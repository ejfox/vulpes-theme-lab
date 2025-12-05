<script setup lang="ts">
import {
  exportGhostty,
  exportNeovim,
  exportBat,
  exportYazi,
  exportLazygit,
  exportZsh,
  exportTweakcc,
  exportNeomutt,
  exportWezterm,
  exportAlacritty,
  exportMaplibre,
  createSemanticPalette,
  type ExportResult,
} from '~/utils/exporters'
import { serializeItermTheme } from '~/utils/iterm'
import { serializeTmuxTheme } from '~/utils/tmux'
import {
  validateThemeContrast,
  applyContrastFixes,
  generateAccessibilityReport,
} from '~/utils/contrast'
import { getImportedPreset, applyImportedPreset } from '~/utils/importedPresets'
import chroma from 'chroma-js'

const { state, colors, darkColors, lightColors } = useTheme()
const { highlightedColor } = useHighlightedColor()

// Export format selection - multi-select
const exportFormats = ref<string[]>(['ghostty'])

// Export modal state
const showExportModal = ref(false)

// Import modal state
const showImportModal = ref(false)
const droppedFile = ref<File | undefined>(undefined)

// Contrast warning modal state
const showContrastWarning = ref(false)
const contrastIssues = ref<any[]>([])
const pendingExport = ref<{
  palette: any
  themeName: string
  formats: string[]
  mode: 'both' | 'dark' | 'light'
} | null>(null)

// Success toast state
const showSuccessToast = ref(false)
const successMessage = ref('')

