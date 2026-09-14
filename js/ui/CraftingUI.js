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
  }
  open(){
    this.returnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
    this.panel.inert=false;
    this.panel.classList.add('open');
    this.panel.setAttribute('aria-hidden','false');
    this.render();
    requestAnimationFrame(()=>this.closeBtn?.focus());
  }
  close(){
    const target=this.returnFocus;
    if(this.panel.contains(document.activeElement))document.activeElement.blur();
    this.panel.classList.remove('open');
    this.panel.setAttribute('aria-hidden','true');
    this.panel.inert=true;
    requestAnimationFrame(()=>{if(target?.isConnected)target.focus();this.returnFocus=null});
  }
  render(){
    const mats=this.p.materials||{};
    const m=this.data.crafting?.materials||{};
    const materials=Object.entries(m).map(([id,x])=>`<span class="material-pill">${x.icon} ${x.name}: <b>${mats[id]||0}</b></span>`).join('');
    const recipes=Object.entries(this.data.crafting?.recipes||{}).map(([id,r])=>{
      const base=this.data.items[r.baseItemId];
      const ok=this.p.canCraft(r);
      const cost=Object.entries(r.cost||{}).map(([k,v])=>k==='gold'?`🪙 ${v}`:`${m[k]?.icon||'•'} ${v}`).join(' · ');
      return `<div class="recipe-card"><div><span class="item-icon">${base?.icon||'⚒️'}</span><div><strong>${r.name}</strong><small>${base?.name||r.baseItemId}</small><small>${cost}</small></div></div><button data-craft="${id}" ${ok?'':'disabled'}>Craft</button></div>`;
    }).join('');
    this.content.innerHTML=`<div class="inventory-head"><div><span class="eyebrow">FORGE</span><h3>Crafting</h3></div><div class="material-row">${materials}</div></div><p class="note">Crafted equipment rolls 1–2 random affixes. Higher rarity bases produce stronger gear.</p><div class="item-list">${recipes}</div>`;
    this.content.querySelectorAll('[data-craft]').forEach(b=>b.onclick=()=>{if(this.p.craft(this.data.crafting.recipes[b.dataset.craft]))this.render()});
  }
}
