import chroma from 'chroma-js'
import type { ThemePalette, ExportResult, MapExportOptions } from '../types'

/**
 * Layer group → layer ID mapping for visibility/opacity controls
 */
export const LAYER_GROUPS: Record<string, string[]> = {
  water: ['water', 'water-outline', 'waterway', 'waterway-tunnel'],
  parks: ['landuse-park', 'landuse-grass', 'landuse-forest'],
  buildings: ['building-3d'],
  roads: [
    'road-motorway',
    'road-trunk',
    'road-primary',
    'road-secondary',
    'road-tertiary',
    'road-street',
    'road-pedestrian',
    'road-bridge-motorway',
    'road-bridge-major',
    'road-tunnel',
  ],
  railways: ['railway', 'railway-outline'],
  boundaries: ['boundary-country', 'boundary-state'],
  labels: ['place-city', 'place-town', 'road-label'],
  pois: [
    'poi-medical',
    'poi-education',
    'poi-transport',
    'poi-food',
    'poi-culture',
    'poi-shopping',
    'poi-park',
    'poi-religion',
    'poi-general',
  ],
  aeroway: ['aeroway-runway', 'aeroway-taxiway', 'aeroway-apron'],
  landuse: [
    'landuse-residential',
    'landuse-commercial',
    'landuse-industrial',
    'landuse-cemetery',
    'landuse-sports',
  ],
}

/**
 * Scale a numeric paint/layout value (static number or interpolation expression) by a multiplier
 */
function scaleNumericValue(value: any, scale: number): any {
  if (typeof value === 'number') return Math.round(value * scale * 100) / 100
  if (Array.isArray(value) && value[0] === 'interpolate') {
    const scaled = [...value]
    for (let i = 3; i < scaled.length; i += 2) {
      if (typeof scaled[i + 1] === 'number') {
        scaled[i + 1] = Math.round(scaled[i + 1] * scale * 100) / 100
      }
    }
    return scaled
  }
  return value
}

/**
 * Scale a text-size value (static number or interpolation expression) by a multiplier
 */
function scaleTextSize(value: any, scale: number): any {
  if (typeof value === 'number') return Math.round(value * scale * 10) / 10
  if (Array.isArray(value) && value[0] === 'interpolate') {
    // ['interpolate', ['linear'], ['zoom'], stop1, val1, stop2, val2, ...]
    const scaled = [...value]
    for (let i = 3; i < scaled.length; i += 2) {
      if (typeof scaled[i + 1] === 'number') {
        scaled[i + 1] = Math.round(scaled[i + 1] * scale * 10) / 10
      }
    }
    return scaled
  }
  return value
}

/**
 * Find which group a layer belongs to
 */
function layerGroup(layerId: string): string | undefined {
  for (const [group, ids] of Object.entries(LAYER_GROUPS)) {
    if (ids.includes(layerId)) return group
  }
  return undefined
}

/**
 * Generates a MapLibre/Maptiler style JSON with cyberpunk neon aesthetic
 *
 * @param palette - Semantic color palette
 * @param themeName - Name of the theme
 * @param options - Optional typography, visibility, and opacity overrides
 * @returns MapLibre style JSON
 */
