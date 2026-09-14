<script setup lang="ts">
import { MAPTILER_FONTS, type MapEditorState } from '~/composables/useMapTheme'

const props = defineProps<{
  mapState: MapEditorState
}>()

const { state } = useTheme()
const modeColor = (dark: string, light: string) => (state.value.mode === 'dark' ? dark : light)

const sliders = [
  {
    key: 'labelSizeScale' as const,
    label: 'size scale',
    min: 0.5,
    max: 2.0,
    step: 0.1,
    tooltip: 'Multiply all label sizes. 1.0 = default',
  },
  {
    key: 'labelHaloWidth' as const,
    label: 'halo width',
    min: 0,
    max: 4,
    step: 0.5,
    tooltip: 'Text outline/halo thickness in pixels',
  },
  {
    key: 'labelHaloOpacity' as const,
    label: 'halo opacity',
    min: 0,
    max: 100,
    step: 1,
    tooltip: 'How opaque the text halo is. 0 = no halo',
  },
  {
    key: 'labelOpacity' as const,
    label: 'label opacity',
    min: 0,
    max: 100,
    step: 1,
    tooltip: 'Overall label text opacity',
  },
]

const densitySliders = [
  { key: 'labelDensityCity' as const, label: 'city density' },
  { key: 'labelDensityTown' as const, label: 'town density' },
  { key: 'labelDensityRoad' as const, label: 'road density' },
  { key: 'labelDensityPoi' as const, label: 'POI density' },
]
</script>

<template>
  <div class="typography-controls">
    <!-- Font family -->
    <div class="font-select-group">
      <label
        class="font-label"
        :style="{ color: modeColor('rgba(255, 255, 255, 0.6)', 'rgba(0, 0, 0, 0.6)') }"
      >
        FONT FAMILY
      </label>
      <select
        v-model="props.mapState.labelFontFamily"
        class="font-select"
        :style="{
          background: modeColor('rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.3)'),
          borderColor: modeColor('rgba(255, 255, 255, 0.2)', 'rgba(0, 0, 0, 0.2)'),
          color: modeColor('#fff', '#000'),
        }"
      >
        <option v-for="font in MAPTILER_FONTS" :key="font" :value="font">
          {{ font }}
        </option>
      </select>
    </div>

    <!-- Main sliders -->
    <BaseSlider
      v-for="slider in sliders"
      :key="slider.key"
      v-model="props.mapState[slider.key] as number"
      :label="slider.label"
      :min="slider.min"
      :max="slider.max"
      :step="slider.step"
      :tooltip="slider.tooltip"
    />

    <!-- Label density offsets -->
    <details class="density-controls">
      <summary :style="{ color: modeColor('rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)') }">
        label density
      </summary>
      <div
        class="density-hint"
        :style="{ color: modeColor('rgba(255, 255, 255, 0.3)', 'rgba(0, 0, 0, 0.3)') }"
      >
        Positive = less labels, Negative = more labels
      </div>
      <BaseSlider
        v-for="slider in densitySliders"
        :key="slider.key"
        v-model="props.mapState[slider.key] as number"
        :label="slider.label"
        :min="-5"
        :max="5"
        :step="1"
        variant="compact"
      />
    </details>
  </div>
</template>

<style scoped>
.typography-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.font-select-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.font-label {
  font-size: 8px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.font-select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 10px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.font-select:hover {
  opacity: 0.8;
}

.density-controls {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.density-controls summary {
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  user-select: none;
  padding: 4px 0;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.density-controls summary:hover {
  opacity: 1;
}

.density-controls[open] summary {
  opacity: 1;
  margin-bottom: 8px;
}

.density-hint {
  font-size: 7px;
  margin-bottom: 6px;
}
</style>
