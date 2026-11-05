/**
 * Pure, framework-free theme color generator.
 *
 * This is the SAME algorithm as composables/useTheme.ts (generateThemeVariant,
 * simulateColorblind, applyColorblindSim) but extracted so it can run outside
 * a Nuxt context -- in `scripts/export-all.ts` (vite-node), in vitest, and in
 * the browser "download all" page. composables/useTheme.ts imports from here
 * to avoid any divergence between the live app and the batch exporter.
 *
 * Do not fork this logic. If the algorithm changes, change it here only.
 */
import chroma from 'chroma-js'

// Unified theme colors interface - used by ALL export utilities
export interface ThemeColors {
  bg: string
  fg: string
  base: string
  error: string
  warning: string
  hint: string
  comment: string
  keyword: string
  string: string
  number: string
  function: string
  constant: string
  type: string
  variable: string
  operator: string
  builtin: string
  parameter: string
  property: string
  namespace: string
  macro: string
  tag: string
  punctuation: string
  heading: string
  palette: Record<number, string>
  // MapLibre-specific colors
  mapWater: string
  mapPark: string
  mapRoadMotorway: string
  mapRoadTrunk: string
  mapRoadPrimary: string
  mapRoadSecondary: string
  mapBuilding: string
  mapPoi: string
}

export interface ThemeState {
  themeName: string // Name of the active theme
  baseHue: number
  hueOffset: number
  saturation: number
  lightModeSaturation: number // Independent saturation control for light mode
  contrast: number
  monochromeMode: boolean
  monochromeIntensity: number
  monochromeLightness: number
  boldKeywords: boolean
  italicComments: boolean
  boldFunctions: boolean
  italicStrings: boolean
  underlineErrors: boolean
  mode: 'dark' | 'light'
  // Imported theme palette (when set, overrides generated colors)
  importedPalette?: ThemeColors | null
  // Colorblind simulation
  colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
  // Visual effects
  backgroundOpacity: number // 0-100 (for Ghostty, Neovim, etc)
  backgroundBlur: number // 0-100 (Ghostty only, macOS)
  windowBlend: number // 0-100 (Neovim winblend)
  popupBlend: number // 0-100 (Neovim pumblend)
  // Individual color offsets
  errorOffset: number
  warningOffset: number
  keywordOffset: number
  stringOffset: number
  numberOffset: number
  functionOffset: number
  constantOffset: number
  typeOffset: number
  variableOffset: number
  operatorOffset: number
  builtinOffset: number
  parameterOffset: number
  propertyOffset: number
  namespaceOffset: number
  macroOffset: number
  tagOffset: number
  punctuationOffset: number
  headingOffset: number
  commentOffset: number
  baseOffset: number
  hintOffset: number
  fgOffset: number
  bgOffset: number
  // Individual color lightness (0-100)
  errorLightness: number
  warningLightness: number
  keywordLightness: number
  stringLightness: number
  numberLightness: number
  functionLightness: number
  constantLightness: number
  typeLightness: number
  variableLightness: number
  operatorLightness: number
  builtinLightness: number
  parameterLightness: number
  propertyLightness: number
  namespaceLightness: number
  macroLightness: number
  tagLightness: number
  punctuationLightness: number
  headingLightness: number
  commentLightness: number
  baseLightness: number
  hintLightness: number
  fgLightness: number
  bgLightness: number
  // Link to global offset (when true, uses hueOffset * multiplier)
  errorLinked: boolean
  warningLinked: boolean
  keywordLinked: boolean
  stringLinked: boolean
  numberLinked: boolean
  functionLinked: boolean
  constantLinked: boolean
  typeLinked: boolean
  variableLinked: boolean
  operatorLinked: boolean
  builtinLinked: boolean
  parameterLinked: boolean
  propertyLinked: boolean
  namespaceLinked: boolean
  macroLinked: boolean
  tagLinked: boolean
  punctuationLinked: boolean
  headingLinked: boolean
  commentLinked: boolean
  baseLinked: boolean
  hintLinked: boolean
  fgLinked: boolean
  bgLinked: boolean
  // Multipliers for linked colors
  errorMultiplier: number
  warningMultiplier: number
  keywordMultiplier: number
  stringMultiplier: number
  numberMultiplier: number
  functionMultiplier: number
  constantMultiplier: number
  typeMultiplier: number
  variableMultiplier: number
  operatorMultiplier: number
  builtinMultiplier: number
  parameterMultiplier: number
  propertyMultiplier: number
  namespaceMultiplier: number
  macroMultiplier: number
  tagMultiplier: number
  punctuationMultiplier: number
  headingMultiplier: number
  commentMultiplier: number
  baseMultiplier: number
  hintMultiplier: number
  fgMultiplier: number
  bgMultiplier: number
  // MapLibre-specific hue shifts (±degrees from cartographic base hues)
  mapWaterOffset: number
  mapParkOffset: number
  mapRoadMotorwayOffset: number
  mapRoadTrunkOffset: number
  mapRoadPrimaryOffset: number
  mapRoadSecondaryOffset: number
  mapBuildingOffset: number
  mapPoiOffset: number
  // Cartographic saturation controls (0-100)
  mapWaterSaturation: number
  mapParkSaturation: number
  mapRoadSaturation: number
  mapBuildingSaturation: number
}

