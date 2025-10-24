<script setup lang="ts">
const { state } = useTheme()

const sliders = [
  { key: 'baseHue', label: 'base hue', min: 0, max: 360, step: 1 },
  { key: 'hueOffset', label: 'offset ±', min: 1, max: 45, step: 1 },
  { key: 'saturation', label: 'saturation', min: 0, max: 100, step: 1 },
  { key: 'contrast', label: 'contrast', min: 1, max: 100, step: 1 },
]

const monochromeSliders = [
  { key: 'monochromeIntensity', label: 'mono sat', min: 0, max: 100, step: 1 },
  { key: 'monochromeLightness', label: 'mono light', min: 0, max: 100, step: 1 },
]

const offsetSliders = [
  { key: 'errorOffset', label: 'error', min: -180, max: 180, step: 1 },
  { key: 'warningOffset', label: 'warning', min: -180, max: 180, step: 1 },
  { key: 'keywordOffset', label: 'keyword', min: -180, max: 180, step: 1 },
  { key: 'stringOffset', label: 'string', min: -180, max: 180, step: 1 },
  { key: 'numberOffset', label: 'number', min: -180, max: 180, step: 1 },
  { key: 'functionOffset', label: 'function', min: -180, max: 180, step: 1 },
]

const showAdvanced = ref(false)

const toggleMode = () => {
  state.mode = state.mode === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="controls">
    <div class="mode-toggle">
      <button @click="toggleMode" class="mode-btn">
        preview: {{ state.mode }}
      </button>
    </div>

    <div class="checkbox-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="state.monochromeMode" />
        <span>monochrome fg</span>
      </label>
      <label class="checkbox-label">
        <input type="checkbox" v-model="state.boldKeywords" />
        <span>bold keywords</span>
      </label>
      <label class="checkbox-label">
        <input type="checkbox" v-model="state.italicComments" />
        <span>italic comments</span>
      </label>
    </div>

    <div class="control-group" v-for="slider in sliders" :key="slider.key">
      <label>
        <span class="label">{{ slider.label }}</span>
        <span class="value">{{ state[slider.key as keyof typeof state] }}</span>
      </label>
      <input
        type="range"
        v-model.number="state[slider.key as keyof typeof state]"
        :min="slider.min"
        :max="slider.max"
        :step="slider.step"
        :class="{ 'base-hue-slider': slider.key === 'baseHue' }"
      />
    </div>

    <!-- Monochrome-specific controls -->
    <div v-if="state.monochromeMode" class="monochrome-controls">
      <div class="control-group" v-for="slider in monochromeSliders" :key="slider.key">
        <label>
          <span class="label">{{ slider.label }}</span>
          <span class="value">{{ state[slider.key as keyof typeof state] }}</span>
        </label>
        <input
          type="range"
          v-model.number="state[slider.key as keyof typeof state]"
          :min="slider.min"
          :max="slider.max"
          :step="slider.step"
        />
      </div>
    </div>

    <!-- Advanced offset controls -->
    <div class="advanced-section">
      <button @click="showAdvanced = !showAdvanced" class="advanced-toggle">
        <span>{{ showAdvanced ? '▼' : '▶' }}</span>
        <span>offset math</span>
      </button>

      <div v-if="showAdvanced" class="advanced-controls">
        <div class="control-group" v-for="slider in offsetSliders" :key="slider.key">
          <label>
            <span class="label">{{ slider.label }}</span>
            <span class="value">{{ state[slider.key as keyof typeof state] }}</span>
          </label>
          <input
            type="range"
            v-model.number="state[slider.key as keyof typeof state]"
            :min="slider.min"
            :max="slider.max"
            :step="slider.step"
          />
        </div>
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

.mode-toggle {
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 4px;
}

.mode-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 6px 10px;
  font-family: inherit;
  font-size: 8px;
  cursor: pointer;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.15s;
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
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
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  min-width: 24px;
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
