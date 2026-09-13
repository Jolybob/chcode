export class CombatUnit {
  constructor({id, team, template, level = 1}) {
    if (!template?.stats && !template?.baseStats) {
      throw new Error(`Invalid combat template for ${id}: missing stats/baseStats.`);
    }
    this.id = id;
    this.team = team;
    this.template = template;
    this.level = level;
    this.effects = [];
    this.attackTimer = 0;
    this.spellTimers = {};
    this.targetId = null;
    this.position = team === 'hero' ? 16 : 92;
    this.dead = false;
    const base = template.baseStats ?? template.stats;
    const growth = template.growth ?? {};
    this.maxHp = base.hp + (level - 1) * (growth.hp ?? 0);
    this.hp = this.maxHp;
    this.attack = base.attack + (level - 1) * (growth.attack ?? 0);
    this.defense = base.defense + (level - 1) * (growth.defense ?? 0);
    this.attackSpeed = base.attackSpeed ?? 1;
    this.range = base.range ?? 50;
    this.critChance = base.critChance ?? 0;
    this.critDamage = base.critDamage ?? 1.5;
  }
  distanceTo(other) { return Math.abs(this.position - other.position); }
}
