<script setup lang="ts">
import { serializeGhosttyTheme } from '~/utils/ghostty'

const { state, colors, darkColors, lightColors, ghosttyThemeDark, ghosttyThemeLight } = useTheme()

// Generate both configs
const darkConfig = computed(() => serializeGhosttyTheme(ghosttyThemeDark.value, 'theme-lab-dark'))
const lightConfig = computed(() => serializeGhosttyTheme(ghosttyThemeLight.value, 'theme-lab-light'))

// Reset functions for each color
const resetColor = (colorName: string) => {
  const defaults: Record<string, { offset: number, lightness: number }> = {
    error: { offset: 7, lightness: 50 },
    warning: { offset: -7, lightness: 50 },
    keyword: { offset: 10, lightness: 50 },
    string: { offset: -10, lightness: 50 },
    number: { offset: 14, lightness: 50 },
    function: { offset: -14, lightness: 50 },
    constant: { offset: 21, lightness: 50 },
    type: { offset: 17, lightness: 50 },
    variable: { offset: -17, lightness: 50 },
    operator: { offset: 3, lightness: 50 },
  }

  if (defaults[colorName]) {
    state[`${colorName}Offset` as keyof typeof state] = defaults[colorName].offset as any
    state[`${colorName}Lightness` as keyof typeof state] = defaults[colorName].lightness as any
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
  state.baseHue = preset.baseHue
  state.saturation = preset.saturation
  state.contrast = preset.contrast
  state.mode = preset.mode
  // Reset all color offsets to defaults
  const colors = ['error', 'warning', 'keyword', 'string', 'number', 'function', 'constant', 'type', 'variable', 'operator']
  colors.forEach(colorName => resetColor(colorName))
}
</script>

<template>
  <div class="lab" :style="{ background: colors.bg || '#000', color: colors.fg || '#fff' }">
    <!-- Floating frosted glass controls -->
    <aside class="floating-controls">
      <div class="header">
        <h1>theme-lab</h1>
      </div>

      <!-- Presets dropdown -->
      <div class="preset-section">
        <select @change="(e) => loadPreset((e.target as HTMLSelectElement).value as any)" class="preset-select">
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
            <button @click="resetColor('error')" class="reset-btn" title="reset">↺</button>
            <span class="offset-value">{{ state.errorOffset }}° / {{ state.errorLightness }}</span>
          </div>
          <input
            type="range"
            v-model.number="state.errorOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <input
            type="range"
            v-model.number="state.errorLightness"
            class="lightness-slider"
            min="0"
            max="100"
            step="1"
          />
          <code>{{ colors.error }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.warning }">
          <div class="swatch-info">
            <span>warning</span>
            <button @click="resetColor('warning')" class="reset-btn" title="reset">↺</button>
            <span class="offset-value">{{ state.warningOffset }}° / {{ state.warningLightness }}</span>
          </div>
          <input
            type="range"
            v-model.number="state.warningOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <input
            type="range"
            v-model.number="state.warningLightness"
            class="lightness-slider"
            min="0"
            max="100"
            step="1"
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
            <button @click="resetColor('keyword')" class="reset-btn" title="reset">↺</button>
            <span class="offset-value">{{ state.keywordOffset }}° / {{ state.keywordLightness }}</span>
          </div>
          <input
            type="range"
            v-model.number="state.keywordOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <input
            type="range"
            v-model.number="state.keywordLightness"
            class="lightness-slider"
            min="0"
            max="100"
            step="1"
          />
          <code>{{ colors.keyword }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.string }">
          <div class="swatch-info">
            <span>string</span>
            <button @click="resetColor('string')" class="reset-btn" title="reset">↺</button>
            <span class="offset-value">{{ state.stringOffset }}° / {{ state.stringLightness }}</span>
          </div>
          <input
            type="range"
            v-model.number="state.stringOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <input
            type="range"
            v-model.number="state.stringLightness"
            class="lightness-slider"
            min="0"
            max="100"
            step="1"
          />
          <code>{{ colors.string }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.number }">
          <div class="swatch-info">
            <span>number</span>
            <button @click="resetColor('number')" class="reset-btn" title="reset">↺</button>
            <span class="offset-value">{{ state.numberOffset }}° / {{ state.numberLightness }}</span>
          </div>
          <input
            type="range"
            v-model.number="state.numberOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <input
            type="range"
            v-model.number="state.numberLightness"
            class="lightness-slider"
            min="0"
            max="100"
            step="1"
          />
          <code>{{ colors.number }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.function }">
          <div class="swatch-info">
            <span>function</span>
            <button @click="resetColor('function')" class="reset-btn" title="reset">↺</button>
            <span class="offset-value">{{ state.functionOffset }}° / {{ state.functionLightness }}</span>
          </div>
          <input
            type="range"
            v-model.number="state.functionOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <input
            type="range"
            v-model.number="state.functionLightness"
            class="lightness-slider"
            min="0"
            max="100"
            step="1"
          />
          <code>{{ colors.function }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.constant }">
          <div class="swatch-info">
            <span>constant</span>
            <button @click="resetColor('constant')" class="reset-btn" title="reset">↺</button>
            <span class="offset-value">{{ state.constantOffset }}° / {{ state.constantLightness }}</span>
          </div>
          <input
            type="range"
            v-model.number="state.constantOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <input
            type="range"
            v-model.number="state.constantLightness"
            class="lightness-slider"
            min="0"
            max="100"
            step="1"
          />
          <code>{{ colors.constant }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.type }">
          <div class="swatch-info">
            <span>type</span>
            <button @click="resetColor('type')" class="reset-btn" title="reset">↺</button>
            <span class="offset-value">{{ state.typeOffset }}° / {{ state.typeLightness }}</span>
          </div>
          <input
            type="range"
            v-model.number="state.typeOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <input
            type="range"
            v-model.number="state.typeLightness"
            class="lightness-slider"
            min="0"
            max="100"
            step="1"
          />
          <code>{{ colors.type }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.variable }">
          <div class="swatch-info">
            <span>variable</span>
            <button @click="resetColor('variable')" class="reset-btn" title="reset">↺</button>
            <span class="offset-value">{{ state.variableOffset }}° / {{ state.variableLightness }}</span>
          </div>
          <input
            type="range"
            v-model.number="state.variableOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <input
            type="range"
            v-model.number="state.variableLightness"
            class="lightness-slider"
            min="0"
            max="100"
            step="1"
          />
          <code>{{ colors.variable }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.operator }">
          <div class="swatch-info">
            <span>operator</span>
            <button @click="resetColor('operator')" class="reset-btn" title="reset">↺</button>
            <span class="offset-value">{{ state.operatorOffset }}° / {{ state.operatorLightness }}</span>
          </div>
          <input
            type="range"
            v-model.number="state.operatorOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <input
            type="range"
            v-model.number="state.operatorLightness"
            class="lightness-slider"
            min="0"
            max="100"
            step="1"
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

h1 {
  font-size: 10px;
  font-weight: normal;
  margin: 0;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preset-section {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.preset-select {
  width: 100%;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 6px;
  font-family: inherit;
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.15s;
}

.preset-select:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.5);
}

.preset-select option {
  background: #000;
  color: #fff;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
  padding: 6px;
  font-family: inherit;
  font-size: 9px;
  cursor: pointer;
  transition: all 0.1s;
  text-transform: uppercase;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-primary {
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-small {
  font-size: 8px;
  padding: 4px;
}

.preview {
  padding: 0;
  overflow: auto;
  height: 100vh;
  width: 100vw;
}

.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 2px;
  margin-bottom: 4px;
  position: sticky;
  top: 0;
  z-index: 50;
  background: #000;
  padding-bottom: 4px;
}

.swatch {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #000;
  font-size: 9px;
}

.swatch.editable {
  gap: 6px;
  padding: 14px 8px;
}

.swatch-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

.reset-btn {
  background: transparent;
  border: none;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  font-size: 10px;
  padding: 0;
  line-height: 1;
  transition: color 0.15s, transform 0.15s;
  margin-left: auto;
  margin-right: 4px;
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
  font-size: 7px;
  opacity: 0.8;
  font-weight: normal;
  font-variant-numeric: tabular-nums;
}

.offset-slider {
  width: 100%;
  height: 2px;
  background: rgba(0, 0, 0, 0.2);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  margin: 2px 0;
}

.offset-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 8px;
  height: 8px;
  background: rgba(0, 0, 0, 0.8);
  cursor: pointer;
  border-radius: 0;
}

.offset-slider::-moz-range-thumb {
  width: 8px;
  height: 8px;
  background: rgba(0, 0, 0, 0.8);
  cursor: pointer;
  border-radius: 0;
  border: none;
}

.lightness-slider {
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.15);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  margin: 1px 0;
}

.lightness-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 6px;
  height: 6px;
  background: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  border-radius: 0;
}

.lightness-slider::-moz-range-thumb {
  width: 6px;
  height: 6px;
  background: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  border-radius: 0;
  border: none;
}

.swatch code {
  font-family: inherit;
  opacity: 0.7;
  font-size: 8px;
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
