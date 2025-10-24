import chroma from 'chroma-js'
import { useUrlSearchParams } from '@vueuse/core'

interface ThemeState {
  baseHue: number
  hueOffset: number
  saturation: number
  contrast: number
  monochromeMode: boolean
  monochromeIntensity: number
  monochromeLightness: number
  boldKeywords: boolean
  italicComments: boolean
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
}

const defaultState: ThemeState = {
  baseHue: 0,
  hueOffset: 7,
  saturation: 85,
  contrast: 50,
  monochromeMode: false,
  monochromeIntensity: 80,
  monochromeLightness: 50,
  boldKeywords: false,
  italicComments: true,
  mode: 'dark' as 'dark' | 'light',
  // Default offsets based on original multipliers
  errorOffset: 7,    // was hueOffset * 1
  warningOffset: -7, // was -hueOffset * 1
  keywordOffset: 10, // was hueOffset * 1.5
  stringOffset: -10, // was -hueOffset * 1.5
  numberOffset: 14,  // was hueOffset * 2
  functionOffset: -14, // was -hueOffset * 2
  constantOffset: 21, // hueOffset * 3
  typeOffset: 17,     // hueOffset * 2.5
  variableOffset: -17, // -hueOffset * 2.5
  operatorOffset: 3,   // hueOffset * 0.5
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

    return {
      bg,
      fg,
      base: colorAt(0, 50, 45),
      error: colorAt(state.value.errorOffset, errorL.dark, errorL.light),
      warning: colorAt(state.value.warningOffset, warningL.dark, warningL.light),
      hint: colorAt(0, 70, 55),
      comment: state.value.monochromeMode
        ? chroma.hsl(state.value.baseHue, sat * monoIntensity * 0.5, isDark ? 0.45 : 0.55).hex()
        : chroma.hsl(0, 0, isDark ? 0.45 : 0.55).hex(),
      keyword: colorAt(state.value.keywordOffset, keywordL.dark, keywordL.light),
      string: colorAt(state.value.stringOffset, stringL.dark, stringL.light),
      number: colorAt(state.value.numberOffset, numberL.dark, numberL.light),
      function: colorAt(state.value.functionOffset, functionL.dark, functionL.light),
      constant: colorAt(state.value.constantOffset, constantL.dark, constantL.light),
      type: colorAt(state.value.typeOffset, typeL.dark, typeL.light),
      variable: colorAt(state.value.variableOffset, variableL.dark, variableL.light),
      operator: colorAt(state.value.operatorOffset, operatorL.dark, operatorL.light),
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

  return {
    state,
    colors,
    darkColors,
    lightColors,
    ghosttyTheme,
    ghosttyThemeDark,
    ghosttyThemeLight,
  }
}
