<script setup lang="ts">
const { state } = useTheme()

// Ordered by importance: base hue first, offset second (most impactful controls)
const sliders = [
  { key: 'baseHue', label: 'base hue', min: 0, max: 360, step: 1 },
  { key: 'hueOffset', label: 'offset ±', min: 1, max: 45, step: 1 },
  { key: 'saturation', label: 'dark sat', min: 0, max: 100, step: 1 },
  { key: 'lightModeSaturation', label: 'light sat', min: 0, max: 100, step: 1 },
  { key: 'contrast', label: 'contrast', min: 1, max: 100, step: 1 },
]

const monochromeSliders = [
  { key: 'monochromeIntensity', label: 'mono sat', min: 0, max: 100, step: 1 },
  { key: 'monochromeLightness', label: 'mono light', min: 0, max: 100, step: 1 },
]

const visualEffectsSliders = [
  { key: 'backgroundOpacity', label: 'bg opacity', min: 0, max: 100, step: 1 },
  { key: 'backgroundBlur', label: 'bg blur (mac)', min: 0, max: 100, step: 1 },
  { key: 'windowBlend', label: 'nvim blend', min: 0, max: 100, step: 1 },
  { key: 'popupBlend', label: 'popup blend', min: 0, max: 100, step: 1 },
]

// Programmatically generate all 23 color offset sliders for maximum granular control
// Ordered by semantic importance for code legibility (matches multiplier importance)
const colorTypes = [
  // Row 1: Core structural elements (most important)
  'keyword', 'function', 'builtin', 'type', 'string', 'number',
  // Row 2: Medium importance
  'constant', 'macro', 'tag', 'heading', 'namespace', 'property',
  // Row 3: Lower prominence + diagnostics
  'variable', 'parameter', 'operator', 'punctuation', 'comment', 'error', 'warning',
  // Row 4: Base colors
  'base', 'hint', 'fg', 'bg'
]
const offsetSliders = colorTypes.map(type => ({
  key: `${type}Offset`,
  label: type,
  min: -180,
  max: 180,
  step: 1
}))

const fixingContrast = ref(false)
const contrastFixSummary = ref<string[]>([])

// Fix all colors to meet WCAG AAA contrast (7:1)
const fixAllContrast = async () => {
  fixingContrast.value = true
  contrastFixSummary.value = []

  // Import chroma dynamically
  const chroma = (await import('chroma-js')).default

  // Colors to check (exclude bg/fg as they define the contrast baseline)
  const colorsToCheck = [
    'error', 'warning', 'keyword', 'string', 'number', 'function',
    'constant', 'type', 'variable', 'operator', 'builtin', 'parameter',
    'property', 'namespace', 'macro', 'tag', 'punctuation', 'heading',
    'comment', 'base', 'hint'
  ]

  // Temporarily disable colorblind sim to get true color values
  const originalColorblindMode = state.value.colorblindMode
  state.value.colorblindMode = 'none'

  // Get base colors without simulation
  const { colors } = useTheme()
  const bgColor = colors.value.bg
  const targetRatio = 7.0 // AAA level
  const baseColors = { ...colors.value }

  let checkedCount = 0
  let fixedCount = 0

  for (const colorName of colorsToCheck) {
    const currentColor = baseColors[colorName as keyof typeof baseColors] as string

    // Calculate current contrast
    const currentRatio = chroma.contrast(currentColor, bgColor)
    checkedCount++

    if (currentRatio >= targetRatio) {
      continue // Already compliant
    }

    fixedCount++

    // Get current values
    const multiplier = state.value[`${colorName}Multiplier` as keyof typeof state.value] as number || 0
    const individualOffset = state.value[`${colorName}Offset` as keyof typeof state.value] as number || 0
    const isLinked = state.value[`${colorName}Linked` as keyof typeof state.value] as boolean
    const sat = (state.value.mode === 'dark' ? state.value.saturation : state.value.lightModeSaturation) / 100

    const currentOffset = isLinked ? (state.value.hueOffset * multiplier) + individualOffset : individualOffset
    const hue = (state.value.baseHue + currentOffset + 360) % 360

    // Binary search for AAA-compliant lightness
    let low = 0
    let high = 100
    let bestLightness = 50

    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2
      const testColor = chroma.hsl(hue, sat, mid / 100).hex()
      const ratio = chroma.contrast(testColor, bgColor)

      if (ratio >= targetRatio) {
        bestLightness = mid
        if (state.value.mode === 'dark') {
          low = mid
        } else {
          high = mid
        }
      } else {
        if (state.value.mode === 'dark') {
          high = mid
        } else {
          low = mid
        }
      }
    }

    const oldLightness = state.value[`${colorName}Lightness` as keyof typeof state.value] as number
    const newLightness = Math.round(bestLightness)

    if (Math.abs(newLightness - oldLightness) > 1) {
      state.value[`${colorName}Lightness` as keyof typeof state.value] = newLightness as any
      contrastFixSummary.value.push(`${colorName}: L${oldLightness} → L${newLightness}`)
    }
  }

  // Restore colorblind mode
  state.value.colorblindMode = originalColorblindMode

  // Show summary
  if (contrastFixSummary.value.length === 0) {
    contrastFixSummary.value = [
      `Checked ${checkedCount} colors - all AAA compliant! ✓`,
      `(Contrast slider at ${state.value.contrast})`
    ]
  } else {
    contrastFixSummary.value.unshift(`Fixed ${fixedCount} of ${checkedCount} colors:`)
  }

  fixingContrast.value = false

  // Clear summary after 5 seconds
  setTimeout(() => {
    contrastFixSummary.value = []
  }, 5000)
}
</script>

