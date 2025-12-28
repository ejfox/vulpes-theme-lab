<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { exportMaplibre, createSemanticPalette } from '~/utils/exporters'

const { colors, darkColors, lightColors, state } = useTheme()

// Throttle helper to prevent excessive style updates during animation
let styleUpdateTimeout: ReturnType<typeof setTimeout> | null = null
let lastStyleUpdate = 0
const THROTTLE_MS = 500 // Only update map style every 500ms max
const config = useRuntimeConfig()
const mapContainer = ref<HTMLDivElement | null>(null)
let map: maplibregl.Map | null = null

const initMap = () => {
  if (!mapContainer.value) {
    console.error('MapPreview: mapContainer ref not available')
    return
  }

  try {
    // Create semantic palette from current theme mode
    const currentColors = state.value.mode === 'dark' ? darkColors.value : lightColors.value
    const palette = createSemanticPalette(currentColors, state.value.mode)

    // Generate MapLibre style JSON
    const styleResult = exportMaplibre(palette, 'vulpes')
    const style = JSON.parse(styleResult.content)

    // Use Maptiler API key from environment variable
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
      interactive: false, // Disable mouse interactions - this is a preview
      scrollZoom: false,
      dragPan: false,
      dragRotate: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
    })

    map.on('load', () => {
      // Force resize after load to ensure tiles render
      setTimeout(() => map?.resize(), 100)
    })

    map.on('error', (e) => {
      console.error('MapPreview: Map error:', e)
    })

    // Add navigation controls (hidden by default but accessible)
    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    )
  } catch (error) {
    console.error('MapPreview: Error initializing map:', error)
  }
}

// Throttled style update function
const updateMapStyle = () => {
  if (!map) return

  try {
    // Generate new style with updated colors for current mode
    const currentColors = state.value.mode === 'dark' ? darkColors.value : lightColors.value
    const palette = createSemanticPalette(currentColors, state.value.mode)
    const styleResult = exportMaplibre(palette, 'vulpes')
    const style = JSON.parse(styleResult.content)

    const maptilerKey = config.public.maptilerKey || 'get_your_own_OpIi9ZULNHzrESv6T2vL'
    const styleString = JSON.stringify(style).replace(/{key}/g, maptilerKey)
    const parsedStyle = JSON.parse(styleString)

    map.setStyle(parsedStyle)
    lastStyleUpdate = Date.now()
  } catch (error) {
    console.error('MapPreview: Error updating style:', error)
  }
}

// Update map style when colors or mode change (throttled to prevent fan spin)
watch(
  () => [colors.value, state.value.mode],
  () => {
    if (!map) return

    const now = Date.now()
    const timeSinceLastUpdate = now - lastStyleUpdate

    // Clear any pending update
    if (styleUpdateTimeout) {
      clearTimeout(styleUpdateTimeout)
      styleUpdateTimeout = null
    }

    // If enough time has passed, update immediately
    if (timeSinceLastUpdate >= THROTTLE_MS) {
      updateMapStyle()
    } else {
      // Otherwise, schedule an update for later
      styleUpdateTimeout = setTimeout(updateMapStyle, THROTTLE_MS - timeSinceLastUpdate)
    }
  },
  { deep: true }
)

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  // Clean up throttle timeout
  if (styleUpdateTimeout) {
    clearTimeout(styleUpdateTimeout)
    styleUpdateTimeout = null
  }
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="map-preview-container" :style="{ background: colors.bg }">
    <div
      class="map-header"
      :style="{ background: colors.base + '15', borderBottom: `1px solid ${colors.base}` }"
    >
      <span :style="{ color: colors.base, fontWeight: 'bold', fontSize: '10px' }">
        CYBERPUNK MAP THEME
      </span>
      <span :style="{ marginLeft: 'auto', fontSize: '8px', color: colors.hint }">
        MapLibre GL JS
      </span>
    </div>
    <div ref="mapContainer" class="map-container"></div>
    <div
      class="map-footer"
      :style="{
        background: colors.bg,
        borderTop: `1px solid ${colors.comment}`,
        color: colors.hint,
        fontSize: '7px',
        padding: '2px 4px',
      }"
    >
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
  min-height: 400px;
  height: 400px;
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
