<script setup lang="ts">
interface Props {
  mode?: 'dark' | 'light'
  exportFormats?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'dark',
  exportFormats: () => ['ghostty']
})

const emit = defineEmits<{
  'load-preset': [preset: string]
  'select-all-formats': []
  'export-both': []
  'export-dark': []
  'export-light': []
  'copy-dark': []
  'copy-light': []
  'reset-all': []
  'update:exportFormats': [formats: string[]]
}>()

// Local v-model for export formats
const selectedFormats = computed({
  get: () => props.exportFormats,
  set: (value) => emit('update:exportFormats', value)
})

const handlePresetChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  if (target.value) {
    emit('load-preset', target.value)
    target.value = '' // Reset dropdown
  }
}

// Computed styles based on mode
const isDark = computed(() => props.mode === 'dark')

const styles = computed(() => ({
  background: isDark.value ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
  borderColor: isDark.value ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
  boxShadow: isDark.value ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
  color: isDark.value ? '#fff' : '#000',
  dividerColor: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  mutedColor: isDark.value ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
  inputBorder: isDark.value ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
  buttonBorder: isDark.value ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
  primaryBg: isDark.value ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
  primaryBorder: isDark.value ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
  accentColor: isDark.value ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'
}))
</script>

<template>
  <aside class="theme-sidebar" :style="{
    background: styles.background,
    borderColor: styles.borderColor,
    boxShadow: styles.boxShadow,
    color: styles.color
  }">
    <!-- Branding Header -->
    <header class="sidebar-header" :style="{ borderBottomColor: styles.dividerColor }">
      <h1 class="brand-title">theme-lab</h1>
      <p class="brand-subtitle" :style="{ color: styles.mutedColor }">
        terminal color designer
      </p>
    </header>

    <!-- Preset Selector Section -->
    <section class="preset-section" :style="{ borderBottomColor: styles.dividerColor }">
      <label class="section-label" :style="{ color: styles.mutedColor }">
        quick start
      </label>
      <select
        @change="handlePresetChange"
        class="preset-select"
        :style="{
          borderColor: styles.inputBorder,
          color: styles.color,
          background: 'transparent'
        }"
      >
        <option value="">load preset...</option>
        <option value="catppuccin-mocha">catppuccin mocha (dark)</option>
        <option value="catppuccin-latte">catppuccin latte (light)</option>
        <option value="ayu-dark">ayu dark</option>
        <option value="ayu-light">ayu light</option>
      </select>
    </section>

    <!-- Color Controls Slot -->
    <section class="controls-section">
      <slot />
    </section>

    <!-- Export Actions Section -->
    <section class="export-section" :style="{ borderTopColor: styles.dividerColor }">
      <!-- Format Selection -->
      <div class="export-group" :style="{ borderBottomColor: styles.dividerColor }">
        <label class="section-label" :style="{ color: styles.mutedColor }">
          export formats
        </label>
        <div class="format-grid">
          <label class="format-option" :style="{ color: styles.color }">
            <input
              type="checkbox"
              v-model="selectedFormats"
              value="ghostty"
              :style="{ accentColor: styles.accentColor }"
            />
            <span>ghostty</span>
          </label>
          <label class="format-option" :style="{ color: styles.color }">
            <input
              type="checkbox"
              v-model="selectedFormats"
              value="iterm"
              :style="{ accentColor: styles.accentColor }"
            />
            <span>iterm2</span>
          </label>
          <label class="format-option" :style="{ color: styles.color }">
            <input
              type="checkbox"
              v-model="selectedFormats"
              value="tmux"
              :style="{ accentColor: styles.accentColor }"
            />
            <span>tmux</span>
          </label>
          <label class="format-option" :style="{ color: styles.color }">
            <input
              type="checkbox"
              v-model="selectedFormats"
              value="neovim"
              :style="{ accentColor: styles.accentColor }"
            />
            <span>neovim</span>
          </label>
          <label class="format-option" :style="{ color: styles.color }">
            <input
              type="checkbox"
              v-model="selectedFormats"
              value="lazygit"
              :style="{ accentColor: styles.accentColor }"
            />
            <span>lazygit</span>
          </label>
        </div>
        <button
          @click="emit('select-all-formats')"
          class="btn-utility"
          :style="{
            borderColor: styles.buttonBorder,
            color: styles.mutedColor
          }"
        >
          select all
        </button>
      </div>

      <!-- Download Section -->
      <div class="export-group" :style="{ borderBottomColor: styles.dividerColor }">
        <label class="section-label" :style="{ color: styles.mutedColor }">
          download files
        </label>
        <button
          @click="emit('export-both')"
          class="btn btn-primary"
          :style="{
            background: styles.primaryBg,
            borderColor: styles.primaryBorder,
            color: styles.color
          }"
          title="Download both dark and light theme files"
        >
          BOTH THEMES
        </button>
        <div class="button-row">
          <button
            @click="emit('export-dark')"
            class="btn btn-secondary"
            :style="{
              borderColor: styles.buttonBorder,
              color: styles.color
            }"
            title="Download dark theme file"
          >
            DARK
          </button>
          <button
            @click="emit('export-light')"
            class="btn btn-secondary"
            :style="{
              borderColor: styles.buttonBorder,
              color: styles.color
            }"
            title="Download light theme file"
          >
            LIGHT
          </button>
        </div>
      </div>

      <!-- Copy Section -->
      <div class="export-group" :style="{ borderBottomColor: styles.dividerColor }">
        <label class="section-label" :style="{ color: styles.mutedColor }">
          copy to clipboard
        </label>
        <div class="button-row">
          <button
            @click="emit('copy-dark')"
            class="btn btn-secondary"
            :style="{
              borderColor: styles.buttonBorder,
              color: styles.color
            }"
            title="Copy dark theme config to clipboard"
          >
            COPY DARK
          </button>
          <button
            @click="emit('copy-light')"
            class="btn btn-secondary"
            :style="{
              borderColor: styles.buttonBorder,
              color: styles.color
            }"
            title="Copy light theme config to clipboard"
          >
            COPY LIGHT
          </button>
        </div>
      </div>

      <!-- Reset Section -->
      <div class="export-group">
        <button
          @click="emit('reset-all')"
          class="btn btn-reset"
          title="Reset all values to defaults"
        >
          RESET ALL
        </button>
      </div>
    </section>
  </aside>
