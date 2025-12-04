# 🦊 The Vulpes Monthly Theme Line

A year-long chromatic journey through color space. Each month brings a new hue, following ROYGBIV smoothly through the seasons.

## The Complete Line

**November Reddish (330°)** is our anchor - the original cyberpunk neon theme.

From there, the color wheel progresses +30° each month:

| Month | Name | Hue | Color Family | Vibe |
|-------|------|-----|--------------|------|
| **December** | vulpes-reddish-december | 0° | Pure Red | Winter solstice, year-end reset |
| **January** | vulpes-orangish-january | 30° | Red-Orange | New year warmth |
| **February** | vulpes-yellowish-february | 60° | Yellow-Orange | Winter fading into spring |
| **March** | vulpes-yellowish-march | 90° | Yellow-Green | Spring awakening |
| **April** | vulpes-greenish-april | 120° | Pure Green | Code in full bloom |
| **May** | vulpes-greenish-may | 150° | Green-Cyan | Late spring freshness |
| **June** | vulpes-cyanish-june | 180° | Pure Cyan | Summer sky syntax |
| **July** | vulpes-bluish-july | 210° | Cyan-Blue | Midsummer compilation |
| **August** | vulpes-bluish-august | 240° | Deep Blue | Late summer debugging |
| **September** | vulpes-purplish-september | 270° | Blue-Violet | Autumn transition |
| **October** | vulpes-magentaish-october | 300° | Violet | Spooky season syntax |
| **November** | vulpes-reddish-november | 330° | Reddish-Violet | **THE ANCHOR** 🦊 |

## Design Philosophy

### ROYGBIV Progression
Following the classic rainbow spectrum, but distributed across 12 months instead of 7 colors. This creates smooth transitions where each month naturally flows into the next.

### Seasonal Resonance
- **Winter** (Dec-Feb): Red → Orange → Yellow - warm colors for cold months
- **Spring** (Mar-May): Yellow-Green → Green → Cyan - fresh growth colors
- **Summer** (Jun-Aug): Cyan → Blue → Deep Blue - cool sky colors
- **Fall** (Sep-Nov): Violet → Magenta → Reddish - deep contemplative colors

### Consistent Parameters
All themes share:
- Saturation: 78-86% (optimized per hue for readability)
- Lightness: 55-62% (dark mode optimized)
- Error offset: 180° (complementary color for high contrast)
- Warning offset: 30° (analogous for coherence)
- Syntax offsets: Inherited from November Reddish

## Usage in vulpes-theme-lab

### Loading Presets

The PresetSelector component shows all 12 monthly themes with:
- Color preview circles
- Current month highlighted
- One-click loading

Click any month to instantly apply its theme to all previews and exports.

### Current Month Auto-Detection

The app knows what month it is:
```typescript
import { getCurrentMonthPreset } from '~/utils/presets'

const currentPreset = getCurrentMonthPreset()
// Returns the appropriate theme for the current month
```

### Exporting Monthly Themes

1. Select your month from the preset grid
2. Choose export formats (nvim, ghostty, bat, yazi, lazygit, etc.)
3. Download your customized config files

All exports include the month name in the filename:
- `vulpes-orangish-january-dark.lua`
- `vulpes-cyanish-june.ghostty`
- `vulpes-magentaish-october-maplibre.json`

## Creating Your Own Variants

### Light Mode Variants
Each monthly theme can be adapted for light mode by adjusting:
```typescript
baseLightness: 45  // Darker for light backgrounds
baseSaturation: 70  // Slightly less saturated
```

### Custom Hue Tweaks
Want February at 65° instead of 60°?
```typescript
{
  name: 'vulpes-yellowish-february-custom',
  baseHue: 65,  // Tweak the hue
  // ... keep other settings
}
```

### Adding New Months (13-month lunar calendar?)
```typescript
{
  name: 'vulpes-tealish-leap',
  month: 13,
  baseHue: 165,  // Between May (150°) and June (180°)
  description: 'Leap month - for when 12 isn\'t enough',
  // ...
}
```

## Theme Export Formats

Each monthly theme can be exported to:

### Terminal Emulators
- **Ghostty** - Native config format
- **Wezterm** - Lua config
- **Alacritty** - YAML config
- **iTerm2** - XML plist

