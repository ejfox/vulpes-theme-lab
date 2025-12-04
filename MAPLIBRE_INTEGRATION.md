# MapLibre Integration - Cyberpunk Neon Map Themes

## Overview

Added MapLibre/Maptiler style export and live preview to vulpes-theme-lab. This allows generating custom map styles that match your vulpes-reddishnovember theme with a dark cyberpunk neon aesthetic.

## What Was Added

### 1. MapLibre Exporter (`utils/exporters/maplibre.ts`)

Generates MapLibre Style Spec JSON with:
- **Dark cyberpunk aesthetic**: Background uses theme `bg` color
- **Neon water bodies**: Bright pink/magenta water using `base` accent color
- **Road hierarchy**: Roads colored in varying intensities based on importance
  - Motorways: Brightest neon
  - Trunk/Primary: Medium intensity
  - Secondary/Tertiary: Dimmer
  - Service roads: Subtle
- **Buildings**: Dark fills with subtle pink outlines
- **Labels**: Light pink text with halos for readability
- **POI markers**: Bright neon accents
- **3D tilt (pitch)**: 45° angle for that cyberpunk feel

### 2. MapPreview Component (`components/MapPreview.vue`)

Live preview that:
- Renders actual MapLibre GL map with your theme
- Updates in real-time when colors change
- Shows San Francisco (cyberpunk vibes)
- Includes navigation controls
- Non-interactive preview mode

### 3. Export Integration

Added to the export system:
- `exportMaplibre()` function
- Added to `ExportFormat` type
- Integrated into export modal
- Generates `{themeName}-maplibre.json` file

## Usage

### In vulpes-theme-lab

1. **Preview**: Scroll to the "maplibre - cyberpunk neon cartography" section to see live preview
2. **Export**: Select "maplibre" in export options
3. **Download**: Get JSON file with complete style spec

### Using the Exported Style

```javascript
import maplibregl from 'maplibre-gl'
import style from './vulpes-reddishnovember-maplibre.json'

// Replace {key} with your Maptiler API key
const styleString = JSON.stringify(style).replace(/{key}/g, 'YOUR_MAPTILER_KEY')

const map = new maplibregl.Map({
  container: 'map',
  style: JSON.parse(styleString),
  center: [-122.4194, 37.7749],
  zoom: 12,
  pitch: 45
})
```

### Getting a Maptiler API Key

1. Sign up at https://www.maptiler.com/
2. Get free API key (generous free tier)
3. Replace `{key}` in the exported JSON

### Alternative Vector Tile Sources

You can use any vector tile source that follows the OpenMapTiles schema:
- Maptiler (recommended)
- MapTiler Cloud
- Self-hosted OpenMapTiles
- Stadia Maps
- Jawg Maps

## Color Mapping

The exporter maps vulpes theme colors to map features:

| Map Feature | Color Source | Example |
|------------|--------------|---------|
| Background (land) | `palette.bg` | #0d0d0d |
| Water | `palette.base` (saturated) | #e60067 |
| Roads (motorway) | `palette.base` (brightest) | #ff0095 |
| Roads (minor) | `palette.base` (dimmed) | #501630 |
| Buildings | `palette.bg` (brightened) | #1a1a1a |
| Labels | `palette.fg` | #f2cfdf |
| POI markers | `palette.base` | #e60067 |

## Files Changed

- ✅ `utils/exporters/maplibre.ts` - New exporter
- ✅ `utils/exporters/index.ts` - Export function
- ✅ `utils/types.ts` - Added 'maplibre' to ExportFormat
- ✅ `components/MapPreview.vue` - New preview component
- ✅ `pages/index.vue` - Integration (import, generateConfig, template)
- ✅ `package.json` - Added maplibre-gl dependency

## Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run dev server
npm run dev

# Build for production
npm run build
```

## Future Enhancements

- [ ] Add light mode variant (neon-on-light aesthetic)
- [ ] Custom vector tile source configuration UI
- [ ] More map styles (satellite hybrid, terrain)
- [ ] Export to multiple map providers (Google Maps, Leaflet)
- [ ] Interactive map builder with layer toggles
- [ ] Preset locations (Tokyo, NYC, etc.)
- [ ] Animation presets (camera paths, transitions)
- [ ] 3D building extrusion styling

## Technical Notes

- Uses MapLibre GL JS v4.x
- Style follows MapLibre Style Specification v8
- Compatible with Maptiler, OpenMapTiles, and other OpenMapTiles-schema sources
- Client-side only (wrapped in `<ClientOnly>`)
- Watches theme changes and regenerates style dynamically

## Credits

- MapLibre GL JS: https://maplibre.org/
- Maptiler: https://www.maptiler.com/
- OpenMapTiles: https://openmaptiles.org/

---

**Status**: ✅ Fully implemented and tested
**Date**: 2025-12-03
**Theme Lab Version**: 0.2.0+