<template>
  <div class="controls">
    <!-- Theme name + mode display -->
    <div class="theme-header" :style="{ borderBottomColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }">
      <div class="theme-name" :style="{ color: state.mode === 'dark' ? '#fff' : '#000' }">
        {{ state.themeName }}
      </div>
      <div class="mode-toggle-group">
        <button
          @click="state.mode = 'dark'"
          class="mode-toggle-btn"
          :class="{ active: state.mode === 'dark' }"
          :style="{
            color: state.mode === 'dark' ? 'rgba(150, 180, 255, 1)' : (state.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'),
            borderColor: state.mode === 'dark' ? 'rgba(100, 150, 255, 0.5)' : 'transparent',
            background: state.mode === 'dark' ? 'rgba(100, 150, 255, 0.1)' : 'transparent'
          }"
          title="Switch to dark mode"
        >
          DARK
        </button>
        <span :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)', fontSize: '8px' }">|</span>
        <button
          @click="state.mode = 'light'"
          class="mode-toggle-btn"
          :class="{ active: state.mode === 'light' }"
          :style="{
            color: state.mode === 'light' ? 'rgba(255, 200, 0, 1)' : (state.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'),
            borderColor: state.mode === 'light' ? 'rgba(255, 200, 0, 0.5)' : 'transparent',
            background: state.mode === 'light' ? 'rgba(255, 200, 0, 0.1)' : 'transparent'
          }"
          title="Switch to light mode"
        >
          LIGHT
        </button>
      </div>
    </div>

    <!-- Colorblind Simulation -->
    <div class="colorblind-section" :style="{ borderBottomColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }">
      <label class="section-label" :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }">
        COLORBLIND SIM
      </label>
      <select
        v-model="state.colorblindMode"
        class="colorblind-select"
        :style="{
          background: state.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
          borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          color: state.mode === 'dark' ? '#fff' : '#000'
        }"
      >
        <option value="none">Normal Vision</option>
        <option value="protanopia">Protanopia (no red)</option>
        <option value="deuteranopia">Deuteranopia (no green)</option>
        <option value="tritanopia">Tritanopia (no blue)</option>
        <option value="achromatopsia">Achromatopsia (grayscale)</option>
      </select>
      <div class="sim-hint" :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }">
        Preview how your theme looks with different types of color vision
      </div>
    </div>

    <!-- Fix All Contrast Button -->
    <div class="fix-contrast-section" :style="{ borderBottomColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }">
      <button
        @click="fixAllContrast"
        :disabled="fixingContrast"
        class="fix-contrast-btn"
        :style="{
          background: state.mode === 'dark' ? 'rgba(100, 255, 100, 0.15)' : 'rgba(0, 200, 0, 0.15)',
          borderColor: state.mode === 'dark' ? 'rgba(100, 255, 100, 0.4)' : 'rgba(0, 200, 0, 0.4)',
          color: state.mode === 'dark' ? 'rgba(100, 255, 100, 1)' : 'rgba(0, 150, 0, 1)',
          opacity: fixingContrast ? 0.5 : 1,
          cursor: fixingContrast ? 'wait' : 'pointer'
        }"
        title="Automatically adjust all colors to meet WCAG AAA (7:1) contrast"
      >
        {{ fixingContrast ? 'FIXING...' : 'FIX ALL CONTRAST (AAA)' }}
      </button>

      <div v-if="contrastFixSummary.length > 0" class="contrast-summary">
        <div v-for="(line, idx) in contrastFixSummary" :key="idx" class="summary-line" :style="{
          color: state.mode === 'dark' ? 'rgba(100, 255, 100, 0.9)' : 'rgba(0, 150, 0, 0.9)'
        }">
          {{ line }}
        </div>
      </div>
    </div>

    <div class="checkbox-group" :style="{ borderBottomColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }">
      <label class="checkbox-label" :style="{ color: state.mode === 'dark' ? '#fff' : '#000' }">
        <input type="checkbox" v-model="state.monochromeMode" :style="{ accentColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }" />
        <span>monochrome fg</span>
      </label>
      <label class="checkbox-label" :style="{ color: state.mode === 'dark' ? '#fff' : '#000' }">
        <input type="checkbox" v-model="state.boldKeywords" :style="{ accentColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }" />
        <span>bold keywords</span>
      </label>
      <label class="checkbox-label" :style="{ color: state.mode === 'dark' ? '#fff' : '#000' }">
        <input type="checkbox" v-model="state.italicComments" :style="{ accentColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }" />
        <span>italic comments</span>
      </label>
      <label class="checkbox-label" :style="{ color: state.mode === 'dark' ? '#fff' : '#000' }">
        <input type="checkbox" v-model="state.boldFunctions" :style="{ accentColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }" />
        <span>bold functions</span>
      </label>
      <label class="checkbox-label" :style="{ color: state.mode === 'dark' ? '#fff' : '#000' }">
        <input type="checkbox" v-model="state.italicStrings" :style="{ accentColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }" />
        <span>italic strings</span>
      </label>
      <label class="checkbox-label" :style="{ color: state.mode === 'dark' ? '#fff' : '#000' }">
        <input type="checkbox" v-model="state.underlineErrors" :style="{ accentColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }" />
        <span>underline errors</span>
      </label>
    </div>

    <div class="control-group" v-for="slider in sliders" :key="slider.key">
      <label>
        <span class="label" :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }">{{ slider.label }}</span>
        <span class="value" :style="{ color: state.mode === 'dark' ? '#fff' : '#000' }">{{ state[slider.key as keyof typeof state] }}</span>
      </label>
      <input
        type="range"
        v-model.number="state[slider.key as keyof typeof state]"
        :min="slider.min"
        :max="slider.max"
        :step="slider.step"
        :class="{ 'base-hue-slider': slider.key === 'baseHue' }"
        :style="{ background: slider.key === 'baseHue' ? undefined : (state.mode === 'dark' ? '#666' : '#ccc') }"
      />
    </div>

    <!-- Monochrome-specific controls -->
    <div v-if="state.monochromeMode" class="monochrome-controls" :style="{ borderTopColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }">
      <div class="control-group" v-for="slider in monochromeSliders" :key="slider.key">
        <label>
          <span class="label" :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }">{{ slider.label }}</span>
          <span class="value" :style="{ color: state.mode === 'dark' ? '#fff' : '#000' }">{{ state[slider.key as keyof typeof state] }}</span>
        </label>
        <input
          type="range"
          v-model.number="state[slider.key as keyof typeof state]"
          :min="slider.min"
          :max="slider.max"
          :step="slider.step"
          :style="{ background: state.mode === 'dark' ? '#666' : '#ccc' }"
        />
      </div>
    </div>

    <!-- Visual effects controls -->
    <div class="visual-effects-section" :style="{ borderTopColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }">
      <div class="section-header" :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }">
        VISUAL EFFECTS
      </div>
      <div class="control-group" v-for="slider in visualEffectsSliders" :key="slider.key">
        <label>
          <span class="label" :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }">{{ slider.label }}</span>
          <span class="value" :style="{ color: state.mode === 'dark' ? '#fff' : '#000' }">{{ state[slider.key as keyof typeof state] }}</span>
        </label>
        <input
          type="range"
          v-model.number="state[slider.key as keyof typeof state]"
          :min="slider.min"
          :max="slider.max"
          :step="slider.step"
          :style="{ background: state.mode === 'dark' ? '#666' : '#ccc' }"
        />
      </div>
    </div>

    <!-- Individual color offset controls -->
    <div class="color-offsets-section" :style="{ borderTopColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }">
      <div class="section-header" :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }">
        INDIVIDUAL COLORS
      </div>
      <div class="control-group" v-for="slider in offsetSliders" :key="slider.key">
        <label>
          <span class="label" :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }">{{ slider.label }}</span>
          <span class="value" :style="{ color: state.mode === 'dark' ? '#fff' : '#000' }">{{ state[slider.key as keyof typeof state] }}</span>
        </label>
        <input
          type="range"
          v-model.number="state[slider.key as keyof typeof state]"
          :min="slider.min"
          :max="slider.max"
          :step="slider.step"
          :style="{ background: state.mode === 'dark' ? '#666' : '#ccc' }"
        />
      </div>
    </div>

  </div>
