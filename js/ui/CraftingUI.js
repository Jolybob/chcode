export class CraftingUI {
  constructor({progression,data}){
    this.p=progression;this.data=data;
    this.panel=document.getElementById('craftingPanel');
    this.content=document.getElementById('craftingContent');
    this.closeBtn=document.getElementById('closeCraftingBtn');
    this.returnFocus=null;
    this.panel.inert=true;
    this.panel.setAttribute('aria-hidden','true');
    document.getElementById('craftingBtn').onclick=()=>this.open();
    this.closeBtn.onclick=()=>this.close();
    this.panel.addEventListener('click',e=>{if(e.target===this.panel)this.close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.panel.classList.contains('open')){e.preventDefault();this.close()}});
    progression.bus?.on?.('materialsChanged',()=>{if(this.panel.classList.contains('open'))this.render()});
    progression.bus?.on?.('inventoryChanged',()=>{if(this.panel.classList.contains('open'))this.render()});
  }
  open(){
    this.returnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
    this.panel.inert=false;this.panel.classList.add('open');this.panel.setAttribute('aria-hidden','false');
    this.render();requestAnimationFrame(()=>this.closeBtn?.focus());
  }
  close(){
    const target=this.returnFocus;
    if(this.panel.contains(document.activeElement))document.activeElement.blur();
    this.panel.classList.remove('open');this.panel.setAttribute('aria-hidden','true');this.panel.inert=true;
    requestAnimationFrame(()=>{if(target?.isConnected)target.focus();this.returnFocus=null});
  }
  rarityRank(r){return ({mythic:6,legendary:5,epic:4,rare:3,uncommon:2,common:1}[String(r||'common').toLowerCase()]||1)}
  formatStat(k,v){
    const label={attack:'ATK',hp:'HP',defense:'DEF',critChance:'CRIT',critDamage:'CRIT DMG',attackSpeed:'SPEED'}[k]||k;
    const pct=['critChance','attackSpeed'].includes(k)?`${Math.round(Number(v)*100)}%`:`+${v}`;
    return `${label} ${pct}`;
  }
  render(){
    const mats=this.p.materials||{}, m=this.data.crafting?.materials||{};
    const materials=Object.entries(m).map(([id,x])=>`<span class="craft-material ${Number(mats[id]||0)>0?'has-stock':''}"><i>${x.icon}</i><span>${x.name}</span><b>${mats[id]||0}</b></span>`).join('');
    const recipes=Object.entries(this.data.crafting?.recipes||{}).map(([id,r])=>{
      const base=this.data.items?.[r.baseItemId];
      if(!base)return '';
      const rarity=String(base.rarity||'common').toLowerCase(), rank=this.rarityRank(rarity), ok=this.p.canCraft(r);
      const cost=Object.entries(r.cost||{}).map(([k,v])=>k==='gold'?`<span class="craft-cost gold">🪙 ${v}</span>`:`<span class="craft-cost">${m[k]?.icon||'•'} ${v}<b>${mats[k]||0}</b></span>`).join('');
      const stats=Object.entries(base.stats||{}).slice(0,4).map(([k,v])=>`<span>${this.formatStat(k,v)}</span>`).join('');
      return `<article class="craft-recipe rarity-${rarity} ${ok?'craftable':'unavailable'}" style="--rarity-rank:${rank}">
        <div class="craft-rarity-bar"></div>
        <div class="craft-item-icon"><span>${base.icon||'⚒️'}</span><em>${rarity}</em></div>
        <div class="craft-item-info"><div class="craft-item-name"><strong>${base.name||r.baseItemId}</strong><small>${r.name}</small></div><div class="craft-stats">${stats}</div><div class="craft-costs">${cost}</div></div>
        <button class="craft-action" data-craft="${id}" ${ok?'':'disabled'}>${ok?'Forge':'Missing mats'}</button>
      </article>`;
    }).join('');
    const stockTotal=Object.values(mats).reduce((a,v)=>a+Number(v||0),0);
    this.content.innerHTML=`<div class="craft-header">
      <div><span class="eyebrow">THE FORGE</span><h3>Crafting Workshop</h3><p>Forge equipment, roll 1–2 random affixes, and chase higher-quality gear.</p></div>
      <div class="craft-stock"><span>Material stock</span><b>${stockTotal}</b><small>items available</small></div>
    </div>
    <div class="craft-materials"><div class="craft-section-label">MATERIAL SATCHEL</div><div class="craft-material-row">${materials}</div></div>
    <div class="craft-legend"><span class="craft-section-label">FORGE RECIPES</span><div class="rarity-legend"><span class="rarity-dot common">Common</span><span class="rarity-dot uncommon">Uncommon</span><span class="rarity-dot rare">Rare</span><span class="rarity-dot epic">Epic</span><span class="rarity-dot legendary">Legendary</span></div></div>
    <p class="craft-note">Base quality is shown clearly on every recipe. Crafted gear keeps the base rarity and receives random affixes.</p>
    <div class="craft-recipe-list">${recipes||'<div class="craft-empty">No forge recipes available.</div>'}</div>`;
    this.content.querySelectorAll('[data-craft]').forEach(b=>b.onclick=()=>{if(this.p.craft(this.data.crafting.recipes[b.dataset.craft]))this.render()});
  }
}
