# Changelog

## v0.4.0

[compare changes](https://github.com/ejfox/vulpes-theme-lab/compare/v0.3.0...v0.4.0)

### 🚀 Enhancements

- Rebuild showcase page as Product Hunt-style landing ([7c3540d](https://github.com/ejfox/vulpes-theme-lab/commit/7c3540d))
- Add syntax highlighting demos and semantic color examples ([572d3b1](https://github.com/ejfox/vulpes-theme-lab/commit/572d3b1))
- Add Tailwind CSS for proper spacing on showcase page ([aa5e931](https://github.com/ejfox/vulpes-theme-lab/commit/aa5e931))
- Sticky nav with prominent hue counter badge that shows color rotation ([6537414](https://github.com/ejfox/vulpes-theme-lab/commit/6537414))
- Rewrite showcase copy to explain monochrome benefits and multi-format export ([4a719ea](https://github.com/ejfox/vulpes-theme-lab/commit/4a719ea))
- Reorder sections with visual demos first, add live color demos to offset mentions, improve copy ([4168a89](https://github.com/ejfox/vulpes-theme-lab/commit/4168a89))
- Add clickable preset rows, fix readability, and redesign sliders ([f73afb1](https://github.com/ejfox/vulpes-theme-lab/commit/f73afb1))
- Add real SVG logos to export formats grid ([ad72198](https://github.com/ejfox/vulpes-theme-lab/commit/ad72198))
- Make base, fg, and bg colors editable ([49e6111](https://github.com/ejfox/vulpes-theme-lab/commit/49e6111))
- Showcase page overhaul with hero examples, presets grid, and Monaspace fonts ([904c4fe](https://github.com/ejfox/vulpes-theme-lab/commit/904c4fe))
- Add Tailwind CSS exporter ([7cc38f8](https://github.com/ejfox/vulpes-theme-lab/commit/7cc38f8))
- Add Obsidian theme exporter and preview component ([d117169](https://github.com/ejfox/vulpes-theme-lab/commit/d117169))
- Flatten sidebar/preview nesting and redesign sliders ([2ef4913](https://github.com/ejfox/vulpes-theme-lab/commit/2ef4913))

### 🔥 Performance

- Cut per-drag work so sliders stay responsive ([39ab95b](https://github.com/ejfox/vulpes-theme-lab/commit/39ab95b))

### 🩹 Fixes

- Remove global overflow hidden to allow showcase page scrolling ([716cdf5](https://github.com/ejfox/vulpes-theme-lab/commit/716cdf5))
- Remove aggressive global reset killing tailwind spacing, throttle hue animation to prevent router history spam ([110637e](https://github.com/ejfox/vulpes-theme-lab/commit/110637e))
- Theme preview cards now show actual theme hues with color palette swatches ([1cdcd11](https://github.com/ejfox/vulpes-theme-lab/commit/1cdcd11))
- MapLibre filter syntax for proper tile rendering ([c4f041c](https://github.com/ejfox/vulpes-theme-lab/commit/c4f041c))
- Proper grid layouts for color swatches and presets ([328b48b](https://github.com/ejfox/vulpes-theme-lab/commit/328b48b))
- ObsidianPreview undefined colors.value.property ([c119f6b](https://github.com/ejfox/vulpes-theme-lab/commit/c119f6b))
- Remove problematic colors.value refs in Obsidian preview ([e737487](https://github.com/ejfox/vulpes-theme-lab/commit/e737487))
- Pin nuxt to 4.1.3 to resolve vue-router RouterView crash ([3c3e254](https://github.com/ejfox/vulpes-theme-lab/commit/3c3e254))

### 💅 Refactors

- Fix DOM manipulation, add design tokens, implement VueUse composables ([55131e6](https://github.com/ejfox/vulpes-theme-lab/commit/55131e6))

### 🎨 Styles

- Format MapLibre filter expressions for readability ([35de8c6](https://github.com/ejfox/vulpes-theme-lab/commit/35de8c6))

### ❤️ Contributors

- EJ Fox ([@ejfox](https://github.com/ejfox))

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
