export class DataManager {
  constructor(){this.raw={}}
  async load(){const files=['classes','enemies','spells','dungeons','progression','balance','items','crafting','jobs'];const values=await Promise.all(files.map(async name=>[name,await (await fetch(`data/${name}.json?v=9`,{cache:'no-store'})).json()]));this.raw=Object.fromEntries(values);return this.raw}
  get classes(){return this.raw.classes.classes} get enemies(){return this.raw.enemies.enemies} get spells(){return this.raw.spells.spells} get dungeons(){return this.raw.dungeons.dungeons} get items(){return this.raw.items.items} get crafting(){return this.raw.crafting} get jobs(){return this.raw.jobs} get progression(){return this.raw.progression} get balance(){return this.raw.balance}
  exportBundle(extra={}){return {schemaVersion:2,exportedAt:new Date().toISOString(),config:this.raw,...extra}}
  importBundle(bundle){if(!bundle?.config?.classes?.classes||!bundle.config.enemies?.enemies)throw new Error('Invalid config bundle.');this.raw=bundle.config}
}
