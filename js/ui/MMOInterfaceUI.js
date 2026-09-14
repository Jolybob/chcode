export class MMOInterfaceUI {
  constructor({progression,data,engine}){
    this.p=progression;this.data=data;this.engine=engine;this.host=document.getElementById('mmoUi');
    if(!this.host)return;this.render();
    progression.bus?.on?.('levelUp',()=>this.render());progression.bus?.on?.('inventoryChanged',()=>this.render());progression.bus?.on?.('classChanged',()=>this.render());progression.bus?.on?.('waveStart',()=>this.render());
  }
  item(v){return this.p.resolveItem?this.p.resolveItem(v):(typeof v==='string'?this.data.items?.[v]:v)}
  render(){
    const p=this.p,c=this.data.classes?.[p.classId]||this.data.classes?.ranger,hero=this.engine.hero;
    const hp=Math.max(0,Math.ceil(hero?.hp??0)),max=Math.ceil(hero?.maxHp??0),spells=(c.spellIds||[]).map(id=>this.data.spells?.[id]).filter(Boolean),hot=[...spells,...spells,...spells].slice(0,8),bag=(p.inventory||[]).slice(0,8);
    this.host.innerHTML=`<div class="mmo-left-rail"><div class="rail-title">TURN ORDER</div><div class="turn-avatar active">${c.icon||'🏹'}<b>${p.level}</b></div><div class="turn-avatar">👹<b>3</b></div><div class="turn-avatar">🟢<b>4</b></div><div class="turn-avatar">🐗<b>5</b></div></div><div class="mmo-top-card"><span>☠ Ancient Ruins</span><b>Wave ${this.engine.wave||0}/${this.engine.dungeon?.waves||10}</b><small>Level ${p.level} · ${c.name}</small></div><div class="mmo-target"><div class="target-head"><span>☠</span><div><b>Ancient Guardian</b><small>Lv. 15 · Boss</small></div><strong>2,480 / 2,480</strong></div><div class="target-bar"><i style="width:100%"></i></div><div class="target-status">🔥 ❄️ ☘️ ✦</div></div><div class="mmo-bottom"><div class="chat-box"><div class="chat-tabs"><b>General</b><span>Group</span><span>Guild</span></div><p>[14:32] You gain 42 XP.</p><p>[14:32] You receive loot.</p><p>[14:33] Goblin is defeated.</p><div class="chat-input">/w &nbsp; Enter your message...</div></div><div class="action-bar"><div class="resource hp"><strong>${hp}/${max||'—'}</strong><small>HP</small></div><div class="resource ap"><strong>6</strong><small>AP</small></div>${hot.map((s,i)=>`<button class="action-slot" title="${s.name||'Ability'}"><span>${s.icon||'✦'}</span><small>${i+1}</small></button>`).join('')}<div class="action-slot bag">🎒</div></div><div class="quick-inventory">${bag.map(v=>{const i=this.item(v);return i?`<div title="${i.name}">${i.icon||'◈'}</div>`:''}).join('')}</div></div>`;
  }
}