// Handle imported theme
function handleThemeImported(presetId: string) {
  const preset = getImportedPreset(presetId)
  if (!preset) return

  // Apply the imported preset to the current theme state
  const applied = applyImportedPreset(preset)

  state.value.themeName = applied.themeName
  state.value.mode = applied.mode
  // Apply the imported color palette directly (overrides generated colors)
  state.value.importedPalette = applied.colors

  // Show success message
  successMessage.value = `Imported theme "${preset.name}" from ${preset.source}`
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

// Global drag and drop using composable
const { isGlobalDragging } = useGlobalDrop((file: File) => {
  droppedFile.value = file
  showImportModal.value = true
})

// Clear dropped file when modal closes
watch(showImportModal, (isOpen) => {
  if (!isOpen) {
    droppedFile.value = undefined
  }
})

// Helper to generate config for a single format using new exporters
const generateConfig = (format: string, isDark: boolean): string => {
  const themeColors = isDark ? darkColors.value : lightColors.value
  const baseThemeName = state.value.themeName || 'vulpes'
  const mode = isDark ? 'dark' : 'light'

  // Create semantic palette for new exporters
  const palette = createSemanticPalette(themeColors, mode)

  let result: ExportResult

  switch (format) {
    case 'ghostty':
      result = exportGhostty(palette, baseThemeName)
      break
    case 'neovim':
      result = exportNeovim(palette, baseThemeName)
      break
    case 'bat':
      result = exportBat(palette, baseThemeName)
      break
    case 'yazi':
      result = exportYazi(palette, baseThemeName)
      break
    case 'lazygit':
      result = exportLazygit(palette, baseThemeName)
      break
    case 'zsh':
      result = exportZsh(palette, baseThemeName)
      break
    case 'tweakcc':
      result = exportTweakcc(palette, baseThemeName)
      break
    case 'neomutt':
      result = exportNeomutt(palette, baseThemeName)
      break
    case 'wezterm':
      result = exportWezterm(palette, baseThemeName)
      break
    case 'alacritty':
      result = exportAlacritty(palette, baseThemeName)
      break
    case 'maplibre':
      result = exportMaplibre(palette, baseThemeName)
      break
    case 'iterm':
      // iTerm not yet migrated to new exporter system
      return serializeItermTheme(themeColors, `${baseThemeName}-${mode}`)
    case 'tmux':
      // Tmux not yet migrated to new exporter system
      return serializeTmuxTheme(themeColors, `${baseThemeName}-${mode}`)
    default:
      result = exportGhostty(palette, baseThemeName)
  }

  return result.content
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

// Helper to generate export result with proper filename
const generateExport = (format: string, isDark: boolean): ExportResult => {
  const themeColors = isDark ? darkColors.value : lightColors.value
  const baseThemeName = state.value.themeName || 'vulpes'
  const mode = isDark ? 'dark' : 'light'
  const themeName = `${baseThemeName}-${mode}`

  // Create semantic palette for new exporters
  const palette = createSemanticPalette(themeColors, mode)

  switch (format) {
    case 'ghostty':
      return exportGhostty(palette, themeName)
    case 'neovim':
      return exportNeovim(palette, themeName)
    case 'bat':
      return exportBat(palette, themeName)
    case 'yazi':
      return exportYazi(palette, themeName)
    case 'lazygit':
      return exportLazygit(palette, themeName)
    case 'zsh':
      return exportZsh(palette, themeName)
    case 'tweakcc':
      return exportTweakcc(palette, themeName)
    case 'neomutt':
      return exportNeomutt(palette, themeName)
    case 'wezterm':
      return exportWezterm(palette, themeName)
    case 'alacritty':
      return exportAlacritty(palette, themeName)
    case 'iterm':
      // iTerm not yet migrated - create ExportResult manually
      return {
        filename: `${themeName}.itermcolors`,
        content: serializeItermTheme(themeColors, themeName),
        format: 'iterm' as any,
      }
    case 'tmux':
      // Tmux not yet migrated - create ExportResult manually
      return {
        filename: `${themeName}.tmux.conf`,
        content: serializeTmuxTheme(themeColors, themeName),
        format: 'tmux' as any,
      }
    default:
      return exportGhostty(palette, themeName)
  }
}

// Reset functions for each color - resets to 0 offset, 50 lightness, linked=true
const resetColor = (colorName: string) => {
  // All colors reset to: offset=0, lightness=50, linked=true
  // Multipliers come from defaultState in useTheme
  const defaults: Record<
    string,
    { multiplier: number; offset: number; lightness: number; linked: boolean }
  > = {
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

// Validate and export with contrast checking
const validateAndExport = (mode: 'both' | 'dark' | 'light') => {
  if (exportFormats.value.length === 0) {
    alert('Please select at least one format to export')
    return
  }

  // Check dark theme contrast
  const darkPalette = createSemanticPalette(darkColors.value, 'dark')
  const darkIssues = validateThemeContrast(darkPalette)

  // Check light theme contrast if exporting both or light only
  const lightPalette = createSemanticPalette(lightColors.value, 'light')
  const lightIssues = mode !== 'dark' ? validateThemeContrast(lightPalette) : []

  // Combine issues
  const allIssues =
    mode === 'both' ? [...darkIssues, ...lightIssues] : mode === 'dark' ? darkIssues : lightIssues

  if (allIssues.length > 0) {
    // Show contrast warning modal
    contrastIssues.value = allIssues
    pendingExport.value = {
      palette: mode === 'dark' ? darkPalette : lightPalette,
      themeName: state.value.themeName || 'vulpes',
      formats: exportFormats.value,
      mode,
    }
    showContrastWarning.value = true
  } else {
    // No issues - export directly
    performExport(mode)
    successMessage.value = '✓ WCAG AA Compliant - Themes Exported!'
    showSuccessToast.value = true
  }
}

// Perform the actual export
const performExport = (
  mode: 'both' | 'dark' | 'light',
  fixedPalettes?: { dark?: any; light?: any }
) => {
  exportFormats.value.forEach((format, index) => {
    setTimeout(() => {
      if (mode === 'both') {
        const darkResult = fixedPalettes?.dark
          ? generateExportFromPalette(format, fixedPalettes.dark, true)
          : generateExport(format, true)
        const lightResult = fixedPalettes?.light
          ? generateExportFromPalette(format, fixedPalettes.light, false)
          : generateExport(format, false)

        downloadFile(darkResult.content, darkResult.filename)
        setTimeout(() => downloadFile(lightResult.content, lightResult.filename), 50)
      } else if (mode === 'dark') {
        const result = fixedPalettes?.dark
          ? generateExportFromPalette(format, fixedPalettes.dark, true)
          : generateExport(format, true)
        downloadFile(result.content, result.filename)
      } else {
        const result = fixedPalettes?.light
          ? generateExportFromPalette(format, fixedPalettes.light, false)
          : generateExport(format, false)
        downloadFile(result.content, result.filename)
      }
    }, index * 150)
  })
}

// Generate export from a fixed palette
const generateExportFromPalette = (format: string, palette: any, isDark: boolean): ExportResult => {
  const baseThemeName = state.value.themeName || 'vulpes'
  const mode = isDark ? 'dark' : 'light'
  const themeName = `${baseThemeName}-${mode}`

  switch (format) {
    case 'ghostty':
      return exportGhostty(palette, themeName)
    case 'neovim':
      return exportNeovim(palette, themeName)
    case 'bat':
      return exportBat(palette, themeName)
    case 'yazi':
      return exportYazi(palette, themeName)
    case 'lazygit':
      return exportLazygit(palette, themeName)
    case 'zsh':
      return exportZsh(palette, themeName)
    case 'tweakcc':
      return exportTweakcc(palette, themeName)
    case 'neomutt':
      return exportNeomutt(palette, themeName)
    case 'wezterm':
      return exportWezterm(palette, themeName)
    case 'alacritty':
      return exportAlacritty(palette, themeName)
    case 'maplibre':
      return exportMaplibre(palette, themeName)
    default:
      return exportGhostty(palette, themeName)
  }
}

// Export both dark and light for all selected formats
const exportBoth = () => {
  validateAndExport('both')
}

// Export only dark for all selected formats
const exportDark = () => {
  validateAndExport('dark')
}

// Export only light for all selected formats
const exportLight = () => {
  validateAndExport('light')
}

// Modal action handlers
const handleAutoFix = () => {
  if (!pendingExport.value) return

  const mode = pendingExport.value.mode

  // Apply fixes to dark theme
  const darkPalette = createSemanticPalette(darkColors.value, 'dark')
  const { fixed: fixedDark, changes: darkChanges } = applyContrastFixes(darkPalette)

  // Apply fixes to light theme
  const lightPalette = createSemanticPalette(lightColors.value, 'light')
  const { fixed: fixedLight, changes: lightChanges } = applyContrastFixes(lightPalette)

  const totalChanges = darkChanges.length + lightChanges.length

  // Export with fixed palettes
  performExport(mode, { dark: fixedDark, light: fixedLight })

  // Show success
  successMessage.value = `✓ Auto-Fixed ${totalChanges} Color${totalChanges > 1 ? 's' : ''} - Exported!`
  showSuccessToast.value = true

  // Close modal
  showContrastWarning.value = false
  pendingExport.value = null
}

const handleExportAnyway = () => {
  if (!pendingExport.value) return

  // Export without fixes
  performExport(pendingExport.value.mode)

  // Close modal
  showContrastWarning.value = false
  pendingExport.value = null
}

const handleExportWithReport = () => {
  if (!pendingExport.value) return

  const mode = pendingExport.value.mode

  // Generate accessibility report
  if (mode === 'both' || mode === 'dark') {
    const darkPalette = createSemanticPalette(darkColors.value, 'dark')
    const darkReport = generateAccessibilityReport(
      darkPalette,
      `${state.value.themeName || 'vulpes'}-dark`
    )
    downloadFile(darkReport, `${state.value.themeName || 'vulpes'}-dark-accessibility.md`)
  }

  if (mode === 'both' || mode === 'light') {
    const lightPalette = createSemanticPalette(lightColors.value, 'light')
    const lightReport = generateAccessibilityReport(
      lightPalette,
      `${state.value.themeName || 'vulpes'}-light`
    )
    downloadFile(lightReport, `${state.value.themeName || 'vulpes'}-light-accessibility.md`)
  }

  // Export themes
  performExport(mode)

  // Close modal
  showContrastWarning.value = false
  pendingExport.value = null
}

const handleCancelExport = () => {
  showContrastWarning.value = false
  pendingExport.value = null
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

// Handle export from modal
const handleModalExport = (formats: string[], mode: 'both' | 'dark' | 'light') => {
  exportFormats.value = formats

  // Use the appropriate export function based on mode
  if (mode === 'both') {
    exportBoth()
  } else if (mode === 'dark') {
    exportDark()
  } else {
    exportLight()
  }
}

// Load preset from Vulpes monthly themes
const loadPreset = (preset: any) => {
  state.value.baseHue = preset.baseHue
  state.value.baseSaturation = preset.baseSaturation
  state.value.baseLightness = preset.baseLightness
  state.value.themeName = preset.id

  // Apply all color offsets
  state.value.errorOffset = preset.errorOffset
  state.value.warningOffset = preset.warningOffset
  state.value.keywordOffset = preset.keywordOffset
  state.value.stringOffset = preset.stringOffset
  state.value.numberOffset = preset.numberOffset
  state.value.functionOffset = preset.functionOffset
  state.value.constantOffset = preset.constantOffset
  state.value.typeOffset = preset.typeOffset
  state.value.variableOffset = preset.variableOffset
  state.value.operatorOffset = preset.operatorOffset
  state.value.builtinOffset = preset.builtinOffset
  state.value.parameterOffset = preset.parameterOffset
  state.value.propertyOffset = preset.propertyOffset
  state.value.namespaceOffset = preset.namespaceOffset
  state.value.macroOffset = preset.macroOffset
  state.value.tagOffset = preset.tagOffset
  state.value.punctuationOffset = preset.punctuationOffset
  state.value.headingOffset = preset.headingOffset
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
    [key: string]: { offset?: number; lightness?: number; linked?: boolean; multiplier?: number }
  }
}

const presets: Record<string, ThemePreset> = {
  'catppuccin-mocha': {
    baseHue: 267, // Mauve base (signature color)
    hueOffset: 0,
    saturation: 84, // Match mauve saturation
    contrast: 42,
    mode: 'dark',
    monochromeMode: true,
    monochromeIntensity: 35,
    monochromeLightness: 60,
    colors: {
      error: { offset: 343, linked: false, lightness: 75 }, // Red #f38ba8
      warning: { offset: 23, linked: false, lightness: 75 }, // Peach #fab387
      keyword: { offset: 267, linked: false, lightness: 81 }, // Mauve #cba6f7
      string: { offset: 115, linked: false, lightness: 76 }, // Green #a6e3a1
      number: { offset: 23, linked: false, lightness: 75 }, // Peach #fab387
      function: { offset: 217, linked: false, lightness: 76 }, // Blue #89b4fa
      constant: { offset: 350, linked: false, lightness: 77 }, // Maroon #eba0ac
      type: { offset: 41, linked: false, lightness: 83 }, // Yellow #f9e2af
      variable: { offset: 170, linked: false, lightness: 73 }, // Teal #94e2d5
      operator: { offset: 189, linked: false, lightness: 73 }, // Sky #89dceb
    },
  },
  'catppuccin-latte': {
    baseHue: 266, // Mauve base (signature color)
    hueOffset: 0,
    saturation: 85, // Match mauve saturation
    contrast: 42,
    mode: 'light',
    monochromeMode: true,
    monochromeIntensity: 35,
    monochromeLightness: 40,
    colors: {
      error: { offset: 347, linked: false, lightness: 44 }, // Red #d20f39
      warning: { offset: 22, linked: false, lightness: 52 }, // Peach #fe640b
      keyword: { offset: 266, linked: false, lightness: 58 }, // Mauve #8839ef
      string: { offset: 109, linked: false, lightness: 40 }, // Green #40a02b
      number: { offset: 22, linked: false, lightness: 52 }, // Peach #fe640b
      function: { offset: 220, linked: false, lightness: 54 }, // Blue #1e66f5
      constant: { offset: 355, linked: false, lightness: 59 }, // Maroon #e64553
      type: { offset: 35, linked: false, lightness: 49 }, // Yellow #df8e1d
      variable: { offset: 183, linked: false, lightness: 35 }, // Teal #179299
      operator: { offset: 197, linked: false, lightness: 46 }, // Sky #04a5e5
    },
  },
  'ayu-dark': {
    baseHue: 40, // Based on actual yellow/orange accent
    hueOffset: 0,
    saturation: 75,
    contrast: 52,
    mode: 'dark',
    monochromeMode: true,
    monochromeIntensity: 28,
    monochromeLightness: 55,
    colors: {
      error: { offset: 0, linked: false, lightness: 60 }, // #ff3333
      warning: { offset: 357, linked: false, lightness: 69 }, // #f07178
      keyword: { offset: 357, linked: false, lightness: 69 }, // #f07178
      string: { offset: 70, linked: false, lightness: 56 }, // #b8cc52
      number: { offset: 40, linked: false, lightness: 61 }, // #e6b450
      function: { offset: 200, linked: false, lightness: 53 }, // #36a3d9
      constant: { offset: 357, linked: false, lightness: 69 }, // #f07178
      type: { offset: 40, linked: false, lightness: 61 }, // #e6b450
      variable: { offset: 160, linked: false, lightness: 74 }, // #95e6cb
      operator: { offset: 40, linked: false, lightness: 61 }, // #e6b450
    },
  },
  'ayu-light': {
    baseHue: 36, // Based on actual yellow/orange accent
    hueOffset: 0,
    saturation: 87,
    contrast: 52,
    mode: 'light',
    monochromeMode: true,
    monochromeIntensity: 28,
    monochromeLightness: 40,
    colors: {
      error: { offset: 357, linked: false, lightness: 69 }, // #f07178
      warning: { offset: 25, linked: false, lightness: 61 }, // #fa8d3e
      keyword: { offset: 25, linked: false, lightness: 61 }, // #fa8d3e
      string: { offset: 75, linked: false, lightness: 35 }, // #86b300
      number: { offset: 36, linked: false, lightness: 62 }, // #f2ae49
      function: { offset: 195, linked: false, lightness: 58 }, // #55b4d4
      constant: { offset: 25, linked: false, lightness: 61 }, // #fa8d3e
      type: { offset: 36, linked: false, lightness: 62 }, // #f2ae49
      variable: { offset: 184, linked: false, lightness: 43 }, // #3e999f
      operator: { offset: 36, linked: false, lightness: 62 }, // #f2ae49
    },
  },
}

const presetOptions = [
  { value: 'catppuccin-mocha', label: 'catppuccin mocha (dark)' },
  { value: 'catppuccin-latte', label: 'catppuccin latte (light)' },
  { value: 'ayu-dark', label: 'ayu dark' },
  { value: 'ayu-light', label: 'ayu light' },
]

const loadOldPreset = (presetName: keyof typeof presets) => {
  const preset = presets[presetName]

  // Apply base settings
  state.value.baseHue = preset.baseHue
  state.value.hueOffset = preset.hueOffset
  state.value.saturation = preset.saturation
  state.value.contrast = preset.contrast
  state.mode = preset.mode

  // Apply monochrome settings
  if (preset.monochromeMode !== undefined) state.value.monochromeMode = preset.monochromeMode
  if (preset.monochromeIntensity !== undefined)
    state.value.monochromeIntensity = preset.monochromeIntensity
  if (preset.monochromeLightness !== undefined)
    state.value.monochromeLightness = preset.monochromeLightness

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
        state.value[`${colorName}Multiplier` as keyof typeof state.value] =
          settings.multiplier as any
      }
    })
  } else {
    // If no color overrides, reset to defaults
    const colors = [
      'error',
      'warning',
      'keyword',
      'string',
      'number',
      'function',
      'constant',
      'type',
      'variable',
      'operator',
    ]
    colors.forEach((colorName) => resetColor(colorName))
  }
}

