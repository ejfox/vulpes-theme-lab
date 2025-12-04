<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { exportMaplibre, createSemanticPalette } from '~/utils/exporters'

const { colors, darkColors } = useTheme()
const config = useRuntimeConfig()
const mapContainer = ref<HTMLDivElement | null>(null)
let map: maplibregl.Map | null = null

const initMap = () => {
  if (!mapContainer.value) return

  // Create semantic palette from current theme
  const palette = createSemanticPalette(darkColors.value, 'dark')

  // Generate MapLibre style JSON
  const styleResult = exportMaplibre(palette, 'vulpes')
  const style = JSON.parse(styleResult.content)

  // Use Maptiler API key from environment variable
  // Fallback to demo key if not set (limited usage)
  const maptilerKey = config.public.maptilerKey || 'get_your_own_OpIi9ZULNHzrESv6T2vL'
  const styleString = JSON.stringify(style).replace(/{key}/g, maptilerKey)
  const parsedStyle = JSON.parse(styleString)

  // Initialize map
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: parsedStyle,
    center: [-122.4194, 37.7749], // San Francisco (cyberpunk vibes)
    zoom: 12,
    pitch: 45, // 3D tilt for that cyberpunk feel
    bearing: -17.6,
    attributionControl: false,
    interactive: false, // Disable interactions for preview
  })

  // Add navigation controls (hidden by default but accessible)
  map.addControl(
    new maplibregl.NavigationControl({
      visualizePitch: true,
    }),
    'top-right',
  )
}

// Reinitialize map when colors change
watch(
  () => colors.value,
  () => {
    if (map) {
      map.remove()
      map = null
    }
    setTimeout(initMap, 100) // Small delay to ensure DOM is ready
  },
  { deep: true },
)

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="map-preview-container" :style="{ background: colors.bg }">
    <div class="map-header" :style="{ background: colors.base + '15', borderBottom: `1px solid ${colors.base}` }">
      <span :style="{ color: colors.base, fontWeight: 'bold', fontSize: '10px' }">
        CYBERPUNK MAP THEME
      </span>
      <span :style="{ marginLeft: 'auto', fontSize: '8px', color: colors.hint }">
        MapLibre GL JS
      </span>
    </div>
    <div ref="mapContainer" class="map-container"></div>
    <div class="map-footer" :style="{ background: colors.bg, borderTop: `1px solid ${colors.comment}`, color: colors.hint, fontSize: '7px', padding: '2px 4px' }">
      Neon cartography • Replace {'{key}'} with your Maptiler API key
    </div>
  </div>
</template>

<style scoped>
.map-preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color, #333);
  overflow: hidden;
}

.map-header {
  display: flex;
  padding: 4px 6px;
  align-items: center;
  flex-shrink: 0;
}

.map-container {
  flex: 1;
  min-height: 0;
  position: relative;
}

.map-footer {
  flex-shrink: 0;
  text-align: center;
}

/* Override maplibre default styles to fit the preview */
:deep(.maplibregl-canvas) {
  outline: none;
}

:deep(.maplibregl-ctrl-top-right) {
  opacity: 0.3;
  transition: opacity 0.2s;
}

:deep(.maplibregl-ctrl-top-right:hover) {
  opacity: 1;
}
</style>
