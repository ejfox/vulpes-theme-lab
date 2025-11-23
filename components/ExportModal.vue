<script setup lang="ts">
const { state } = useTheme()

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  export: [formats: string[], mode: 'both' | 'dark' | 'light']
}>()

// Local state for format selection
const selectedFormats = ref<string[]>(['ghostty'])
const themeName = ref(state.value.themeName)

// Watch for theme name changes
watch(
  () => state.value.themeName,
  (newName) => {
    themeName.value = newName
  }
)

// Update theme name in state when changed
watch(themeName, (newName) => {
  state.value.themeName = newName
})

const formats = [
  { id: 'ghostty', label: 'Ghostty', desc: 'Terminal emulator config' },
  { id: 'wezterm', label: 'WezTerm', desc: 'Terminal emulator theme' },
  { id: 'alacritty', label: 'Alacritty', desc: 'Terminal emulator theme' },
  { id: 'iterm', label: 'iTerm2', desc: 'macOS terminal theme' },
  { id: 'tmux', label: 'Tmux', desc: 'Terminal multiplexer' },
  { id: 'neovim', label: 'Neovim', desc: 'Vim editor theme' },
  { id: 'bat', label: 'Bat', desc: 'Syntax highlighter theme' },
  { id: 'lazygit', label: 'Lazygit', desc: 'Git TUI theme' },
  { id: 'yazi', label: 'Yazi', desc: 'File manager theme' },
  { id: 'neomutt', label: 'Neomutt', desc: 'Email client theme' },
  { id: 'zsh', label: 'ZSH/FZF', desc: 'Shell & fuzzy finder' },
  { id: 'tweakcc', label: 'tweakcc', desc: 'Claude Code customization' },
]

const selectAll = () => {
  selectedFormats.value = formats.map((f) => f.id)
}

const deselectAll = () => {
  selectedFormats.value = []
}

const handleExport = (mode: 'both' | 'dark' | 'light') => {
  if (selectedFormats.value.length === 0) {
    alert('Please select at least one format')
    return
  }
  emit('export', selectedFormats.value, mode)
  emit('close')
}

const handleClose = () => {
  emit('close')
}

