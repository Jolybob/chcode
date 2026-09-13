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
    const base = template.baseStats ?? template.stats ?? {};
    const growth = template.growth ?? {};
    this.maxHp = Number(base.hp ?? 1) + (level - 1) * Number(growth.hp ?? 0);
    this.hp = this.maxHp;
    this.attack = Number(base.attack ?? 1) + (level - 1) * Number(growth.attack ?? 0);
    this.defense = Number(base.defense ?? 0) + (level - 1) * Number(growth.defense ?? 0);
    this.attackSpeed = Math.max(0.05, Number(base.attackSpeed ?? 1));
    this.range = Math.max(1, Number(base.range ?? 50));
    this.critChance = Math.max(0, Number(base.critChance ?? 0));
    this.critDamage = Math.max(1, Number(base.critDamage ?? 1.5));
  }
  distanceTo(other) { return Math.abs(this.position - other.position); }
}
