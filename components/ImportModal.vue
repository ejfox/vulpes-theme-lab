<script setup lang="ts">
import { ref, computed } from 'vue'
import { parseThemeFromFile } from '~/utils/importers'
import { themeImportToPreset, addImportedPreset } from '~/utils/importedPresets'
import type { ThemeImport } from '~/utils/importers/types'

const { state } = useTheme()

const props = defineProps<{
  show: boolean
  droppedFile?: File
}>()

const emit = defineEmits<{
  close: []
  imported: [presetId: string]
}>()

// Import state
const isDragging = ref(false)
const isProcessing = ref(false)
const importedTheme = ref<ThemeImport | null>(null)
const error = ref<string | null>(null)

// File input ref
const fileInput = ref<HTMLInputElement | null>(null)

/**
 * Handle file drop
 */
async function handleDrop(event: DragEvent) {
  isDragging.value = false
  event.preventDefault()

  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return

  await processFile(files[0])
}

/**
 * Handle file selection from input
 */
async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  await processFile(files[0])
}

/**
 * Process uploaded file
 */
async function processFile(file: File) {
  isProcessing.value = true
  error.value = null
  importedTheme.value = null

  try {
    const content = await file.text()
    const result = parseThemeFromFile(content, file.name)

    if (!result.success) {
      error.value = result.error || 'Failed to parse theme file'
      return
    }

    importedTheme.value = result.theme!
  } catch (err: any) {
    error.value = `Error reading file: ${err.message}`
  } finally {
    isProcessing.value = false
  }
}

/**
 * Save imported theme as preset
 */
function saveAsPreset() {
  if (!importedTheme.value) return

  const preset = themeImportToPreset(importedTheme.value)
  addImportedPreset(preset)

  emit('imported', preset.id)
  handleClose()
}

/**
 * Reset and try again
 */
