import chroma from 'chroma-js'
import { useUrlSearchParams } from '@vueuse/core'

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
  palette: Record<number, string>
}

// Theme options interface - font styles and other configurable settings
export interface ThemeOptions {
  boldKeywords: boolean
  italicComments: boolean
  boldFunctions: boolean
  italicStrings: boolean
  underlineErrors: boolean
}

interface ThemeState {
  baseHue: number
  hueOffset: number
  saturation: number
  contrast: number
  monochromeMode: boolean
  monochromeIntensity: number
  monochromeLightness: number
  bgLightness: number  // 0-100, 50 = auto
  fgLightness: number  // 0-100, 50 = auto
  boldKeywords: boolean
  italicComments: boolean
  boldFunctions: boolean
  italicStrings: boolean
  underlineErrors: boolean
  mode: 'dark' | 'light'
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
}

const defaultState: ThemeState = {
  baseHue: 309,
  hueOffset: 1,
  saturation: 100,
  contrast: 86,
  monochromeMode: true,
  monochromeIntensity: 100,
  monochromeLightness: 0,
  bgLightness: 50,  // 50 = auto-calculated
  fgLightness: 50,  // 50 = auto-calculated
  boldKeywords: false,
  italicComments: true,
  boldFunctions: false,
  italicStrings: true,
  underlineErrors: true,
  mode: 'dark' as 'dark' | 'light',
  // Default offsets - now additive to global (0 = use pure multiplier)
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
  // Default lightness values (50 = use auto-calculated)
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
  // Default linked state (all linked by default)
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
  // Default multipliers
  errorMultiplier: 1,
  warningMultiplier: -1,
  keywordMultiplier: 1.5,
  stringMultiplier: -1.5,
  numberMultiplier: 2,
  functionMultiplier: -2,
  constantMultiplier: 3,
  typeMultiplier: 2.5,
  variableMultiplier: -2.5,
  operatorMultiplier: 0.5,
}