export const DEFAULT_THEME_STATE: ThemeState = {
  themeName: 'vulpes',
  baseHue: 309,
  hueOffset: 1,
  saturation: 100,
  lightModeSaturation: 100, // Default to same as dark mode
  contrast: 86,
  monochromeMode: true,
  monochromeIntensity: 100,
  monochromeLightness: 0,
  boldKeywords: false,
  italicComments: true,
  boldFunctions: false,
  italicStrings: true,
  underlineErrors: true,
  mode: 'dark' as 'dark' | 'light',
  importedPalette: null,
  colorblindMode: 'none' as 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia',
  backgroundOpacity: 100,
  backgroundBlur: 0,
  windowBlend: 0,
  popupBlend: 10,
  errorOffset: 0,
  warningOffset: 0,
  keywordOffset: 0,
  stringOffset: 0,
  numberOffset: 0,
  functionOffset: 0,
  constantOffset: 0,
  typeOffset: 0,
  variableOffset: 0,
  operatorOffset: 0,
  builtinOffset: 0,
  parameterOffset: 0,
  propertyOffset: 0,
  namespaceOffset: 0,
  macroOffset: 0,
  tagOffset: 0,
  punctuationOffset: 0,
  headingOffset: 0,
  commentOffset: 0,
  baseOffset: 0,
  hintOffset: 0,
  fgOffset: 0,
  bgOffset: 0,
  errorLightness: 50,
  warningLightness: 50,
  keywordLightness: 50,
  stringLightness: 50,
  numberLightness: 50,
  functionLightness: 50,
  constantLightness: 50,
  typeLightness: 50,
  variableLightness: 50,
  operatorLightness: 50,
  builtinLightness: 50,
  parameterLightness: 50,
  propertyLightness: 50,
  namespaceLightness: 50,
  macroLightness: 50,
  tagLightness: 50,
  punctuationLightness: 50,
  headingLightness: 50,
  commentLightness: 50,
  baseLightness: 50,
  hintLightness: 50,
  fgLightness: 50,
  bgLightness: 50,
  errorLinked: true,
  warningLinked: true,
  keywordLinked: true,
  stringLinked: true,
  numberLinked: true,
  functionLinked: true,
  constantLinked: true,
  typeLinked: true,
  variableLinked: true,
  operatorLinked: true,
  builtinLinked: true,
  parameterLinked: true,
  propertyLinked: true,
  namespaceLinked: true,
  macroLinked: true,
  tagLinked: true,
  punctuationLinked: true,
  headingLinked: true,
  commentLinked: false,
  baseLinked: true,
  hintLinked: true,
  fgLinked: false,
  bgLinked: false,
  keywordMultiplier: 3,
  functionMultiplier: -3,
  builtinMultiplier: 2.5,
  typeMultiplier: -2.5,
  stringMultiplier: 4,
  numberMultiplier: -4,
  constantMultiplier: 3.5,
  macroMultiplier: -2,
  tagMultiplier: 2,
  headingMultiplier: 3.5,
  namespaceMultiplier: 1.5,
  variableMultiplier: -1,
  propertyMultiplier: -1.5,
  parameterMultiplier: -0.5,
  operatorMultiplier: 0.5,
  punctuationMultiplier: 0.25,
  errorMultiplier: 5,
  warningMultiplier: -5,
  commentMultiplier: 0,
  baseMultiplier: 0,
  hintMultiplier: 0,
  fgMultiplier: 0,
  bgMultiplier: 0,
  mapWaterOffset: 0,
  mapParkOffset: 0,
  mapRoadMotorwayOffset: 0,
  mapRoadTrunkOffset: 0,
  mapRoadPrimaryOffset: 0,
  mapRoadSecondaryOffset: 0,
  mapBuildingOffset: 0,
  mapPoiOffset: 0,
  mapWaterSaturation: 15,
  mapParkSaturation: 50,
  mapRoadSaturation: 60,
  mapBuildingSaturation: 30,
}

