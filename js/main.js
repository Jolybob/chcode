import {EventBus} from './core/EventBus.js';
import {DataManager} from './data/DataManager.js';
import {ProgressionSystem} from './progression/ProgressionSystem.js';
import {CombatEngine} from './combat/CombatEngine.js';
import {CombatUI} from './ui/CombatUI.js';
import {AdminUI} from './ui/AdminUI.js';

const data=new DataManager();
await data.load();
const bus=new EventBus();
const progression=new ProgressionSystem({...data.progression,...data.balance.rewards,...data.balance.player},bus);
const ui=new CombatUI(null,progression,data);
const engine=new CombatEngine({data,bus,progression,ui});
ui.engine=engine;
new AdminUI(data,progression,engine,bus);

let last=performance.now();
function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;engine.update(dt);ui.render();ui.updateHud();requestAnimationFrame(frame)}
requestAnimationFrame(frame);

bus.on('waveStart',({wave})=>ui.setStatus(`Wave ${wave} — combat`));
bus.on('waveClear',({wave})=>ui.setStatus(`Wave ${wave} cleared — next wave soon`));
bus.on('levelUp',({level})=>ui.log(`Level up! You are now level ${level}.`));
bus.on('victory',()=>ui.setStatus('Victory! All 10 waves cleared.'));
bus.on('defeat',()=>ui.setStatus('Defeat — restart the run.'));
bus.on('dataImported',()=>{location.reload()});

document.getElementById('pauseBtn').onclick=()=>{if(engine.active){engine.active=false;engine.state='paused';document.getElementById('pauseBtn').textContent='Resume';ui.setStatus('Paused')}else if(engine.state==='paused'){engine.active=true;engine.state='combat';document.getElementById('pauseBtn').textContent='Pause';ui.setStatus(`Wave ${engine.wave} — combat`)}};
document.getElementById('restartBtn').onclick=()=>location.reload();
console.info('[AutoBattler V1] build 2 loaded');
document.querySelectorAll('[data-speed]').forEach(b=>b.onclick=()=>{engine.setSpeed(+b.dataset.speed);document.querySelectorAll('[data-speed]').forEach(x=>x.classList.toggle('active',x===b))});
engine.start();
