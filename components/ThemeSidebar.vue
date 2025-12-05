<script setup lang="ts">
defineProps<{
  state: any
  presetOptions: { value: string; label: string }[]
}>()

const emit = defineEmits<{
  (e: 'load-old-preset', value: string): void
  (e: 'load-preset', preset: any): void
  (e: 'show-import'): void
  (e: 'show-export'): void
  (e: 'copy-dark'): void
  (e: 'copy-light'): void
  (e: 'reset-all'): void
}>()

const handlePresetChange = (event: Event) => {
  const el = event.target as HTMLSelectElement
  if (el.value) {
    emit('load-old-preset', el.value)
    el.value = ''
  }
}
</script>

<template>
  <aside
    class="sidebar-left"
    :style="{
      background: state.mode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
      boxShadow:
        state.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
      color: state.mode === 'dark' ? '#fff' : '#000',
    }"
  >
    <div
      class="header"
      :style="{
        borderBottomColor:
          state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      }"
    >
      <h1>theme-lab</h1>
      <NuxtLink
        to="/showcase"
        class="showcase-link"
        :style="{
          color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
        }"
      >
        showcase →
      </NuxtLink>
    </div>

    <div
      class="preset-section"
      :style="{
        borderBottomColor:
          state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      }"
    >
      <select
        class="preset-select"
        :style="{
          borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          color: state.mode === 'dark' ? '#fff' : '#000',
          background: 'transparent',
        }"
        @change="handlePresetChange"
      >
        <option value="">load preset...</option>
        <option v-for="preset in presetOptions" :key="preset.value" :value="preset.value">
          {{ preset.label }}
        </option>
      </select>
    </div>

    <PresetSelector @load-preset="(preset) => emit('load-preset', preset)" />

    <ColorControls />

    <div
      class="actions"
      :style="{
        borderTopColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      }"
    >
      <div
        class="export-section"
        :style="{
          borderBottomColor:
            state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }"
      >
        <div
          class="section-label"
          :style="{
            color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
          }"
        >
          import / export
        </div>
        <div class="action-row">
          <button
            class="btn btn-secondary"
            :style="{
              background:
                state.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              borderColor:
                state.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
            }"
            title="Import theme from file"
            @click="emit('show-import')"
          >
            IMPORT
          </button>
          <button
            class="btn btn-primary"
            :style="{
              background: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              borderColor:
                state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              color: state.mode === 'dark' ? '#fff' : '#000',
            }"
            title="Export theme to files"
            @click="emit('show-export')"
          >
            EXPORT
          </button>
        </div>
      </div>

      <div
        class="export-section"
        :style="{
          borderBottomColor:
            state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }"
      >
        <div
          class="section-label"
          :style="{
            color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
          }"
        >
          copy to clipboard
        </div>
        <div class="button-grid">
          <button
            class="btn btn-secondary"
            :style="{
              borderColor:
                state.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              color: state.mode === 'dark' ? '#fff' : '#000',
            }"
            title="Copy dark theme config to clipboard"
            @click="emit('copy-dark')"
          >
            COPY DARK
          </button>
          <button
            class="btn btn-secondary"
            :style="{
              borderColor:
                state.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              color: state.mode === 'dark' ? '#fff' : '#000',
            }"
            title="Copy light theme config to clipboard"
            @click="emit('copy-light')"
          >
            COPY LIGHT
          </button>
        </div>
      </div>

      <div class="export-section">
        <button
          class="btn btn-reset"
          title="Reset all values to defaults"
          @click="emit('reset-all')"
        >
          RESET ALL
        </button>
      </div>
    </div>
  </aside>
</template>
