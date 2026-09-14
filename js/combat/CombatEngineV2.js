import {rng} from '../core/RNG.js';
import {CombatUnit} from './CombatUnitV1.js?v=9';
export class CombatEngine extends (await import('./CombatEngine.js')).CombatEngine {
  constructor(args){super(args);this.bossWave=false}
  start(){super.start();this.bossWave=false}
  startWave(){this.wave++;this.bus.emit('waveStart',{wave:this.wave});const template=this.dungeon.waveTemplates[this.wave-1];if(!template){this.completeDungeon();return}this.bossWave=Boolean(this.wave===this.dungeon.waves&&this.dungeon.bossId);this.ui.log(this.bossWave?`👑 BOSS WAVE ${this.wave}: ${this.data.enemies[this.dungeon.bossId]?.name||'Boss'}!`:`Wave ${this.wave} incoming.`);this.hero=this.createHero();this.enemies=[];let idx=0;for(const group of template.enemies){for(let i=0;i<group.count;i++){const base=this.data.enemies[group.id];if(!base)throw new Error(`Enemy template not found: ${group.id}`);const enemy=new CombatUnit({id:`e${this.wave}-${idx++}`,team:'enemy',template:base});enemy.position=82+i*4+Math.floor(idx/4)*5;this.enemies.push(enemy)}}if(this.bossWave){const base=this.data.enemies[this.dungeon.bossId];if(base){const boss=new CombatUnit({id:`boss-${this.wave}`,team:'enemy',template:base});boss.position=92;this.enemies.push(boss)}}this.state='combat';this.bus.emit('render')}
  hit(attacker,target){const before=target.hp;super.hit(attacker,target);if(attacker.team==='hero'&&target.dead&&target.template.boss)this.ui.log(`👑 Boss defeated: ${target.template.name}!`);return before}
  winWave(){
    this.state='between';
    this.progression.bestWave=Math.max(this.progression.bestWave,this.wave);
    const xp=40+this.wave*8;
    const gold=Math.round(this.data.progression.goldPerWave*this.wave*this.dungeon.rewardMultiplier);
    this.progression.gain(xp,gold);
    if(this.hero&&!this.hero.dead){const heal=Math.max(1,Math.round(this.hero.maxHp*.15));this.hero.hp=Math.min(this.hero.maxHp,this.hero.hp+heal);this.ui.log(`Wave ${this.wave} cleared! +${heal} HP recovered.`)}else this.ui.log(`Wave ${this.wave} cleared!`);
    if(this.wave>=this.dungeon.waves){this.completeDungeon();return}
    this.nextWaveTimer=this.data.balance.combat.waveDelay;
    this.bus.emit('waveClear',{wave:this.wave});
    this.bus.emit('progressionChanged');
  }
  completeDungeon(){
    this.state='victory';this.active=false;
    const candidates=Object.keys(this.data.items).filter(id=>this.data.items[id].rarity!=='common');
    const rewardId=candidates.length?candidates[rng.int(0,candidates.length-1)]:Object.keys(this.data.items)[0];
    if(rewardId)this.progression.addLoot(rewardId);
    const gold=Math.round(150*this.dungeon.rewardMultiplier);this.progression.gold+=gold;
    this.progression.addMaterials({scrap:5,crystal:2,ember:1});
    this.bus.emit('dungeonReward',{dungeonId:this.dungeon.id,itemId:rewardId,gold});
    const reward=this.data.items[rewardId];
    this.ui.log(`🏆 Dungeon complete! +${gold} gold + ${reward?.name||'reward'} + materials.`);
    this.bus.emit('victory');
  }
}
