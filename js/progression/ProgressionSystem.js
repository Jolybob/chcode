export class ProgressionSystem {
  constructor(data,bus){
    this.data=data;this.bus=bus;
    this.level=1;this.xp=0;this.gold=Number(this.data.startingGold||0);
    this.totalKills=0;this.totalDamage=0;this.bestWave=0;this.classId='ranger';
  }
  xpToNext(){return Math.floor(this.data.xpBase*Math.pow(this.data.xpGrowth,this.level-1))}
  gain(xp,gold){this.xp+=Math.floor(xp*this.data.waveXpMultiplier);this.gold+=Math.floor(gold*this.data.waveGoldMultiplier);this.checkLevel();this.bus.emit('progressionChanged')}
  checkLevel(){let leveled=false;while(this.xp>=this.xpToNext()){this.xp-=this.xpToNext();this.level++;leveled=true}if(leveled)this.bus.emit('levelUp',{level:this.level})}
  selectClass(id){if(!this.data.classes[id])return false;this.classId=id;this.bus.emit('classChanged',{classId:id});this.bus.emit('progressionChanged');return true}
  resetRun(){this.bus.emit('runReset');this.bus.emit('progressionChanged')}
  resetAllProgression(){this.level=1;this.xp=0;this.gold=Number(this.data.startingGold||0);this.totalKills=0;this.totalDamage=0;this.bestWave=0;this.classId='ranger';this.bus.emit('progressionReset');this.bus.emit('progressionChanged')}
}
