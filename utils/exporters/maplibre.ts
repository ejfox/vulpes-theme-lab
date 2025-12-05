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
  // === SMART SEMANTIC MAPPING ===
  // Map code syntax colors to cartographic features
  // Now uses customizable maplibre-specific colors from theme controls

  // ROADS - User-customizable road colors
  const roadMotorway = palette.mapRoadMotorway
  const roadTrunk = palette.mapRoadTrunk
  const roadPrimary = palette.mapRoadPrimary
  const roadSecondary = palette.mapRoadSecondary
  const roadTertiary = palette.comment // Muted like comments
  const roadMinor = chroma(palette.comment).darken(0.3).alpha(0.6).hex()
  const roadPedestrian = palette.success // Green for walkable paths

  // WATER - User-customizable water color
  const water = palette.mapWater
  const waterOutline = chroma(palette.mapWater).darken(0.5).alpha(0.4).hex()

  // BUILDINGS - User-customizable base building color with variations
  const buildingBase = chroma(palette.mapBuilding)
  // Array of building colors - variations of the base building color
  const buildingColors = [
    buildingBase.set('hsl.h', '+10').darken(0.5).hex(),
    buildingBase.set('hsl.h', '+20').darken(0.5).hex(),
    buildingBase.set('hsl.h', '+30').darken(0.5).hex(),
    buildingBase.set('hsl.h', '-10').darken(0.5).hex(),
    buildingBase.set('hsl.h', '-20').darken(0.5).hex(),
    buildingBase.set('hsl.h', '-30').darken(0.5).hex(),
    buildingBase.darken(0.5).hex(),
    buildingBase.brighten(0.2).darken(0.5).hex(),
    buildingBase.saturate(0.5).darken(0.5).hex(),
    buildingBase.desaturate(0.5).darken(0.5).hex(),
  ]
  // NATURE/PARKS - User-customizable park color
  const parkBase = chroma(palette.mapPark)
  const parkFill = parkBase.darken(0.5).alpha(0.4).hex()
  const forestFill = parkBase.darken(0.3).alpha(0.5).hex()
  const grassFill = parkBase.darken(0.7).alpha(0.3).hex()

  // LANDUSE - Properties and types
  const landuseResidential = palette.bg_alt // Subtle background variation
  const landuseCommercial = chroma(palette.property).darken(1.0).alpha(0.3).hex()
  const landuseIndustrial = chroma(palette.builtin).darken(1.0).alpha(0.4).hex()
  const landuseSports = chroma(palette.variable).darken(0.8).alpha(0.5).hex()
  const landuseCemetery = chroma(palette.comment).darken(0.5).alpha(0.3).hex()

  // RAILWAYS - Info color (infrastructure, systematic)
  const railway = palette.info
  const railwayOutline = chroma(palette.info).darken(0.5).hex()

  // BOUNDARIES - Punctuation (delimiters, separators)
  const boundary = chroma(palette.punctuation).alpha(0.4).hex()

  // POIs/AMENITIES - User-customizable POI color with semantic variations
  const poiGeneral = palette.mapPoi
  const poiMedical = palette.error // Red for hospitals
  const poiEducation = palette.type // Type color for schools
  const poiTransport = palette.info // Blue for transit
  const poiFood = palette.warning // Orange for food/dining
  const poiShopping = palette.property // Property color for retail
  const poiCulture = palette.macro // Macro color for museums/theaters
  const poiReligion = palette.builtin // Builtin for churches/temples
  const poiPark = palette.success // Green for park entrances

  // TUNNELS/BRIDGES - Special infrastructure
  const tunnel = chroma(palette.builtin).darken(1.0).alpha(0.6).hex()
  const bridge = palette.macro

  // AEROWAY - Aviation infrastructure
  const runway = chroma(palette.heading).darken(0.5).hex()
  const taxiway = chroma(palette.heading).darken(1.0).alpha(0.7).hex()

  // WATERWAYS - Flowing water (rivers, streams)
  const waterway = chroma(palette.constant).brighten(0.2).alpha(0.8).hex()
  const waterwayTunnel = chroma(palette.constant).darken(0.5).alpha(0.5).hex()

  // LABELS - Foreground with proper hierarchy
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
        filter: ['in', ['get', 'class'], ['literal', ['stadium', 'pitch', 'track']]],
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
        filter: ['in', ['get', 'class'], ['literal', ['wood', 'forest']]],
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
          // Use modulo to pseudo-randomly assign colors based on feature id
          'fill-extrusion-color': [
            'case',
            ['<', ['%', ['id'], 10], 1],
            buildingColors[0],
            ['<', ['%', ['id'], 10], 2],
            buildingColors[1],
            ['<', ['%', ['id'], 10], 3],
            buildingColors[2],
            ['<', ['%', ['id'], 10], 4],
            buildingColors[3],
            ['<', ['%', ['id'], 10], 5],
            buildingColors[4],
            ['<', ['%', ['id'], 10], 6],
            buildingColors[5],
            ['<', ['%', ['id'], 10], 7],
            buildingColors[6],
            ['<', ['%', ['id'], 10], 8],
            buildingColors[7],
            ['<', ['%', ['id'], 10], 9],
            buildingColors[8],
            buildingColors[9], // default
          ],
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
        filter: ['in', ['get', 'class'], ['literal', ['tertiary', 'minor']]],
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
        filter: ['in', ['get', 'class'], ['literal', ['service', 'street']]],
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
        filter: ['in', ['get', 'class'], ['literal', ['path', 'pedestrian']]],
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
          ['in', ['get', 'class'], ['literal', ['trunk', 'primary', 'secondary']]],
          ['==', 'brunnel', 'bridge'],
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
          'in',
          ['get', 'class'],
          ['literal', ['hospital', 'doctor', 'dentist', 'pharmacy']],
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
          'in',
          ['get', 'class'],
          ['literal', ['school', 'college', 'university', 'library']],
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
          'in',
          'class',
          'bus_stop',
          'bus_station',
          'subway_entrance',
          'train_station',
          'airport',
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
        filter: ['in', ['get', 'class'], ['literal', ['restaurant', 'cafe', 'bar', 'fast_food']]],
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
          'in',
          ['get', 'class'],
          ['literal', ['museum', 'theatre', 'cinema', 'monument', 'artwork']],
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
          'in',
          ['get', 'class'],
          ['literal', ['shop', 'supermarket', 'mall', 'department_store']],
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
        filter: ['in', ['get', 'class'], ['literal', ['park', 'playground', 'garden']]],
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
          'in',
          ['get', 'class'],
          ['literal', ['place_of_worship', 'church', 'mosque', 'temple', 'synagogue']],
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
