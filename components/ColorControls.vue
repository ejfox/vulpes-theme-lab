<script setup lang="ts">
const { state } = useTheme()

// Generate rainbow gradient programmatically
const baseHueGradient = `linear-gradient(to right, ${
  Array.from({ length: 13 }, (_, i) => `hsl(${i * 30}, 85%, 55%)`).join(', ')
})`

// Ordered by importance: base hue first, offset second (most impactful controls)
const sliders = [
  {
    key: 'baseHue',
    label: 'base hue',
    min: 0,
    max: 360,
    step: 1,
    variant: 'primary' as const,
    gradient: baseHueGradient,
  },
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

// Map color intensity controls - how vivid each map feature is
const mapColorIntensity = [
  {
    key: 'mapWaterSaturation',
    label: 'water blue',
    min: 0,
    max: 100,
    step: 1,
    tooltip: 'How blue is the water? 0 = gray like background, 100 = vivid blue ocean',
  },
  {
    key: 'mapParkSaturation',
    label: 'park green',
    min: 0,
    max: 100,
    step: 1,
    tooltip: 'How green are parks? 0 = gray, 100 = bright grass green',
  },
  {
    key: 'mapRoadSaturation',
    label: 'road color',
    min: 0,
    max: 100,
    step: 1,
    tooltip: 'How colorful are roads? 0 = all gray, 100 = orange/yellow highways',
  },
  {
    key: 'mapBuildingSaturation',
    label: 'building color',
    min: 0,
    max: 100,
    step: 1,
    tooltip: 'How colorful are buildings? 0 = gray structures, 100 = colorful',
  },
]

// Advanced: Fine-tune map feature hues (optional tweaking)
const mapAdvancedHues = [
  {
    key: 'mapWaterOffset',
    label: 'water shift',
    min: -180,
    max: 180,
    step: 1,
    tooltip: 'Shift water hue. Blue is 200°. Try 180° for cyan, 220° for purple-blue',
  },
  {
    key: 'mapParkOffset',
    label: 'park shift',
    min: -180,
    max: 180,
    step: 1,
    tooltip: 'Shift park hue. Green is 120°. Try 100° for yellow-green, 140° for blue-green',
  },
  {
    key: 'mapRoadMotorwayOffset',
    label: 'highway shift',
    min: -180,
    max: 180,
    step: 1,
    tooltip: 'Shift highway hue. Orange is 20°. Try 40° for yellow, 0° for red',
  },
]

// Color types ordered by semantic importance for code legibility
const colorTypes = [
  // Core structural elements
  'keyword', 'function', 'builtin', 'type', 'string', 'number',
  // Medium importance
  'constant', 'macro', 'tag', 'heading', 'namespace', 'property',
  // Lower prominence + diagnostics
  'variable', 'parameter', 'operator', 'punctuation', 'comment', 'error', 'warning',
  // Base colors
  'base', 'hint', 'fg', 'bg',
]

const offsetSliders = colorTypes.map((type) => ({
  key: `${type}Offset`,
  label: type,
  min: -180,
  max: 180,
  step: 1,
}))

// Style toggles
const styleToggles = [
  { key: 'monochromeMode', label: 'monochrome fg' },
  { key: 'boldKeywords', label: 'bold keywords' },
  { key: 'italicComments', label: 'italic comments' },
  { key: 'boldFunctions', label: 'bold functions' },
  { key: 'italicStrings', label: 'italic strings' },
  { key: 'underlineErrors', label: 'underline errors' },
]

// Mode-aware color helpers
const modeColor = (dark: string, light: string) => state.value.mode === 'dark' ? dark : light
const borderColor = computed(() => modeColor('rgba(255, 255, 255, 0.1)', 'rgba(0, 0, 0, 0.1)'))
const textColor = computed(() => modeColor('#fff', '#000'))
const mutedColor = computed(() => modeColor('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.5)'))
const accentColor = computed(() => modeColor('rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 0.8)'))

const fixingContrast = ref(false)
const contrastFixSummary = ref<string[]>([])

// Fix all colors to meet WCAG AAA contrast (7:1)
const fixAllContrast = async () => {
  fixingContrast.value = true
  contrastFixSummary.value = []

  const chroma = (await import('chroma-js')).default
  const colorsToCheck = colorTypes.filter((c) => c !== 'fg' && c !== 'bg')

  // Temporarily disable colorblind sim to get true color values
  const originalColorblindMode = state.value.colorblindMode
  state.value.colorblindMode = 'none'

  const { colors } = useTheme()
  const bgColor = colors.value.bg
  const targetRatio = 7.0
  const baseColors = { ...colors.value }
  const isDark = state.value.mode === 'dark'
  const sat = (isDark ? state.value.saturation : state.value.lightModeSaturation) / 100

  let checkedCount = 0
  let fixedCount = 0

  for (const colorName of colorsToCheck) {
    const currentColor = baseColors[colorName as keyof typeof baseColors] as string
    const currentRatio = chroma.contrast(currentColor, bgColor)
    checkedCount++

    if (currentRatio >= targetRatio) continue

    fixedCount++

    const s = state.value as Record<string, any>
    const multiplier = s[`${colorName}Multiplier`] || 0
    const individualOffset = s[`${colorName}Offset`] || 0
    const isLinked = s[`${colorName}Linked`] as boolean
    const currentOffset = isLinked ? state.value.hueOffset * multiplier + individualOffset : individualOffset
    const hue = (state.value.baseHue + currentOffset + 360) % 360

    // Binary search for AAA-compliant lightness
    let low = 0, high = 100, bestLightness = 50
    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2
      const testColor = chroma.hsl(hue, sat, mid / 100).hex()
      const ratio = chroma.contrast(testColor, bgColor)
      if (ratio >= targetRatio) {
        bestLightness = mid
        isDark ? (low = mid) : (high = mid)
      } else {
        isDark ? (high = mid) : (low = mid)
      }
    }

    const oldLightness = s[`${colorName}Lightness`] as number
    const newLightness = Math.round(bestLightness)

    if (Math.abs(newLightness - oldLightness) > 1) {
      s[`${colorName}Lightness`] = newLightness
      contrastFixSummary.value.push(`${colorName}: L${oldLightness} -> L${newLightness}`)
    }
  }

  state.value.colorblindMode = originalColorblindMode

  if (contrastFixSummary.value.length === 0) {
    contrastFixSummary.value = [
      `Checked ${checkedCount} colors - all AAA compliant`,
      `(Contrast slider at ${state.value.contrast})`,
    ]
  } else {
    contrastFixSummary.value.unshift(`Fixed ${fixedCount} of ${checkedCount} colors:`)
  }

  fixingContrast.value = false
  setTimeout(() => { contrastFixSummary.value = [] }, 5000)
}
</script>

