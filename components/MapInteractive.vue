<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
const props = defineProps<{
  mapStyle: { content: string }
}>()

const config = useRuntimeConfig()
const { state } = useTheme()

const mapContainer = ref<HTMLDivElement | null>(null)
let map: maplibregl.Map | null = null

// Readout state
const zoom = ref(12)
const pitch = ref(45)
const bearing = ref(-17.6)

// Throttle style updates
let styleUpdateTimeout: ReturnType<typeof setTimeout> | null = null
let lastStyleUpdate = 0
const THROTTLE_MS = 400

const getMaptilerKey = () => config.public.maptilerKey || 'get_your_own_OpIi9ZULNHzrESv6T2vL'

const injectKey = (json: string) => json.replace(/{key}/g, getMaptilerKey())

const initMap = () => {
  if (!mapContainer.value) return

  try {
    const styleObj = JSON.parse(injectKey(props.mapStyle.content))

    map = new maplibregl.Map({
      container: mapContainer.value,
      style: styleObj,
      center: [-122.4194, 37.7749],
      zoom: 12,
      pitch: 45,
      bearing: -17.6,
      attributionControl: false,
    })

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 150 }), 'bottom-right')

    // Track camera state
    map.on('move', () => {
      if (!map) return
      zoom.value = Math.round(map.getZoom() * 10) / 10
      pitch.value = Math.round(map.getPitch())
      bearing.value = Math.round(map.getBearing() * 10) / 10
    })

    map.on('load', () => {
      setTimeout(() => map?.resize(), 100)
    })

    map.on('error', (e) => {
      console.error('MapInteractive: Map error:', e)
    })
  } catch (error) {
    console.error('MapInteractive: Error initializing map:', error)
  }
}

// Throttled full style update
const updateMapStyle = () => {
  if (!map) return
  try {
    const styleObj = JSON.parse(injectKey(props.mapStyle.content))
    map.setStyle(styleObj)
    lastStyleUpdate = Date.now()
  } catch (error) {
    console.error('MapInteractive: Error updating style:', error)
  }
}

// Watch style changes (throttled)
watch(
  () => props.mapStyle,
  () => {
    if (!map) return
    const now = Date.now()
    const timeSinceLastUpdate = now - lastStyleUpdate

    if (styleUpdateTimeout) {
      clearTimeout(styleUpdateTimeout)
      styleUpdateTimeout = null
    }

    if (timeSinceLastUpdate >= THROTTLE_MS) {
      updateMapStyle()
    } else {
      styleUpdateTimeout = setTimeout(updateMapStyle, THROTTLE_MS - timeSinceLastUpdate)
    }
  },
  { deep: true }
)

// Expose flyTo for location presets
const flyTo = (opts: { center: [number, number]; zoom?: number; name?: string }) => {
  if (!map) return
  map.flyTo({
    center: opts.center,
    zoom: opts.zoom || 12,
    pitch: pitch.value,
    bearing: bearing.value,
    duration: 2000,
  })
}

// Set view angle (pitch/bearing) with animation
const setView = (opts: { pitch: number; bearing: number }) => {
  if (!map) return
  map.easeTo({
    pitch: opts.pitch,
    bearing: opts.bearing,
    duration: 800,
  })
}

// Reset to north-up top-down
const resetNorth = () => {
  if (!map) return
  map.easeTo({ pitch: 0, bearing: 0, duration: 600 })
}

defineExpose({ flyTo, setView, resetNorth })

onMounted(() => {
  initMap()
})

onUnmounted(() => {
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
  <div class="map-interactive-container">
    <div ref="mapContainer" class="map-canvas"></div>
    <!-- Camera readout -->
    <div
      class="camera-readout"
      :style="{
        background: state.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
      }"
    >
      <span>Z {{ zoom }}</span>
      <span>P {{ pitch }}°</span>
      <span>B {{ bearing }}°</span>
    </div>
  </div>
</template>

<style scoped>
.map-interactive-container {
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 400px;
}

.map-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

.camera-readout {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  gap: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 9px;
  font-family: var(--font-krypton, monospace);
  letter-spacing: 0.5px;
  pointer-events: none;
  z-index: 10;
}

:deep(.maplibregl-canvas) {
  outline: none;
}

:deep(.maplibregl-ctrl-top-right) {
  opacity: 0.5;
  transition: opacity 0.2s;
}

:deep(.maplibregl-ctrl-top-right:hover) {
  opacity: 1;
}
</style>
