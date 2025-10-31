<script setup lang="ts">
import { serializeGhosttyTheme } from '~/utils/ghostty'
import { serializeItermTheme } from '~/utils/iterm'
import { serializeTmuxTheme } from '~/utils/tmux'
import { serializeNeovimTheme } from '~/utils/neovim'
import { serializeLazygitTheme } from '~/utils/lazygit'
import chroma from 'chroma-js'

const { state, colors, darkColors, lightColors, ghosttyThemeDark, ghosttyThemeLight, options } = useTheme()

// Export format selection - multi-select
const exportFormats = ref<string[]>(['ghostty'])

// Helper to generate config for a single format
const generateConfig = (format: string, isDark: boolean) => {
  const themeColors = isDark ? darkColors.value : lightColors.value
  const themeName = isDark ? 'theme-lab-dark' : 'theme-lab-light'
  const themeNameUnderscore = isDark ? 'theme_lab_dark' : 'theme_lab_light'

  switch (format) {
    case 'ghostty':
      return serializeGhosttyTheme(isDark ? ghosttyThemeDark.value : ghosttyThemeLight.value, themeName)
    case 'iterm':
      return serializeItermTheme(themeColors, themeName)
    case 'tmux':
      return serializeTmuxTheme(themeColors, themeName)
    case 'neovim':
      return serializeNeovimTheme(themeColors, themeNameUnderscore, isDark, options.value)
    case 'lazygit':
      return serializeLazygitTheme(themeColors, !isDark)
    default:
      return serializeGhosttyTheme(isDark ? ghosttyThemeDark.value : ghosttyThemeLight.value, themeName)
  }
}

// Generate preview config for first selected format
const darkConfig = computed(() => {
  const format = exportFormats.value[0] || 'ghostty'
  return generateConfig(format, true)
})

const lightConfig = computed(() => {
  const format = exportFormats.value[0] || 'ghostty'
  return generateConfig(format, false)
})

// Get file extension based on format
const getFileExtension = (format: string): string => {
  switch (format) {
    case 'ghostty': return '.conf'
    case 'iterm': return '.itermcolors'
    case 'tmux': return '.tmux.conf'
    case 'neovim': return '.lua'
    case 'lazygit': return '.yml'
    default: return '.txt'
  }
}

// Select all formats helper
const selectAllFormats = () => {
  exportFormats.value = ['ghostty', 'iterm', 'tmux', 'neovim', 'lazygit']
}

// Reset functions for each color - resets to 0 offset, 50 lightness, linked=true
const resetColor = (colorName: string) => {
  // All colors reset to: offset=0, lightness=50, linked=true
  // Multipliers come from defaultState in useTheme
  const defaults: Record<string, { multiplier: number, offset: number, lightness: number, linked: boolean }> = {
    error: { multiplier: 5, offset: 0, lightness: 50, linked: true },
    warning: { multiplier: -5, offset: 0, lightness: 50, linked: true },
    keyword: { multiplier: 3, offset: 0, lightness: 50, linked: true },
    string: { multiplier: 4, offset: 0, lightness: 50, linked: true },
    number: { multiplier: -4, offset: 0, lightness: 50, linked: true },
    function: { multiplier: -3, offset: 0, lightness: 50, linked: true },
    constant: { multiplier: 3.5, offset: 0, lightness: 50, linked: true },
    type: { multiplier: -2.5, offset: 0, lightness: 50, linked: true },
    variable: { multiplier: -1, offset: 0, lightness: 50, linked: true },
    operator: { multiplier: 0.5, offset: 0, lightness: 50, linked: true },
    builtin: { multiplier: 2.5, offset: 0, lightness: 50, linked: true },
    parameter: { multiplier: -0.5, offset: 0, lightness: 50, linked: true },
    property: { multiplier: -1.5, offset: 0, lightness: 50, linked: true },
    namespace: { multiplier: 1.5, offset: 0, lightness: 50, linked: true },
    macro: { multiplier: -2, offset: 0, lightness: 50, linked: true },
    tag: { multiplier: 2, offset: 0, lightness: 50, linked: true },
    punctuation: { multiplier: 0.25, offset: 0, lightness: 50, linked: true },
    heading: { multiplier: 3.5, offset: 0, lightness: 50, linked: true },
  }

  const d = defaults[colorName]
  if (!d) return

  // Direct property assignment for each color type
  switch (colorName) {
    case 'error':
      state.value.errorOffset = d.offset
      state.value.errorLightness = d.lightness
      state.value.errorLinked = d.linked
      state.value.errorMultiplier = d.multiplier
      break
    case 'warning':
      state.value.warningOffset = d.offset
      state.value.warningLightness = d.lightness
      state.value.warningLinked = d.linked
      state.value.warningMultiplier = d.multiplier
      break
    case 'keyword':
      state.value.keywordOffset = d.offset
      state.value.keywordLightness = d.lightness
      state.value.keywordLinked = d.linked
      state.value.keywordMultiplier = d.multiplier
      break
    case 'string':
      state.value.stringOffset = d.offset
      state.value.stringLightness = d.lightness
      state.value.stringLinked = d.linked
      state.value.stringMultiplier = d.multiplier
      break
    case 'number':
      state.value.numberOffset = d.offset
      state.value.numberLightness = d.lightness
      state.value.numberLinked = d.linked
      state.value.numberMultiplier = d.multiplier
      break
    case 'function':
      state.value.functionOffset = d.offset
      state.value.functionLightness = d.lightness
      state.value.functionLinked = d.linked
      state.value.functionMultiplier = d.multiplier
      break
    case 'constant':
      state.value.constantOffset = d.offset
      state.value.constantLightness = d.lightness
      state.value.constantLinked = d.linked
      state.value.constantMultiplier = d.multiplier
      break
    case 'type':
      state.value.typeOffset = d.offset
      state.value.typeLightness = d.lightness
      state.value.typeLinked = d.linked
      state.value.typeMultiplier = d.multiplier
      break
    case 'variable':
      state.value.variableOffset = d.offset
      state.value.variableLightness = d.lightness
      state.value.variableLinked = d.linked
      state.value.variableMultiplier = d.multiplier
      break
    case 'operator':
      state.value.operatorOffset = d.offset
      state.value.operatorLightness = d.lightness
      state.value.operatorLinked = d.linked
      state.value.operatorMultiplier = d.multiplier
      break
    case 'builtin':
      state.value.builtinOffset = d.offset
      state.value.builtinLightness = d.lightness
      state.value.builtinLinked = d.linked
      state.value.builtinMultiplier = d.multiplier
      break
    case 'parameter':
      state.value.parameterOffset = d.offset
      state.value.parameterLightness = d.lightness
      state.value.parameterLinked = d.linked
      state.value.parameterMultiplier = d.multiplier
      break
    case 'property':
      state.value.propertyOffset = d.offset
      state.value.propertyLightness = d.lightness
      state.value.propertyLinked = d.linked
      state.value.propertyMultiplier = d.multiplier
      break
    case 'namespace':
      state.value.namespaceOffset = d.offset
      state.value.namespaceLightness = d.lightness
      state.value.namespaceLinked = d.linked
      state.value.namespaceMultiplier = d.multiplier
      break
    case 'macro':
      state.value.macroOffset = d.offset
      state.value.macroLightness = d.lightness
      state.value.macroLinked = d.linked
      state.value.macroMultiplier = d.multiplier
      break
    case 'tag':
      state.value.tagOffset = d.offset
      state.value.tagLightness = d.lightness
      state.value.tagLinked = d.linked
      state.value.tagMultiplier = d.multiplier
      break
    case 'punctuation':
      state.value.punctuationOffset = d.offset
      state.value.punctuationLightness = d.lightness
      state.value.punctuationLinked = d.linked
      state.value.punctuationMultiplier = d.multiplier
      break
    case 'heading':
      state.value.headingOffset = d.offset
      state.value.headingLightness = d.lightness
      state.value.headingLinked = d.linked
      state.value.headingMultiplier = d.multiplier
      break
  }
}