export function exportMaplibre(
  palette: ThemePalette,
  themeName: string = 'vulpes',
  options?: MapExportOptions
): ExportResult {
  // Create color variations for different map features
  // === SMART SEMANTIC MAPPING ===
  // Map code syntax colors to cartographic features
  // Now uses customizable maplibre-specific colors from theme controls

  // Color override helper: use override if provided, otherwise fall back to derived
  const ov = options?.colorOverrides || {}

  // ROADS
  const roadMotorway = ov.roadMotorway || palette.mapRoadMotorway
  const roadTrunk = ov.roadTrunk || palette.mapRoadTrunk
  const roadPrimary = ov.roadPrimary || palette.mapRoadPrimary
  const roadSecondary = ov.roadSecondary || palette.mapRoadSecondary
  const roadTertiary = ov.roadTertiary || palette.comment
  const roadMinor = chroma(ov.roadTertiary || palette.comment)
    .darken(0.3)
    .alpha(0.6)
    .hex()
  const roadPedestrian = ov.roadPedestrian || palette.success

  // WATER
  const water = ov.water || palette.mapWater
  const waterOutline = chroma(ov.water || palette.mapWater)
    .darken(0.5)
    .alpha(0.4)
    .hex()

  // BUILDINGS
  const buildingColor = chroma(ov.building || palette.mapBuilding)
    .darken(0.5)
    .hex()

  // NATURE/PARKS
  const parkBase = chroma(ov.park || palette.mapPark)
  const parkFill = parkBase.darken(0.5).alpha(0.4).hex()
  const forestFill = parkBase.darken(0.3).alpha(0.5).hex()
  const grassFill = parkBase.darken(0.7).alpha(0.3).hex()

  // LANDUSE - Properties and types
  const landuseResidential = ov.landuseResidential || palette.bg_alt
  const landuseCommercial =
    ov.landuseCommercial || chroma(palette.property).darken(1.0).alpha(0.3).hex()
  const landuseIndustrial =
    ov.landuseIndustrial || chroma(palette.builtin).darken(1.0).alpha(0.4).hex()
  const landuseSports = chroma(palette.variable).darken(0.8).alpha(0.5).hex()
  const landuseCemetery = chroma(palette.comment).darken(0.5).alpha(0.3).hex()

  // RAILWAYS
  const railway = ov.railway || palette.info
  const railwayOutline = chroma(ov.railway || palette.info)
    .darken(0.5)
    .hex()

  // BOUNDARIES
  const boundary = ov.boundary || chroma(palette.punctuation).alpha(0.4).hex()

  // POIs/AMENITIES
  const poiGeneral = ov.poi || palette.mapPoi
  const poiMedical = ov.poiMedical || palette.error
  const poiEducation = ov.poiEducation || palette.type
  const poiTransport = ov.poiTransport || palette.info
  const poiFood = ov.poiFood || palette.warning
  const poiShopping = ov.poiShopping || palette.property
  const poiCulture = ov.poiCulture || palette.macro
  const poiReligion = ov.poiReligion || palette.builtin
  const poiPark = palette.success

  // TUNNELS/BRIDGES
  const tunnel = ov.tunnel || chroma(palette.builtin).darken(1.0).alpha(0.6).hex()
  const bridge = ov.bridge || palette.macro

  // AEROWAY
  const runway = ov.runway || chroma(palette.heading).darken(0.5).hex()
  const taxiway = chroma(ov.runway || palette.heading)
    .darken(1.0)
    .alpha(0.7)
    .hex()

  // WATERWAYS
  const waterway = ov.waterway || chroma(palette.constant).brighten(0.2).alpha(0.8).hex()
  const waterwayTunnel = chroma(ov.waterway || palette.constant)
    .darken(0.5)
    .alpha(0.5)
    .hex()

  // LABELS
  const labelText = ov.labelText || palette.fg
  const labelHalo = ov.labelHalo || palette.bg

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

    // Monaspace font stack for that coding aesthetic
    sprite: 'https://api.maptiler.com/maps/basic/sprite?key={key}',

    layers: [
      // Background (base land color)
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': palette.bg,
        },
      },

      // Waterways (rivers, streams, canals) - flowing constant
      {
        id: 'waterway-tunnel',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'waterway',
        filter: ['==', 'brunnel', 'tunnel'],
        paint: {
          'line-color': waterwayTunnel,
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 16, 4],
          'line-dasharray': [3, 2],
        },
      },
      {
        id: 'waterway',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'waterway',
        filter: ['!=', 'brunnel', 'tunnel'],
        paint: {
          'line-color': waterway,
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 16, 4],
        },
      },

      // Water bodies - minimal, fades in with zoom
      {
        id: 'water',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: {
          'fill-color': water,
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 8, 0.3, 12, 0.6, 16, 0.8],
        },
      },
      {
        id: 'water-outline',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: {
          'line-color': waterOutline,
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 16, 1],
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.2, 14, 0.5],
        },
      },

      // Landuse - fades in with zoom for minimalist aesthetic
      {
        id: 'landuse-residential',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        filter: ['==', 'class', 'residential'],
        minzoom: 11,
        paint: {
          'fill-color': landuseResidential,
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 11, 0, 13, 0.2, 16, 0.3],
        },
      },
      {
        id: 'landuse-commercial',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        filter: ['==', 'class', 'commercial'],
        minzoom: 12,
        paint: {
          'fill-color': landuseCommercial,
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.2, 15, 0.5],
        },
      },
      {
        id: 'landuse-industrial',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        filter: ['==', 'class', 'industrial'],
        minzoom: 12,
        paint: {
          'fill-color': landuseIndustrial,
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.2, 15, 0.4],
        },
      },
      {
        id: 'landuse-cemetery',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        filter: ['==', 'class', 'cemetery'],
        minzoom: 13,
        paint: {
          'fill-color': landuseCemetery,
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 13, 0.1, 16, 0.3],
        },
      },
      {
        id: 'landuse-sports',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        filter: [
          'any',
          ['==', ['get', 'class'], 'stadium'],
          ['==', ['get', 'class'], 'pitch'],
          ['==', ['get', 'class'], 'track'],
        ],
        minzoom: 13,
        paint: {
          'fill-color': landuseSports,
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 13, 0.2, 16, 0.5],
        },
      },
      {
        id: 'landuse-park',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        filter: ['==', 'class', 'park'],
        minzoom: 10,
        paint: {
          'fill-color': parkFill,
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.2, 14, 0.5, 18, 0.7],
        },
      },
      {
        id: 'landuse-grass',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        filter: ['==', 'class', 'grass'],
        minzoom: 13,
        paint: {
          'fill-color': grassFill,
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 13, 0.1, 16, 0.4],
        },
      },
      {
        id: 'landuse-forest',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        filter: ['any', ['==', ['get', 'class'], 'wood'], ['==', ['get', 'class'], 'forest']],
        minzoom: 10,
        paint: {
          'fill-color': forestFill,
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.2, 14, 0.5],
        },
      },

      // Aeroway (runways, taxiways, aprons) - heading color
      {
        id: 'aeroway-runway',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'aeroway',
        filter: ['==', 'class', 'runway'],
        minzoom: 11,
        paint: {
          'line-color': runway,
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 3, 18, 20],
        },
      },
      {
        id: 'aeroway-taxiway',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'aeroway',
        filter: ['==', 'class', 'taxiway'],
        minzoom: 13,
        paint: {
          'line-color': taxiway,
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 1, 18, 4],
        },
      },
      {
        id: 'aeroway-apron',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'aeroway',
        filter: ['==', 'class', 'apron'],
        minzoom: 12,
        paint: {
          'fill-color': chroma(palette.heading).darken(1.2).alpha(0.4).hex(),
          'fill-opacity': 0.6,
        },
      },

      // Buildings - 3D extruded with randomized palette colors, fades in cyberpunk style
      {
        id: 'building-3d',
        type: 'fill-extrusion',
        source: 'openmaptiles',
        'source-layer': 'building',
        minzoom: 13,
        paint: {
          'fill-extrusion-color': buildingColor,
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            13,
            0,
            13.5,
            ['get', 'render_height'],
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            13,
            0,
            13.5,
            ['get', 'render_min_height'],
          ],
          // Cyberpunk fade-in: buildings emerge from darkness as you zoom
          'fill-extrusion-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            13,
            0.3,
            15,
            0.6,
            18,
            0.85,
          ],
          'fill-extrusion-vertical-gradient': true,
        },
      },

      // Road tunnels - builtin color (darker, underground)
      {
        id: 'road-tunnel',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['==', 'brunnel', 'tunnel'],
        paint: {
          'line-color': tunnel,
          'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, 0.5, 18, 12],
          'line-dasharray': [3, 2],
          'line-opacity': 0.7,
        },
      },

      // Roads - neon hierarchy with zoom-based brightness
      {
        id: 'road-motorway',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: [
          'all',
          ['==', 'class', 'motorway'],
          ['!=', 'brunnel', 'tunnel'],
          ['!=', 'brunnel', 'bridge'],
        ],
        paint: {
          'line-color': roadMotorway,
          'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, 1, 18, 20],
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0.5, 10, 0.8, 16, 1],
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
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0.4, 10, 0.7, 16, 0.95],
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
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 6, 0.3, 12, 0.7, 16, 0.9],
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
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 8, 0.2, 14, 0.6, 18, 0.85],
        },
      },
      {
        id: 'road-tertiary',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['any', ['==', ['get', 'class'], 'tertiary'], ['==', ['get', 'class'], 'minor']],
        paint: {
          'line-color': roadTertiary,
          'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 10, 0.5, 18, 8],
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.2, 14, 0.5, 18, 0.8],
        },
      },
      {
        id: 'road-street',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['any', ['==', ['get', 'class'], 'service'], ['==', ['get', 'class'], 'street']],
        minzoom: 14,
        paint: {
          'line-color': roadMinor,
          'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 14, 1, 18, 6],
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0.3, 16, 0.6, 18, 0.8],
        },
      },

      // Pedestrian paths - success green for walkability
      {
        id: 'road-pedestrian',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['any', ['==', ['get', 'class'], 'path'], ['==', ['get', 'class'], 'pedestrian']],
        minzoom: 14,
        paint: {
          'line-color': roadPedestrian,
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 0.5, 18, 2],
          'line-dasharray': [2, 1],
          'line-opacity': 0.6,
        },
      },

      // Road bridges - macro color (elevated infrastructure)
      {
        id: 'road-bridge-motorway',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['all', ['==', 'class', 'motorway'], ['==', 'brunnel', 'bridge']],
        paint: {
          'line-color': bridge,
          'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, 1.2, 18, 22],
          'line-opacity': 0.9,
        },
      },
      {
        id: 'road-bridge-major',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: [
          'all',
          [
            'any',
            ['==', ['get', 'class'], 'trunk'],
            ['==', ['get', 'class'], 'primary'],
            ['==', ['get', 'class'], 'secondary'],
          ],
          ['==', ['get', 'brunnel'], 'bridge'],
        ],
        paint: {
          'line-color': bridge,
          'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, 0.8, 18, 14],
        },
      },

      // Railways - info blue for infrastructure
      {
        id: 'railway',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['==', 'class', 'rail'],
        paint: {
          'line-color': railway,
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 18, 2],
        },
      },
      {
        id: 'railway-outline',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['==', 'class', 'rail'],
        paint: {
          'line-color': railwayOutline,
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 18, 4],
          'line-gap-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 18, 2],
        },
      },

      // Administrative boundaries - punctuation (delimiters)
      {
        id: 'boundary-country',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'boundary',
        filter: ['==', 'admin_level', 2],
        paint: {
          'line-color': boundary,
          'line-width': ['interpolate', ['linear'], ['zoom'], 4, 1, 10, 3],
          'line-dasharray': [4, 2],
          'line-opacity': 0.6,
        },
      },
      {
        id: 'boundary-state',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'boundary',
        filter: ['==', 'admin_level', 4],
        minzoom: 4,
        paint: {
          'line-color': boundary,
          'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.5, 10, 2],
          'line-dasharray': [4, 3],
          'line-opacity': 0.4,
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
          'text-font': ['Noto Sans Bold'], // Monaspace not in Maptiler, using bold Noto for coding aesthetic
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
          'text-font': ['Noto Sans Bold'],
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
          'text-font': ['Noto Sans Bold'],
          'text-size': 12,
          'symbol-placement': 'line',
        },
        paint: {
          'text-color': labelText,
          'text-halo-color': labelHalo,
          'text-halo-width': 1,
        },
      },

      // POI markers - varied semantic colors
      {
        id: 'poi-medical',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        filter: [
          'any',
          ['==', ['get', 'class'], 'hospital'],
          ['==', ['get', 'class'], 'doctor'],
          ['==', ['get', 'class'], 'dentist'],
          ['==', ['get', 'class'], 'pharmacy'],
        ],
        minzoom: 14,
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Bold'],
          'text-size': 11,
          'text-anchor': 'top',
          'text-offset': [0, 0.5],
        },
        paint: {
          'text-color': poiMedical,
          'text-halo-color': labelHalo,
          'text-halo-width': 1,
        },
      },
      {
        id: 'poi-education',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        filter: [
          'any',
          ['==', ['get', 'class'], 'school'],
          ['==', ['get', 'class'], 'college'],
          ['==', ['get', 'class'], 'university'],
          ['==', ['get', 'class'], 'library'],
        ],
        minzoom: 14,
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Bold'],
          'text-size': 11,
          'text-anchor': 'top',
          'text-offset': [0, 0.5],
        },
        paint: {
          'text-color': poiEducation,
          'text-halo-color': labelHalo,
          'text-halo-width': 1,
        },
      },
      {
        id: 'poi-transport',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        filter: [
          'any',
          ['==', ['get', 'class'], 'bus_stop'],
          ['==', ['get', 'class'], 'bus_station'],
          ['==', ['get', 'class'], 'subway_entrance'],
          ['==', ['get', 'class'], 'train_station'],
          ['==', ['get', 'class'], 'airport'],
        ],
        minzoom: 13,
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Bold'],
          'text-size': 11,
          'text-anchor': 'top',
          'text-offset': [0, 0.5],
        },
        paint: {
          'text-color': poiTransport,
          'text-halo-color': labelHalo,
          'text-halo-width': 1,
        },
      },
      {
        id: 'poi-food',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        filter: [
          'any',
          ['==', ['get', 'class'], 'restaurant'],
          ['==', ['get', 'class'], 'cafe'],
          ['==', ['get', 'class'], 'bar'],
          ['==', ['get', 'class'], 'fast_food'],
        ],
        minzoom: 15,
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Bold'],
          'text-size': 10,
          'text-anchor': 'top',
          'text-offset': [0, 0.5],
        },
        paint: {
          'text-color': poiFood,
          'text-halo-color': labelHalo,
          'text-halo-width': 1,
        },
      },
      {
        id: 'poi-culture',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        filter: [
          'any',
          ['==', ['get', 'class'], 'museum'],
          ['==', ['get', 'class'], 'theatre'],
          ['==', ['get', 'class'], 'cinema'],
          ['==', ['get', 'class'], 'monument'],
          ['==', ['get', 'class'], 'artwork'],
        ],
        minzoom: 14,
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Bold'],
          'text-size': 11,
          'text-anchor': 'top',
          'text-offset': [0, 0.5],
        },
        paint: {
          'text-color': poiCulture,
          'text-halo-color': labelHalo,
          'text-halo-width': 1,
        },
      },
      {
        id: 'poi-shopping',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        filter: [
          'any',
          ['==', ['get', 'class'], 'shop'],
          ['==', ['get', 'class'], 'supermarket'],
          ['==', ['get', 'class'], 'mall'],
          ['==', ['get', 'class'], 'department_store'],
        ],
        minzoom: 15,
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Bold'],
          'text-size': 10,
          'text-anchor': 'top',
          'text-offset': [0, 0.5],
        },
        paint: {
          'text-color': poiShopping,
          'text-halo-color': labelHalo,
          'text-halo-width': 1,
        },
      },
      {
        id: 'poi-park',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        filter: [
          'any',
          ['==', ['get', 'class'], 'park'],
          ['==', ['get', 'class'], 'playground'],
          ['==', ['get', 'class'], 'garden'],
        ],
        minzoom: 14,
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Bold'],
          'text-size': 11,
          'text-anchor': 'top',
          'text-offset': [0, 0.5],
        },
        paint: {
          'text-color': poiPark,
          'text-halo-color': labelHalo,
          'text-halo-width': 1,
        },
      },
      {
        id: 'poi-religion',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        filter: [
          'any',
          ['==', ['get', 'class'], 'place_of_worship'],
          ['==', ['get', 'class'], 'church'],
          ['==', ['get', 'class'], 'mosque'],
          ['==', ['get', 'class'], 'temple'],
          ['==', ['get', 'class'], 'synagogue'],
        ],
        minzoom: 14,
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Bold'],
          'text-size': 11,
          'text-anchor': 'top',
          'text-offset': [0, 0.5],
        },
        paint: {
          'text-color': poiReligion,
          'text-halo-color': labelHalo,
          'text-halo-width': 1,
        },
      },
      {
        id: 'poi-general',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        minzoom: 15,
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Bold'],
          'text-size': 10,
          'text-anchor': 'top',
          'text-offset': [0, 0.5],
        },
        paint: {
          'text-color': poiGeneral,
          'text-halo-color': labelHalo,
          'text-halo-width': 1,
        },
      },
    ],
  }

  // === POST-PROCESSING: Apply options if provided ===
  if (options) {
    const typo = options.typography
    const vis = options.visibility
    const opac = options.opacity

    // Filter out hidden layer groups
    if (vis) {
      style.layers = style.layers.filter((layer: any) => {
        if (layer.type === 'background') return true
        const group = layerGroup(layer.id)
        if (group && vis[group] === false) return false
        return true
      })
    }

    // Apply typography and opacity to remaining layers
    for (const layer of style.layers as any[]) {
      const group = layerGroup(layer.id)

      // Typography: apply to all symbol layers
      if (layer.type === 'symbol' && typo) {
        if (!layer.layout) layer.layout = {}
        if (!layer.paint) layer.paint = {}

        if (typo.fontFamily) {
          layer.layout['text-font'] = [typo.fontFamily]
        }
        if (typo.sizeScale != null && typo.sizeScale !== 1) {
          layer.layout['text-size'] = scaleTextSize(layer.layout['text-size'], typo.sizeScale)
        }
        if (typo.haloWidth != null) {
          layer.paint['text-halo-width'] = typo.haloWidth
        }
        if (typo.haloOpacity != null && typo.haloOpacity < 1) {
          layer.paint['text-halo-blur'] = (1 - typo.haloOpacity) * 2
        }
        if (typo.labelOpacity != null && typo.labelOpacity < 1) {
          layer.paint['text-opacity'] = typo.labelOpacity
        }
        // Per-layer density: adjust minzoom
        if (typo.densityOffsets && typo.densityOffsets[layer.id] != null) {
          const baseMinzoom = layer.minzoom || 0
          layer.minzoom = Math.max(0, Math.min(24, baseMinzoom + typo.densityOffsets[layer.id]))
        }
      }

      // Per-group opacity overrides
      if (group && opac && opac[group] != null && opac[group] < 1) {
        if (!layer.paint) layer.paint = {}
        const groupOpacity = opac[group]

        if (layer.type === 'fill') {
          layer.paint['fill-opacity'] = groupOpacity
        } else if (layer.type === 'line') {
          layer.paint['line-opacity'] = groupOpacity
        } else if (layer.type === 'fill-extrusion') {
          layer.paint['fill-extrusion-opacity'] = groupOpacity
        } else if (layer.type === 'symbol') {
          layer.paint['text-opacity'] = groupOpacity
          layer.paint['icon-opacity'] = groupOpacity
        }
      }
    }

    // Geometry scaling
    const geo = options.geometry
    if (geo) {
      for (const layer of style.layers as any[]) {
        if (!layer.paint) continue

        // Building height scale
        if (
          geo.buildingHeightScale != null &&
          geo.buildingHeightScale !== 1 &&
          layer.type === 'fill-extrusion'
        ) {
          if (layer.paint['fill-extrusion-height']) {
            layer.paint['fill-extrusion-height'] = scaleNumericValue(
              layer.paint['fill-extrusion-height'],
              geo.buildingHeightScale
            )
          }
          if (layer.paint['fill-extrusion-base']) {
            layer.paint['fill-extrusion-base'] = scaleNumericValue(
              layer.paint['fill-extrusion-base'],
              geo.buildingHeightScale
            )
          }
        }

        // Road width scale
        if (geo.roadWidthScale != null && geo.roadWidthScale !== 1 && layer.type === 'line') {
          const group = layerGroup(layer.id)
          if (group === 'roads' && layer.paint['line-width']) {
            layer.paint['line-width'] = scaleNumericValue(
              layer.paint['line-width'],
              geo.roadWidthScale
            )
          }
        }

        // Water outline width
        if (geo.waterOutlineWidth != null && layer.id === 'water-outline') {
          layer.paint['line-width'] = scaleNumericValue(
            layer.paint['line-width'],
            geo.waterOutlineWidth
          )
        }

        // Boundary width
        if (geo.boundaryWidth != null && layer.type === 'line') {
          const group = layerGroup(layer.id)
          if (group === 'boundaries' && layer.paint['line-width']) {
            layer.paint['line-width'] = scaleNumericValue(
              layer.paint['line-width'],
              geo.boundaryWidth
            )
          }
        }
      }
    }
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
