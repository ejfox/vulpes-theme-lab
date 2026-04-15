import { exportMaplibre, LAYER_GROUPS, createSemanticPalette } from '~/utils/exporters'
import type { MapExportOptions } from '~/utils/types'

/**
 * Available fonts from MapTiler's glyph API
 */
export const MAPTILER_FONTS = [
  'Noto Sans Bold',
  'Noto Sans Regular',
  'Noto Sans Italic',
  'Roboto Regular',
  'Roboto Bold',
  'Roboto Medium',
  'Open Sans Regular',
  'Open Sans Bold',
  'Open Sans Semibold',
  'Klokantech Noto Sans Regular',
  'Klokantech Noto Sans Bold',
  'Klokantech Noto Sans Italic',
] as const

/**
 * Location presets for the map editor
 */
export const LOCATION_PRESETS = [
  { name: 'San Francisco', center: [-122.4194, 37.7749] as [number, number], zoom: 12 },
  { name: 'New York', center: [-73.9857, 40.7484] as [number, number], zoom: 12 },
  { name: 'Tokyo', center: [139.6917, 35.6895] as [number, number], zoom: 12 },
  { name: 'London', center: [-0.1278, 51.5074] as [number, number], zoom: 12 },
  { name: 'Paris', center: [2.3522, 48.8566] as [number, number], zoom: 12 },
  { name: 'Berlin', center: [13.405, 52.52] as [number, number], zoom: 12 },
  { name: 'Sydney', center: [151.2093, -33.8688] as [number, number], zoom: 12 },
  { name: 'Rio', center: [-43.1729, -22.9068] as [number, number], zoom: 12 },
  { name: 'Dubai', center: [55.2708, 25.2048] as [number, number], zoom: 12 },
  { name: 'Singapore', center: [103.8198, 1.3521] as [number, number], zoom: 12 },
] as const

/**
 * Map editor state — typography, layer visibility, and opacity
 */
export interface MapEditorState {
  labelFontFamily: string
  labelSizeScale: number
  labelHaloWidth: number
  labelHaloOpacity: number
  labelOpacity: number
  labelDensityCity: number
  labelDensityTown: number
  labelDensityRoad: number
  labelDensityPoi: number
  showWater: boolean
  showParks: boolean
  showBuildings: boolean
  showRoads: boolean
  showRailways: boolean
  showBoundaries: boolean
  showLabels: boolean
  showPois: boolean
  showAeroway: boolean
  showLanduse: boolean
  waterOpacity: number
  parkOpacity: number
  buildingOpacity: number
  roadOpacity: number
  railwayOpacity: number
  boundaryOpacity: number
  poiOpacity: number

  // Geometry scales
  buildingHeightScale: number // 0.1–3.0, multiplier on extrusion height
  roadWidthScale: number // 0.3–3.0, multiplier on all road widths
  waterOutlineWidth: number // 0–4
  boundaryWidth: number // 0.5–5

  // Color overrides — empty string means "use derived color"
  // Primary features
  colorWater: string
  colorPark: string
  colorRoadMotorway: string
  colorRoadTrunk: string
  colorRoadPrimary: string
  colorRoadSecondary: string
  colorBuilding: string
  colorPoi: string
  // Extended features
  colorRoadTertiary: string
  colorRoadPedestrian: string
  colorRailway: string
  colorBoundary: string
  colorTunnel: string
  colorBridge: string
  colorRunway: string
  colorWaterway: string
  colorLanduseResidential: string
  colorLanduseCommercial: string
  colorLanduseIndustrial: string
  colorPoiMedical: string
  colorPoiEducation: string
  colorPoiTransport: string
  colorPoiFood: string
  colorPoiShopping: string
  colorPoiCulture: string
  colorPoiReligion: string
  colorLabelText: string
  colorLabelHalo: string
}