<template>
  <div class="controls">
    <!-- Theme name + mode display -->
    <div class="theme-header" :style="{ borderBottomColor: borderColor }">
      <div class="theme-name" :style="{ color: textColor }">{{ state.themeName }}</div>
      <div class="mode-toggle-group">
        <button
          @click="state.mode = 'dark'"
          class="mode-toggle-btn"
          :class="{ active: state.mode === 'dark' }"
          :style="{
            color: state.mode === 'dark' ? 'rgba(150, 180, 255, 1)' : 'rgba(0, 0, 0, 0.4)',
            borderColor: state.mode === 'dark' ? 'rgba(100, 150, 255, 0.5)' : 'transparent',
            background: state.mode === 'dark' ? 'rgba(100, 150, 255, 0.1)' : 'transparent',
          }"
          title="Switch to dark mode"
        >
          DARK
        </button>
        <span :style="{ color: modeColor('rgba(255, 255, 255, 0.2)', 'rgba(0, 0, 0, 0.2)'), fontSize: '8px' }">|</span>
        <button
          @click="state.mode = 'light'"
          class="mode-toggle-btn"
          :class="{ active: state.mode === 'light' }"
          :style="{
            color: state.mode === 'light' ? 'rgba(255, 200, 0, 1)' : modeColor('rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)'),
            borderColor: state.mode === 'light' ? 'rgba(255, 200, 0, 0.5)' : 'transparent',
            background: state.mode === 'light' ? 'rgba(255, 200, 0, 0.1)' : 'transparent',
          }"
          title="Switch to light mode"
        >
          LIGHT
        </button>
      </div>
    </div>

    <!-- Colorblind Simulation -->
    <div class="colorblind-section" :style="{ borderBottomColor: borderColor }">
      <label class="section-label" :style="{ color: modeColor('rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.7)') }">
        COLORBLIND SIM
      </label>
      <select
        v-model="state.colorblindMode"
        class="colorblind-select"
        :style="{
          background: modeColor('rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.3)'),
          borderColor: modeColor('rgba(255, 255, 255, 0.3)', 'rgba(0, 0, 0, 0.3)'),
          color: textColor,
        }"
      >
        <option value="none">Normal Vision</option>
        <option value="protanopia">Protanopia (no red)</option>
        <option value="deuteranopia">Deuteranopia (no green)</option>
        <option value="tritanopia">Tritanopia (no blue)</option>
        <option value="achromatopsia">Achromatopsia (grayscale)</option>
      </select>
      <div class="sim-hint" :style="{ color: mutedColor }">
        Preview how your theme looks with different types of color vision
      </div>
    </div>

    <!-- Fix All Contrast Button -->
    <div class="fix-contrast-section" :style="{ borderBottomColor: borderColor }">
      <button
        @click="fixAllContrast"
        :disabled="fixingContrast"
        class="fix-contrast-btn"
        :style="{
          background: modeColor('rgba(100, 255, 100, 0.15)', 'rgba(0, 200, 0, 0.15)'),
          borderColor: modeColor('rgba(100, 255, 100, 0.4)', 'rgba(0, 200, 0, 0.4)'),
          color: modeColor('rgba(100, 255, 100, 1)', 'rgba(0, 150, 0, 1)'),
          opacity: fixingContrast ? 0.5 : 1,
          cursor: fixingContrast ? 'wait' : 'pointer',
        }"
        title="Automatically adjust all colors to meet WCAG AAA (7:1) contrast"
      >
        {{ fixingContrast ? 'FIXING...' : 'FIX ALL CONTRAST (AAA)' }}
      </button>

      <div v-if="contrastFixSummary.length > 0" class="contrast-summary">
        <div
          v-for="(line, idx) in contrastFixSummary"
          :key="idx"
          class="summary-line"
          :style="{ color: modeColor('rgba(100, 255, 100, 0.9)', 'rgba(0, 150, 0, 0.9)') }"
        >
          {{ line }}
        </div>
      </div>
    </div>

    <div class="checkbox-group" :style="{ borderBottomColor: borderColor }">
      <label
        v-for="toggle in styleToggles"
        :key="toggle.key"
        class="checkbox-label"
        :style="{ color: textColor }"
      >
        <input
          type="checkbox"
          v-model="state[toggle.key as keyof typeof state]"
          :style="{ accentColor: accentColor }"
        />
        <span>{{ toggle.label }}</span>
      </label>
    </div>

    <BaseSlider
      v-for="slider in sliders"
      :key="slider.key"
      v-model="state[slider.key as keyof typeof state]"
      :label="slider.label"
      :min="slider.min"
      :max="slider.max"
      :step="slider.step"
      :variant="slider.variant"
      :gradient="slider.gradient"
    />

    <!-- Monochrome-specific controls -->
    <div v-if="state.monochromeMode" class="monochrome-controls" :style="{ borderTopColor: borderColor }">
      <BaseSlider
        v-for="slider in monochromeSliders"
        :key="slider.key"
        v-model="state[slider.key as keyof typeof state]"
        :label="slider.label"
        :min="slider.min"
        :max="slider.max"
        :step="slider.step"
      />
    </div>

    <!-- Visual effects controls -->
    <div class="visual-effects-section" :style="{ borderTopColor: borderColor }">
      <div class="section-header" :style="{ color: mutedColor }">VISUAL EFFECTS</div>
      <BaseSlider
        v-for="slider in visualEffectsSliders"
        :key="slider.key"
        v-model="state[slider.key as keyof typeof state]"
        :label="slider.label"
        :min="slider.min"
        :max="slider.max"
        :step="slider.step"
      />
    </div>

    <!-- MapLibre color controls -->
    <div class="maplibre-section" :style="{ borderTopColor: borderColor }">
      <div class="section-header" :style="{ color: mutedColor }">MAP COLORS</div>

      <!-- Main map color intensity controls -->
      <BaseSlider
        v-for="slider in mapColorIntensity"
        :key="slider.key"
        v-model="state[slider.key as keyof typeof state]"
        :label="slider.label"
        :min="slider.min"
        :max="slider.max"
        :step="slider.step"
        :tooltip="slider.tooltip"
      />

      <!-- Advanced hue controls (optional) -->
      <details class="advanced-controls">
        <summary :style="{ color: modeColor('rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)') }">
          advanced hue shifts
        </summary>
        <BaseSlider
          v-for="slider in mapAdvancedHues"
          :key="slider.key"
          v-model="state[slider.key as keyof typeof state]"
          :label="slider.label"
          :min="slider.min"
          :max="slider.max"
          :step="slider.step"
          :tooltip="slider.tooltip"
          variant="compact"
        />
      </details>
    </div>

    <!-- Individual color offset controls -->
    <div class="color-offsets-section" :style="{ borderTopColor: borderColor }">
      <div class="section-header" :style="{ color: mutedColor }">INDIVIDUAL COLORS</div>
      <BaseSlider
        v-for="slider in offsetSliders"
        :key="slider.key"
        v-model="state[slider.key as keyof typeof state]"
        :label="slider.label"
        :min="slider.min"
        :max="slider.max"
        :step="slider.step"
        variant="compact"
      />
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

