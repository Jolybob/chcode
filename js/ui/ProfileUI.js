export class ProfileUI {
  constructor({progression,data,engine}){
    this.progression=progression;this.data=data;this.engine=engine;
    this.panel=document.getElementById('profilePanel');this.content=document.getElementById('profileContent');
    document.getElementById('profileBtn').onclick=()=>this.open();document.getElementById('closeProfileBtn').onclick=()=>this.close();
    this.panel.addEventListener('click',e=>{if(e.target===this.panel)this.close()});
  }
  open(){this.render();this.panel.classList.add('open');this.panel.setAttribute('aria-hidden','false')}
  close(){this.panel.classList.remove('open');this.panel.setAttribute('aria-hidden','true')}
  render(){
    const p=this.progression,cls=this.data.classes[p.classId]||this.data.classes.ranger,hero=this.engine.hero;
    const base=cls.baseStats||{},growth=cls.growth||{},eq=p.equipmentStats?.()||{},level=p.level;
    const calc=k=>Number(base[k]||0)+(level-1)*Number(growth[k]||0);
    const hpMax=Math.ceil(hero?.maxHp??(calc('hp')+(p.skills.vitality||0)*25+(eq.hp||0)));
    const hpCurrent=Math.min(hpMax,Math.ceil(hero?.hp??hpMax));
    const attack=Math.round(calc('attack')+(p.skills.power||0)*5+(eq.attack||0));
    const defense=Math.round(calc('defense')+(eq.defense||0));
    const speed=(Number(base.attackSpeed||1)+(p.skills.haste||0)*.08+(eq.attackSpeed||0)).toFixed(2);
    const crit=Math.round((Number(base.critChance||0)+(p.skills.precision||0)*.02+(eq.critChance||0))*100);
    const xpNext=p.xpToNext(),xpPct=Math.min(100,p.xp/xpNext*100);
    const stats=[['Vitality',hpMax,'Maximum health','♥'],['Strength',attack,'Damage per hit','⚔️'],['Defense',defense,'Damage mitigation','🛡️'],['Initiative',speed,'Attacks / second','⚡'],['Critical hit',`${crit}%`,'Critical chance','✦'],['Critical damage',`${Number(base.critDamage||1.5).toFixed(2)}x`,'Critical multiplier','✹'],['Range',Math.round(base.range||50),'Combat range','➜'],['Skill points',p.skillPoints,'Available points','★']];
    const defs=[['power','Power','+5 attack / rank','⚔️'],['vitality','Vitality','+25 maximum HP / rank','♥'],['haste','Haste','+0.08 attack speed / rank','⚡'],['precision','Precision','+2% critical chance / rank','✦']];
    this.content.innerHTML=`
      <div class="dofus-profile-head"><div class="dofus-avatar">${cls.icon||'🏹'}</div><div class="dofus-identity"><span class="eyebrow">CHARACTER</span><h3>${cls.name}</h3><div class="profile-meta"><span class="badge">Level ${level}</span><span class="badge purple">${cls.role}</span><span class="badge">${p.gold} Kamas</span></div><div class="profile-xp"><div><span>Experience</span><strong>${p.xp.toLocaleString()} / ${xpNext.toLocaleString()}</strong></div><div class="xpbar"><i style="width:${xpPct}%"></i></div></div></div><div class="profile-combat-summary"><strong>${attack}</strong><span>Power</span><strong>${defense}</strong><span>Defense</span></div></div>
      <div class="profile-layout"><section class="profile-column"><div class="profile-section-title"><h3>Characteristics</h3><span class="badge">Level ${level}</span></div><div class="character-sheet">${stats.map(([name,value,note,icon])=>`<div class="character-row"><div class="character-icon">${icon}</div><div><strong>${name}</strong><small>${note}</small></div><b>${value}</b></div>`).join('')}</div></section>
      <section class="profile-column"><div class="profile-section-title"><h3>Equipment</h3><span class="badge green">${Object.values(p.equipment||{}).filter(Boolean).length}/3</span></div><div class="dofus-equipment-grid">${['weapon','armor','ring'].map(slot=>{const id=p.equipment?.[slot],item=id?(this.data.items?.[id]||{}):null;return `<div class="equipment-slot ${item?'filled':''}"><div class="equipment-art">${item?.icon||'＋'}</div><strong>${item?.name||'Empty'}</strong><small>${slot}</small></div>`}).join('')}</div><div class="profile-bonus"><span>Equipment bonuses</span><strong>+${eq.attack||0} ATK · +${eq.hp||0} HP · +${Math.round((eq.critChance||0)*100)}% Crit</strong></div></section></div>
      <section class="profile-section"><div class="profile-section-title"><h3>Class</h3><span>Choose your playstyle</span></div><div class="class-grid">${Object.values(this.data.classes).map(c=>`<button class="class-card ${c.id===p.classId?'selected':''}" data-class="${c.id}"><div class="class-card-icon">${c.icon||'⚔️'}</div><div><strong>${c.name}</strong><small>${c.role}</small><p>${c.description||''}</p></div>${c.id===p.classId?'<span class="equipped-mark">✓</span>':''}</button>`).join('')}</div></section>
      <section class="profile-section"><div class="profile-section-title"><h3>Skill tree</h3><span class="badge purple">${p.skillPoints} points</span></div><div class="skill-tree">${defs.map(([id,name,note,icon])=>{const rank=p.skills[id]||0;return `<button class="skill-node ${rank?'unlocked':''}" data-skill="${id}" ${p.skillPoints<1||rank>=5?'disabled':''}><div class="skill-node-icon">${icon}</div><div><strong>${name}</strong><small>${note}</small></div><b>${rank}/5</b></button>`}).join('')}</div></section>
      <section class="profile-section"><div class="profile-section-title"><h3>Achievements</h3><span>Lifetime progression</span></div><div class="achievement-grid"><div><strong>${p.totalKills.toLocaleString()}</strong><small>Monsters defeated</small></div><div><strong>${Math.floor(p.totalDamage).toLocaleString()}</strong><small>Damage dealt</small></div><div><strong>${p.bestWave}</strong><small>Best wave</small></div><div><strong>${p.inventory?.length||0}</strong><small>Items collected</small></div></div></section><p class="note">Character progression is persistent between runs and dungeons.</p>`;
    this.content.querySelectorAll('[data-class]').forEach(b=>b.onclick=()=>{this.engine.selectClass(b.dataset.class);this.render()});
    this.content.querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>{if(this.progression.buySkill(b.dataset.skill)){this.engine.restartRun();this.render()}});
  }
}
