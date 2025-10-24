<script setup lang="ts">
import { serializeGhosttyTheme } from '~/utils/ghostty'
import chroma from 'chroma-js'

const { state, colors, darkColors, lightColors, ghosttyThemeDark, ghosttyThemeLight } = useTheme()

// Generate both configs
const darkConfig = computed(() => serializeGhosttyTheme(ghosttyThemeDark.value, 'theme-lab-dark'))
const lightConfig = computed(() => serializeGhosttyTheme(ghosttyThemeLight.value, 'theme-lab-light'))

// Reset functions for each color
const resetColor = (colorName: string) => {
  const defaults: Record<string, { multiplier: number, offset: number, lightness: number, linked: boolean }> = {
    error: { multiplier: 1, offset: 0, lightness: 50, linked: true },
    warning: { multiplier: -1, offset: 0, lightness: 50, linked: true },
    keyword: { multiplier: 1.5, offset: 0, lightness: 50, linked: true },
    string: { multiplier: -1.5, offset: 0, lightness: 50, linked: true },
    number: { multiplier: 2, offset: 0, lightness: 50, linked: true },
    function: { multiplier: -2, offset: 0, lightness: 50, linked: true },
    constant: { multiplier: 3, offset: 0, lightness: 50, linked: true },
    type: { multiplier: 2.5, offset: 0, lightness: 50, linked: true },
    variable: { multiplier: -2.5, offset: 0, lightness: 50, linked: true },
    operator: { multiplier: 0.5, offset: 0, lightness: 50, linked: true },
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

const exportBoth = () => {
  downloadFile(darkConfig.value, 'theme-lab-dark')
  setTimeout(() => downloadFile(lightConfig.value, 'theme-lab-light'), 100)
}

const copyDark = async () => {
  await navigator.clipboard.writeText(darkConfig.value)
}

const copyLight = async () => {
  await navigator.clipboard.writeText(lightConfig.value)
}

// Theme presets
const presets = {
  'ayu-dark': { baseHue: 33, saturation: 60, contrast: 55, mode: 'dark' as const },
  'ayu-mirage': { baseHue: 33, saturation: 50, contrast: 50, mode: 'dark' as const },
  'catppuccin-mocha': { baseHue: 267, saturation: 75, contrast: 45, mode: 'dark' as const },
  'catppuccin-macchiato': { baseHue: 267, saturation: 70, contrast: 50, mode: 'dark' as const },
  'catppuccin-latte': { baseHue: 267, saturation: 65, contrast: 55, mode: 'light' as const },
  'tokyo-night': { baseHue: 225, saturation: 70, contrast: 48, mode: 'dark' as const },
  'nord': { baseHue: 220, saturation: 40, contrast: 45, mode: 'dark' as const },
  'gruvbox-dark': { baseHue: 35, saturation: 75, contrast: 50, mode: 'dark' as const },
  'gruvbox-light': { baseHue: 35, saturation: 70, contrast: 55, mode: 'light' as const },
}

const loadPreset = (presetName: keyof typeof presets) => {
  const preset = presets[presetName]
  state.value.baseHue = preset.baseHue
  state.value.saturation = preset.saturation
  state.value.contrast = preset.contrast
  state.value.mode = preset.mode
  // Reset all color offsets to defaults
  const colors = ['error', 'warning', 'keyword', 'string', 'number', 'function', 'constant', 'type', 'variable', 'operator']
  colors.forEach(colorName => resetColor(colorName))
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
  // Reset core settings
  state.value.baseHue = 0
  state.value.hueOffset = 7
  state.value.saturation = 85
  state.value.contrast = 50
  state.value.monochromeMode = true
  state.value.monochromeIntensity = 80
  state.value.monochromeLightness = 50
  state.value.boldKeywords = false
  state.value.italicComments = true
  state.value.mode = 'dark'

  // Reset all colors
  const colors = ['error', 'warning', 'keyword', 'string', 'number', 'function', 'constant', 'type', 'variable', 'operator']
  colors.forEach(colorName => resetColor(colorName))
}

// Dynamic gradient helpers - generate data-driven gradients for each slider
const getMultiplierGradient = (colorName: string) => {
  // Show the color at different multiplier values from -5 to +5
  const sat = state.value.saturation / 100
  const isDark = state.value.mode === 'dark'
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
  const isDark = state.value.mode === 'dark'
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
  const isDark = state.value.mode === 'dark'

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
</script>

<template>
  <div class="lab" :style="{ background: colors.bg || '#000', color: colors.fg || '#fff' }">
    <!-- Floating frosted glass controls -->
    <aside class="floating-controls" :style="{
      background: state.mode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
      boxShadow: state.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
      color: state.mode === 'dark' ? '#fff' : '#000'
    }">
      <div class="header">
        <h1>theme-lab</h1>
      </div>

      <!-- Presets dropdown -->
      <div class="preset-section">
        <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { loadPreset(el.value as any); el.value = ''; } }" class="preset-select">
          <option value="">load preset...</option>
          <option value="ayu-dark">ayu dark</option>
          <option value="ayu-mirage">ayu mirage</option>
          <option value="catppuccin-mocha">catppuccin mocha</option>
          <option value="catppuccin-macchiato">catppuccin macchiato</option>
          <option value="catppuccin-latte">catppuccin latte</option>
          <option value="tokyo-night">tokyo night</option>
          <option value="nord">nord</option>
          <option value="gruvbox-dark">gruvbox dark</option>
          <option value="gruvbox-light">gruvbox light</option>
        </select>
      </div>

      <ColorControls />

      <div class="actions">
        <button @click="exportBoth" class="btn btn-primary">export</button>
        <div class="action-row">
          <button @click="copyDark" class="btn btn-small">dark</button>
          <button @click="copyLight" class="btn btn-small">light</button>
        </div>
        <button @click="resetAll" class="btn btn-reset">reset all</button>
      </div>
    </aside>

    <!-- Main preview area -->
    <main class="preview">
      <!-- Color swatches -->
      <div class="swatches">
        <div class="swatch" :style="{ background: colors.base }">
          <span>base</span>
          <code>{{ colors.base }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.error }">
          <div class="swatch-info">
            <span>error</span>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('error', el.value as any); el.value = ''; } }" class="color-math-select" title="apply color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="split-complementary">150°</option>
              <option value="tetradic">90°</option>
              <option value="analogous">30°</option>
              <option value="monochromatic">0°</option>
            </select>
            <button @click="state.errorLinked = !state.errorLinked" class="link-btn" :class="{ linked: state.errorLinked }" title="link to global offset">{{ state.errorLinked ? 'L' : 'U' }}</button>
            <button @click="shuffleColor('error')" class="shuffle-btn" title="randomize all values">⚄</button>
            <button @click="resetColor('error')" class="reset-btn" title="reset to defaults">↺</button>
            <span class="offset-value">{{ state.errorLinked ? ((state.hueOffset * state.errorMultiplier) + state.errorOffset).toFixed(0) : state.errorOffset }}° / {{ state.errorLightness }}</span>
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
        <div class="swatch editable" :style="{ background: colors.warning }">
          <div class="swatch-info">
            <span>warning</span>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('warning', el.value as any); el.value = ''; } }" class="color-math-select" title="apply color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="split-complementary">150°</option>
              <option value="tetradic">90°</option>
              <option value="analogous">30°</option>
              <option value="monochromatic">0°</option>
            </select>
            <button @click="state.warningLinked = !state.warningLinked" class="link-btn" :class="{ linked: state.warningLinked }" title="link to global offset">{{ state.warningLinked ? 'L' : 'U' }}</button>
            <button @click="shuffleColor('warning')" class="shuffle-btn" title="randomize all values">⚄</button>
            <button @click="resetColor('warning')" class="reset-btn" title="reset to defaults">↺</button>
            <span class="offset-value">{{ state.warningLinked ? ((state.hueOffset * state.warningMultiplier) + state.warningOffset).toFixed(0) : state.warningOffset }}° / {{ state.warningLightness }}</span>
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
        <div class="swatch" :style="{ background: colors.hint }">
          <span>hint</span>
          <code>{{ colors.hint }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.keyword }">
          <div class="swatch-info">
            <span>keyword</span>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('keyword', el.value as any); el.value = ''; } }" class="color-math-select" title="apply color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="split-complementary">150°</option>
              <option value="tetradic">90°</option>
              <option value="analogous">30°</option>
              <option value="monochromatic">0°</option>
            </select>
            <button @click="state.keywordLinked = !state.keywordLinked" class="link-btn" :class="{ linked: state.keywordLinked }" title="link to global offset">{{ state.keywordLinked ? 'L' : 'U' }}</button>
            <button @click="shuffleColor('keyword')" class="shuffle-btn" title="randomize all values">⚄</button>
            <button @click="resetColor('keyword')" class="reset-btn" title="reset to defaults">↺</button>
            <span class="offset-value">{{ state.keywordLinked ? ((state.hueOffset * state.keywordMultiplier) + state.keywordOffset).toFixed(0) : state.keywordOffset }}° / {{ state.keywordLightness }}</span>
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
        <div class="swatch editable" :style="{ background: colors.string }">
          <div class="swatch-info">
            <span>string</span>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('string', el.value as any); el.value = ''; } }" class="color-math-select" title="apply color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="split-complementary">150°</option>
              <option value="tetradic">90°</option>
              <option value="analogous">30°</option>
              <option value="monochromatic">0°</option>
            </select>
            <button @click="state.stringLinked = !state.stringLinked" class="link-btn" :class="{ linked: state.stringLinked }" title="link to global offset">{{ state.stringLinked ? 'L' : 'U' }}</button>
            <button @click="shuffleColor('string')" class="shuffle-btn" title="randomize all values">⚄</button>
            <button @click="resetColor('string')" class="reset-btn" title="reset to defaults">↺</button>
            <span class="offset-value">{{ state.stringLinked ? ((state.hueOffset * state.stringMultiplier) + state.stringOffset).toFixed(0) : state.stringOffset }}° / {{ state.stringLightness }}</span>
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
        <div class="swatch editable" :style="{ background: colors.number }">
          <div class="swatch-info">
            <span>number</span>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('number', el.value as any); el.value = ''; } }" class="color-math-select" title="apply color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="split-complementary">150°</option>
              <option value="tetradic">90°</option>
              <option value="analogous">30°</option>
              <option value="monochromatic">0°</option>
            </select>
            <button @click="state.numberLinked = !state.numberLinked" class="link-btn" :class="{ linked: state.numberLinked }" title="link to global offset">{{ state.numberLinked ? 'L' : 'U' }}</button>
            <button @click="shuffleColor('number')" class="shuffle-btn" title="randomize all values">⚄</button>
            <button @click="resetColor('number')" class="reset-btn" title="reset to defaults">↺</button>
            <span class="offset-value">{{ state.numberLinked ? ((state.hueOffset * state.numberMultiplier) + state.numberOffset).toFixed(0) : state.numberOffset }}° / {{ state.numberLightness }}</span>
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
        <div class="swatch editable" :style="{ background: colors.function }">
          <div class="swatch-info">
            <span>function</span>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('function', el.value as any); el.value = ''; } }" class="color-math-select" title="apply color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="split-complementary">150°</option>
              <option value="tetradic">90°</option>
              <option value="analogous">30°</option>
              <option value="monochromatic">0°</option>
            </select>
            <button @click="state.functionLinked = !state.functionLinked" class="link-btn" :class="{ linked: state.functionLinked }" title="link to global offset">{{ state.functionLinked ? 'L' : 'U' }}</button>
            <button @click="shuffleColor('function')" class="shuffle-btn" title="randomize all values">⚄</button>
            <button @click="resetColor('function')" class="reset-btn" title="reset to defaults">↺</button>
            <span class="offset-value">{{ state.functionLinked ? ((state.hueOffset * state.functionMultiplier) + state.functionOffset).toFixed(0) : state.functionOffset }}° / {{ state.functionLightness }}</span>
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
        <div class="swatch editable" :style="{ background: colors.constant }">
          <div class="swatch-info">
            <span>constant</span>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('constant', el.value as any); el.value = ''; } }" class="color-math-select" title="apply color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="split-complementary">150°</option>
              <option value="tetradic">90°</option>
              <option value="analogous">30°</option>
              <option value="monochromatic">0°</option>
            </select>
            <button @click="state.constantLinked = !state.constantLinked" class="link-btn" :class="{ linked: state.constantLinked }" title="link to global offset">{{ state.constantLinked ? 'L' : 'U' }}</button>
            <button @click="shuffleColor('constant')" class="shuffle-btn" title="randomize all values">⚄</button>
            <button @click="resetColor('constant')" class="reset-btn" title="reset to defaults">↺</button>
            <span class="offset-value">{{ state.constantLinked ? ((state.hueOffset * state.constantMultiplier) + state.constantOffset).toFixed(0) : state.constantOffset }}° / {{ state.constantLightness }}</span>
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
        <div class="swatch editable" :style="{ background: colors.type }">
          <div class="swatch-info">
            <span>type</span>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('type', el.value as any); el.value = ''; } }" class="color-math-select" title="apply color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="split-complementary">150°</option>
              <option value="tetradic">90°</option>
              <option value="analogous">30°</option>
              <option value="monochromatic">0°</option>
            </select>
            <button @click="state.typeLinked = !state.typeLinked" class="link-btn" :class="{ linked: state.typeLinked }" title="link to global offset">{{ state.typeLinked ? 'L' : 'U' }}</button>
            <button @click="shuffleColor('type')" class="shuffle-btn" title="randomize all values">⚄</button>
            <button @click="resetColor('type')" class="reset-btn" title="reset to defaults">↺</button>
            <span class="offset-value">{{ state.typeLinked ? ((state.hueOffset * state.typeMultiplier) + state.typeOffset).toFixed(0) : state.typeOffset }}° / {{ state.typeLightness }}</span>
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
        <div class="swatch editable" :style="{ background: colors.variable }">
          <div class="swatch-info">
            <span>variable</span>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('variable', el.value as any); el.value = ''; } }" class="color-math-select" title="apply color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="split-complementary">150°</option>
              <option value="tetradic">90°</option>
              <option value="analogous">30°</option>
              <option value="monochromatic">0°</option>
            </select>
            <button @click="state.variableLinked = !state.variableLinked" class="link-btn" :class="{ linked: state.variableLinked }" title="link to global offset">{{ state.variableLinked ? 'L' : 'U' }}</button>
            <button @click="shuffleColor('variable')" class="shuffle-btn" title="randomize all values">⚄</button>
            <button @click="resetColor('variable')" class="reset-btn" title="reset to defaults">↺</button>
            <span class="offset-value">{{ state.variableLinked ? ((state.hueOffset * state.variableMultiplier) + state.variableOffset).toFixed(0) : state.variableOffset }}° / {{ state.variableLightness }}</span>
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
        <div class="swatch editable" :style="{ background: colors.operator }">
          <div class="swatch-info">
            <span>operator</span>
            <select @change="(e) => { const el = e.target as HTMLSelectElement; if (el.value) { applyColorMath('operator', el.value as any); el.value = ''; } }" class="color-math-select" title="apply color theory">
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="split-complementary">150°</option>
              <option value="tetradic">90°</option>
              <option value="analogous">30°</option>
              <option value="monochromatic">0°</option>
            </select>
            <button @click="state.operatorLinked = !state.operatorLinked" class="link-btn" :class="{ linked: state.operatorLinked }" title="link to global offset">{{ state.operatorLinked ? 'L' : 'U' }}</button>
            <button @click="shuffleColor('operator')" class="shuffle-btn" title="randomize all values">⚄</button>
            <button @click="resetColor('operator')" class="reset-btn" title="reset to defaults">↺</button>
            <span class="offset-value">{{ state.operatorLinked ? ((state.hueOffset * state.operatorMultiplier) + state.operatorOffset).toFixed(0) : state.operatorOffset }}° / {{ state.operatorLightness }}</span>
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
        <div class="swatch" :style="{ background: colors.comment }">
          <span>comment</span>
          <code>{{ colors.comment }}</code>
        </div>
        <div class="swatch" :style="{ background: colors.fg }">
          <span>foreground</span>
          <code>{{ colors.fg }}</code>
        </div>
        <div class="swatch" :style="{ background: colors.bg, border: '1px solid ' + colors.comment }">
          <span :style="{ color: colors.fg }">background</span>
          <code :style="{ color: colors.fg }">{{ colors.bg }}</code>
        </div>
      </div>

      <!-- Live previews -->
      <div class="previews">
        <CodePreview />
        <TmuxPreview />
      </div>

      <!-- Live config previews - both variants -->
      <div class="configs">
        <div class="config-preview">
          <div class="config-header">theme-lab-dark</div>
          <pre class="config-content" :style="{ color: colors.string }">{{ darkConfig }}</pre>
        </div>
        <div class="config-preview">
          <div class="config-header">theme-lab-light</div>
          <pre class="config-content" :style="{ color: colors.string }">{{ lightConfig }}</pre>
        </div>
      </div>

      <!-- Additional example scenarios -->
      <div class="scenario-section">
        <div class="scenario-label">lazygit - git interface</div>
        <GitPreview />
      </div>

      <div class="scenario-section">
        <div class="scenario-label">nvim - editing session</div>
        <NvimPreview />
      </div>

      <div class="scenario-section">
        <div class="scenario-label">htop - system monitor</div>
        <HtopPreview />
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
  overflow: hidden;
}