// Download file helper
const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Export both dark and light for all selected formats
const exportBoth = () => {
  if (exportFormats.value.length === 0) {
    alert('Please select at least one format to export')
    return
  }

  exportFormats.value.forEach((format, index) => {
    setTimeout(() => {
      const ext = getFileExtension(format)
      const darkContent = generateConfig(format, true)
      const lightContent = generateConfig(format, false)

      downloadFile(darkContent, `theme-lab-dark-${format}${ext}`)
      setTimeout(() => downloadFile(lightContent, `theme-lab-light-${format}${ext}`), 50)
    }, index * 150)
  })
}

// Export only dark for all selected formats
const exportDark = () => {
  if (exportFormats.value.length === 0) {
    alert('Please select at least one format to export')
    return
  }

  exportFormats.value.forEach((format, index) => {
    setTimeout(() => {
      const ext = getFileExtension(format)
      const darkContent = generateConfig(format, true)
      downloadFile(darkContent, `theme-lab-dark-${format}${ext}`)
    }, index * 100)
  })
}

// Export only light for all selected formats
const exportLight = () => {
  if (exportFormats.value.length === 0) {
    alert('Please select at least one format to export')
    return
  }

  exportFormats.value.forEach((format, index) => {
    setTimeout(() => {
      const ext = getFileExtension(format)
      const lightContent = generateConfig(format, false)
      downloadFile(lightContent, `theme-lab-light-${format}${ext}`)
    }, index * 100)
  })
}

// Copy configs to clipboard (first selected format only)
const copyDark = async () => {
  const format = exportFormats.value[0] || 'ghostty'
  const content = generateConfig(format, true)
  await navigator.clipboard.writeText(content)
}

const copyLight = async () => {
  const format = exportFormats.value[0] || 'ghostty'
  const content = generateConfig(format, false)
  await navigator.clipboard.writeText(content)
}

// Theme presets - based on real theme color analysis
interface ThemePreset {
  baseHue: number
  hueOffset: number
  saturation: number
  contrast: number
  mode: 'dark' | 'light'
  monochromeMode?: boolean
  monochromeIntensity?: number
  monochromeLightness?: number
  // Color-specific overrides
  colors?: {
    [key: string]: { offset?: number, lightness?: number, linked?: boolean, multiplier?: number }
  }
}

const presets: Record<string, ThemePreset> = {
  'catppuccin-mocha': {
    baseHue: 267,  // Mauve base (signature color)
    hueOffset: 0,
    saturation: 84,  // Match mauve saturation
    contrast: 42,
    mode: 'dark',
    monochromeMode: true,
    monochromeIntensity: 35,
    monochromeLightness: 60,
    colors: {
      error: { offset: 343, linked: false, lightness: 75 },      // Red #f38ba8
      warning: { offset: 23, linked: false, lightness: 75 },     // Peach #fab387
      keyword: { offset: 267, linked: false, lightness: 81 },    // Mauve #cba6f7
      string: { offset: 115, linked: false, lightness: 76 },     // Green #a6e3a1
      number: { offset: 23, linked: false, lightness: 75 },      // Peach #fab387
      function: { offset: 217, linked: false, lightness: 76 },   // Blue #89b4fa
      constant: { offset: 350, linked: false, lightness: 77 },   // Maroon #eba0ac
      type: { offset: 41, linked: false, lightness: 83 },        // Yellow #f9e2af
      variable: { offset: 170, linked: false, lightness: 73 },   // Teal #94e2d5
      operator: { offset: 189, linked: false, lightness: 73 },   // Sky #89dceb
    }
  },
  'catppuccin-latte': {
    baseHue: 266,  // Mauve base (signature color)
    hueOffset: 0,
    saturation: 85,  // Match mauve saturation
    contrast: 42,
    mode: 'light',
    monochromeMode: true,
    monochromeIntensity: 35,
    monochromeLightness: 40,
    colors: {
      error: { offset: 347, linked: false, lightness: 44 },      // Red #d20f39
      warning: { offset: 22, linked: false, lightness: 52 },     // Peach #fe640b
      keyword: { offset: 266, linked: false, lightness: 58 },    // Mauve #8839ef
      string: { offset: 109, linked: false, lightness: 40 },     // Green #40a02b
      number: { offset: 22, linked: false, lightness: 52 },      // Peach #fe640b
      function: { offset: 220, linked: false, lightness: 54 },   // Blue #1e66f5
      constant: { offset: 355, linked: false, lightness: 59 },   // Maroon #e64553
      type: { offset: 35, linked: false, lightness: 49 },        // Yellow #df8e1d
      variable: { offset: 183, linked: false, lightness: 35 },   // Teal #179299
      operator: { offset: 197, linked: false, lightness: 46 },   // Sky #04a5e5
    }
  },
  'ayu-dark': {
    baseHue: 40,  // Based on actual yellow/orange accent
    hueOffset: 0,
    saturation: 75,
    contrast: 52,
    mode: 'dark',
    monochromeMode: true,
    monochromeIntensity: 28,
    monochromeLightness: 55,
    colors: {
      error: { offset: 0, linked: false, lightness: 60 },       // #ff3333
      warning: { offset: 357, linked: false, lightness: 69 },   // #f07178
      keyword: { offset: 357, linked: false, lightness: 69 },   // #f07178
      string: { offset: 70, linked: false, lightness: 56 },     // #b8cc52
      number: { offset: 40, linked: false, lightness: 61 },     // #e6b450
      function: { offset: 200, linked: false, lightness: 53 },  // #36a3d9
      constant: { offset: 357, linked: false, lightness: 69 },  // #f07178
      type: { offset: 40, linked: false, lightness: 61 },       // #e6b450
      variable: { offset: 160, linked: false, lightness: 74 },  // #95e6cb
      operator: { offset: 40, linked: false, lightness: 61 },   // #e6b450
    }
  },
  'ayu-light': {
    baseHue: 36,  // Based on actual yellow/orange accent
    hueOffset: 0,
    saturation: 87,
    contrast: 52,
    mode: 'light',
    monochromeMode: true,
    monochromeIntensity: 28,
    monochromeLightness: 40,
    colors: {
      error: { offset: 357, linked: false, lightness: 69 },     // #f07178
      warning: { offset: 25, linked: false, lightness: 61 },    // #fa8d3e
      keyword: { offset: 25, linked: false, lightness: 61 },    // #fa8d3e
      string: { offset: 75, linked: false, lightness: 35 },     // #86b300
      number: { offset: 36, linked: false, lightness: 62 },     // #f2ae49
      function: { offset: 195, linked: false, lightness: 58 },  // #55b4d4
      constant: { offset: 25, linked: false, lightness: 61 },   // #fa8d3e
      type: { offset: 36, linked: false, lightness: 62 },       // #f2ae49
      variable: { offset: 184, linked: false, lightness: 43 },  // #3e999f
      operator: { offset: 36, linked: false, lightness: 62 },   // #f2ae49
    }
  },
}

const loadPreset = (presetName: keyof typeof presets) => {
  const preset = presets[presetName]

  // Apply base settings
  state.value.baseHue = preset.baseHue
  state.value.hueOffset = preset.hueOffset
  state.value.saturation = preset.saturation
  state.value.contrast = preset.contrast
  state.mode = preset.mode

  // Apply monochrome settings
  if (preset.monochromeMode !== undefined) state.value.monochromeMode = preset.monochromeMode
  if (preset.monochromeIntensity !== undefined) state.value.monochromeIntensity = preset.monochromeIntensity
  if (preset.monochromeLightness !== undefined) state.value.monochromeLightness = preset.monochromeLightness

  // Apply color-specific settings
  if (preset.colors) {
    Object.entries(preset.colors).forEach(([colorName, settings]) => {
      if (settings.offset !== undefined) {
        state.value[`${colorName}Offset` as keyof typeof state.value] = settings.offset as any
      }
      if (settings.lightness !== undefined) {
        state.value[`${colorName}Lightness` as keyof typeof state.value] = settings.lightness as any
      }
      if (settings.linked !== undefined) {
        state.value[`${colorName}Linked` as keyof typeof state.value] = settings.linked as any
      }
      if (settings.multiplier !== undefined) {
        state.value[`${colorName}Multiplier` as keyof typeof state.value] = settings.multiplier as any
      }
    })
  } else {
    // If no color overrides, reset to defaults
    const colors = ['error', 'warning', 'keyword', 'string', 'number', 'function', 'constant', 'type', 'variable', 'operator']
    colors.forEach(colorName => resetColor(colorName))
  }
}

