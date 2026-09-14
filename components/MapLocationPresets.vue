<script setup lang="ts">
import { LOCATION_PRESETS } from '~/composables/useMapTheme'

const emit = defineEmits<{
  (e: 'flyTo', preset: { center: [number, number]; zoom: number; name: string }): void
}>()

const { state } = useTheme()
const modeColor = (dark: string, light: string) => (state.value.mode === 'dark' ? dark : light)
</script>

<template>
  <div class="location-presets">
    <div class="preset-grid">
      <button
        v-for="preset in LOCATION_PRESETS"
        :key="preset.name"
        class="preset-btn"
        :style="{
          background: modeColor('rgba(255, 255, 255, 0.05)', 'rgba(0, 0, 0, 0.05)'),
          color: modeColor('rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.7)'),
          borderColor: modeColor('rgba(255, 255, 255, 0.1)', 'rgba(0, 0, 0, 0.1)'),
        }"
        @click="
          emit('flyTo', {
            center: [...preset.center] as [number, number],
            zoom: preset.zoom,
            name: preset.name,
          })
        "
      >
        {{ preset.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 4px;
}

.preset-btn {
  padding: 6px 8px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 9px;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preset-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.2);
}

.preset-btn:active {
  transform: translateY(0);
}
</style>
