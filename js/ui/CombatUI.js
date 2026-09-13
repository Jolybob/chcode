export class CombatUI{
 constructor(engine,progression,data){this.engine=engine;this.progression=progression;this.data=data;this.el={battlefield:document.getElementById('battlefield'),hero:document.getElementById('heroSlot'),enemyLayer:document.getElementById('enemyLayer'),fx:document.getElementById('combatFx'),log:document.getElementById('log'),status:document.getElementById('combatStatus')}}
 render(){this.el.hero.innerHTML='';if(this.engine.hero)this.renderUnit(this.el.hero,this.engine.hero);this.el.enemyLayer.innerHTML='';for(const e of this.engine.enemies)this.renderUnit(this.el.enemyLayer.appendChild(document.createElement('div')),e)}
 renderUnit(node,u){node.className='unit '+(u.team==='hero'?'hero-unit':'enemy');node.style.left=`${u.position}%`;node.innerHTML=`<div class="unit-body">${u.team==='hero'?'🏹':u.template.icon}</div><div class="unit-name">${u.template.name}</div><div class="bar"><i style="width:${Math.max(0,u.hp/u.maxHp*100)}%"></i></div>`}
 updateHud(){
  const p=this.progression;const d=this.engine.dungeon;
  document.getElementById('waveLabel').textContent=`${this.engine.wave} / ${d.waves}`;document.getElementById('levelLabel').textContent=p.level;document.getElementById('goldLabel').textContent=p.gold;
  document.getElementById('bestWave').textContent=p.bestWave;document.getElementById('kills').textContent=p.totalKills;document.getElementById('damage').textContent=Math.floor(p.totalDamage);document.getElementById('dungeonName').textContent=d.name;
  const next=p.xpToNext();document.getElementById('xpFill').style.width=`${Math.min(100,p.xp/next*100)}%`;document.getElementById('xpLabel').textContent=`${p.xp} / ${next}`;
  const h=this.engine.hero;const cls=this.data.classes.ranger;
  if(h){document.getElementById('heroPanel').innerHTML=`<div class="hero-sheet"><div class="portrait">🏹</div><div><div><strong>${cls.name}</strong> · Lv ${p.level}</div><div class="stats"><div><span>HP</span><strong>${Math.ceil(h.hp)}/${Math.ceil(h.maxHp)}</strong></div><div><span>ATK</span><strong>${Math.round(h.attack)}</strong></div><div><span>DEF</span><strong>${Math.round(h.defense)}</strong></div><div><span>AS</span><strong>${h.attackSpeed.toFixed(2)}</strong></div></div></div></div>`;
  } else {
   const base=cls.baseStats??{},growth=cls.growth??{},at=(key)=>Number(base[key]??0)+(p.level-1)*Number(growth[key]??0);
   document.getElementById('heroPanel').innerHTML=`<div class="hero-sheet"><div class="portrait">🏹</div><div><div><strong>${cls.name}</strong> · Lv ${p.level}</div><div class="stats"><div><span>HP</span><strong>${Math.ceil(at('hp'))}</strong></div><div><span>ATK</span><strong>${Math.round(at('attack'))}</strong></div><div><span>DEF</span><strong>${Math.round(at('defense'))}</strong></div><div><span>AS</span><strong>${Number(base.attackSpeed??1).toFixed(2)}</strong></div></div></div></div>`;
  }
  document.getElementById('spellPanel').innerHTML=`<div class="spell"><h4>☄️ ${this.data.spells.poison_arrow.name}</h4><small>Every ${this.data.spells.poison_arrow.cooldown}s: poison the nearest enemy for ${this.data.spells.poison_arrow.poisonDps}/s over ${this.data.spells.poison_arrow.poisonDuration}s.</small></div>`;
  document.getElementById('gameTime').textContent=this.formatTime(this.engine.elapsed);
 }
 formatTime(s){s=Math.floor(s);return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
 log(msg){this.el.log.textContent=msg;clearTimeout(this.logTimer);this.logTimer=setTimeout(()=>this.el.log.textContent='',3200)}
 fxDamage(target,damage){this.fxText(target,damage)}fxCrit(target,damage){this.fxText(target,damage,true)}fxSpell(a,t){const r=a.position;const el=document.createElement('div');el.className='projectile';el.style.left=`${r}%`;el.style.bottom='115px';this.el.fx.appendChild(el);setTimeout(()=>el.remove(),330)}fxText(target,damage,crit=false){const el=document.createElement('div');el.className='damage-pop';el.textContent=`-${damage}${crit?'!':''}`;el.style.left=`${target.position}%`;el.style.bottom='150px';this.el.fx.appendChild(el);setTimeout(()=>el.remove(),650)}setStatus(text){this.el.status.textContent=text}
}
