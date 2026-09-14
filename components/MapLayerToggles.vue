<script setup lang="ts">
import type { MapEditorState } from '~/composables/useMapTheme'

const props = defineProps<{
  mapState: MapEditorState
}>()

const { state } = useTheme()
const modeColor = (dark: string, light: string) => (state.value.mode === 'dark' ? dark : light)

const layerGroups = [
  { key: 'showWater' as const, label: 'Water', opacityKey: 'waterOpacity' as const },
  { key: 'showParks' as const, label: 'Parks', opacityKey: 'parkOpacity' as const },
  { key: 'showBuildings' as const, label: 'Buildings', opacityKey: 'buildingOpacity' as const },
  { key: 'showRoads' as const, label: 'Roads', opacityKey: 'roadOpacity' as const },
  { key: 'showRailways' as const, label: 'Railways', opacityKey: 'railwayOpacity' as const },
  { key: 'showBoundaries' as const, label: 'Boundaries', opacityKey: 'boundaryOpacity' as const },
  { key: 'showLabels' as const, label: 'Labels', opacityKey: null },
  { key: 'showPois' as const, label: 'POIs', opacityKey: 'poiOpacity' as const },
  { key: 'showAeroway' as const, label: 'Aeroway', opacityKey: null },
  { key: 'showLanduse' as const, label: 'Landuse', opacityKey: null },
]

function toggle(key: keyof MapEditorState) {
  ;(props.mapState[key] as boolean) = !(props.mapState[key] as boolean)
}
</script>

<template>
  <div class="layer-toggles">
    <div v-for="group in layerGroups" :key="group.key" class="toggle-row">
      <label
        class="toggle-label"
        :style="{ color: modeColor('rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.7)') }"
      >
        <input
          type="checkbox"
          :checked="mapState[group.key] as boolean"
          :style="{ accentColor: modeColor('rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 0.8)') }"
          @change="toggle(group.key)"
        />
        <span>{{ group.label }}</span>
      </label>
      <BaseSlider
        v-if="group.opacityKey && mapState[group.key]"
        v-model="mapState[group.opacityKey] as number"
        :min="0"
        :max="100"
        :step="1"
        label=""
        variant="compact"
        class="opacity-slider"
      />
    </div>
  </div>
</template>

<style scoped>
.layer-toggles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  min-width: 90px;
  flex-shrink: 0;
}

.toggle-label input[type='checkbox'] {
  width: 10px;
  height: 10px;
  cursor: pointer;
  margin: 0;
}

.opacity-slider {
  flex: 1;
  min-width: 0;
}
</style>