const defaultMapState: MapEditorState = {
  labelFontFamily: 'Noto Sans Bold',
  labelSizeScale: 1.0,
  labelHaloWidth: 1.5,
  labelHaloOpacity: 100,
  labelOpacity: 100,
  labelDensityCity: 0,
  labelDensityTown: 0,
  labelDensityRoad: 0,
  labelDensityPoi: 0,
  showWater: true,
  showParks: true,
  showBuildings: true,
  showRoads: true,
  showRailways: true,
  showBoundaries: true,
  showLabels: true,
  showPois: true,
  showAeroway: true,
  showLanduse: true,
  waterOpacity: 100,
  parkOpacity: 100,
  buildingOpacity: 100,
  roadOpacity: 100,
  railwayOpacity: 100,
  boundaryOpacity: 100,
  poiOpacity: 100,
  buildingHeightScale: 1.0,
  roadWidthScale: 1.0,
  waterOutlineWidth: 1,
  boundaryWidth: 1.5,
  colorWater: '',
  colorPark: '',
  colorRoadMotorway: '',
  colorRoadTrunk: '',
  colorRoadPrimary: '',
  colorRoadSecondary: '',
  colorBuilding: '',
  colorPoi: '',
  colorRoadTertiary: '',
  colorRoadPedestrian: '',
  colorRailway: '',
  colorBoundary: '',
  colorTunnel: '',
  colorBridge: '',
  colorRunway: '',
  colorWaterway: '',
  colorLanduseResidential: '',
  colorLanduseCommercial: '',
  colorLanduseIndustrial: '',
  colorPoiMedical: '',
  colorPoiEducation: '',
  colorPoiTransport: '',
  colorPoiFood: '',
  colorPoiShopping: '',
  colorPoiCulture: '',
  colorPoiReligion: '',
  colorLabelText: '',
  colorLabelHalo: '',
}

/**
 * View angle presets for the map
 */
export const VIEW_PRESETS = [
  { name: 'Top', pitch: 0, bearing: 0 },
  { name: '3D', pitch: 45, bearing: -17.6 },
  { name: 'Street', pitch: 60, bearing: 0 },
] as const

