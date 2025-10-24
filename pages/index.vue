<script setup lang="ts">
import { serializeGhosttyTheme } from '~/utils/ghostty'

const { state, colors, darkColors, lightColors, ghosttyThemeDark, ghosttyThemeLight } = useTheme()

// Generate both configs
const darkConfig = computed(() => serializeGhosttyTheme(ghosttyThemeDark.value, 'theme-lab-dark'))
const lightConfig = computed(() => serializeGhosttyTheme(ghosttyThemeLight.value, 'theme-lab-light'))

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
</script>

<template>
  <div class="lab" :style="{ background: colors.bg || '#000', color: colors.fg || '#fff' }">
    <!-- Floating frosted glass controls -->
    <aside class="floating-controls">
      <div class="header">
        <h1>theme-lab</h1>
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
            <span class="offset-value">{{ state.errorOffset }}°</span>
          </div>
          <input
            type="range"
            v-model.number="state.errorOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <code>{{ colors.error }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.warning }">
          <div class="swatch-info">
            <span>warning</span>
            <span class="offset-value">{{ state.warningOffset }}°</span>
          </div>
          <input
            type="range"
            v-model.number="state.warningOffset"
            class="offset-slider"
            min="-180"
            max="180"
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
            <span class="offset-value">{{ state.keywordOffset }}°</span>
          </div>
          <input
            type="range"
            v-model.number="state.keywordOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <code>{{ colors.keyword }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.string }">
          <div class="swatch-info">
            <span>string</span>
            <span class="offset-value">{{ state.stringOffset }}°</span>
          </div>
          <input
            type="range"
            v-model.number="state.stringOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <code>{{ colors.string }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.number }">
          <div class="swatch-info">
            <span>number</span>
            <span class="offset-value">{{ state.numberOffset }}°</span>
          </div>
          <input
            type="range"
            v-model.number="state.numberOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <code>{{ colors.number }}</code>
        </div>
        <div class="swatch editable" :style="{ background: colors.function }">
          <div class="swatch-info">
            <span>function</span>
            <span class="offset-value">{{ state.functionOffset }}°</span>
          </div>
          <input
            type="range"
            v-model.number="state.functionOffset"
            class="offset-slider"
            min="-180"
            max="180"
            step="1"
          />
          <code>{{ colors.function }}</code>
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
  gap: 4px;
  padding: 10px 8px;
}

.swatch-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
