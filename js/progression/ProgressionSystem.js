export class ProgressionSystem {
  constructor(data,bus){this.data=data;this.bus=bus;this.level=1;this.xp=0;this.gold=Number(this.data.startingGold||0);this.totalKills=0;this.totalDamage=0;this.bestWave=0;this.classId='ranger';this.skillPoints=0;this.skills={power:0,vitality:0,haste:0,precision:0};this.inventory=[];this.equipment={weapon:'training_bow',armor:null,ring:null}}
  xpToNext(){return Math.floor(this.data.xpBase*Math.pow(this.data.xpGrowth,this.level-1))}
  gain(xp,gold){this.xp+=Math.floor(xp*this.data.waveXpMultiplier);this.gold+=Math.floor(gold*this.data.waveGoldMultiplier);this.checkLevel();this.bus.emit('progressionChanged')}
  checkLevel(){let leveled=false;while(this.xp>=this.xpToNext()){this.xp-=this.xpToNext();this.level++;this.skillPoints++;leveled=true}if(leveled)this.bus.emit('levelUp',{level:this.level})}
  selectClass(id){if(typeof id!=='string'||!id)return false;this.classId=id;this.bus.emit('classChanged',{classId:id});this.bus.emit('progressionChanged');return true}
  buySkill(id){const max=5;if(!(id in this.skills)||this.skillPoints<1||this.skills[id]>=max)return false;this.skills[id]++;this.skillPoints--;this.bus.emit('skillChanged',{skillId:id});this.bus.emit('progressionChanged');return true}
  addLoot(itemId){if(!this.data.items?.[itemId])return false;this.inventory.push(itemId);this.bus.emit('lootFound',{item:this.data.items[itemId]});this.bus.emit('inventoryChanged');return true}
  equipItem(index){const id=this.inventory[index],item=this.data.items?.[id];if(!item)return false;const old=this.equipment[item.slot];this.equipment[item.slot]=id;if(old)this.inventory[index]=old;else this.inventory.splice(index,1);this.bus.emit('inventoryChanged');this.bus.emit('progressionChanged');return true}
  unequipItem(slot){const id=this.equipment[slot];if(!id)return false;this.inventory.push(id);this.equipment[slot]=null;this.bus.emit('inventoryChanged');this.bus.emit('progressionChanged');return true}
  equipmentStats(){const out={};for(const id of Object.values(this.equipment)){for(const [k,v] of Object.entries(this.data.items?.[id]?.stats||{}))out[k]=(out[k]||0)+Number(v)}return out}
  resetRun(){this.bus.emit('runReset');this.bus.emit('progressionChanged')}
  resetAllProgression(){this.level=1;this.xp=0;this.gold=Number(this.data.startingGold||0);this.totalKills=0;this.totalDamage=0;this.bestWave=0;this.classId='ranger';this.skillPoints=0;this.skills={power:0,vitality:0,haste:0,precision:0};this.inventory=[];this.equipment={weapon:'training_bow',armor:null,ring:null};this.bus.emit('progressionReset');this.bus.emit('progressionChanged')}
}
