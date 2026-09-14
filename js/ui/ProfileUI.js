export class ProfileUI {
  constructor({progression,data,engine}){
    this.progression=progression;this.data=data;this.engine=engine;this.panel=document.getElementById('profilePanel');this.content=document.getElementById('profileContent');this.returnFocus=null;
    document.getElementById('profileBtn').onclick=()=>this.open();document.getElementById('closeProfileBtn').onclick=()=>this.close();
    this.panel.addEventListener('click',e=>{if(e.target===this.panel)this.close()});
  }
  open(){this.returnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;this.panel.inert=false;this.render();this.panel.classList.add('open');this.panel.setAttribute('aria-hidden','false');document.getElementById('closeProfileBtn')?.focus()}
  close(){const target=this.returnFocus;this.panel.classList.remove('open');if(this.panel.contains(document.activeElement))document.activeElement.blur();this.panel.inert=true;this.panel.setAttribute('aria-hidden','true');if(target?.isConnected)target.focus();this.returnFocus=null}
  render(){
    const p=this.progression,cls=this.data.classes[p.classId]||this.data.classes.ranger,hero=this.engine.hero;
    const base=cls.baseStats||{},growth=cls.growth||{},eq=p.equipmentStats?.()||{},level=p.level;
    const calc=k=>Number(base[k]||0)+(level-1)*Number(growth[k]||0);
    const hpMax=Math.ceil(hero?.maxHp??(calc('hp')+(p.skills.vitality||0)*25+(eq.hp||0)));
    const hpCurrent=Math.min(hpMax,Math.ceil(hero?.hp??hpMax));
    const attack=Math.round(calc('attack')+(p.skills.power||0)*5+(eq.attack||0));
    const defense=Math.round(calc('defense')+(eq.defense||0));
    const speed=Number(base.attackSpeed||1)+(p.skills.haste||0)*.08+(eq.attackSpeed||0);
    const crit=Math.round((Number(base.critChance||0)+(p.skills.precision||0)*.02+(eq.critChance||0))*100);
    const critDamage=(Number(base.critDamage||1.5)+(eq.critDamage||0)).toFixed(2);
    const range=Math.round(base.range||50);
    const initiative=Math.round(speed*100);
    const pods=100+level*10;
    const wisdom=level>1?Math.floor((level-1)/5):0;
    const prospecting=100;
    const dodge=Math.min(95,Math.round(50+defense*1.5));
    const tackle=Math.min(95,Math.round(25+defense*1.2));
    const xpNext=p.xpToNext(),xpPct=Math.min(100,p.xp/xpNext*100);
    const equipped=Object.values(p.equipment||{}).filter(Boolean).length;
    const itemOf=value=>p.resolveItem?p.resolveItem(value):(typeof value==='string'?this.data.items?.[value]:value);
    const itemLabel=value=>{const item=itemOf(value);return item?.name||'Empty'};
    const stats=[['Vitality',hpMax,`Current ${hpCurrent} / ${hpMax}`,'♥'],['Strength',attack,'Damage per hit','⚔️'],['Defense',defense,'Damage mitigation','🛡️'],['Initiative',initiative,`${speed.toFixed(2)} attacks / second`,'⚡'],['Critical hit',`${crit}%`,'Critical chance','✦'],['Critical damage',`${critDamage}x`,'Critical multiplier','✹'],['Range',range,'Combat range','➜'],['Skill points',p.skillPoints,'Available points','★']];
    const secondary=[['Dodge',`${dodge}%`,'Derived from defense'],['Tackle',`${tackle}%`,'Derived from defense'],['Prospecting',prospecting,'Loot baseline'],['Wisdom',wisdom,'XP bonus stat'],['Pods',`${pods}`,'Inventory capacity'],['Kamas',p.gold.toLocaleString(),'Current currency']];
    const defs=[['power','Power','+5 attack / rank','⚔️'],['vitality','Vitality','+25 maximum HP / rank','♥'],['haste','Haste','+0.08 attack speed / rank','⚡'],['precision','Precision','+2% critical chance / rank','✦']];
    this.content.innerHTML=`
      <div class="dofus-profile-head"><div class="dofus-avatar">${cls.icon||'🏹'}</div><div class="dofus-identity"><span class="eyebrow">CHARACTER SHEET</span><h3>${cls.name}</h3><div class="profile-meta"><span class="badge">Level ${level}</span><span class="badge purple">${cls.role}</span><span class="badge">${p.gold.toLocaleString()} Kamas</span></div><div class="profile-xp"><div><span>Experience</span><strong>${p.xp.toLocaleString()} / ${xpNext.toLocaleString()}</strong></div><div class="xpbar"><i style="width:${xpPct}%"></i></div></div></div><div class="profile-combat-summary"><strong>${attack}</strong><span>Power</span><strong>${defense}</strong><span>Defense</span></div></div>
      <div class="profile-layout"><section class="profile-column"><div class="profile-section-title"><h3>Characteristics</h3><span class="badge">Level ${level}</span></div><div class="character-sheet">${stats.map(([name,value,note,icon])=>`<div class="character-row"><div class="character-icon">${icon}</div><div><strong>${name}</strong><small>${note}</small></div><b>${value}</b></div>`).join('')}</div></section>
      <section class="profile-column"><div class="profile-section-title"><h3>Secondary stats</h3><span>Combat & progression</span></div><div class="character-sheet">${secondary.map(([name,value,note])=>`<div class="character-row compact"><div><strong>${name}</strong><small>${note}</small></div><b>${value}</b></div>`).join('')}</div></section></div>
      <section class="profile-section"><div class="profile-section-title"><h3>Equipment</h3><span class="badge green">${equipped}/3</span></div><div class="dofus-equipment-grid">${['weapon','armor','ring'].map(slot=>{const value=p.equipment?.[slot],item=itemOf(value);return `<div class="equipment-slot ${item?'filled':''}"><div class="equipment-art">${item?.icon||'＋'}</div><strong>${itemLabel(value)}</strong><small>${slot}</small>${item?.rarity?`<em>${item.rarity}</em>`:''}</div>`}).join('')}</div><div class="profile-bonus"><span>Equipment bonuses</span><strong>+${eq.attack||0} ATK · +${eq.hp||0} HP · +${Math.round((eq.critChance||0)*100)}% Crit · +${eq.defense||0} DEF</strong></div></section>
      <section class="profile-section"><div class="profile-section-title"><h3>Class</h3><span>Choose your playstyle</span></div><div class="class-grid">${Object.values(this.data.classes).map(c=>`<button class="class-card ${c.id===p.classId?'selected':''}" data-class="${c.id}"><div class="class-card-icon">${c.icon||'⚔️'}</div><div><strong>${c.name}</strong><small>${c.role}</small><p>${c.description||''}</p></div>${c.id===p.classId?'<span class="equipped-mark">✓</span>':''}</button>`).join('')}</div></section>
      <section class="profile-section"><div class="profile-section-title"><h3>Skill tree</h3><span class="badge purple">${p.skillPoints} points</span></div><div class="skill-tree">${defs.map(([id,name,note,icon])=>{const rank=p.skills[id]||0;return `<button class="skill-node ${rank?'unlocked':''}" data-skill="${id}" ${p.skillPoints<1||rank>=5?'disabled':''}><div class="skill-node-icon">${icon}</div><div><strong>${name}</strong><small>${note}</small></div><b>${rank}/5</b></button>`}).join('')}</div></section>
      <section class="profile-section"><div class="profile-section-title"><h3>Achievements</h3><span>Lifetime progression</span></div><div class="achievement-grid"><div><strong>${p.totalKills.toLocaleString()}</strong><small>Monsters defeated</small></div><div><strong>${Math.floor(p.totalDamage).toLocaleString()}</strong><small>Damage dealt</small></div><div><strong>${p.bestWave}</strong><small>Best wave</small></div><div><strong>${p.inventory?.length||0}</strong><small>Items collected</small></div></div></section><p class="note">Character progression is persistent between runs and dungeons.</p>`;
    this.content.querySelectorAll('[data-class]').forEach(b=>b.onclick=()=>{this.engine.selectClass(b.dataset.class);this.render()});
    this.content.querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>{if(this.progression.buySkill(b.dataset.skill)){this.engine.restartRun();this.render()}});
  }
}