// Color math presets - apply color theory to multipliers
const colorMathPresets = {
  complementary: {
    // Complementary: 180° apart for maximum contrast
    error: { multiplier: 0, offset: 0 },
    warning: { multiplier: 180 / 7, offset: 0 }, // ~25.7x for 180°
    keyword: { multiplier: 0, offset: 0 },
    string: { multiplier: 180 / 7, offset: 0 },
    number: { multiplier: 0, offset: 0 },
    function: { multiplier: 180 / 7, offset: 0 },
    constant: { multiplier: 0, offset: 0 },
    type: { multiplier: 90 / 7, offset: 0 }, // quarter turn
    variable: { multiplier: -90 / 7, offset: 0 },
    operator: { multiplier: 0, offset: 0 },
  },
  triadic: {
    // Triadic: 120° apart for balanced harmony
    error: { multiplier: 0, offset: 0 },
    warning: { multiplier: 120 / 7, offset: 0 }, // ~17.1x
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
    warning: { multiplier: 150 / 7, offset: 0 }, // ~21.4x
    keyword: { multiplier: -150 / 7, offset: 0 },
    string: { multiplier: 0, offset: 0 },
    number: { multiplier: 150 / 7, offset: 0 },
    function: { multiplier: -150 / 7, offset: 0 },
    constant: { multiplier: 0, offset: 0 },
    type: { multiplier: 150 / 7, offset: 0 },
    variable: { multiplier: -150 / 7, offset: 0 },
    operator: { multiplier: 0, offset: 0 },
  },
  tetradic: {
    // Tetradic/Square: 90° apart for rich palette
    error: { multiplier: 0, offset: 0 },
    warning: { multiplier: 90 / 7, offset: 0 }, // ~12.9x
    keyword: { multiplier: 180 / 7, offset: 0 },
    string: { multiplier: -90 / 7, offset: 0 },
    number: { multiplier: 0, offset: 0 },
    function: { multiplier: 90 / 7, offset: 0 },
    constant: { multiplier: 180 / 7, offset: 0 },
    type: { multiplier: -90 / 7, offset: 0 },
    variable: { multiplier: 0, offset: 0 },
    operator: { multiplier: 45 / 7, offset: 0 }, // half-step
  },
  analogous: {
    // Analogous: close together (30° spacing) for harmony
    error: { multiplier: 0, offset: 0 },
    warning: { multiplier: -30 / 7, offset: 0 }, // ~4.3x
    keyword: { multiplier: 30 / 7, offset: 0 },
    string: { multiplier: -30 / 7, offset: 0 },
    number: { multiplier: 60 / 7, offset: 0 },
    function: { multiplier: -60 / 7, offset: 0 },
    constant: { multiplier: 30 / 7, offset: 0 },
    type: { multiplier: -30 / 7, offset: 0 },
    variable: { multiplier: 60 / 7, offset: 0 },
    operator: { multiplier: 15 / 7, offset: 0 },
  },
  monochromatic: {
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
  const color = colorName as
    | 'error'
    | 'warning'
    | 'keyword'
    | 'string'
    | 'number'
    | 'function'
    | 'constant'
    | 'type'
    | 'variable'
    | 'operator'
  const preset = colorMathPresets[mathType]
  const values = preset[color]

  state.value[`${color}Multiplier` as keyof typeof state.value] = values.multiplier as any
  state.value[`${color}Offset` as keyof typeof state.value] = values.offset as any
  state.value[`${color}Linked` as keyof typeof state.value] = true as any
}

const shuffleColor = (colorName: string) => {
  const color = colorName as
    | 'error'
    | 'warning'
    | 'keyword'
    | 'string'
    | 'number'
    | 'function'
    | 'constant'
    | 'type'
    | 'variable'
    | 'operator'

  // Random multiplier between -5 and 5
  const randomMultiplier = Math.random() * 10 - 5
  // Random offset between -180 and 180
  const randomOffset = Math.floor(Math.random() * 360 - 180)
  // Random lightness between 30 and 70 (avoiding extremes)
  const randomLightness = Math.floor(Math.random() * 40 + 30)

  state.value[`${color}Multiplier` as keyof typeof state.value] = randomMultiplier as any
  state.value[`${color}Offset` as keyof typeof state.value] = randomOffset as any
  state.value[`${color}Lightness` as keyof typeof state.value] = randomLightness as any
  state.value[`${color}Linked` as keyof typeof state.value] = (Math.random() > 0.5) as any
}

type LinkedUpdatePayload = { name: string; value: boolean }
type NumberUpdatePayload = { name: string; value: number }

const updateLinked = ({ name, value }: LinkedUpdatePayload) => {
  state.value[`${name}Linked` as keyof typeof state.value] = value as any
}

const updateMultiplier = ({ name, value }: NumberUpdatePayload) => {
  state.value[`${name}Multiplier` as keyof typeof state.value] = value as any
}

const updateOffset = ({ name, value }: NumberUpdatePayload) => {
  state.value[`${name}Offset` as keyof typeof state.value] = value as any
}

const updateLightness = ({ name, value }: NumberUpdatePayload) => {
  state.value[`${name}Lightness` as keyof typeof state.value] = value as any
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
  state.value.bgLightness = 50 // Reset background lightness
  state.value.fgLightness = 50 // Reset foreground lightness
  state.value.boldKeywords = false
  state.value.italicComments = true
  state.value.boldFunctions = false
  state.value.italicStrings = true
  state.value.underlineErrors = true
  state.mode = 'dark'

  // Reset ALL individual color settings (offset, lightness, linked, multiplier)
  const colors = [
    'error',
    'warning',
    'keyword',
    'string',
    'number',
    'function',
    'constant',
    'type',
    'variable',
    'operator',
  ]
  colors.forEach((colorName) => resetColor(colorName))
}

// Dynamic gradient helpers - generate data-driven gradients for each slider
const getMultiplierGradient = (_colorName: string) => {
  // Show the color at different multiplier values from -5 to +5
  const sat = state.value.saturation / 100
  const isDark = state.mode === 'dark'
  const baseL = isDark ? 0.55 : 0.4

  // Generate 5 color stops showing the hue at different multiplier positions
  const stops = [-5, -2.5, 0, 2.5, 5].map((mult) => {
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
  const baseL = isDark ? 0.55 : 0.4

  // Get the current hue for this color
  const multiplier =
    (state.value[`${colorName}Multiplier` as keyof typeof state.value] as number) || 0
  const individualOffset =
    (state.value[`${colorName}Offset` as keyof typeof state.value] as number) || 0
  const isLinked = state.value[`${colorName}Linked` as keyof typeof state.value] as boolean

  const currentOffset = isLinked
    ? state.value.hueOffset * multiplier + individualOffset
    : individualOffset
  const currentHue = (state.value.baseHue + currentOffset + 360) % 360

  // Generate gradient showing hue range
  const stops = [-60, -30, 0, 30, 60].map((offset) => {
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
  const multiplier =
    (state.value[`${colorName}Multiplier` as keyof typeof state.value] as number) || 0
  const individualOffset =
    (state.value[`${colorName}Offset` as keyof typeof state.value] as number) || 0
  const isLinked = state.value[`${colorName}Linked` as keyof typeof state.value] as boolean

  const currentOffset = isLinked
    ? state.value.hueOffset * multiplier + individualOffset
    : individualOffset
  const hue = (state.value.baseHue + currentOffset + 360) % 360

  // Generate gradient from dark to light at this hue
  const darkL = isDark ? 0.2 : 0.1
  const lightL = isDark ? 0.85 : 0.75

  const stops = [0, 0.25, 0.5, 0.75, 1].map((t) => {
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
  const multiplier =
    (state.value[`${colorName}Multiplier` as keyof typeof state.value] as number) || 0
  const individualOffset =
    (state.value[`${colorName}Offset` as keyof typeof state.value] as number) || 0
  const isLinked = state.value[`${colorName}Linked` as keyof typeof state.value] as boolean
  const sat = state.value.saturation / 100

  const currentOffset = isLinked
    ? state.value.hueOffset * multiplier + individualOffset
    : individualOffset
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

  state.value[`${colorName}Lightness` as keyof typeof state.value] = Math.round(
    bestLightness
  ) as any
}

// Handle color picker changes - reverse-engineer the color to offset + lightness
const handleColorPicker = (colorName: string, hexColor: string) => {
  try {
    // Parse the picked color to HSL
    const color = chroma(hexColor)
    const [hue, , lightness] = color.hsl()

    // Calculate what offset would produce this hue
    let offset = hue - state.value.baseHue

    // Normalize offset to -180 to 180 range
    while (offset > 180) offset -= 360
    while (offset < -180) offset += 360

    // Convert lightness (0-1) to our scale (0-100)
    const lightnessValue = Math.round(lightness * 100)

    // Update state: unlink the color and set direct offset
    state.value[`${colorName}Linked` as keyof typeof state.value] = false as any
    state.value[`${colorName}Offset` as keyof typeof state.value] = Math.round(offset) as any
    state.value[`${colorName}Lightness` as keyof typeof state.value] = lightnessValue as any
  } catch (e) {
    console.error('Error parsing color:', e)
  }
}

const handleLock = ({ name, level }: { name: string; level: 'AA' | 'AAA' }) => {
  lockToWCAG(name, level)
}

const handlePick = ({ name, color }: { name: string; color: string }) => {
  handleColorPicker(name, color)
}
</script>

<template>
  <div class="lab" :style="{ background: colors.bg || '#000', color: colors.fg || '#fff' }">
    <ThemeSidebar
      :state="state"
      :preset-options="presetOptions"
      @load-old-preset="loadOldPreset"
      @load-preset="loadPreset"
      @show-import="showImportModal = true"
      @show-export="showExportModal = true"
      @copy-dark="copyDark"
      @copy-light="copyLight"
      @reset-all="resetAll"
    />

    <!-- Right preview area (70% width) -->
    <main class="preview-right">
      <ColorSwatches
        :colors="colors"
        :state="state"
        :highlighted-color="highlightedColor"
        :get-text-color="getTextColor"
        :get-contrast-ratio="getContrastRatio"
        :get-contrast-level="getContrastLevel"
        :get-contrast-icon="getContrastIcon"
        :get-multiplier-gradient="getMultiplierGradient"
        :get-offset-gradient="getOffsetGradient"
        :get-lightness-gradient="getLightnessGradient"
        @update:linked="updateLinked"
        @update:multiplier="updateMultiplier"
        @update:offset="updateOffset"
        @update:lightness="updateLightness"
        @color-math="({ name, math }) => applyColorMath(name, math as any)"
        @shuffle="shuffleColor"
        @reset="resetColor"
        @lock="handleLock"
        @pick="handlePick"
      />

      <!-- Live previews -->
      <PreviewGrid :columns="2">
        <CodePreview />
        <ShellPreview />
      </PreviewGrid>

      <PreviewGrid :columns="2">
        <TmuxPreview />
        <HtopPreview />
      </PreviewGrid>

      <PreviewGrid :columns="1">
        <EditorPreview />
      </PreviewGrid>

      <!-- Live config previews - both variants -->
      <PreviewGrid :columns="2" gap="16px">
        <ConfigPreview
          :colors="darkColors"
          :format="exportFormats[0] || 'ghostty'"
          mode="dark"
          :config="darkConfig"
          :additional-formats="exportFormats.length - 1"
        />
        <ConfigPreview
          :colors="lightColors"
          :format="exportFormats[0] || 'ghostty'"
          mode="light"
          :config="lightConfig"
          :additional-formats="exportFormats.length - 1"
        />
      </PreviewGrid>

      <!-- Accessibility Validation - CRITICAL -->
      <ScenarioSection
        label="wcag contrast validation - accessibility compliance"
        :mode="state.mode"
      >
        <ContrastValidator />
      </ScenarioSection>

      <!-- Additional example scenarios -->
      <ScenarioSection label="nvim - editing session with LSP diagnostics" :mode="state.mode">
        <NvimPreview />
      </ScenarioSection>

      <ScenarioSection label="lazygit - git interface" :mode="state.mode">
        <GitPreview />
      </ScenarioSection>

      <ScenarioSection label="maplibre - cyberpunk neon cartography" :mode="state.mode">
        <ClientOnly>
          <MapPreview />
        </ClientOnly>
      </ScenarioSection>

      <ScenarioSection label="simulacra palette - the hyperreal rendered" :mode="state.mode">
        <ColorReferencePreview />
      </ScenarioSection>

      <ScenarioSection label="color space - perceptual topology" :mode="state.mode">
        <div
          class="color-wheel-wrapper"
          :style="{ background: colors.bg, border: `1px solid ${colors.comment}30` }"
        >
          <ColorWheel />
        </div>
      </ScenarioSection>
    </main>

    <!-- Global drop overlay -->
    <GlobalDropOverlay v-if="isGlobalDragging" :mode="state.mode" />

    <!-- Import Modal -->
    <ImportModal
      :show="showImportModal"
      :droppedFile="droppedFile"
      @close="showImportModal = false"
      @imported="handleThemeImported"
    />

    <!-- Export Modal -->
    <ExportModal
      :show="showExportModal"
      @close="showExportModal = false"
      @export="handleModalExport"
    />

    <!-- Color Tooltip -->
    <ColorTooltip />

    <!-- Color Fidelity Indicator -->
    <ColorFidelity />

    <!-- Contrast Warning Modal -->
    <ContrastWarningModal
      :show="showContrastWarning"
      :palette="pendingExport?.palette"
      :themeName="pendingExport?.themeName || ''"
      :issues="contrastIssues"
      :onAutoFix="handleAutoFix"
      :onExportAnyway="handleExportAnyway"
      :onExportWithReport="handleExportWithReport"
      :onCancel="handleCancelExport"
    />

    <!-- Success Toast -->
    <SuccessToast :show="showSuccessToast" :message="successMessage" />
  </div>
</template>
