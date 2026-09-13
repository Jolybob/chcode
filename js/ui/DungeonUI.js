export class DungeonUI {
  constructor({data, engine, progression}) {
    this.data = data;
    this.engine = engine;
    this.progression = progression;
    this.panel = document.getElementById('dungeonPanel');
    this.content = document.getElementById('dungeonContent');
    document.getElementById('dungeonBtn').onclick = () => this.open();
    document.getElementById('closeDungeonBtn').onclick = () => this.close();
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
    const dungeons = Object.values(this.data.dungeons);
    this.content.innerHTML = dungeons.map((dungeon) => {
      const selected = dungeon.id === this.engine.dungeonId;
      const canSelect = dungeon.unlocked !== false;
      const waves = dungeon.waves ?? dungeon.waveTemplates?.length ?? 0;
      const reward = Number(dungeon.rewardMultiplier ?? 1).toFixed(2);
      return `<button class="dungeon-card ${selected ? 'selected' : ''}" data-dungeon="${dungeon.id}" ${canSelect ? '' : 'disabled'}>
        <div class="dungeon-icon">${dungeon.icon ?? '⚔️'}</div>
        <div class="dungeon-copy"><strong>${dungeon.name}</strong><span>${waves} waves · ${reward}x rewards</span><small>${dungeon.description ?? 'Combat dungeon'}</small></div>
        <div class="dungeon-state">${selected ? 'Selected' : canSelect ? 'Select' : 'Locked'}</div>
      </button>`;
    }).join('');

    this.content.querySelectorAll('[data-dungeon]').forEach((button) => {
      button.onclick = () => {
        this.engine.selectDungeon(button.dataset.dungeon);
        this.close();
      };
    });
  }
}
