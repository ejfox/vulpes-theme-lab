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

const showAdvanced = ref(false)

const toggleMode = () => {
  state.value.mode = state.value.mode === 'dark' ? 'light' : 'dark'
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
