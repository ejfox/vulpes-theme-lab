<script setup lang="ts">
const {
  themeState,
  mapState,
  mapStyle,
  colors,
  featureColors,
  extendedColors,
  resetAll,
  VIEW_PRESETS,
} = useMapTheme()

const mapRef = ref<{
  flyTo: (opts: { center: [number, number]; zoom?: number }) => void
  setView: (opts: { pitch: number; bearing: number }) => void
  resetNorth: () => void
} | null>(null)

const handleFlyTo = (preset: { center: [number, number]; zoom: number; name: string }) => {
  mapRef.value?.flyTo(preset)
}

const handleSetView = (opts: { pitch: number; bearing: number }) => {
  mapRef.value?.setView(opts)
}

const shared = ref(false)
const handleShare = async () => {
  await navigator.clipboard.writeText(window.location.href)
  shared.value = true
  setTimeout(() => {
    shared.value = false
  }, 2000)
}

const handleExport = () => {
  const result = mapStyle.value
  const maptilerKey = useRuntimeConfig().public.maptilerKey || 'get_your_own_OpIi9ZULNHzrESv6T2vL'
  const content = result.content.replace(/{key}/g, maptilerKey)
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = result.filename
  a.click()
  URL.revokeObjectURL(url)
}

const copied = ref(false)
const handleCopy = async () => {
  const result = mapStyle.value
  await navigator.clipboard.writeText(result.content)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

useHead({
  title: `${themeState.value.themeName} — Basemap Editor`,
})
</script>

<template>
  <div
    class="map-editor-layout"
    :style="{
      background: colors.bg,
      color: colors.fg,
    }"
  >
    <aside
      class="map-sidebar-left"
      :style="{
        background: themeState.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(12px)',
        borderRight: `1px solid ${themeState.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      }"
    >
      <MapEditorSidebar
        :map-state="mapState"
        :feature-colors="featureColors"
        :extended-colors="extendedColors"
        :view-presets="VIEW_PRESETS"
        @fly-to="handleFlyTo"
        @set-view="handleSetView"
        @reset="resetAll"
        @export="handleExport"
        @copy="handleCopy"
        @share="handleShare"
      />
    </aside>

    <main class="map-main">
      <ClientOnly>
        <MapInteractive ref="mapRef" :map-style="mapStyle" />
      </ClientOnly>

      <Transition name="fade">
        <div v-if="copied" class="copied-toast">JSON copied to clipboard</div>
      </Transition>
      <Transition name="fade">
        <div v-if="shared" class="copied-toast">URL copied — share it!</div>
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.map-editor-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: var(--font-krypton, 'Monaspace Krypton', monospace);
}

.map-sidebar-left {
  width: 280px;
  min-width: 280px;
  height: 100vh;
  overflow-y: auto;
  flex-shrink: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.map-sidebar-left::-webkit-scrollbar {
  width: 4px;
}

.map-sidebar-left::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.map-main {
  flex: 1;
  position: relative;
  min-width: 0;
}

.copied-toast {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: rgba(100, 255, 100, 1);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 10px;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  pointer-events: none;
  z-index: 100;
  backdrop-filter: blur(8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .map-editor-layout {
    flex-direction: column;
  }

  .map-sidebar-left {
    width: 100%;
    min-width: unset;
    height: auto;
    max-height: 40vh;
    overflow-y: auto;
  }

  .map-main {
    height: 60vh;
  }
}
</style>