// Color math presets - apply color theory to multipliers
const colorMathPresets = {
  'complementary': {
    // Complementary: 180° apart for maximum contrast
    error: { multiplier: 0, offset: 0 },
    warning: { multiplier: 180 / 7, offset: 0 },  // ~25.7x for 180°
    keyword: { multiplier: 0, offset: 0 },
    string: { multiplier: 180 / 7, offset: 0 },
    number: { multiplier: 0, offset: 0 },
    function: { multiplier: 180 / 7, offset: 0 },
    constant: { multiplier: 0, offset: 0 },
    type: { multiplier: 90 / 7, offset: 0 },  // quarter turn
    variable: { multiplier: -90 / 7, offset: 0 },
    operator: { multiplier: 0, offset: 0 },
  },
  'triadic': {
    // Triadic: 120° apart for balanced harmony
    error: { multiplier: 0, offset: 0 },
    warning: { multiplier: 120 / 7, offset: 0 },  // ~17.1x
    keyword: { multiplier: -120 / 7, offset: 0 },
    string: { multiplier: 0, offset: 0 },
    number: { multiplier: 120 / 7, offset: 0 },
    function: { multiplier: -120 / 7, offset: 0 },
    constant: { multiplier: 0, offset: 0 },
    type: { multiplier: 120 / 7, offset: 0 },
    variable: { multiplier: -120 / 7, offset: 0 },
    operator: { multiplier: 0, offset: 0 },
  },
  'split-complementary': {
    // Split complementary: base + 150° and 210° (flanking complement)
    error: { multiplier: 0, offset: 0 },
    warning: { multiplier: 150 / 7, offset: 0 },  // ~21.4x
    keyword: { multiplier: -150 / 7, offset: 0 },
    string: { multiplier: 0, offset: 0 },
    number: { multiplier: 150 / 7, offset: 0 },
    function: { multiplier: -150 / 7, offset: 0 },
    constant: { multiplier: 0, offset: 0 },
    type: { multiplier: 150 / 7, offset: 0 },
    variable: { multiplier: -150 / 7, offset: 0 },
    operator: { multiplier: 0, offset: 0 },
  },
  'tetradic': {
    // Tetradic/Square: 90° apart for rich palette
    error: { multiplier: 0, offset: 0 },
    warning: { multiplier: 90 / 7, offset: 0 },  // ~12.9x
    keyword: { multiplier: 180 / 7, offset: 0 },
    string: { multiplier: -90 / 7, offset: 0 },
    number: { multiplier: 0, offset: 0 },
    function: { multiplier: 90 / 7, offset: 0 },
    constant: { multiplier: 180 / 7, offset: 0 },
    type: { multiplier: -90 / 7, offset: 0 },
    variable: { multiplier: 0, offset: 0 },
    operator: { multiplier: 45 / 7, offset: 0 },  // half-step
  },
  'analogous': {
    // Analogous: close together (30° spacing) for harmony
    error: { multiplier: 0, offset: 0 },
    warning: { multiplier: -30 / 7, offset: 0 },  // ~4.3x
    keyword: { multiplier: 30 / 7, offset: 0 },
    string: { multiplier: -30 / 7, offset: 0 },
    number: { multiplier: 60 / 7, offset: 0 },
    function: { multiplier: -60 / 7, offset: 0 },
    constant: { multiplier: 30 / 7, offset: 0 },
    type: { multiplier: -30 / 7, offset: 0 },
    variable: { multiplier: 60 / 7, offset: 0 },
    operator: { multiplier: 15 / 7, offset: 0 },
  },
  'monochromatic': {
    // Monochromatic: same hue, vary only lightness
    error: { multiplier: 0, offset: 0 },
    warning: { multiplier: 0, offset: 0 },
    keyword: { multiplier: 0, offset: 0 },
    string: { multiplier: 0, offset: 0 },
    number: { multiplier: 0, offset: 0 },
    function: { multiplier: 0, offset: 0 },
    constant: { multiplier: 0, offset: 0 },
    type: { multiplier: 0, offset: 0 },
    variable: { multiplier: 0, offset: 0 },
    operator: { multiplier: 0, offset: 0 },
  },
}

const applyColorMath = (colorName: string, mathType: keyof typeof colorMathPresets) => {
  const color = colorName as 'error' | 'warning' | 'keyword' | 'string' | 'number' | 'function' | 'constant' | 'type' | 'variable' | 'operator'
  const preset = colorMathPresets[mathType]
  const values = preset[color]

  state.value[`${color}Multiplier` as keyof typeof state.value] = values.multiplier as any
  state.value[`${color}Offset` as keyof typeof state.value] = values.offset as any
  state.value[`${color}Linked` as keyof typeof state.value] = true as any
}

const shuffleColor = (colorName: string) => {
  const color = colorName as 'error' | 'warning' | 'keyword' | 'string' | 'number' | 'function' | 'constant' | 'type' | 'variable' | 'operator'

  // Random multiplier between -5 and 5
  const randomMultiplier = (Math.random() * 10 - 5)
  // Random offset between -180 and 180
  const randomOffset = Math.floor(Math.random() * 360 - 180)
  // Random lightness between 30 and 70 (avoiding extremes)
  const randomLightness = Math.floor(Math.random() * 40 + 30)

  state.value[`${color}Multiplier` as keyof typeof state.value] = randomMultiplier as any
  state.value[`${color}Offset` as keyof typeof state.value] = randomOffset as any
  state.value[`${color}Lightness` as keyof typeof state.value] = randomLightness as any
  state.value[`${color}Linked` as keyof typeof state.value] = Math.random() > 0.5 as any
}

const resetAll = () => {
  // Reset ALL core settings - ensures complete reset
  state.value.baseHue = 309
  state.value.hueOffset = 1
  state.value.saturation = 100
  state.value.contrast = 86
  state.value.monochromeMode = true
  state.value.monochromeIntensity = 100
  state.value.monochromeLightness = 0
  state.value.bgLightness = 50  // Reset background lightness
  state.value.fgLightness = 50  // Reset foreground lightness
  state.value.boldKeywords = false
  state.value.italicComments = true
  state.value.boldFunctions = false
  state.value.italicStrings = true
  state.value.underlineErrors = true
  state.mode = 'dark'

  // Reset ALL individual color settings (offset, lightness, linked, multiplier)
  const colors = ['error', 'warning', 'keyword', 'string', 'number', 'function', 'constant', 'type', 'variable', 'operator']
  colors.forEach(colorName => resetColor(colorName))
}

// Dynamic gradient helpers - generate data-driven gradients for each slider
const getMultiplierGradient = (colorName: string) => {
  // Show the color at different multiplier values from -5 to +5
  const sat = state.value.saturation / 100
  const isDark = state.mode === 'dark'
  const baseL = isDark ? 0.55 : 0.40

  // Generate 5 color stops showing the hue at different multiplier positions
  const stops = [-5, -2.5, 0, 2.5, 5].map(mult => {
    const offset = state.value.hueOffset * mult
    const hue = (state.value.baseHue + offset + 360) % 360
    return chroma.hsl(hue, sat, baseL).hex()
  })

  return `linear-gradient(to right, ${stops.join(', ')})`
}