// Close on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.show) {
      handleClose()
    }
  }
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape)
  })
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="handleClose">
        <div
          class="modal-content"
          @click.stop
          :style="{
            background:
              state.mode === 'dark' ? 'rgba(15, 15, 20, 0.98)' : 'rgba(250, 250, 252, 0.98)',
            borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            color: state.mode === 'dark' ? '#fff' : '#000',
          }"
        >
          <div
            class="modal-header"
            :style="{
              borderBottomColor:
                state.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
            }"
          >
            <h2 :style="{ color: state.mode === 'dark' ? '#fff' : '#000' }">Export Theme</h2>
            <button
              @click="handleClose"
              class="close-btn"
              :style="{
                color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              }"
            >
              ✕
            </button>
          </div>

          <div class="modal-body">
            <!-- Theme Name -->
            <div class="form-group">
              <label
                class="form-label"
                :style="{
                  color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                }"
              >
                Theme Name
              </label>
              <input
                v-model="themeName"
                type="text"
                class="theme-name-input"
                placeholder="my-awesome-theme"
                :style="{
                  background:
                    state.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  borderColor:
                    state.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  color: state.mode === 'dark' ? '#fff' : '#000',
                }"
              />
              <div
                class="form-hint"
                :style="{
                  color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                }"
              >
                Used in exported filenames: {{ themeName }}-dark-ghostty.conf
              </div>
            </div>

            <!-- Format Selection -->
            <div class="form-group">
              <div class="form-label-row">
                <label
                  class="form-label"
                  :style="{
                    color:
                      state.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  }"
                >
                  Export Formats
                </label>
                <div class="quick-actions">
                  <button
                    @click="selectAll"
                    class="quick-btn"
                    :style="{
                      color:
                        state.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                    }"
                  >
                    Select All
                  </button>
                  <button
                    @click="deselectAll"
                    class="quick-btn"
                    :style="{
                      color:
                        state.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                    }"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div class="format-grid">
                <label
                  v-for="format in formats"
                  :key="format.id"
                  class="format-card"
                  :class="{ selected: selectedFormats.includes(format.id) }"
                  :style="{
                    background: selectedFormats.includes(format.id)
                      ? state.mode === 'dark'
                        ? 'rgba(100, 150, 255, 0.15)'
                        : 'rgba(100, 150, 255, 0.1)'
                      : state.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(0, 0, 0, 0.03)',
                    borderColor: selectedFormats.includes(format.id)
                      ? state.mode === 'dark'
                        ? 'rgba(100, 150, 255, 0.5)'
                        : 'rgba(100, 150, 255, 0.4)'
                      : state.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(0, 0, 0, 0.15)',
                    color: state.mode === 'dark' ? '#fff' : '#000',
                  }"
                >
                  <input
                    type="checkbox"
                    v-model="selectedFormats"
                    :value="format.id"
                    class="format-checkbox"
                  />
                  <div class="format-info">
                    <div class="format-name">{{ format.label }}</div>
                    <div
                      class="format-desc"
                      :style="{
                        color:
                          state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                      }"
                    >
                      {{ format.desc }}
                    </div>
                  </div>
                  <div
                    v-if="selectedFormats.includes(format.id)"
                    class="check-mark"
                    :style="{
                      color:
                        state.mode === 'dark' ? 'rgba(100, 150, 255, 1)' : 'rgba(100, 150, 255, 1)',
                    }"
                  >
                    ✓
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div
            class="modal-footer"
            :style="{
              borderTopColor:
                state.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
            }"
          >
            <button
              @click="handleClose"
              class="btn-cancel"
              :style="{
                borderColor:
                  state.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              }"
            >
              Cancel
            </button>
            <div class="export-buttons">
              <button
                @click="handleExport('dark')"
                class="btn-export btn-dark"
                :style="{
                  borderColor:
                    state.mode === 'dark' ? 'rgba(100, 150, 255, 0.4)' : 'rgba(100, 150, 255, 0.3)',
                  color: state.mode === 'dark' ? 'rgba(150, 180, 255, 1)' : 'rgba(80, 120, 200, 1)',
                }"
              >
                Export Dark
              </button>
              <button
                @click="handleExport('light')"
                class="btn-export btn-light"
                :style="{
                  borderColor:
                    state.mode === 'dark' ? 'rgba(255, 200, 100, 0.4)' : 'rgba(255, 200, 100, 0.3)',
                  color: state.mode === 'dark' ? 'rgba(255, 220, 120, 1)' : 'rgba(200, 160, 60, 1)',
                }"
              >
                Export Light
              </button>
              <button
                @click="handleExport('both')"
                class="btn-export btn-both"
                :style="{
                  background:
                    state.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(100, 150, 255, 0.25), rgba(150, 100, 255, 0.25))'
                      : 'linear-gradient(135deg, rgba(100, 150, 255, 0.15), rgba(150, 100, 255, 0.15))',
                  borderColor:
                    state.mode === 'dark' ? 'rgba(150, 150, 255, 0.5)' : 'rgba(100, 100, 200, 0.5)',
                  color: state.mode === 'dark' ? '#fff' : '#000',
                }"
              >
                Export Both
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  border: 1px solid;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.15s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 24px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 10px;
}

.form-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.quick-actions {
  display: flex;
  gap: 8px;
}

.quick-btn {
  background: transparent;
  border: none;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.15s;
  font-weight: 500;
}

.quick-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.theme-name-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  transition: all 0.2s;
}

.theme-name-input:focus {
  outline: none;
  border-color: rgba(100, 150, 255, 0.6);
  box-shadow: 0 0 0 3px rgba(100, 150, 255, 0.1);
}

.form-hint {
  font-size: 9px;
  margin-top: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  letter-spacing: 0.3px;
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
}

.format-card {
  position: relative;
  padding: 14px 16px;
  border: 2px solid;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 60px;
}

.format-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.format-card.selected {
  border-width: 2px;
}

.format-checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.format-info {
  flex: 1;
}

.format-name {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 2px;
  letter-spacing: 0.3px;
}

.format-desc {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.check-mark {
  font-size: 18px;
  font-weight: bold;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}

.export-buttons {
  display: flex;
  gap: 8px;
}

.btn-cancel {
  background: transparent;
  border: 1px solid;
  padding: 10px 16px;
  font-family: inherit;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.05);
}

.btn-export {
  background: transparent;
  border: 1.5px solid;
  padding: 10px 16px;
  font-family: inherit;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-export:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-both {
  font-weight: 700;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
  opacity: 0;
}
</style>
