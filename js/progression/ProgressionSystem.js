export class ProgressionSystem {
  constructor(data,bus){this.data=data;this.bus=bus;this.level=1;this.xp=0;this.gold=Number(this.data.startingGold||0);this.totalKills=0;this.totalDamage=0;this.bestWave=0;this.classId='ranger';this.skillPoints=0;this.skills={power:0,vitality:0,haste:0,precision:0}}
  xpToNext(){return Math.floor(this.data.xpBase*Math.pow(this.data.xpGrowth,this.level-1))}
  gain(xp,gold){this.xp+=Math.floor(xp*this.data.waveXpMultiplier);this.gold+=Math.floor(gold*this.data.waveGoldMultiplier);this.checkLevel();this.bus.emit('progressionChanged')}
  checkLevel(){let leveled=false;while(this.xp>=this.xpToNext()){this.xp-=this.xpToNext();this.level++;this.skillPoints++;leveled=true}if(leveled)this.bus.emit('levelUp',{level:this.level})}
  selectClass(id){if(typeof id!=='string'||!id)return false;this.classId=id;this.bus.emit('classChanged',{classId:id});this.bus.emit('progressionChanged');return true}
  buySkill(id){const max=5;if(!(id in this.skills)||this.skillPoints<1||this.skills[id]>=max)return false;this.skills[id]++;this.skillPoints--;this.bus.emit('skillChanged',{skillId:id});this.bus.emit('progressionChanged');return true}
  resetRun(){this.bus.emit('runReset');this.bus.emit('progressionChanged')}
  resetAllProgression(){this.level=1;this.xp=0;this.gold=Number(this.data.startingGold||0);this.totalKills=0;this.totalDamage=0;this.bestWave=0;this.classId='ranger';this.skillPoints=0;this.skills={power:0,vitality:0,haste:0,precision:0};this.bus.emit('progressionReset');this.bus.emit('progressionChanged')}
}