function reset() {
  importedTheme.value = null
  error.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

/**
 * Close modal
 */
function handleClose() {
  reset()
  emit('close')
}

// Drag handlers
function handleDragEnter(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  // Only set to false if leaving the drop zone completely
  if (e.target === e.currentTarget) {
    isDragging.value = false
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
}

// Color preview computed
const colorPreview = computed(() => {
  if (!importedTheme.value) return null

  const colors = importedTheme.value.colors
  return {
    bg: colors.bg || '#000',
    fg: colors.fg || '#fff',
    keyword: colors.keyword || colors.fg || '#fff',
    string: colors.string || colors.fg || '#fff',
    function: colors.function || colors.fg || '#fff',
    comment: colors.comment || colors.fg || '#fff',
  }
})

// Watch for dropped file from parent
watch(() => props.droppedFile, (file) => {
  if (file && props.show) {
    processFile(file)
  }
})

// Close on escape
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
          <!-- Header -->
          <div
            class="modal-header"
            :style="{
              borderBottomColor:
                state.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
            }"
          >
            <h2 :style="{ color: state.mode === 'dark' ? '#fff' : '#000' }">Import Theme</h2>
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

          <!-- Body -->
          <div class="modal-body">
            <!-- Drop Zone (shown when no theme imported) -->
            <div v-if="!importedTheme" class="import-section">
              <div
                class="drop-zone"
                :class="{ dragging: isDragging, processing: isProcessing }"
                :style="{
                  borderColor: isDragging
                    ? state.mode === 'dark'
                      ? 'rgba(100, 150, 255, 0.6)'
                      : 'rgba(100, 150, 255, 0.5)'
                    : state.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(0, 0, 0, 0.2)',
                  background: isDragging
                    ? state.mode === 'dark'
                      ? 'rgba(100, 150, 255, 0.1)'
                      : 'rgba(100, 150, 255, 0.05)'
                    : state.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.02)'
                      : 'rgba(0, 0, 0, 0.02)',
                }"
                @drop="handleDrop"
                @dragenter="handleDragEnter"
                @dragleave="handleDragLeave"
                @dragover="handleDragOver"
              >
                <div v-if="isProcessing" class="processing-state">
                  <div class="spinner"></div>
                  <p>Parsing theme...</p>
                </div>

                <div v-else class="drop-prompt">
                  <div class="drop-icon">📁</div>
                  <p class="drop-title">
                    {{ isDragging ? 'Drop theme file here' : 'Drag & drop theme file' }}
                  </p>
                  <p
                    class="drop-hint"
                    :style="{
                      color:
                        state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    }"
                  >
                    Supports: Base16 (.yml, .json), Neovim (.lua), Ghostty (.ghostty), VS Code
                    (.json)
                  </p>
                  <button
                    class="browse-btn"
                    @click="fileInput?.click()"
                    :style="{
                      background:
                        state.mode === 'dark'
                          ? 'rgba(100, 150, 255, 0.15)'
                          : 'rgba(100, 150, 255, 0.1)',
                      borderColor:
                        state.mode === 'dark'
                          ? 'rgba(100, 150, 255, 0.4)'
                          : 'rgba(100, 150, 255, 0.3)',
                      color: state.mode === 'dark' ? 'rgba(150, 180, 255, 1)' : 'rgba(80, 120, 200, 1)',
                    }"
                  >
                    Browse Files
                  </button>
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".yml,.yaml,.json,.lua,.ghostty"
                    @change="handleFileSelect"
                    style="display: none"
                  />
                </div>
              </div>

              <!-- Error message -->
              <div
                v-if="error"
                class="error-message"
                :style="{
                  background:
                    state.mode === 'dark' ? 'rgba(255, 100, 100, 0.1)' : 'rgba(255, 100, 100, 0.05)',
                  borderColor:
                    state.mode === 'dark' ? 'rgba(255, 100, 100, 0.4)' : 'rgba(255, 100, 100, 0.3)',
                  color: state.mode === 'dark' ? '#ff6b6b' : '#d63031',
                }"
              >
                <strong>Error:</strong> {{ error }}
              </div>
            </div>

            <!-- Preview (shown when theme imported) -->
            <div v-else class="preview-section">
              <div class="preview-header">
                <div>
                  <h3 :style="{ color: state.mode === 'dark' ? '#fff' : '#000' }">
                    {{ importedTheme.name }}
                  </h3>
                  <p
                    class="preview-meta"
                    :style="{
                      color:
                        state.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                    }"
                  >
                    Source: {{ importedTheme.metadata.source }}
                    <span v-if="importedTheme.metadata.author"> by {{ importedTheme.metadata.author }}</span>
                    • {{ importedTheme.metadata.isDark ? 'Dark' : 'Light' }} theme
                  </p>
                </div>
                <button
                  @click="reset"
                  class="reset-btn"
                  :style="{
                    color:
                      state.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                  }"
                >
                  Try Another
                </button>
              </div>

              <!-- Color swatches -->
              <div class="color-swatches" v-if="colorPreview">
                <div
                  class="swatch-row"
                  :style="{
                    background: colorPreview.bg,
                    border: `1px solid ${state.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  }"
                >
                  <div class="swatch-content" :style="{ color: colorPreview.fg }">
                    <span :style="{ color: colorPreview.keyword }">const</span>
                    <span :style="{ color: colorPreview.function }">hello</span>
                    <span :style="{ color: colorPreview.fg }">=</span>
                    <span :style="{ color: colorPreview.string }">"world"</span>
                    <span :style="{ color: colorPreview.comment }">// imported theme</span>
                  </div>
                </div>
              </div>

              <p
                class="preview-note"
                :style="{
                  color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                }"
              >
                Preview shows imported colors. Save as preset to use across all export formats.
              </p>
            </div>
          </div>

          <!-- Footer -->
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
            <button
              v-if="importedTheme"
              @click="saveAsPreset"
              class="btn-save"
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
              Save as Preset
            </button>
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

.import-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.drop-zone {
  border: 2px dashed;
  border-radius: 12px;
  padding: 48px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  min-height: 300px;
}

.drop-zone.dragging {
  transform: scale(1.02);
}

.drop-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.drop-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.drop-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.drop-hint {
  font-size: 11px;
  margin: 0;
  max-width: 400px;
}

.browse-btn {
  margin-top: 12px;
  padding: 10px 20px;
  border: 1.5px solid;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
}

.browse-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.processing-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: rgba(100, 150, 255, 0.8);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  padding: 12px 16px;
  border: 1px solid;
  border-radius: 6px;
  font-size: 12px;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.preview-header h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.preview-meta {
  margin: 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.reset-btn {
  background: transparent;
  border: none;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.15s;
  font-weight: 500;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.color-swatches {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.swatch-row {
  padding: 16px;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
}

.swatch-content {
  display: flex;
  gap: 8px;
}

.preview-note {
  font-size: 11px;
  margin: 0;
  text-align: center;
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

.btn-cancel,
.btn-save {
  padding: 10px 16px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-cancel {
  background: transparent;
  border: 1px solid;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.05);
}

.btn-save {
  border: 1.5px solid;
  font-weight: 700;
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