</template>

<style scoped>
.theme-sidebar {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 280px;
  max-height: calc(100vh - 40px);
  border: 1px solid;
  overflow-y: auto;
  overflow-x: hidden;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
}

/* Custom scrollbar */
.theme-sidebar::-webkit-scrollbar {
  width: 8px;
}

.theme-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.theme-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.theme-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Header Section */
.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid;
  flex-shrink: 0;
}

.brand-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 4px 0;
}

.brand-subtitle {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  opacity: 0.7;
}

/* Preset Section */
.preset-section {
  padding: 16px;
  border-bottom: 1px solid;
  flex-shrink: 0;
}

.section-label {
  display: block;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 600;
  margin-bottom: 10px;
}

.preset-select {
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid;
  background: transparent;
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.preset-select:hover {
  opacity: 0.8;
}

.preset-select:focus {
  outline: none;
  opacity: 1;
  border-width: 2px;
}

/* Controls Section - Just a container for slot */
.controls-section {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

/* Export Section */
.export-section {
  border-top: 1px solid;
  flex-shrink: 0;
}

.export-group {
  padding: 16px;
  border-bottom: 1px solid;
}

.export-group:last-child {
  border-bottom: none;
}

/* Format Grid */
.format-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}

.format-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  cursor: pointer;
  min-height: 32px;
  padding: 6px 0;
  transition: opacity 0.15s;
}

.format-option:hover {
  opacity: 0.8;
}

.format-option input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin: 0;
  flex-shrink: 0;
}

.format-option span {
  text-transform: uppercase;
  font-size: 9px;
  letter-spacing: 0.5px;
  font-weight: 500;
}

/* Buttons */
.btn {
  width: 100%;
  min-height: 44px;
  padding: 12px 16px;
  border: 1px solid;
  background: transparent;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  border-width: 2px;
  margin-bottom: 8px;
}

.btn-primary:hover {
  border-width: 2px;
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
}

.btn-secondary {
  font-size: 10px;
}

.btn-utility {
  width: 100%;
  min-height: 36px;
  padding: 8px 12px;
  border: 1px solid;
  background: transparent;
  font-family: inherit;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-utility:hover {
  opacity: 0.8;
}

.btn-reset {
  font-size: 10px;
  border-color: rgba(255, 100, 100, 0.5) !important;
  color: rgba(255, 100, 100, 1) !important;
}

.btn-reset:hover {
  background: rgba(255, 100, 100, 0.1) !important;
  border-color: rgba(255, 100, 100, 0.8) !important;
}

.button-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .theme-sidebar {
    width: 100%;
    max-width: 320px;
    right: 10px;
    bottom: 10px;
    max-height: calc(100vh - 20px);
  }
}

@media (max-height: 700px) {
  .sidebar-header {
    padding: 12px 16px;
  }

  .preset-section,
  .export-group {
    padding: 12px 16px;
  }

  .controls-section {
    padding: 12px 16px;
  }
}
</style>