### CLI Tools
- **Neovim** - Full syntax highlighting (100+ groups)
- **Bat** - Syntax highlighting themes
- **Yazi** - File manager colors
- **Lazygit** - Git UI theme
- **Zsh** - Shell syntax + FZF colors
- **Neomutt** - Email client theme

### Maps
- **MapLibre** - Custom cartography with your monthly theme
- Perfect for data visualization projects

### IDE/Editors
- **TweakCC** - Claude Code themes
- Can be adapted for VS Code, Sublime, etc.

## Installation Examples

### Neovim (Lazy.nvim)
```lua
-- Download vulpes-orangish-january-dark.lua to ~/.config/nvim/colors/

-- In your lazy config:
vim.cmd.colorscheme('vulpes-orangish-january-dark')
```

### Ghostty
```bash
# Download vulpes-cyanish-june-dark.ghostty to ~/.config/ghostty/themes/

# In ~/.config/ghostty/config:
theme = vulpes-cyanish-june-dark
```

### Switching Monthly
Create a script to auto-switch themes each month:

```bash
#!/bin/bash
# switch-vulpes-theme.sh

MONTH=$(date +%m)
THEMES=(
  "vulpes-orangish-january"
  "vulpes-yellowish-february"
  "vulpes-yellowish-march"
  "vulpes-greenish-april"
  "vulpes-greenish-may"
  "vulpes-cyanish-june"
  "vulpes-bluish-july"
  "vulpes-bluish-august"
  "vulpes-purplish-september"
  "vulpes-magentaish-october"
  "vulpes-reddish-november"
  "vulpes-reddish-december"
)

# Get theme for current month (array is 0-indexed)
THEME=${THEMES[$((MONTH - 1))]}

echo "Switching to $THEME for month $MONTH"

# Update your configs here
sed -i "s/colorscheme.*/colorscheme '$THEME-dark'/" ~/.config/nvim/init.lua
sed -i "s/theme = .*/theme = $THEME-dark/" ~/.config/ghostty/config

# Reload configs
# ...
```

Run monthly via cron:
```cron
0 0 1 * * ~/switch-vulpes-theme.sh
```

## Color Theory Deep Dive

### Why 30° Steps?
360° ÷ 12 months = 30° per month

This creates perceptually smooth transitions. The human eye can detect ~1° hue differences, but 30° provides distinct identities while maintaining harmony.

### Saturation Variations
Not all hues look equally vivid at the same saturation:
- **Yellows** (60-90°): Lower saturation (78-82%) prevents eye strain
- **Blues** (210-240°): Higher saturation (85%) for depth
- **Reds/Magentas** (0°, 300-330°): Medium-high (82-85%) for impact

### Lightness Curve
Dark mode requires different lightness per hue:
- **Warm colors** (0-90°): Slightly higher (58-62%) - naturally darker
- **Greens/Cyans** (120-180°): Medium (55-56%) - balanced
- **Blues/Purples** (210-330°): Lower (54-58%) - naturally brighter

## Future Enhancements

### Seasonal Packs
Bundle 3 months together:
- Winter Pack (Dec-Feb): Warm energy colors
- Spring Pack (Mar-May): Growth and renewal
- Summer Pack (Jun-Aug): Cool sky vibes
- Fall Pack (Sep-Nov): Deep introspection

### Animation Transitions
Gradual hue shifts between months:
```typescript
// Smoothly transition from January (30°) to February (60°)
const dayOfMonth = new Date().getDate()
const progress = dayOfMonth / 31
const currentHue = 30 + (progress * 30)  // 30° to 60° over the month
```

### AI-Generated Variants
Use the monthly themes as training data to generate:
- Regional variants (Tokyo neon, Nordic minimalism)
- Mood-based (energetic, contemplative, focused)
- Activity-specific (coding, writing, debugging)

### Community Submissions
Open for variations:
- Light mode versions
- Accessibility-optimized (WCAG AAA)
- Monochrome variants
- Duotone experiments

## Credits

- **Original Theme**: vulpes-reddish-november by @ejfox
- **Color Theory**: Josef Albers, Johannes Itten
- **Tool**: vulpes-theme-lab (Nuxt + chroma-js)
- **Philosophy**: Seasonal computing, chromatic mindfulness

---

**Start your chromatic journey today. 🦊**

*The year is a color wheel, and every month is a new hue.*