/**
 * Generate a full ThemeColors palette for the given mode from a ThemeState.
 * Pure function -- identical math to composables/useTheme.ts's internal
 * generateThemeVariant, parameterized on `s` instead of closing over a ref.
 */
/** Picks between a dark-mode and light-mode value -- used in place of
 * `isDark ? dark : light` throughout this file (no ternaries in new code). */
function forMode<T>(isDark: boolean, dark: T, light: T): T {
  if (isDark) return dark
  return light
}

export function generateThemeVariant(s: ThemeState, mode: 'dark' | 'light'): ThemeColors {
  const isDark = mode === 'dark'
  const contrastFactor = s.contrast / 100
  const sat = forMode(isDark, s.saturation, s.lightModeSaturation) / 100
  const monoIntensity = s.monochromeIntensity / 100

  const colorAt = (hueOffset: number, darkBase: number, lightBase: number) => {
    const hue = (s.baseHue + hueOffset + 360) % 360
    const darkL = darkBase + (contrastFactor - 0.5) * 15
    const lightL = lightBase - (contrastFactor - 0.5) * 12
    const l = forMode(isDark, darkL, lightL)
    return chroma.hsl(hue, sat, l / 100).hex()
  }

  const applyLightnessAdjust = (baseDark: number, baseLight: number, adjust: number) => {
    const offset = (adjust - 50) * 0.3
    return {
      dark: baseDark + offset,
      light: baseLight + offset,
    }
  }

  const LIGHTNESS_BASES: Record<string, [number, number]> = {
    error: [55, 28], warning: [55, 30], keyword: [60, 25], string: [60, 32],
    number: [65, 35], function: [55, 28], constant: [58, 30], type: [62, 27],
    variable: [57, 33], operator: [60, 30], builtin: [58, 29], parameter: [56, 32],
    property: [57, 31], namespace: [61, 28], macro: [59, 29], tag: [60, 26],
    punctuation: [55, 35], heading: [62, 25], comment: [45, 50], base: [50, 30],
    hint: [70, 45], fg: [88, 15], bg: [5, 97],
  }

  const L: Record<string, { dark: number; light: number }> = {}
  for (const [name, [dark, light]] of Object.entries(LIGHTNESS_BASES)) {
    const adjust = (s as unknown as Record<string, number>)[`${name}Lightness`]
    L[name] = applyLightnessAdjust(dark, light, adjust)
  }

  const getOffset = (colorName: string): number => {
    const linked = (s as unknown as Record<string, boolean>)[`${colorName}Linked`]
    const individualOffset = (s as unknown as Record<string, number>)[`${colorName}Offset`]
    if (linked) {
      const multiplier = (s as unknown as Record<string, number>)[`${colorName}Multiplier`]
      return s.hueOffset * multiplier + individualOffset
    }
    return individualOffset
  }

  const bgHue = (s.baseHue + getOffset('bg') + 360) % 360
  const fgHue = (s.baseHue + getOffset('fg') + 360) % 360
  const bgL = forMode(isDark, L.bg.dark, L.bg.light)
  const fgL = forMode(isDark, L.fg.dark, L.fg.light)

  const bgSat = forMode(isDark, 0, sat * 0.08)
  const bg = chroma.hsl(bgHue, bgSat, bgL / 100).hex()
  let fg: string
  if (s.monochromeMode) {
    fg = chroma.hsl(fgHue, sat * monoIntensity, fgL / 100).hex()
  } else {
    fg = chroma.hsl(fgHue, 0, fgL / 100).hex()
  }

  const CARTOGRAPHIC_HUES = {
    water: 200,
    park: 120,
    motorway: 20,
    trunk: 40,
    primary: 50,
    secondary: 60,
    building: 280,
    poi: 0,
  }

  const getMapLightness = (feature: keyof typeof CARTOGRAPHIC_HUES) => {
    const lightness = {
      dark: {
        water: 15, park: 45, motorway: 60, trunk: 58, primary: 55, secondary: 52,
        building: 35, poi: 58,
      },
      light: {
        water: 85, park: 40, motorway: 42, trunk: 43, primary: 44, secondary: 46,
        building: 50, poi: 42,
      },
    }
    const base = forMode(isDark, lightness.dark[feature], lightness.light[feature])
    return base + (contrastFactor - 0.5) * forMode(isDark, 15, -12)
  }

  const getMapSaturation = (feature: keyof typeof CARTOGRAPHIC_HUES) => {
    const baseSaturation = {
      water: s.mapWaterSaturation / 100,
      park: s.mapParkSaturation / 100,
      motorway: s.mapRoadSaturation / 100,
      trunk: s.mapRoadSaturation / 100,
      primary: s.mapRoadSaturation / 100,
      secondary: (s.mapRoadSaturation / 100) * 0.7,
      building: s.mapBuildingSaturation / 100,
      poi: s.mapRoadSaturation / 100,
    }
    return baseSaturation[feature]
  }

  const MAP_OFFSET_KEYS: Record<keyof typeof CARTOGRAPHIC_HUES, keyof ThemeState> = {
    water: 'mapWaterOffset',
    park: 'mapParkOffset',
    motorway: 'mapRoadMotorwayOffset',
    trunk: 'mapRoadTrunkOffset',
    primary: 'mapRoadPrimaryOffset',
    secondary: 'mapRoadSecondaryOffset',
    building: 'mapBuildingOffset',
    poi: 'mapPoiOffset',
  }

  const mapColorAt = (feature: keyof typeof CARTOGRAPHIC_HUES) => {
    const offset = ((s[MAP_OFFSET_KEYS[feature]] as number) || 0)
    const hue = (((CARTOGRAPHIC_HUES[feature] + offset) % 360) + 360) % 360
    const lightness = getMapLightness(feature) / 100
    const saturation = getMapSaturation(feature)
    return chroma.hsl(hue, saturation, lightness).hex()
  }

  const semanticColor = (name: string) => colorAt(getOffset(name), L[name].dark, L[name].light)

  return {
    bg,
    fg,
    base: semanticColor('base'),
    error: semanticColor('error'),
    warning: semanticColor('warning'),
    hint: semanticColor('hint'),
    comment: semanticColor('comment'),
    keyword: semanticColor('keyword'),
    string: semanticColor('string'),
    number: semanticColor('number'),
    function: semanticColor('function'),
    constant: semanticColor('constant'),
    type: semanticColor('type'),
    variable: semanticColor('variable'),
    operator: semanticColor('operator'),
    builtin: semanticColor('builtin'),
    parameter: semanticColor('parameter'),
    property: semanticColor('property'),
    namespace: semanticColor('namespace'),
    macro: semanticColor('macro'),
    tag: semanticColor('tag'),
    punctuation: semanticColor('punctuation'),
    heading: semanticColor('heading'),
    palette: {
      0: chroma.hsl(0, 0, forMode(isDark, 0.1, 0.9)).hex(),
      1: colorAt(s.hueOffset, 50, 35),
      2: colorAt(s.hueOffset * 2, 50, 38),
      3: colorAt(-s.hueOffset, 60, 45),
      4: colorAt(-s.hueOffset * 2, 55, 40),
      5: colorAt(-s.hueOffset * 3, 58, 42),
      6: colorAt(s.hueOffset * 3, 55, 40),
      7: chroma.hsl(0, 0, forMode(isDark, 0.7, 0.3)).hex(),
      8: chroma.hsl(0, 0, forMode(isDark, 0.35, 0.65)).hex(),
      9: colorAt(s.hueOffset, 65, 42),
      10: colorAt(s.hueOffset * 2, 65, 45),
      11: colorAt(-s.hueOffset, 75, 50),
      12: colorAt(-s.hueOffset * 2, 70, 48),
      13: colorAt(-s.hueOffset * 3, 72, 48),
      14: colorAt(s.hueOffset * 3, 70, 45),
      15: chroma.hsl(0, 0, forMode(isDark, 0.95, 0.1)).hex(),
    },
    mapWater: mapColorAt('water'),
    mapPark: mapColorAt('park'),
    mapRoadMotorway: mapColorAt('motorway'),
    mapRoadTrunk: mapColorAt('trunk'),
    mapRoadPrimary: mapColorAt('primary'),
    mapRoadSecondary: mapColorAt('secondary'),
    mapBuilding: mapColorAt('building'),
    mapPoi: mapColorAt('poi'),
  }
}