</template>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
}

.theme-header {
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 4px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.theme-name {
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #fff;
}

.mode-toggle-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mode-toggle-btn {
  background: transparent;
  border: 1px solid transparent;
  color: rgba(255, 255, 255, 0.4);
  padding: 4px 8px;
  font-family: inherit;
  font-size: 7px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.15s;
  flex: 1;
}

.mode-toggle-btn:hover {
  opacity: 0.8;
}

.mode-toggle-btn.active {
  font-weight: bold;
  border: 1px solid;
}

.colorblind-section {
  padding: 12px 0;
  border-bottom: 1px solid;
  margin-bottom: 4px;
}

.section-label {
  display: block;
  font-size: 9px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
}

.colorblind-select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.colorblind-select:hover {
  opacity: 0.8;
}

.sim-hint {
  font-size: 8px;
  line-height: 1.4;
  margin-top: 6px;
  opacity: 0.7;
}

.fix-contrast-section {
  padding: 12px 0;
  border-bottom: 1px solid;
  margin-bottom: 4px;
}

.fix-contrast-btn {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid;
  border-radius: 6px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s;
}

.fix-contrast-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.fix-contrast-btn:active:not(:disabled) {
  transform: translateY(0);
}

.contrast-summary {
  margin-top: 8px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.summary-line {
  font-size: 9px;
  font-family: 'Monaco', 'Menlo', monospace;
  padding: 2px 0;
  letter-spacing: 0.3px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 9px;
  color: #fff;
  cursor: pointer;
  padding: 2px 0;
  transition: opacity 0.1s;
}

.checkbox-label:hover {
  opacity: 0.8;
}

.checkbox-label input[type="checkbox"] {
  width: 10px;
  height: 10px;
  cursor: pointer;
  margin: 0;
  flex-shrink: 0;
}

.checkbox-label span {
  text-transform: uppercase;
  font-size: 8px;
  letter-spacing: 0.5px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.monochrome-controls {
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-offsets-section {
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.visual-effects-section {
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-header {
  font-size: 7px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
  padding-bottom: 4px;
}

.advanced-section {
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 8px;
}

.advanced-toggle {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  padding: 4px 0;
  font-family: inherit;
  font-size: 8px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  gap: 6px;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.15s;
}

.advanced-toggle:hover {
  color: rgba(255, 255, 255, 0.8);
}

.advanced-toggle span:first-child {
  font-size: 6px;
  width: 8px;
}

.advanced-controls {
  padding-top: 8px;
  display: grid;
  grid-template-columns: repeat(18, 100px);
  gap: 12px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  padding-right: 8px;
  /* Make scrollbar visible */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
}

.advanced-controls::-webkit-scrollbar {
  height: 6px;
}

.advanced-controls::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.advanced-controls::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.advanced-controls::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.advanced-controls .control-group {
  min-width: 100px;
  flex-shrink: 0;
}

label {
  display: flex;
  justify-content: space-between;
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.label {
  color: rgba(255, 255, 255, 0.5);
}

.value {
  font-variant-numeric: tabular-nums;
  color: #fff;
  font-weight: bold;
  min-width: 36px;
  width: 36px;
  display: inline-block;
  text-align: right;
}

input[type="range"] {
  width: 100%;
  height: 2px;
  background: #666;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 8px;
  height: 8px;
  background: #fff;
  cursor: pointer;
  border-radius: 0;
}

input[type="range"]::-moz-range-thumb {
  width: 8px;
  height: 8px;
  background: #fff;
  cursor: pointer;
  border-radius: 0;
  border: none;
}

/* Base hue slider - RED and prominent like a car shifter */
.base-hue-slider {
  height: 3px !important;
  background: linear-gradient(
    to right,
    hsl(0, 80%, 50%),
    hsl(60, 80%, 50%),
    hsl(120, 80%, 50%),
    hsl(180, 80%, 50%),
    hsl(240, 80%, 50%),
    hsl(300, 80%, 50%),
    hsl(360, 80%, 50%)
  ) !important;
}

.base-hue-slider::-webkit-slider-thumb {
  width: 12px !important;
  height: 12px !important;
  background: #ff0000 !important;
  box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.3);
}

.base-hue-slider::-moz-range-thumb {
  width: 12px !important;
  height: 12px !important;
  background: #ff0000 !important;
  box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.3);
}
</style>
