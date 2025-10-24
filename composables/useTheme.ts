import chroma from 'chroma-js'
import { useUrlSearchParams } from '@vueuse/core'

interface ThemeState {
  baseHue: number
  hueOffset: number
  saturation: number
  contrast: number
  monochromeMode: boolean
  boldKeywords: boolean
  italicComments: boolean
  mode: 'dark' | 'light'
}

const defaultState: ThemeState = {
  baseHue: 0,
  hueOffset: 7,
  saturation: 85,
  contrast: 50,
  monochromeMode: false,
  boldKeywords: false,
  italicComments: true,
  mode: 'dark' as 'dark' | 'light',
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
    boldKeywords: params.b === '1' || defaultState.boldKeywords,
    italicComments: params.i !== '0',
    mode: (params.mode as 'dark' | 'light') || defaultState.mode,
  }))

  // Watch state and sync to URL
  if (import.meta.client) {
    watch(state, (newState) => {
      params.h = String(newState.baseHue)
      params.o = String(newState.hueOffset)
      params.s = String(newState.saturation)
      params.c = String(newState.contrast)
      params.m = newState.monochromeMode ? '1' : '0'
      params.b = newState.boldKeywords ? '1' : '0'
      params.i = newState.italicComments ? '1' : '0'
      params.mode = newState.mode
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
    const fg = state.value.monochromeMode
      ? chroma.hsl(
          state.value.baseHue,
          sat * 0.8, // Slightly desaturate for readability
          isDark ? 0.75 + (contrastFactor * 0.20) : 0.30 - (contrastFactor * 0.10)
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

    return {
      bg,
      fg,
      base: colorAt(0, 50, 45),
      error: colorAt(state.value.hueOffset, 55, 40),
      warning: colorAt(-state.value.hueOffset, 55, 40),
      hint: colorAt(0, 70, 55),
      comment: chroma.hsl(0, 0, isDark ? 0.45 : 0.55).hex(),
      keyword: colorAt(state.value.hueOffset * 1.5, 60, 38),
      string: colorAt(-state.value.hueOffset * 1.5, 60, 42),
      number: colorAt(state.value.hueOffset * 2, 65, 45),
      function: colorAt(-state.value.hueOffset * 2, 55, 40),
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
