export class DungeonUI {
  constructor({data,engine,progression}){this.data=data;this.engine=engine;this.progression=progression;this.panel=document.getElementById('dungeonPanel');this.content=document.getElementById('dungeonContent');this.returnFocus=null;document.getElementById('dungeonBtn').onclick=()=>this.open();document.getElementById('closeDungeonBtn').onclick=()=>this.close();this.panel.addEventListener('click',e=>{if(e.target===this.panel)this.close()})}
  open(){this.returnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;this.panel.inert=false;this.render();this.panel.classList.add('open');this.panel.setAttribute('aria-hidden','false');document.getElementById('closeDungeonBtn')?.focus()}
  close(){const target=this.returnFocus;this.panel.classList.remove('open');if(this.panel.contains(document.activeElement))document.activeElement.blur();this.panel.inert=true;this.panel.setAttribute('aria-hidden','true');if(target?.isConnected)target.focus();this.returnFocus=null}
  enemyOf(id){return this.data.enemies?.[id]??{id,name:id,icon:'👹'}}
  renderDungeon(d){
    const selected=d.id===this.engine.dungeonId,minLevel=Number(d.minLevel||1),canSelect=this.progression.level>=minLevel;
    const waves=Number(d.waves??d.waveTemplates?.length??0),reward=Number(d.rewardMultiplier??1).toFixed(2);
    const featured=d.featuredVariants??[];
    const boss=d.bossId?this.enemyOf(d.bossId):null;
    const currentWave=selected?Number(this.engine.wave||0):0;
    const waveStrip=Array.from({length:waves},(_,i)=>{const n=i+1,isBoss=n===waves,done=selected&&currentWave>n,active=selected&&currentWave===n;return `<span class="dungeon-wave ${isBoss?'boss':''} ${done?'done':''} ${active?'active':''}">${isBoss?'♛':n}</span>`}).join('');
    const variants=featured.map(id=>{const e=this.enemyOf(id);return `<span class="family-mob"><i>${e.icon??'👹'}</i>${e.name??id}</span>`}).join('');
    return `<article class="dungeon-card ${selected?'selected':''} ${canSelect?'':'locked'}">
      <div class="dungeon-card-top"><div class="dungeon-icon">${d.icon??'⚔️'}</div><div class="dungeon-copy"><strong>${d.name}</strong><span>${waves} waves · ${reward}x rewards · Recommended Lv.${minLevel}</span><small>${d.description??'Combat dungeon'}</small></div><div class="dungeon-state">${selected?'In Progress':canSelect?'Available':`Locked · Lv.${minLevel}`}</div></div>
      <div class="dungeon-meta">
        <div class="dungeon-family"><label>Featured family</label><strong>${d.focusFamily??'Mixed Enemies'}</strong><div class="family-roster">${variants||'<span class="family-mob">⚔️ Classic roster</span>'}</div></div>
        <div class="dungeon-boss"><label>Final encounter</label><strong>${boss?`${boss.icon??'♛'} ${boss.name??d.bossId}`:'—'}</strong><small>${boss?'Boss · Final wave':'No dedicated boss'}</small></div>
      </div>
      <div class="dungeon-route"><div class="route-label"><span>Dungeon route</span><small>${selected?`Wave ${currentWave} / ${waves}`:'10-wave progression'}</small></div><div class="dungeon-wave-strip">${waveStrip}</div></div>
      <button class="dungeon-select" data-dungeon="${d.id}" ${canSelect?'':'disabled'}>${selected?'Restart this dungeon':canSelect?'Enter dungeon':`Reach level ${minLevel}`}</button>
    </article>`;
  }
  render(){const dungeons=Object.values(this.data.dungeons);this.content.innerHTML=`<div class="dungeon-intro"><div><span class="eyebrow">DUNGEON CODEX</span><h3>Choose your next expedition</h3><p>Each dungeon has a signature monster family, five featured variants and a dedicated boss waiting on the final wave.</p></div><div class="dungeon-rule"><b>10 WAVE RUN</b><span>Family focus → escalation → boss</span></div></div><div class="dungeon-list">${dungeons.map(d=>this.renderDungeon(d)).join('')}</div>`;this.content.querySelectorAll('[data-dungeon]').forEach(b=>b.onclick=()=>{if(this.engine.selectDungeon(b.dataset.dungeon))this.close()})}
}