/** Apply colorblind simulation to a single hex color. */
export function simulateColorblind(hexColor: string, mode: ThemeState['colorblindMode']): string {
  if (mode === 'none') return hexColor

  const color = chroma(hexColor)
  const [h, s, l] = color.hsl()

  if (mode === 'achromatopsia') {
    return chroma.hsl(0, 0, l).hex()
  }

  if (mode === 'protanopia') {
    let newHue = h
    if (h >= 0 && h < 60) newHue = h + 30
    if (h >= 300) newHue = 60
    return chroma.hsl(newHue, s * 0.6, l).hex()
  }

  if (mode === 'deuteranopia') {
    let newHue = h
    if (h >= 60 && h < 180) newHue = 50
    return chroma.hsl(newHue, s * 0.5, l).hex()
  }

  if (mode === 'tritanopia') {
    let newHue = h
    if (h >= 180 && h < 300) newHue = h - 60
    return chroma.hsl(newHue, s * 0.7, l).hex()
  }

  return hexColor
}

/** Apply colorblind simulation to every color in a theme. */
export function applyColorblindSim(
  theme: ThemeColors,
  mode: ThemeState['colorblindMode']
): ThemeColors {
  if (mode === 'none') return theme

  const simulated: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(theme)) {
    if (key === 'palette') {
      const palette: Record<number, string> = {}
      for (const [idx, color] of Object.entries(value as Record<number, string>)) {
        palette[Number(idx)] = simulateColorblind(color, mode)
      }
      simulated.palette = palette
    } else {
      simulated[key] = simulateColorblind(value as string, mode)
    }
  }
  return simulated as unknown as ThemeColors
}

