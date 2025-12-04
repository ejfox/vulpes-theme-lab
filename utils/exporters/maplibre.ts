import chroma from 'chroma-js'
import type { ThemePalette, ExportResult } from '../types'

/**
 * Generates a MapLibre/Maptiler style JSON with cyberpunk neon aesthetic
 * Inspired by vulpes-reddishnovember theme - dark, minimalist, neon accents
 *
 * @param palette - Semantic color palette
 * @param themeName - Name of the theme
 * @returns MapLibre style JSON
 */
export function exportMaplibre(palette: ThemePalette, themeName: string = 'vulpes'): ExportResult {
  // Create color variations for different map features
  const baseColor = chroma(palette.base)
  const bgColor = chroma(palette.bg)

  // Neon accent colors (brighten the base for that cyberpunk glow)
  const neonBright = baseColor.brighten(0.5).hex()
  const neonMedium = baseColor.hex()
  const neonDim = baseColor.darken(0.5).hex()

  // Road colors - varying intensities of the theme color
  const roadMotorway = neonBright // Brightest roads
  const roadTrunk = neonMedium
  const roadPrimary = baseColor.darken(0.3).hex()
  const roadSecondary = baseColor.darken(0.6).hex()
  const roadTertiary = baseColor.darken(0.9).hex()
  const roadMinor = baseColor.darken(1.2).alpha(0.6).hex()

  // Water - neon pink/magenta glow
  const water = baseColor.saturate(0.5).hex()
  const waterOutline = baseColor.brighten(0.3).hex()

  // Buildings - dark with subtle pink outline
  const buildingFill = bgColor.brighten(0.2).hex()
  const buildingOutline = baseColor.darken(0.8).alpha(0.3).hex()

  // Parks/landuse - subtle variation
  const parkFill = bgColor.brighten(0.1).set('hsl.h', baseColor.get('hsl.h')).hex()

  // Labels - light pink text
  const labelText = palette.fg
  const labelHalo = palette.bg

  const style = {
    version: 8,
    name: `${themeName} - Cyberpunk Neon`,
    metadata: {
      'maplibre:version': '3.0.0',
      'generated-by': 'vulpes-theme-lab',
      description: 'Dark cyberpunk aesthetic with neon accents',
    },

    // Use OpenMapTiles or Maptiler vector tiles
    // Users will need to replace {key} with their API key or use a different source
    sources: {
      openmaptiles: {
        type: 'vector',
        url: 'https://api.maptiler.com/tiles/v3/tiles.json?key={key}',
      },
    },

    glyphs: 'https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key={key}',

    layers: [
      // Background (base land color)
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': palette.bg,
        },
      },

      // Water bodies - neon glow
      {
        id: 'water',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: {
          'fill-color': water,
          'fill-opacity': 0.8,
        },
      },
      {
        id: 'water-outline',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: {
          'line-color': waterOutline,
          'line-width': 1,
          'line-opacity': 0.5,
        },
      },

      // Landuse (parks, etc.) - subtle variation
      {
        id: 'landuse-park',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        filter: ['==', 'class', 'park'],
        paint: {
          'fill-color': parkFill,
          'fill-opacity': 0.6,
        },
      },

      // Buildings - dark with subtle outline
      {
        id: 'building',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'building',
        paint: {
          'fill-color': buildingFill,
          'fill-opacity': 0.7,
        },
      },
      {
        id: 'building-outline',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'building',
        paint: {
          'line-color': buildingOutline,
          'line-width': 0.5,
        },
      },

      // Roads - neon hierarchy
      {
        id: 'road-motorway',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['==', 'class', 'motorway'],
        paint: {
          'line-color': roadMotorway,
          'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, 1, 18, 20],
          'line-opacity': 0.9,
        },
      },
      {
        id: 'road-trunk',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['==', 'class', 'trunk'],
        paint: {
          'line-color': roadTrunk,
          'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, 0.8, 18, 16],
        },
      },
      {
        id: 'road-primary',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['==', 'class', 'primary'],
        paint: {
          'line-color': roadPrimary,
          'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, 0.6, 18, 12],
        },
      },
      {
        id: 'road-secondary',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['==', 'class', 'secondary'],
        paint: {
          'line-color': roadSecondary,
          'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, 0.5, 18, 10],
        },
      },
      {
        id: 'road-tertiary',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'tertiary', 'minor'],
        paint: {
          'line-color': roadTertiary,
          'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 10, 0.5, 18, 8],
        },
      },
      {
        id: 'road-street',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'service', 'street'],
        minzoom: 14,
        paint: {
          'line-color': roadMinor,
          'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 14, 1, 18, 6],
        },
      },

      // Place labels - neon text
      {
        id: 'place-city',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'place',
        filter: ['==', 'class', 'city'],
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Regular'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 4, 12, 10, 24],
        },
        paint: {
          'text-color': labelText,
          'text-halo-color': labelHalo,
          'text-halo-width': 2,
        },
      },
      {
        id: 'place-town',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'place',
        filter: ['==', 'class', 'town'],
        minzoom: 8,
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Regular'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 8, 10, 14, 18],
        },
        paint: {
          'text-color': labelText,
          'text-halo-color': labelHalo,
          'text-halo-width': 1.5,
        },
      },
      {
        id: 'road-label',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'transportation_name',
        minzoom: 13,
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Regular'],
          'text-size': 12,
          'symbol-placement': 'line',
        },
        paint: {
          'text-color': labelText,
          'text-halo-color': labelHalo,
          'text-halo-width': 1,
        },
      },

      // POI markers - bright accents
      {
        id: 'poi-label',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        minzoom: 14,
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Regular'],
          'text-size': 11,
          'text-anchor': 'top',
          'text-offset': [0, 0.5],
        },
        paint: {
          'text-color': neonMedium,
          'text-halo-color': labelHalo,
          'text-halo-width': 1,
        },
      },
    ],
  }

  return {
    filename: `${themeName}-maplibre.json`,
    content: JSON.stringify(style, null, 2),
    format: 'maplibre',
    metadata: {
      description: 'MapLibre/Maptiler style with cyberpunk neon aesthetic',
      usage: 'Replace {key} with your Maptiler API key, or use a different vector tile source',
    },
  }
}