export const useTheme = () => {
  // Sync with URL params
  const params = useUrlSearchParams('history')

  // Initialize state from URL or defaults
  const state = useState<ThemeState>('theme', () => ({
    baseHue: Number(params.h) || defaultState.baseHue,
    hueOffset: Number(params.o) || defaultState.hueOffset,
    saturation: Number(params.s) || defaultState.saturation,
    contrast: Number(params.c) || defaultState.contrast,
    monochromeMode: params.m === '1' || defaultState.monochromeMode,
    monochromeIntensity: Number(params.mi) || defaultState.monochromeIntensity,
    monochromeLightness: Number(params.ml) || defaultState.monochromeLightness,
    boldKeywords: params.b === '1' || defaultState.boldKeywords,
    italicComments: params.i !== '0',
    boldFunctions: params.bf === '1' || defaultState.boldFunctions,
    italicStrings: params.is === '1' || defaultState.italicStrings,
    underlineErrors: params.ue !== '0',
    mode: (params.mode as 'dark' | 'light') || defaultState.mode,
    errorOffset: Number(params.eo) || defaultState.errorOffset,
    warningOffset: Number(params.wo) || defaultState.warningOffset,
    keywordOffset: Number(params.ko) || defaultState.keywordOffset,
    stringOffset: Number(params.so) || defaultState.stringOffset,
    numberOffset: Number(params.no) || defaultState.numberOffset,
    functionOffset: Number(params.fo) || defaultState.functionOffset,
    errorLightness: Number(params.el) || defaultState.errorLightness,
    warningLightness: Number(params.wl) || defaultState.warningLightness,
    keywordLightness: Number(params.kl) || defaultState.keywordLightness,
    stringLightness: Number(params.sl) || defaultState.stringLightness,
    numberLightness: Number(params.nl) || defaultState.numberLightness,
    functionLightness: Number(params.fl) || defaultState.functionLightness,
    constantOffset: Number(params.co) || defaultState.constantOffset,
    typeOffset: Number(params.to) || defaultState.typeOffset,
    variableOffset: Number(params.vo) || defaultState.variableOffset,
    operatorOffset: Number(params.oo) || defaultState.operatorOffset,
    constantLightness: Number(params.cl) || defaultState.constantLightness,
    typeLightness: Number(params.tl) || defaultState.typeLightness,
    variableLightness: Number(params.vl) || defaultState.variableLightness,
    operatorLightness: Number(params.ol) || defaultState.operatorLightness,
    errorLinked: params.elink !== '0',
    warningLinked: params.wlink !== '0',
    keywordLinked: params.klink !== '0',
    stringLinked: params.slink !== '0',
    numberLinked: params.nlink !== '0',
    functionLinked: params.flink !== '0',
    constantLinked: params.clink !== '0',
    typeLinked: params.tlink !== '0',
    variableLinked: params.vlink !== '0',
    operatorLinked: params.olink !== '0',
    errorMultiplier: Number(params.em) || defaultState.errorMultiplier,
    warningMultiplier: Number(params.wm) || defaultState.warningMultiplier,
    keywordMultiplier: Number(params.km) || defaultState.keywordMultiplier,
    stringMultiplier: Number(params.sm) || defaultState.stringMultiplier,
    numberMultiplier: Number(params.nm) || defaultState.numberMultiplier,
    functionMultiplier: Number(params.fm) || defaultState.functionMultiplier,
    constantMultiplier: Number(params.cm) || defaultState.constantMultiplier,
    typeMultiplier: Number(params.tm) || defaultState.typeMultiplier,
    variableMultiplier: Number(params.vm) || defaultState.variableMultiplier,
    operatorMultiplier: Number(params.om) || defaultState.operatorMultiplier,
  }))

  // Watch state and sync to URL
  if (import.meta.client) {
    watch(state, (newState) => {
      params.h = String(newState.baseHue)
      params.o = String(newState.hueOffset)
      params.s = String(newState.saturation)
      params.c = String(newState.contrast)
      params.m = newState.monochromeMode ? '1' : '0'
      params.mi = String(newState.monochromeIntensity)
      params.ml = String(newState.monochromeLightness)
      params.b = newState.boldKeywords ? '1' : '0'
      params.i = newState.italicComments ? '1' : '0'
      params.bf = newState.boldFunctions ? '1' : '0'
      params.is = newState.italicStrings ? '1' : '0'
      params.ue = newState.underlineErrors ? '1' : '0'
      params.mode = newState.mode
      params.eo = String(newState.errorOffset)
      params.wo = String(newState.warningOffset)
      params.ko = String(newState.keywordOffset)
      params.so = String(newState.stringOffset)
      params.no = String(newState.numberOffset)
      params.fo = String(newState.functionOffset)
      params.el = String(newState.errorLightness)
      params.wl = String(newState.warningLightness)
      params.kl = String(newState.keywordLightness)
      params.sl = String(newState.stringLightness)
      params.nl = String(newState.numberLightness)
      params.fl = String(newState.functionLightness)
      params.co = String(newState.constantOffset)
      params.to = String(newState.typeOffset)
      params.vo = String(newState.variableOffset)
      params.oo = String(newState.operatorOffset)
      params.cl = String(newState.constantLightness)
      params.tl = String(newState.typeLightness)
      params.vl = String(newState.variableLightness)
      params.ol = String(newState.operatorLightness)
      params.elink = newState.errorLinked ? '1' : '0'
      params.wlink = newState.warningLinked ? '1' : '0'
      params.klink = newState.keywordLinked ? '1' : '0'
      params.slink = newState.stringLinked ? '1' : '0'
      params.nlink = newState.numberLinked ? '1' : '0'
      params.flink = newState.functionLinked ? '1' : '0'
      params.clink = newState.constantLinked ? '1' : '0'
      params.tlink = newState.typeLinked ? '1' : '0'
      params.vlink = newState.variableLinked ? '1' : '0'
      params.olink = newState.operatorLinked ? '1' : '0'
      params.em = String(newState.errorMultiplier)
      params.wm = String(newState.warningMultiplier)
      params.km = String(newState.keywordMultiplier)
      params.sm = String(newState.stringMultiplier)
      params.nm = String(newState.numberMultiplier)
      params.fm = String(newState.functionMultiplier)
      params.cm = String(newState.constantMultiplier)
      params.tm = String(newState.typeMultiplier)
      params.vm = String(newState.variableMultiplier)
      params.om = String(newState.operatorMultiplier)
    }, { deep: true })
  }

  // Generate colors for a specific mode with auto-contrast
  const generateThemeVariant = (mode: 'dark' | 'light') => {
    const isDark = mode === 'dark'
    const contrastFactor = state.value.contrast / 100
    const sat = state.value.saturation / 100

    // Background is always grayscale - use contrast to adjust
    const bgLightness = isDark ? 0.05 + (contrastFactor * 0.02) : 0.97 - (contrastFactor * 0.05)
    const bg = chroma.hsl(0, 0, bgLightness).hex()

    // Foreground with better contrast math
    // Dark mode: light text (70-95% lightness range)
    // Light mode: dark text (20-45% lightness range)
    const monoIntensity = state.value.monochromeIntensity / 100
    const monoLightness = state.value.monochromeLightness / 100

    const fg = state.value.monochromeMode
      ? chroma.hsl(
          state.value.baseHue,
          sat * monoIntensity, // Use intensity control
          isDark
            ? 0.65 + (monoLightness * 0.30) + (contrastFactor * 0.08)
            : 0.20 + (monoLightness * 0.25)
        ).hex()
      : chroma.hsl(
          0,
          0,
          isDark ? 0.88 + (contrastFactor * 0.10) : 0.20 - (contrastFactor * 0.08)
        ).hex()

    // Helper to generate color at hue offset with mode-appropriate lightness
    // Uses perceptual lightness adjustments for better consistency
    const colorAt = (hueOffset: number, darkBase: number, lightBase: number) => {
      const hue = (state.value.baseHue + hueOffset + 360) % 360

      // Adjust lightness based on contrast setting
      // Dark mode: 50-75% range (visible but not too bright)
      // Light mode: 30-50% range (visible but not too dark)
      const darkL = darkBase + (contrastFactor - 0.5) * 15
      const lightL = lightBase - (contrastFactor - 0.5) * 12

      const l = isDark ? darkL : lightL
      return chroma.hsl(hue, sat, l / 100).hex()
    }

    // Helper to map lightness slider (0-100) to actual lightness values
    // 50 = default (use calculated value), <50 = darker, >50 = lighter
    const applyLightnessAdjust = (baseDark: number, baseLight: number, adjust: number) => {
      const offset = (adjust - 50) * 0.3 // ±15 range from center
      return {
        dark: baseDark + offset,
        light: baseLight + offset
      }
    }

    const errorL = applyLightnessAdjust(55, 40, state.value.errorLightness)
    const warningL = applyLightnessAdjust(55, 40, state.value.warningLightness)
    const keywordL = applyLightnessAdjust(60, 38, state.value.keywordLightness)
    const stringL = applyLightnessAdjust(60, 42, state.value.stringLightness)
    const numberL = applyLightnessAdjust(65, 45, state.value.numberLightness)
    const functionL = applyLightnessAdjust(55, 40, state.value.functionLightness)
    const constantL = applyLightnessAdjust(58, 43, state.value.constantLightness)
    const typeL = applyLightnessAdjust(62, 41, state.value.typeLightness)
    const variableL = applyLightnessAdjust(57, 44, state.value.variableLightness)
    const operatorL = applyLightnessAdjust(60, 40, state.value.operatorLightness)

    // Helper to get actual offset (linked = hueOffset * multiplier + individual offset, unlinked = fixed offset)
    const getOffset = (colorName: string): number => {
      const linked = state.value[`${colorName}Linked` as keyof ThemeState] as boolean
      const individualOffset = state.value[`${colorName}Offset` as keyof ThemeState] as number
      if (linked) {
        const multiplier = state.value[`${colorName}Multiplier` as keyof ThemeState] as number
        return (state.value.hueOffset * multiplier) + individualOffset
      }
      return individualOffset
    }

    return {
      bg,
      fg,
      base: colorAt(0, 50, 45),
      error: colorAt(getOffset('error'), errorL.dark, errorL.light),
      warning: colorAt(getOffset('warning'), warningL.dark, warningL.light),
      hint: colorAt(0, 70, 55),
      comment: state.value.monochromeMode
        ? chroma.hsl(state.value.baseHue, sat * monoIntensity * 0.5, isDark ? 0.45 : 0.55).hex()
        : chroma.hsl(0, 0, isDark ? 0.45 : 0.55).hex(),
      keyword: colorAt(getOffset('keyword'), keywordL.dark, keywordL.light),
      string: colorAt(getOffset('string'), stringL.dark, stringL.light),
      number: colorAt(getOffset('number'), numberL.dark, numberL.light),
      function: colorAt(getOffset('function'), functionL.dark, functionL.light),
      constant: colorAt(getOffset('constant'), constantL.dark, constantL.light),
      type: colorAt(getOffset('type'), typeL.dark, typeL.light),
      variable: colorAt(getOffset('variable'), variableL.dark, variableL.light),
      operator: colorAt(getOffset('operator'), operatorL.dark, operatorL.light),
      palette: {
        0: chroma.hsl(0, 0, isDark ? 0.10 : 0.90).hex(),
        1: colorAt(state.value.hueOffset, 50, 35),
        2: colorAt(state.value.hueOffset * 2, 50, 38),
        3: colorAt(-state.value.hueOffset, 60, 45),
        4: colorAt(-state.value.hueOffset * 2, 55, 40),
        5: colorAt(-state.value.hueOffset * 3, 58, 42),
        6: colorAt(state.value.hueOffset * 3, 55, 40),
        7: chroma.hsl(0, 0, isDark ? 0.70 : 0.30).hex(),
        8: chroma.hsl(0, 0, isDark ? 0.35 : 0.65).hex(),
        9: colorAt(state.value.hueOffset, 65, 42),
        10: colorAt(state.value.hueOffset * 2, 65, 45),
        11: colorAt(-state.value.hueOffset, 75, 50),
        12: colorAt(-state.value.hueOffset * 2, 70, 48),
        13: colorAt(-state.value.hueOffset * 3, 72, 48),
        14: colorAt(state.value.hueOffset * 3, 70, 45),
        15: chroma.hsl(0, 0, isDark ? 0.95 : 0.10).hex(),
      }
    }
  }

  // Current mode colors
  const colors = computed(() => generateThemeVariant(state.value.mode))

  // Both variants
  const darkColors = computed(() => generateThemeVariant('dark'))
  const lightColors = computed(() => generateThemeVariant('light'))

  const ghosttyTheme = computed(() => ({
    background: colors.value.bg,
    foreground: colors.value.fg,
    'cursor-color': colors.value.base,
    'selection-background': colors.value.warning,
    'selection-foreground': colors.value.bg,
    palette: colors.value.palette,
  }))

  const ghosttyThemeDark = computed(() => ({
    background: darkColors.value.bg,
    foreground: darkColors.value.fg,
    'cursor-color': darkColors.value.base,
    'selection-background': darkColors.value.warning,
    'selection-foreground': darkColors.value.bg,
    palette: darkColors.value.palette,
  }))

  const ghosttyThemeLight = computed(() => ({
    background: lightColors.value.bg,
    foreground: lightColors.value.fg,
    'cursor-color': lightColors.value.base,
    'selection-background': lightColors.value.warning,
    'selection-foreground': lightColors.value.bg,
    palette: lightColors.value.palette,
  }))

  // Theme options (font styles, etc)
  const options = computed((): ThemeOptions => ({
    boldKeywords: state.value.boldKeywords,
    italicComments: state.value.italicComments,
    boldFunctions: state.value.boldFunctions,
    italicStrings: state.value.italicStrings,
    underlineErrors: state.value.underlineErrors,
  }))

  return {
    state,
    colors,
    darkColors,
    lightColors,
    ghosttyTheme,
    ghosttyThemeDark,
    ghosttyThemeLight,
    options,
  }
}