export const useMapTheme = () => {
  const { state: themeState, colors, darkColors, lightColors } = useTheme()

  const mapState = useState<MapEditorState>('mapTheme', () => ({ ...defaultMapState }))

  // Computed: semantic palette for exporter
  const mapPalette = computed(() => {
    const currentColors = themeState.value.mode === 'dark' ? darkColors.value : lightColors.value
    return createSemanticPalette(currentColors, themeState.value.mode)
  })

  // Computed: export options from map state
  const mapExportOptions = computed<MapExportOptions>(() => {
    const ms = mapState.value
    return {
      typography: {
        fontFamily: ms.labelFontFamily,
        sizeScale: ms.labelSizeScale,
        haloWidth: ms.labelHaloWidth,
        haloOpacity: ms.labelHaloOpacity / 100,
        labelOpacity: ms.labelOpacity / 100,
        densityOffsets: {
          'place-city': ms.labelDensityCity,
          'place-town': ms.labelDensityTown,
          'road-label': ms.labelDensityRoad,
          'poi-medical': ms.labelDensityPoi,
          'poi-education': ms.labelDensityPoi,
          'poi-transport': ms.labelDensityPoi,
          'poi-food': ms.labelDensityPoi,
          'poi-culture': ms.labelDensityPoi,
          'poi-shopping': ms.labelDensityPoi,
          'poi-park': ms.labelDensityPoi,
          'poi-religion': ms.labelDensityPoi,
          'poi-general': ms.labelDensityPoi,
        },
      },
      visibility: {
        water: ms.showWater,
        parks: ms.showParks,
        buildings: ms.showBuildings,
        roads: ms.showRoads,
        railways: ms.showRailways,
        boundaries: ms.showBoundaries,
        labels: ms.showLabels,
        pois: ms.showPois,
        aeroway: ms.showAeroway,
        landuse: ms.showLanduse,
      },
      opacity: {
        water: ms.waterOpacity / 100,
        parks: ms.parkOpacity / 100,
        buildings: ms.buildingOpacity / 100,
        roads: ms.roadOpacity / 100,
        railways: ms.railwayOpacity / 100,
        boundaries: ms.boundaryOpacity / 100,
        pois: ms.poiOpacity / 100,
      },
      geometry: {
        buildingHeightScale: ms.buildingHeightScale,
        roadWidthScale: ms.roadWidthScale,
        waterOutlineWidth: ms.waterOutlineWidth,
        boundaryWidth: ms.boundaryWidth,
      },
      // Only include non-empty overrides
      colorOverrides: Object.fromEntries(
        [
          ['water', ms.colorWater],
          ['park', ms.colorPark],
          ['roadMotorway', ms.colorRoadMotorway],
          ['roadTrunk', ms.colorRoadTrunk],
          ['roadPrimary', ms.colorRoadPrimary],
          ['roadSecondary', ms.colorRoadSecondary],
          ['building', ms.colorBuilding],
          ['poi', ms.colorPoi],
          ['roadTertiary', ms.colorRoadTertiary],
          ['roadPedestrian', ms.colorRoadPedestrian],
          ['railway', ms.colorRailway],
          ['boundary', ms.colorBoundary],
          ['tunnel', ms.colorTunnel],
          ['bridge', ms.colorBridge],
          ['runway', ms.colorRunway],
          ['waterway', ms.colorWaterway],
          ['landuseResidential', ms.colorLanduseResidential],
          ['landuseCommercial', ms.colorLanduseCommercial],
          ['landuseIndustrial', ms.colorLanduseIndustrial],
          ['poiMedical', ms.colorPoiMedical],
          ['poiEducation', ms.colorPoiEducation],
          ['poiTransport', ms.colorPoiTransport],
          ['poiFood', ms.colorPoiFood],
          ['poiShopping', ms.colorPoiShopping],
          ['poiCulture', ms.colorPoiCulture],
          ['poiReligion', ms.colorPoiReligion],
          ['labelText', ms.colorLabelText],
          ['labelHalo', ms.colorLabelHalo],
        ].filter(([, v]) => v !== '')
      ),
    }
  })

  // Computed: full MapLibre style JSON
  const mapStyle = computed(() => {
    return exportMaplibre(mapPalette.value, themeState.value.themeName, mapExportOptions.value)
  })

  // Computed: feature color swatches for the sidebar (respects overrides)
  const featureColors = computed(() => {
    const c = themeState.value.mode === 'dark' ? darkColors.value : lightColors.value
    const ms = mapState.value
    return {
      water: ms.colorWater || c.mapWater,
      park: ms.colorPark || c.mapPark,
      motorway: ms.colorRoadMotorway || c.mapRoadMotorway,
      building: ms.colorBuilding || c.mapBuilding,
      poi: ms.colorPoi || c.mapPoi,
      bg: c.bg,
      fg: c.fg,
    }
  })

  // Extended: all derived feature colors (for the extended swatch grid)
  // Shows the override if set, otherwise the palette-derived value
  const extendedColors = computed(() => {
    const p = mapPalette.value
    const ms = mapState.value
    return {
      roadTertiary: ms.colorRoadTertiary || p.comment,
      roadPedestrian: ms.colorRoadPedestrian || p.success,
      railway: ms.colorRailway || p.info,
      boundary: ms.colorBoundary || p.punctuation,
      tunnel: ms.colorTunnel || p.builtin,
      bridge: ms.colorBridge || p.macro,
      runway: ms.colorRunway || p.heading,
      waterway: ms.colorWaterway || p.constant,
      landuseResidential: ms.colorLanduseResidential || p.bg_alt,
      landuseCommercial: ms.colorLanduseCommercial || p.property,
      landuseIndustrial: ms.colorLanduseIndustrial || p.builtin,
      poiMedical: ms.colorPoiMedical || p.error,
      poiEducation: ms.colorPoiEducation || p.type,
      poiTransport: ms.colorPoiTransport || p.info,
      poiFood: ms.colorPoiFood || p.warning,
      poiShopping: ms.colorPoiShopping || p.property,
      poiCulture: ms.colorPoiCulture || p.macro,
      poiReligion: ms.colorPoiReligion || p.builtin,
      labelText: ms.colorLabelText || p.fg,
      labelHalo: ms.colorLabelHalo || p.bg,
    }
  })

  // Reset everything to defaults
  const resetAll = () => {
    themeState.value.baseHue = 309
    themeState.value.contrast = 86
    themeState.value.mapWaterSaturation = 15
    themeState.value.mapParkSaturation = 50
    themeState.value.mapRoadSaturation = 60
    themeState.value.mapBuildingSaturation = 30
    themeState.value.mapWaterOffset = 0
    themeState.value.mapParkOffset = 0
    themeState.value.mapRoadMotorwayOffset = 0
    themeState.value.mapRoadTrunkOffset = 0
    themeState.value.mapRoadPrimaryOffset = 0
    themeState.value.mapRoadSecondaryOffset = 0
    themeState.value.mapBuildingOffset = 0
    themeState.value.mapPoiOffset = 0
    Object.assign(mapState.value, defaultMapState)
  }

  return {
    themeState,
    mapState,
    mapPalette,
    mapExportOptions,
    mapStyle,
    colors,
    darkColors,
    lightColors,
    featureColors,
    extendedColors,
    resetAll,
    MAPTILER_FONTS,
    LOCATION_PRESETS,
    LAYER_GROUPS,
    VIEW_PRESETS,
  }
}