const getOffsetGradient = (colorName: string) => {
  // Show a hue gradient from -60° to +60° around the current hue position
  const sat = state.value.saturation / 100
  const isDark = state.mode === 'dark'
  const baseL = isDark ? 0.55 : 0.40

  // Get the current hue for this color
  const multiplier = state.value[`${colorName}Multiplier` as keyof typeof state.value] as number || 0
  const individualOffset = state.value[`${colorName}Offset` as keyof typeof state.value] as number || 0
  const isLinked = state.value[`${colorName}Linked` as keyof typeof state.value] as boolean

  const currentOffset = isLinked ? (state.value.hueOffset * multiplier) + individualOffset : individualOffset
  const currentHue = (state.value.baseHue + currentOffset + 360) % 360

  // Generate gradient showing hue range
  const stops = [-60, -30, 0, 30, 60].map(offset => {
    const hue = (currentHue + offset + 360) % 360
    return chroma.hsl(hue, sat, baseL).hex()
  })

  return `linear-gradient(to right, ${stops.join(', ')})`
}

const getLightnessGradient = (colorName: string) => {
  // Show the color at different lightness values from dark to light
  const sat = state.value.saturation / 100
  const isDark = state.mode === 'dark'

  // Get the current hue for this color
  const multiplier = state.value[`${colorName}Multiplier` as keyof typeof state.value] as number || 0
  const individualOffset = state.value[`${colorName}Offset` as keyof typeof state.value] as number || 0
  const isLinked = state.value[`${colorName}Linked` as keyof typeof state.value] as boolean

  const currentOffset = isLinked ? (state.value.hueOffset * multiplier) + individualOffset : individualOffset
  const hue = (state.value.baseHue + currentOffset + 360) % 360

  // Generate gradient from dark to light at this hue
  const darkL = isDark ? 0.20 : 0.10
  const lightL = isDark ? 0.85 : 0.75

  const stops = [0, 0.25, 0.5, 0.75, 1].map(t => {
    const l = darkL + (lightL - darkL) * t
    return chroma.hsl(hue, sat, l).hex()
  })

  return `linear-gradient(to right, ${stops.join(', ')})`
}

// Helper to get contrasting text color for any background
const getTextColor = (bgColor: string) => {
  try {
    const luminance = chroma(bgColor).luminance()
    return luminance > 0.5 ? '#000' : '#fff'
  } catch {
    return '#000'
  }
}

// WCAG contrast ratio helpers
const getContrastRatio = (color1: string, color2: string): number => {
  try {
    return chroma.contrast(color1, color2)
  } catch {
    return 0
  }
}

const getContrastLevel = (ratio: number): 'AAA' | 'AA' | 'fail' => {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return 'fail'
}

const getContrastIcon = (ratio: number): string => {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return 'FAIL'
}

// Lock color to WCAG level by adjusting lightness
const lockToWCAG = (colorName: string, level: 'AA' | 'AAA') => {
  const targetRatio = level === 'AAA' ? 7 : 4.5
  const bgColor = colors.value.bg

  // Get current hue and saturation
  const multiplier = state.value[`${colorName}Multiplier` as keyof typeof state.value] as number || 0
  const individualOffset = state.value[`${colorName}Offset` as keyof typeof state.value] as number || 0
  const isLinked = state.value[`${colorName}Linked` as keyof typeof state.value] as boolean
  const sat = state.value.saturation / 100

  const currentOffset = isLinked ? (state.value.hueOffset * multiplier) + individualOffset : individualOffset
  const hue = (state.value.baseHue + currentOffset + 360) % 360

  // Binary search for the right lightness
  let low = 0
  let high = 100
  let bestLightness = 50

  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2
    const testColor = chroma.hsl(hue, sat, mid / 100).hex()
    const ratio = getContrastRatio(testColor, bgColor)

    if (ratio >= targetRatio) {
      bestLightness = mid
      // Try to get closer to target
      if (state.mode === 'dark') {
        low = mid
      } else {
        high = mid
      }
    } else {
      if (state.mode === 'dark') {
        high = mid
      } else {
        low = mid
      }
    }
  }

  state.value[`${colorName}Lightness` as keyof typeof state.value] = Math.round(bestLightness) as any
}
</script>