/**
 * Build a ThemeState for one of the VULPES_MONTHLY_PRESETS, matching what
 * clicking that preset in the app does (pages/index.vue `loadPreset`).
 *
 * The preset's `baseSaturation` drives both `saturation` and
 * `lightModeSaturation` (the 78-86% spread in VULPES_MONTHLY_LINE.md).
 * Until 2026-11-04 loadPreset wrote it to a nonexistent field, so the UI
 * rendered every preset at 100%; both paths now use the preset value.
 */
export function presetToThemeState(preset: {
  id: string
  baseHue: number
  baseSaturation: number
  errorOffset: number
  warningOffset: number
  keywordOffset: number
  stringOffset: number
  numberOffset: number
  functionOffset: number
  constantOffset: number
  typeOffset: number
  variableOffset: number
  operatorOffset: number
  builtinOffset: number
  parameterOffset: number
  propertyOffset: number
  namespaceOffset: number
  macroOffset: number
  tagOffset: number
  punctuationOffset: number
  headingOffset: number
}): ThemeState {
  return {
    ...DEFAULT_THEME_STATE,
    themeName: preset.id,
    baseHue: preset.baseHue,
    saturation: preset.baseSaturation,
    lightModeSaturation: preset.baseSaturation,
    errorOffset: preset.errorOffset,
    warningOffset: preset.warningOffset,
    keywordOffset: preset.keywordOffset,
    stringOffset: preset.stringOffset,
    numberOffset: preset.numberOffset,
    functionOffset: preset.functionOffset,
    constantOffset: preset.constantOffset,
    typeOffset: preset.typeOffset,
    variableOffset: preset.variableOffset,
    operatorOffset: preset.operatorOffset,
    builtinOffset: preset.builtinOffset,
    parameterOffset: preset.parameterOffset,
    propertyOffset: preset.propertyOffset,
    namespaceOffset: preset.namespaceOffset,
    macroOffset: preset.macroOffset,
    tagOffset: preset.tagOffset,
    punctuationOffset: preset.punctuationOffset,
    headingOffset: preset.headingOffset,
  }
}
