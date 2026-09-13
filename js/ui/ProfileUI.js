export class ProfileUI {
  constructor({progression, data, engine}) {
    this.progression = progression;
    this.data = data;
    this.engine = engine;
    this.panel = document.getElementById('profilePanel');
    this.content = document.getElementById('profileContent');
    document.getElementById('profileBtn').onclick = () => this.open();
    document.getElementById('closeProfileBtn').onclick = () => this.close();
    this.panel.addEventListener('click', (event) => {
      if (event.target === this.panel) this.close();
    });
  }

  open() {
    this.render();
    this.panel.classList.add('open');
    this.panel.setAttribute('aria-hidden', 'false');
  }

  close() {
    this.panel.classList.remove('open');
    this.panel.setAttribute('aria-hidden', 'true');
  }

  render() {
    const p = this.progression;
    const hero = this.engine.hero;
    const cls = this.data.classes.ranger;
    const level = p.level;
    const base = cls.baseStats ?? {};
    const growth = cls.growth ?? {};
    const stat = (key) => Number(base[key] ?? 0) + (level - 1) * Number(growth[key] ?? 0);
    const hpMax = hero ? Math.ceil(hero.maxHp) : Math.ceil(stat('hp'));
    const hpCurrent = hero ? Math.ceil(hero.hp) : hpMax;
    const xpNext = p.xpToNext();

    this.content.innerHTML = `
      <div class="profile-hero">
        <div class="profile-portrait">🏹</div>
        <div>
          <div class="eyebrow">CHARACTER PROFILE</div>
          <h3>${cls.name}</h3>
          <span class="badge">Level ${level}</span>
          <div class="profile-xp"><div><span>XP</span><strong>${p.xp} / ${xpNext}</strong></div><div class="xpbar"><i style="width:${Math.min(100, p.xp / xpNext * 100)}%"></i></div></div>
        </div>
      </div>
      <div class="profile-grid">
        ${this.statCard('HP', `${hpCurrent} / ${hpMax}`, `+${growth.hp ?? 0} / level`)}
        ${this.statCard('Attack', Math.round(stat('attack')), `+${growth.attack ?? 0} / level`)}
        ${this.statCard('Defense', Math.round(stat('defense')), `+${growth.defense ?? 0} / level`)}
        ${this.statCard('Attack speed', Number(base.attackSpeed ?? 1).toFixed(2), 'attacks / sec')}
        ${this.statCard('Crit chance', `${Math.round(Number(base.critChance ?? 0) * 100)}%`, 'critical hit chance')}
        ${this.statCard('Crit damage', `${Number(base.critDamage ?? 1.5).toFixed(2)}x`, 'critical multiplier')}
        ${this.statCard('Range', Math.round(Number(base.range ?? 50)), 'combat range')}
        ${this.statCard('Gold', p.gold, 'current run')}
      </div>
      <div class="profile-run cardless">
        <div><span>Total kills</span><strong>${p.totalKills}</strong></div>
        <div><span>Total damage</span><strong>${Math.floor(p.totalDamage)}</strong></div>
        <div><span>Best wave</span><strong>${p.bestWave}</strong></div>
      </div>
      <p class="note">Restart Run resets level, XP, gold and run counters back to their starting values. Dungeon selection is kept.</p>`;
  }

  statCard(label, value, note) {
    return `<div class="profile-stat"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`;
  }
}