<template>
  <div class="lab" :style="{ background: colors.bg || '#000', color: colors.fg || '#fff' }">
    <!-- Left sidebar (30% width, full height) -->
    <aside class="sidebar-left" :style="{
      background: state.mode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
      boxShadow: state.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
      color: state.mode === 'dark' ? '#fff' : '#000'
    }">
      <div class="header" :style="{ borderBottomColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }">
        <h1>theme-lab</h1>
      </div>

      <!-- Presets dropdown -->
      <div class="preset-section" :style="{ borderBottomColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }">
        <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { loadPreset(el.value as any); el.value = ''; } }" class="preset-select" :style="{
          borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          color: state.mode === 'dark' ? '#fff' : '#000',
          background: 'transparent'
        }">
          <option value="">load preset...</option>
          <option value="catppuccin-mocha">catppuccin mocha (dark)</option>
          <option value="catppuccin-latte">catppuccin latte (light)</option>
          <option value="ayu-dark">ayu dark</option>
          <option value="ayu-light">ayu light</option>
        </select>
      </div>

      <ColorControls />

      <div class="actions" :style="{ borderTopColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }">
        <!-- Download section -->
        <div class="export-section" :style="{ borderBottomColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }">
          <div class="section-label" :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }">download files</div>
          <button @click="exportBoth" class="btn btn-primary" :style="{
            background: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            color: state.mode === 'dark' ? '#fff' : '#000'
          }" title="Download both dark and light theme files">
            BOTH THEMES
          </button>
          <div class="button-grid">
            <button @click="exportDark" class="btn btn-secondary" :style="{
              borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              color: state.mode === 'dark' ? '#fff' : '#000'
            }" title="Download dark theme file">
              DARK
            </button>
            <button @click="exportLight" class="btn btn-secondary" :style="{
              borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              color: state.mode === 'dark' ? '#fff' : '#000'
            }" title="Download light theme file">
              LIGHT
            </button>
          </div>
        </div>

        <!-- Copy section -->
        <div class="export-section" :style="{ borderBottomColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }">
          <div class="section-label" :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }">copy to clipboard</div>
          <div class="button-grid">
            <button @click="copyDark" class="btn btn-secondary" :style="{
              borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              color: state.mode === 'dark' ? '#fff' : '#000'
            }" title="Copy dark theme config to clipboard">
              COPY DARK
            </button>
            <button @click="copyLight" class="btn btn-secondary" :style="{
              borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              color: state.mode === 'dark' ? '#fff' : '#000'
            }" title="Copy light theme config to clipboard">
              COPY LIGHT
            </button>
          </div>
        </div>

        <!-- Reset -->
        <div class="export-section">
          <button @click="resetAll" class="btn btn-reset" title="Reset all values to defaults">
            RESET ALL
          </button>
        </div>
      </div>
    </aside>

    <!-- Right preview area (70% width) -->
    <main class="preview-right">
      <!-- Floating color swatches at top -->
      <div class="swatches-float">
      <!-- Color swatches -->
      <div class="swatches">
        <div class="swatch" :style="{ background: colors.base, color: getTextColor(colors.base) }">
          <span>base</span>
          <code>{{ colors.base }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.error, color: getTextColor(colors.error) }">
          <div class="swatch-header">
            <span class="color-name">error</span>
            <code class="color-hex">{{ colors.error }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.error, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.error, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.error, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.error, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.error, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('error', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('error', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.errorLinked = !state.errorLinked" class="tool-btn" :class="{ active: state.errorLinked }" :title="state.errorLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.errorLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('error')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('error')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('error', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.errorLinked ? ((state.hueOffset * state.errorMultiplier) + state.errorOffset).toFixed(0) : state.errorOffset }}° · L{{ state.errorLightness }}
          </div>
          <input
            v-if="state.errorLinked"
            type="range"
            v-model.number="state.errorMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('error') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.errorOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.errorLinked }"
            :style="{ background: getOffsetGradient('error') }"
            min="-180"
            max="180"
            step="1"
            :title="state.errorLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.errorLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('error') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.error }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.warning, color: getTextColor(colors.warning) }">
          <div class="swatch-header">
            <span class="color-name">warning</span>
            <code class="color-hex">{{ colors.warning }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.warning, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.warning, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.warning, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.warning, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.warning, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('warning', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('warning', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.warningLinked = !state.warningLinked" class="tool-btn" :class="{ active: state.warningLinked }" :title="state.warningLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.warningLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('warning')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('warning')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('warning', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.warningLinked ? ((state.hueOffset * state.warningMultiplier) + state.warningOffset).toFixed(0) : state.warningOffset }}° · L{{ state.warningLightness }}
          </div>
          <input
            v-if="state.warningLinked"
            type="range"
            v-model.number="state.warningMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('warning') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.warningOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.warningLinked }"
            :style="{ background: getOffsetGradient('warning') }"
            min="-180"
            max="180"
            step="1"
            :title="state.warningLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.warningLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('warning') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.warning }}</code>
        </div>
        <div class="swatch" :style="{ background: colors.hint, color: getTextColor(colors.hint) }">
          <span>hint</span>
          <code>{{ colors.hint }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.keyword, color: getTextColor(colors.keyword) }">
          <div class="swatch-header">
            <span class="color-name">keyword</span>
            <code class="color-hex">{{ colors.keyword }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.keyword, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.keyword, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.keyword, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.keyword, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.keyword, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('keyword', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('keyword', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.keywordLinked = !state.keywordLinked" class="tool-btn" :class="{ active: state.keywordLinked }" :title="state.keywordLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.keywordLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('keyword')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('keyword')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('keyword', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.keywordLinked ? ((state.hueOffset * state.keywordMultiplier) + state.keywordOffset).toFixed(0) : state.keywordOffset }}° · L{{ state.keywordLightness }}
          </div>
          <input
            v-if="state.keywordLinked"
            type="range"
            v-model.number="state.keywordMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('keyword') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.keywordOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.keywordLinked }"
            :style="{ background: getOffsetGradient('keyword') }"
            min="-180"
            max="180"
            step="1"
            :title="state.keywordLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.keywordLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('keyword') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.keyword }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.string, color: getTextColor(colors.string) }">
          <div class="swatch-header">
            <span class="color-name">string</span>
            <code class="color-hex">{{ colors.string }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.string, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.string, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.string, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.string, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.string, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('string', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('string', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.stringLinked = !state.stringLinked" class="tool-btn" :class="{ active: state.stringLinked }" :title="state.stringLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.stringLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('string')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('string')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('string', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.stringLinked ? ((state.hueOffset * state.stringMultiplier) + state.stringOffset).toFixed(0) : state.stringOffset }}° · L{{ state.stringLightness }}
          </div>
          <input
            v-if="state.stringLinked"
            type="range"
            v-model.number="state.stringMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('string') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.stringOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.stringLinked }"
            :style="{ background: getOffsetGradient('string') }"
            min="-180"
            max="180"
            step="1"
            :title="state.stringLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.stringLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('string') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.string }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.number, color: getTextColor(colors.number) }">
          <div class="swatch-header">
            <span class="color-name">number</span>
            <code class="color-hex">{{ colors.number }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.number, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.number, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.number, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.number, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.number, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('number', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('number', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.numberLinked = !state.numberLinked" class="tool-btn" :class="{ active: state.numberLinked }" :title="state.numberLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.numberLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('number')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('number')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('number', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.numberLinked ? ((state.hueOffset * state.numberMultiplier) + state.numberOffset).toFixed(0) : state.numberOffset }}° · L{{ state.numberLightness }}
          </div>
          <input
            v-if="state.numberLinked"
            type="range"
            v-model.number="state.numberMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('number') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.numberOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.numberLinked }"
            :style="{ background: getOffsetGradient('number') }"
            min="-180"
            max="180"
            step="1"
            :title="state.numberLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.numberLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('number') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.number }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.function, color: getTextColor(colors.function) }">
          <div class="swatch-header">
            <span class="color-name">function</span>
            <code class="color-hex">{{ colors.function }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.function, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.function, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.function, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.function, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.function, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('function', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('function', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.functionLinked = !state.functionLinked" class="tool-btn" :class="{ active: state.functionLinked }" :title="state.functionLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.functionLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('function')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('function')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('function', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.functionLinked ? ((state.hueOffset * state.functionMultiplier) + state.functionOffset).toFixed(0) : state.functionOffset }}° · L{{ state.functionLightness }}
          </div>
          <input
            v-if="state.functionLinked"
            type="range"
            v-model.number="state.functionMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('function') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.functionOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.functionLinked }"
            :style="{ background: getOffsetGradient('function') }"
            min="-180"
            max="180"
            step="1"
            :title="state.functionLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.functionLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('function') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.function }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.constant, color: getTextColor(colors.constant) }">
          <div class="swatch-header">
            <span class="color-name">constant</span>
            <code class="color-hex">{{ colors.constant }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.constant, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.constant, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.constant, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.constant, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.constant, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('constant', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('constant', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.constantLinked = !state.constantLinked" class="tool-btn" :class="{ active: state.constantLinked }" :title="state.constantLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.constantLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('constant')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('constant')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('constant', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.constantLinked ? ((state.hueOffset * state.constantMultiplier) + state.constantOffset).toFixed(0) : state.constantOffset }}° · L{{ state.constantLightness }}
          </div>
          <input
            v-if="state.constantLinked"
            type="range"
            v-model.number="state.constantMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('constant') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.constantOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.constantLinked }"
            :style="{ background: getOffsetGradient('constant') }"
            min="-180"
            max="180"
            step="1"
            :title="state.constantLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.constantLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('constant') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.constant }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.type, color: getTextColor(colors.type) }">
          <div class="swatch-header">
            <span class="color-name">type</span>
            <code class="color-hex">{{ colors.type }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.type, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.type, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.type, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.type, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.type, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('type', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('type', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.typeLinked = !state.typeLinked" class="tool-btn" :class="{ active: state.typeLinked }" :title="state.typeLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.typeLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('type')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('type')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('type', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.typeLinked ? ((state.hueOffset * state.typeMultiplier) + state.typeOffset).toFixed(0) : state.typeOffset }}° · L{{ state.typeLightness }}
          </div>
          <input
            v-if="state.typeLinked"
            type="range"
            v-model.number="state.typeMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('type') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.typeOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.typeLinked }"
            :style="{ background: getOffsetGradient('type') }"
            min="-180"
            max="180"
            step="1"
            :title="state.typeLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.typeLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('type') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.type }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.variable, color: getTextColor(colors.variable) }">
          <div class="swatch-header">
            <span class="color-name">variable</span>
            <code class="color-hex">{{ colors.variable }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.variable, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.variable, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.variable, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.variable, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.variable, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('variable', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('variable', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.variableLinked = !state.variableLinked" class="tool-btn" :class="{ active: state.variableLinked }" :title="state.variableLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.variableLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('variable')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('variable')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('variable', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.variableLinked ? ((state.hueOffset * state.variableMultiplier) + state.variableOffset).toFixed(0) : state.variableOffset }}° · L{{ state.variableLightness }}
          </div>
          <input
            v-if="state.variableLinked"
            type="range"
            v-model.number="state.variableMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('variable') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.variableOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.variableLinked }"
            :style="{ background: getOffsetGradient('variable') }"
            min="-180"
            max="180"
            step="1"
            :title="state.variableLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.variableLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('variable') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.variable }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.operator, color: getTextColor(colors.operator) }">
          <div class="swatch-header">
            <span class="color-name">operator</span>
            <code class="color-hex">{{ colors.operator }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.operator, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.operator, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.operator, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.operator, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.operator, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('operator', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('operator', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.operatorLinked = !state.operatorLinked" class="tool-btn" :class="{ active: state.operatorLinked }" :title="state.operatorLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.operatorLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('operator')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('operator')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('operator', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.operatorLinked ? ((state.hueOffset * state.operatorMultiplier) + state.operatorOffset).toFixed(0) : state.operatorOffset }}° · L{{ state.operatorLightness }}
          </div>
          <input
            v-if="state.operatorLinked"
            type="range"
            v-model.number="state.operatorMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('operator') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.operatorOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.operatorLinked }"
            :style="{ background: getOffsetGradient('operator') }"
            min="-180"
            max="180"
            step="1"
            :title="state.operatorLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.operatorLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('operator') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.operator }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.builtin, color: getTextColor(colors.builtin) }">
          <div class="swatch-header">
            <span class="color-name">builtin</span>
            <code class="color-hex">{{ colors.builtin }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.builtin, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.builtin, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.builtin, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.builtin, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.builtin, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('builtin', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('builtin', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.builtinLinked = !state.builtinLinked" class="tool-btn" :class="{ active: state.builtinLinked }" :title="state.builtinLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.builtinLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('builtin')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('builtin')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('builtin', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.builtinLinked ? ((state.hueOffset * state.builtinMultiplier) + state.builtinOffset).toFixed(0) : state.builtinOffset }}° · L{{ state.builtinLightness }}
          </div>
          <input
            v-if="state.builtinLinked"
            type="range"
            v-model.number="state.builtinMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('builtin') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.builtinOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.builtinLinked }"
            :style="{ background: getOffsetGradient('builtin') }"
            min="-180"
            max="180"
            step="1"
            :title="state.builtinLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.builtinLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('builtin') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.builtin }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.parameter, color: getTextColor(colors.parameter) }">
          <div class="swatch-header">
            <span class="color-name">parameter</span>
            <code class="color-hex">{{ colors.parameter }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.parameter, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.parameter, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.parameter, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.parameter, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.parameter, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('parameter', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('parameter', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.parameterLinked = !state.parameterLinked" class="tool-btn" :class="{ active: state.parameterLinked }" :title="state.parameterLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.parameterLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('parameter')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('parameter')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('parameter', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.parameterLinked ? ((state.hueOffset * state.parameterMultiplier) + state.parameterOffset).toFixed(0) : state.parameterOffset }}° · L{{ state.parameterLightness }}
          </div>
          <input
            v-if="state.parameterLinked"
            type="range"
            v-model.number="state.parameterMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('parameter') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.parameterOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.parameterLinked }"
            :style="{ background: getOffsetGradient('parameter') }"
            min="-180"
            max="180"
            step="1"
            :title="state.parameterLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.parameterLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('parameter') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.parameter }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.property, color: getTextColor(colors.property) }">
          <div class="swatch-header">
            <span class="color-name">property</span>
            <code class="color-hex">{{ colors.property }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.property, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.property, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.property, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.property, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.property, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('property', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('property', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.propertyLinked = !state.propertyLinked" class="tool-btn" :class="{ active: state.propertyLinked }" :title="state.propertyLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.propertyLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('property')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('property')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('property', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.propertyLinked ? ((state.hueOffset * state.propertyMultiplier) + state.propertyOffset).toFixed(0) : state.propertyOffset }}° · L{{ state.propertyLightness }}
          </div>
          <input
            v-if="state.propertyLinked"
            type="range"
            v-model.number="state.propertyMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('property') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.propertyOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.propertyLinked }"
            :style="{ background: getOffsetGradient('property') }"
            min="-180"
            max="180"
            step="1"
            :title="state.propertyLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.propertyLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('property') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.property }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.namespace, color: getTextColor(colors.namespace) }">
          <div class="swatch-header">
            <span class="color-name">namespace</span>
            <code class="color-hex">{{ colors.namespace }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.namespace, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.namespace, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.namespace, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.namespace, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.namespace, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('namespace', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('namespace', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.namespaceLinked = !state.namespaceLinked" class="tool-btn" :class="{ active: state.namespaceLinked }" :title="state.namespaceLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.namespaceLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('namespace')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('namespace')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('namespace', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.namespaceLinked ? ((state.hueOffset * state.namespaceMultiplier) + state.namespaceOffset).toFixed(0) : state.namespaceOffset }}° · L{{ state.namespaceLightness }}
          </div>
          <input
            v-if="state.namespaceLinked"
            type="range"
            v-model.number="state.namespaceMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('namespace') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.namespaceOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.namespaceLinked }"
            :style="{ background: getOffsetGradient('namespace') }"
            min="-180"
            max="180"
            step="1"
            :title="state.namespaceLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.namespaceLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('namespace') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.namespace }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.macro, color: getTextColor(colors.macro) }">
          <div class="swatch-header">
            <span class="color-name">macro</span>
            <code class="color-hex">{{ colors.macro }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.macro, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.macro, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.macro, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.macro, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.macro, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('macro', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('macro', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.macroLinked = !state.macroLinked" class="tool-btn" :class="{ active: state.macroLinked }" :title="state.macroLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.macroLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('macro')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('macro')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('macro', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.macroLinked ? ((state.hueOffset * state.macroMultiplier) + state.macroOffset).toFixed(0) : state.macroOffset }}° · L{{ state.macroLightness }}
          </div>
          <input
            v-if="state.macroLinked"
            type="range"
            v-model.number="state.macroMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('macro') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.macroOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.macroLinked }"
            :style="{ background: getOffsetGradient('macro') }"
            min="-180"
            max="180"
            step="1"
            :title="state.macroLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.macroLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('macro') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.macro }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.tag, color: getTextColor(colors.tag) }">
          <div class="swatch-header">
            <span class="color-name">tag</span>
            <code class="color-hex">{{ colors.tag }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.tag, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.tag, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.tag, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.tag, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.tag, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('tag', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('tag', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.tagLinked = !state.tagLinked" class="tool-btn" :class="{ active: state.tagLinked }" :title="state.tagLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.tagLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('tag')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('tag')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('tag', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.tagLinked ? ((state.hueOffset * state.tagMultiplier) + state.tagOffset).toFixed(0) : state.tagOffset }}° · L{{ state.tagLightness }}
          </div>
          <input
            v-if="state.tagLinked"
            type="range"
            v-model.number="state.tagMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('tag') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.tagOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.tagLinked }"
            :style="{ background: getOffsetGradient('tag') }"
            min="-180"
            max="180"
            step="1"
            :title="state.tagLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.tagLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('tag') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.tag }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.punctuation, color: getTextColor(colors.punctuation) }">
          <div class="swatch-header">
            <span class="color-name">punctuation</span>
            <code class="color-hex">{{ colors.punctuation }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.punctuation, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.punctuation, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.punctuation, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.punctuation, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.punctuation, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('punctuation', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('punctuation', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.punctuationLinked = !state.punctuationLinked" class="tool-btn" :class="{ active: state.punctuationLinked }" :title="state.punctuationLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.punctuationLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('punctuation')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('punctuation')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('punctuation', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.punctuationLinked ? ((state.hueOffset * state.punctuationMultiplier) + state.punctuationOffset).toFixed(0) : state.punctuationOffset }}° · L{{ state.punctuationLightness }}
          </div>
          <input
            v-if="state.punctuationLinked"
            type="range"
            v-model.number="state.punctuationMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('punctuation') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.punctuationOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.punctuationLinked }"
            :style="{ background: getOffsetGradient('punctuation') }"
            min="-180"
            max="180"
            step="1"
            :title="state.punctuationLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.punctuationLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('punctuation') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.punctuation }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.heading, color: getTextColor(colors.heading) }">
          <div class="swatch-header">
            <span class="color-name">heading</span>
            <code class="color-hex">{{ colors.heading }}</code>
          </div>
          <div class="contrast-info" :title="`Contrast ratio: ${getContrastRatio(colors.heading, colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors.heading, colors.bg))})`">
            <span class="contrast-icon">{{ getContrastIcon(getContrastRatio(colors.heading, colors.bg)) }}</span>
            <span class="contrast-ratio">{{ getContrastRatio(colors.heading, colors.bg).toFixed(1) }}:1</span>
            <span class="contrast-level">{{ getContrastLevel(getContrastRatio(colors.heading, colors.bg)) }}</span>
          </div>
          <div class="wcag-locks">
            <button @click="lockToWCAG('heading', 'AA')" class="lock-btn lock-aa" title="lock to WCAG AA (4.5:1)">
              Lock AA
            </button>
            <button @click="lockToWCAG('heading', 'AAA')" class="lock-btn lock-aaa" title="lock to WCAG AAA (7:1)">
              Lock AAA
            </button>
          </div>
          <div class="swatch-tools">
            <button @click="state.headingLinked = !state.headingLinked" class="tool-btn" :class="{ active: state.headingLinked }" :title="state.headingLinked ? 'unlink from global offset' : 'link to global offset'">
              {{ state.headingLinked ? 'LINK' : 'UNLNK' }}
            </button>
            <button @click="shuffleColor('heading')" class="tool-btn" title="randomize">RAND</button>
            <button @click="resetColor('heading')" class="tool-btn" title="reset">RESET</button>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('heading', el.value as any); el.value = ''; } }" class="tool-select" title="color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>
          <div class="value-display">
            {{ state.headingLinked ? ((state.hueOffset * state.headingMultiplier) + state.headingOffset).toFixed(0) : state.headingOffset }}° · L{{ state.headingLightness }}
          </div>
          <input
            v-if="state.headingLinked"
            type="range"
            v-model.number="state.headingMultiplier"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient('heading') }"
            min="-5"
            max="5"
            step="0.1"
            title="multiplier: how this color relates to global offset"
          />
          <input
            type="range"
            v-model.number="state.headingOffset"
            class="offset-slider"
            :class="{ 'add-mode': state.headingLinked }"
            :style="{ background: getOffsetGradient('heading') }"
            min="-180"
            max="180"
            step="1"
            :title="state.headingLinked ? 'fine-tune: additional offset on top of global' : 'offset: direct hue adjustment'"
          />
          <input
            type="range"
            v-model.number="state.headingLightness"
            class="lightness-slider"
            :style="{ background: getLightnessGradient('heading') }"
            min="0"
            max="100"
            step="1"
            title="lightness: brightness (50 = default)"
          />
          <code>{{ colors.heading }}</code>
        </div>
        <div class="swatch" :style="{ background: colors.comment, color: getTextColor(colors.comment) }">
          <span>comment</span>
          <code>{{ colors.comment }}</code>
        </div>
        <div class="swatch" :style="{ background: colors.fg, color: getTextColor(colors.fg) }">
          <span>foreground</span>
          <code>{{ colors.fg }}</code>
        </div>
        <div class="swatch" :style="{ background: colors.bg, border: '1px solid ' + colors.comment }">
          <span :style="{ color: colors.fg }">background</span>
          <code :style="{ color: colors.fg }">{{ colors.bg }}</code>
        </div>
      </div>
      </div>

      <!-- Live previews -->
      <div class="previews">
        <CodePreview />
        <ShellPreview />
      </div>

      <div class="previews">
        <TmuxPreview />
        <HtopPreview />
      </div>

      <!-- Live config previews - both variants -->
      <div class="configs">
        <div class="config-preview" :style="{ background: darkColors.bg, borderColor: darkColors.comment }">
          <div class="config-header" :style="{ color: darkColors.comment, borderBottomColor: darkColors.comment }">
            {{ exportFormats[0] || 'ghostty' }} - theme-lab-dark{{ getFileExtension(exportFormats[0] || 'ghostty') }}
            <span v-if="exportFormats.length > 1" :style="{ fontSize: '7px', opacity: 0.6, marginLeft: '4px' }">
              (+{{ exportFormats.length - 1 }} more)
            </span>
          </div>
          <pre class="config-content" :style="{ color: darkColors.string }">{{ darkConfig }}</pre>
        </div>
        <div class="config-preview" :style="{ background: lightColors.bg, borderColor: lightColors.comment }">
          <div class="config-header" :style="{ color: lightColors.comment, borderBottomColor: lightColors.comment }">
            {{ exportFormats[0] || 'ghostty' }} - theme-lab-light{{ getFileExtension(exportFormats[0] || 'ghostty') }}
            <span v-if="exportFormats.length > 1" :style="{ fontSize: '7px', opacity: 0.6, marginLeft: '4px' }">
              (+{{ exportFormats.length - 1 }} more)
            </span>
          </div>
          <pre class="config-content" :style="{ color: lightColors.string }">{{ lightConfig }}</pre>
        </div>
      </div>

      <!-- Additional example scenarios -->
      <div class="scenario-section">
        <div class="scenario-label">nvim - editing session with LSP diagnostics</div>
        <NvimPreview />
      </div>

      <div class="scenario-section">
        <div class="scenario-label">lazygit - git interface</div>
        <GitPreview />
      </div>
    </main>
  </div>
</template>

<style scoped>
.lab {
  height: 100vh;
  width: 100vw;
  font-family: 'Monaspace Krypton', monospace;
  position: relative;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.sidebar-left {
  width: 30%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-right: 1px solid rgba(255, 255, 255, 0.15);
  padding: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
}

.header {
  padding-bottom: 8px;
  border-bottom: 1px solid currentColor;
  border-opacity: 0.1;
}

h1 {
  font-size: 10px;
  font-weight: normal;
  margin: 0;
  color: inherit;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preset-section {
  padding: 8px 0;
  border-bottom: 1px solid currentColor;
  border-opacity: 0.1;
}

.preset-select {
  width: 100%;
  background: transparent;
  border: 1px solid currentColor;
  border-opacity: 0.3;
  color: inherit;
  padding: 6px;
  font-family: inherit;
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.15s;
}

.preset-select:hover {
  background: currentColor;
  background-opacity: 0.05;
  border-opacity: 0.5;
}

.preset-select option {
  background: inherit;
  color: inherit;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid currentColor;
  border-opacity: 0.1;
}

.export-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.export-section:last-child {
  border-bottom: none;
}

.section-label {
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: bold;
  margin-bottom: 4px;
}

.format-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 6px;
}

.format-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 9px;
  color: #fff;
  cursor: pointer;
  padding: 4px 0;
  transition: opacity 0.1s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.format-checkbox:hover {
  opacity: 0.8;
}

.format-checkbox input[type="checkbox"] {
  width: 12px;
  height: 12px;
  cursor: pointer;
  margin: 0;
  flex-shrink: 0;
  accent-color: rgba(255, 255, 255, 0.8);
}

.btn-select-all {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  padding: 4px 8px;
  font-family: inherit;
  font-size: 7px;
  cursor: pointer;
  transition: all 0.15s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-select-all:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 0.9);
}

.button-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 8px 12px;
  font-family: inherit;
  font-size: 8px;
  cursor: pointer;
  transition: all 0.15s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: normal;
  width: 100%;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  font-weight: bold;
  font-size: 9px;
  padding: 10px 12px;
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.7);
}

.btn-secondary {
  font-size: 8px;
  padding: 6px 8px;
}

.btn-reset {
  background: transparent;
  border-color: rgba(255, 100, 100, 0.4);
  color: rgba(255, 150, 150, 0.9);
  font-size: 8px;
  padding: 8px 12px;
}

.btn-reset:hover {
  background: rgba(255, 100, 100, 0.1);
  border-color: rgba(255, 100, 100, 0.6);
  color: rgba(255, 150, 150, 1);
}

.preview-right {
  width: 70%;
  height: 100vh;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  flex-grow: 1;
}

.swatches-float {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  overflow-x: auto;
  overflow-y: hidden;
}

.swatches {
  display: grid;
  grid-template-columns: repeat(18, minmax(120px, 1fr));
  gap: 4px;
  width: max-content;
  min-width: 100%;
}

/* Horizontal scrollbar for swatches */
.swatches-float::-webkit-scrollbar {
  height: 6px;
}

.swatches-float::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.swatches-float::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.swatches-float::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.swatch {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 10px;
}

.swatch.editable {
  gap: 6px;
  padding: 12px;
  min-height: 180px;
}

.swatch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.color-name {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.5px;
}

.color-hex {
  font-size: 8px;
  opacity: 0.7;
}

.contrast-info {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px 6px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  font-size: 9px;
  margin-bottom: 8px;
  cursor: help;
}

.contrast-icon {
  font-size: 11px;
}

.contrast-ratio {
  font-weight: bold;
  font-variant-numeric: tabular-nums;
}

.contrast-level {
  margin-left: auto;
  font-size: 7px;
  opacity: 0.8;
  font-weight: bold;
}

.wcag-locks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin-bottom: 8px;
}

.lock-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid currentColor;
  color: inherit;
  padding: 6px 8px;
  font-size: 9px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.lock-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.lock-btn:active {
  transform: translateY(0);
}

.swatch-tools {
  display: flex;
  gap: 3px;
  margin-bottom: 6px;
}

.tool-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: inherit;
  padding: 4px 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  border-radius: 2px;
  flex: 0 0 auto;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tool-btn.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
}

.tool-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: inherit;
  padding: 4px 6px;
  font-size: 8px;
  cursor: pointer;
  flex: 1;
  border-radius: 2px;
  text-transform: uppercase;
}

.tool-select:hover {
  background: rgba(255, 255, 255, 0.15);
}

.value-display {
  font-size: 8px;
  opacity: 0.7;
  text-align: center;
  font-variant-numeric: tabular-nums;
  margin-bottom: 4px;
}

.color-math-select {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid currentColor;
  color: inherit;
  opacity: 0.7;
  font-family: inherit;
  font-size: 8px;
  padding: 2px 4px;
  cursor: pointer;
  text-transform: lowercase;
  border-radius: 2px;
  transition: all 0.15s;
}

.color-math-select:hover {
  background: rgba(255, 255, 255, 0.25);
  opacity: 1;
}

.contrast-badge {
  font-size: 7px;
  padding: 2px 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid currentColor;
  opacity: 0.8;
  font-weight: bold;
  cursor: help;
  font-variant-numeric: tabular-nums;
}

.link-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid currentColor;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  font-size: 9px;
  padding: 3px 6px;
  line-height: 1;
  transition: all 0.15s;
  font-weight: bold;
  border-radius: 2px;
  min-width: 20px;
}

.link-btn.linked {
  background: rgba(255, 255, 255, 0.2);
  opacity: 0.9;
}

.link-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  opacity: 1;
}

.wcag-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid currentColor;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  font-size: 7px;
  padding: 2px 4px;
  line-height: 1;
  transition: all 0.15s;
  font-weight: bold;
  border-radius: 2px;
  min-width: 18px;
}

.wcag-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  opacity: 1;
  transform: scale(1.05);
}

.shuffle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid currentColor;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  font-size: 10px;
  padding: 2px 4px;
  line-height: 1;
  transition: all 0.15s;
  border-radius: 2px;
}

.shuffle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  opacity: 1;
  transform: scale(1.1);
}

.reset-btn {
  background: transparent;
  border: none;
  color: inherit;
  opacity: 0.5;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  line-height: 1;
  transition: opacity 0.15s, transform 0.15s;
  margin-left: auto;
  margin-right: 6px;
}

.reset-btn:hover {
  opacity: 1;
  transform: rotate(180deg);
}

.swatch span {
  font-weight: bold;
  text-transform: uppercase;
}

.offset-value {
  font-size: 8px;
  opacity: 0.7;
  font-weight: normal;
  font-variant-numeric: tabular-nums;
  color: inherit;
  min-width: 32px;
  width: 32px;
  display: inline-block;
  text-align: right;
}

.offset-slider {
  width: 100%;
  height: 3px;
  background: rgba(0, 0, 0, 0.2);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  margin: 3px 0;
}

.offset-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #fff;
  cursor: pointer;
  border-radius: 0;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.3);
}

.offset-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #fff;
  cursor: pointer;
  border-radius: 0;
  border: none;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.3);
}

.offset-slider.linked {
  height: 4px;
}

.offset-slider.linked::-webkit-slider-thumb {
  background: #fff;
  width: 14px;
  height: 14px;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.4);
}

.offset-slider.linked::-moz-range-thumb {
  background: #fff;
  width: 14px;
  height: 14px;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.4);
}

.offset-slider.add-mode {
  height: 2px;
}

.offset-slider.add-mode::-webkit-slider-thumb {
  background: #fff;
  width: 9px;
  height: 9px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.3);
}

.offset-slider.add-mode::-moz-range-thumb {
  background: #fff;
  width: 9px;
  height: 9px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.3);
}

.lightness-slider {
  width: 100%;
  height: 2px;
  background: rgba(0, 0, 0, 0.15);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  margin: 3px 0;
}

.lightness-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 9px;
  height: 9px;
  background: #fff;
  cursor: pointer;
  border-radius: 0;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.3);
}

.lightness-slider::-moz-range-thumb {
  width: 9px;
  height: 9px;
  background: #fff;
  cursor: pointer;
  border-radius: 0;
  border: none;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.3);
}

.swatch code {
  font-family: inherit;
  opacity: 0.7;
  font-size: 9px;
}

.previews {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  margin-bottom: 4px;
  min-height: 500px;
  margin-top: 220px;
}

.previews:first-of-type {
  margin-top: 220px;
}

.configs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
}

.config-preview {
  border: 1px solid #222;
  background: #0a0a0a;
}

.config-header {
  padding: 6px 8px;
  border-bottom: 1px solid #222;
  font-size: 9px;
  color: #666;
  text-transform: uppercase;
}

.config-content {
  padding: 8px;
  font-size: 9px;
  line-height: 1.4;
  color: #ccc;
  margin: 0;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}

.scenario-section {
  margin-top: 4px;
  min-height: 600px;
}

.scenario-label {
  padding: 4px 8px;
  border-bottom: 1px solid #222;
  font-size: 9px;
  color: #666;
  text-transform: uppercase;
  background: #0a0a0a;
  margin-bottom: 2px;
}

/* Scrollbar styling for sidebar */
.sidebar-left::-webkit-scrollbar {
  width: 8px;
}

.sidebar-left::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-left::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.sidebar-left::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Scrollbar styling for preview area */
.preview-right::-webkit-scrollbar {
  width: 8px;
}

.preview-right::-webkit-scrollbar-track {
  background: transparent;
}

.preview-right::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.preview-right::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Responsive layout for mobile/tablet */
@media (max-width: 1024px) {
  .lab {
    flex-direction: column;
  }

  .sidebar-left {
    width: 100%;
    height: auto;
    max-height: 40vh;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    padding: 16px;
  }

  .preview-right {
    width: 100%;
    height: auto;
    flex-grow: 1;
  }

  .swatches {
    grid-template-columns: repeat(4, 1fr);
  }

  .previews:first-of-type {
    margin-top: 280px;
  }
}

@media (max-width: 768px) {
  .sidebar-left {
    max-height: 50vh;
    padding: 12px;
  }

  .swatches {
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }

  .swatches-float {
    padding: 4px;
  }

  .swatch {
    padding: 8px;
    font-size: 8px;
  }

  .previews {
    grid-template-columns: 1fr;
    margin-top: 320px;
  }

  .previews:first-of-type {
    margin-top: 320px;
  }

  .configs {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .swatches {
    grid-template-columns: repeat(2, 1fr);
  }

  .sidebar-left {
    padding: 8px;
  }

  h1 {
    font-size: 8px;
  }

  .previews:first-of-type {
    margin-top: 400px;
  }
}
</style>