.checkbox-label input[type='checkbox'] {
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
  gap: 4px;
  padding: 4px 0;
  transition: all 0.2s ease;
}

.control-group:hover {
  background: rgba(255, 255, 255, 0.02);
  padding: 6px 4px;
  margin: -2px -4px;
  border-radius: 4px;
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

.maplibre-section {
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.advanced-controls {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.advanced-controls summary {
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  user-select: none;
  padding: 4px 0;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.advanced-controls summary:hover {
  opacity: 1;
}

.advanced-controls[open] summary {
  opacity: 1;
  margin-bottom: 8px;
}

.section-header {
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 8px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  transition: all 0.2s ease;
}

.section-header:hover {
  background: rgba(255, 255, 255, 0.08);
  border-left-color: rgba(255, 255, 255, 0.5);
  padding-left: 12px;
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
  align-items: center;
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 2px;
}

.label {
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.2s ease;
}

.control-group:hover .label {
  color: rgba(255, 255, 255, 0.8);
}

.value {
  font-variant-numeric: tabular-nums;
  color: #fff;
  font-weight: 600;
  min-width: 36px;
  width: 36px;
  display: inline-block;
  text-align: right;
  padding: 2px 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  font-size: 9px;
  transition: all 0.2s ease;
}

/* Note: Slider styles now in BaseSlider.vue component */
</style>
