# Changelog

## v0.3.0

[compare changes](https://github.com/ejfox/vulpes-theme-lab/compare/v0.2.0...v0.3.0)

### 🚀 Features

- **MapLibre Integration**: Added MapLibre/Maptiler style export and live preview
  - New `maplibre.ts` exporter for cyberpunk neon map themes
  - `MapPreview.vue` component with live map rendering
  - Full MapLibre Style Spec JSON generation
  - Integrated into export system

- **Vulpes Monthly Theme Line**: Complete 12-month chromatic journey
  - 12 monthly theme presets following ROYGBIV
  - November Reddish (330°) as anchor theme
  - 30° hue progression per month (December 0° → November 330°)
  - `PresetSelector.vue` component with visual month grid
  - One-click theme loading with instant preview
  - Current month auto-detection

### 📚 Documentation

- Added `MAPLIBRE_INTEGRATION.md` - MapLibre setup and usage guide
- Added `VULPES_MONTHLY_LINE.md` - Complete monthly theme documentation
- Added `CLAUDE.md` - Project context and TODOs

### 🔧 Technical Changes

- Added `maplibre-gl` dependency (v5.14.0)
- New `utils/presets.ts` - Monthly theme preset definitions
- Updated export system to support MapLibre format
- Enhanced `ExportFormat` type with 'maplibre'

### 🎨 Theme Details

Monthly progression:
- December: Reddish (0°) - Pure red
- January: Orangish (30°) - New year warmth
- February: Yellowish (60°) - Winter's end
- March: Yellowish (90°) - Spring awakening
- April: Greenish (120°) - Full bloom
- May: Greenish (150°) - Late spring
- June: Cyanish (180°) - Summer sky
- July: Bluish (210°) - Midsummer
- August: Bluish (240°) - Late summer
- September: Purplish (270°) - Autumn shift
- October: Magentaish (300°) - Spooky season
- November: Reddish (330°) - **THE ANCHOR** 🦊

### ⚡ Export Formats

All monthly themes can now be exported to:
- MapLibre/Maptiler (NEW)
- Neovim
- Ghostty
- Bat
- Yazi
- Lazygit
- ZSH
- TweakCC (Claude Code)
- Neomutt
- Wezterm
- Alacritty

---

## v0.2.0

### 🎨 Features

- Initial release with multiple export formats
- Dark and light mode support
- Live preview components
- Color contrast validation
- Export to Ghostty, Neovim, Bat, Yazi, and more

### 🔧 Infrastructure

- GitHub Pages deployment via Actions
- Nuxt 4 with static site generation
- TypeScript support
- Vitest testing setup

---

Generated with [Changelogen](https://github.com/unjs/changelogen)
