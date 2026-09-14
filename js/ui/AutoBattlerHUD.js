export class AutoBattlerHUD {
  constructor({engine,progression,data}){
    this.engine=engine;this.p=progression;this.data=data;
    this.host=document.getElementById('autoBattlerHud');
    if(!this.host)return;
    this.render();
  }
  render(){
    const p=this.p,e=this.engine,c=this.data.classes?.[p.classId]||{};
    const hero=e.hero;
    const hp=Math.max(0,Math.ceil(hero?.hp??0)), max=Math.max(1,Math.ceil(hero?.maxHp??1));
    const pct=Math.max(0,Math.min(100,hp/max*100));
    const xpNext=p.xpToNext?.()||1,xpPct=Math.min(100,p.xp/xpNext*100);
    const spells=(c.spellIds||[]).map(id=>this.data.spells?.[id]).filter(Boolean);
    const hot=[...spells,...spells,...spells].slice(0,8);
    this.host.innerHTML=`
      <div class="abh-top-left"><b>${e.dungeon?.name||'Dungeon'}</b><span>Wave ${e.wave||0}/${e.dungeon?.waves||10}</span><small>Level ${p.level} · ${c.name||'Hero'}</small></div>
      <div class="abh-xp"><div><span>XP</span><b>${p.xp.toLocaleString()} / ${xpNext.toLocaleString()}</b></div><i style="width:${xpPct}%"></i></div>
      <div class="abh-bottom">
        <div class="abh-vitals"><strong>${hp} / ${max}</strong><span>HP</span><i style="width:${pct}%"></i></div>
        <div class="abh-hotbar">${hot.map((s,i)=>`<button title="${s.name||'Ability'}"><span>${s.icon||'✦'}</span><small>${i+1}</small></button>`).join('')}<button class="abh-menu" data-open-character>☰</button></div>
        <div class="abh-currency"><span>◈ ${p.gold.toLocaleString()}</span><span>✦ ${p.skillPoints}</span></div>
      </div>`;
    this.host.querySelector('[data-open-character]')?.addEventListener('click',()=>document.getElementById('profileBtn')?.click());
  }
}