.floating-controls {
  position: fixed;
  bottom: 8px;
  right: 8px;
  width: 240px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0;
  padding: 16px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
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
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid currentColor;
  border-opacity: 0.1;
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.btn {
  background: transparent;
  border: 1px solid currentColor;
  border-opacity: 0.3;
  color: inherit;
  padding: 6px;
  font-family: inherit;
  font-size: 9px;
  cursor: pointer;
  transition: all 0.1s;
  text-transform: uppercase;
}

.btn:hover {
  background: currentColor;
  background-opacity: 0.2;
  border-opacity: 0.5;
}

.btn-primary {
  border-opacity: 0.5;
}

.btn-small {
  font-size: 8px;
  padding: 4px;
}

.btn-reset {
  border-color: rgba(255, 100, 100, 0.4);
  color: rgba(255, 100, 100, 0.8);
  margin-top: 4px;
}

.btn-reset:hover {
  background: rgba(255, 100, 100, 0.15);
  border-color: rgba(255, 100, 100, 0.6);
  color: rgba(255, 100, 100, 1);
}

.preview {
  padding: 0;
  overflow: auto;
  height: 100vh;
  width: 100vw;
}

.swatches {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  margin-bottom: 8px;
  position: sticky;
  top: 0;
  z-index: 50;
  background: #000;
  padding-bottom: 8px;
}

.swatch {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #000;
  font-size: 10px;
}

.swatch.editable {
  gap: 8px;
  padding: 16px 12px;
}

.swatch-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

.color-math-select {
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.6);
  font-family: inherit;
  font-size: 8px;
  padding: 2px 4px;
  cursor: pointer;
  text-transform: lowercase;
  border-radius: 2px;
  transition: all 0.15s;
}

.color-math-select:hover {
  background: rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.4);
}

.link-btn {
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.4);
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
  background: rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.4);
  color: rgba(0, 0, 0, 0.8);
}

.link-btn:hover {
  background: rgba(0, 0, 0, 0.15);
  border-color: rgba(0, 0, 0, 0.5);
  color: rgba(0, 0, 0, 1);
}

.shuffle-btn {
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  font-size: 10px;
  padding: 2px 4px;
  line-height: 1;
  transition: all 0.15s;
  border-radius: 2px;
}

.shuffle-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.4);
  color: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.reset-btn {
  background: transparent;
  border: none;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  line-height: 1;
  transition: color 0.15s, transform 0.15s;
  margin-left: auto;
  margin-right: 6px;
}

.reset-btn:hover {
  color: rgba(0, 0, 0, 0.9);
  transform: rotate(180deg);
}

.swatch span {
  font-weight: bold;
  text-transform: uppercase;
}

.offset-value {
  font-size: 8px;
  opacity: 0.8;
  font-weight: normal;
  font-variant-numeric: tabular-nums;
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
</style>
