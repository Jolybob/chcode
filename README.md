# Horizonal Auto Battler — V1 Vertical Slice

A vanilla HTML/CSS/JavaScript vertical slice for a horizontal auto-battler prototype.

## Included
- Horizontal auto-combat lane
- 1 playable class: Ranger
- 4 enemy templates (3 core combat types + stronger beast for later waves)
- 1 active skill: Poison Arrow
- 10 waves in Tutorial Cave
- XP, levels, gold, kills, damage and best wave
- Pause, speed control and run restart
- Admin tab for live balance/enemy tuning
- JSON import/export for configuration + player progression
- No `localStorage`

## Run
Use any static server so the ES modules and JSON files can be fetched.

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## Architecture
`data/` contains external JSON configuration. Runtime modules live under `js/`, separated into core, combat, data, progression, dungeon, UI and save concerns.

## Next V2 candidates
- real 2D movement and attack animations
- tank / mage / healer classes
- spell effect registry (damage, heal, buff, debuff, stun)
- procedural dungeon modifiers
- skill tree UI + unlock persistence
- equipment and item templates
- stronger save validation + schema migrations
- proper entity renderer using Canvas or DOM pooling

### Important: clean restart
This build uses cache-busted module URLs. After replacing the files, stop any old Python server, unzip into a fresh folder, then run `python3 -m http.server 8000` from the project folder. Confirm the browser console shows `[AutoBattler V1] build 2 loaded`.
