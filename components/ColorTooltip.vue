<script setup lang="ts">
const { highlightedColor } = useHighlightedColor()
const { state } = useTheme()

const tooltipPosition = ref({ x: 0, y: 0 })
const showTooltip = computed(() => highlightedColor.value !== null)

// Track mouse position
const updatePosition = (e: MouseEvent) => {
  tooltipPosition.value = {
    x: e.clientX,
    y: e.clientY,
  }
}

onMounted(() => {
  window.addEventListener('mousemove', updatePosition)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updatePosition)
})

// Get color info
const colorInfo = computed(() => {
  if (!highlightedColor.value) return null

  const colorName = highlightedColor.value
  const offset = state.value[`${colorName}Offset` as keyof typeof state.value] as number
  const lightness = state.value[`${colorName}Lightness` as keyof typeof state.value] as number
  const linked = state.value[`${colorName}Linked` as keyof typeof state.value] as boolean
  const multiplier = state.value[`${colorName}Multiplier` as keyof typeof state.value] as number

  const actualOffset = linked ? state.value.hueOffset * multiplier + offset : offset

  return {
    name: colorName,
    offset: actualOffset.toFixed(0),
    lightness,
    linked,
    multiplier: multiplier.toFixed(1),
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="tooltip">
      <div
        v-if="showTooltip && colorInfo"
        class="color-tooltip"
        :style="{
          left: `${tooltipPosition.x + 15}px`,
          top: `${tooltipPosition.y + 15}px`,
          background:
            state.mode === 'dark' ? 'rgba(20, 20, 25, 0.98)' : 'rgba(250, 250, 255, 0.98)',
          borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          color: state.mode === 'dark' ? '#fff' : '#000',
        }"
      >
        <div class="tooltip-header">
          <span class="tooltip-color-name">{{ colorInfo.name }}</span>
          <span
            class="tooltip-badge"
            :style="{
              background:
                state.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
              color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
            }"
            >color variable</span
          >
        </div>
        <div class="tooltip-details">
          <div class="tooltip-row">
            <span
              class="tooltip-label"
              :style="{
                color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              }"
              >Offset:</span
            >
            <span class="tooltip-value">{{ colorInfo.offset }}°</span>
          </div>
          <div class="tooltip-row">
            <span
              class="tooltip-label"
              :style="{
                color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              }"
              >Lightness:</span
            >
            <span class="tooltip-value">{{ colorInfo.lightness }}</span>
          </div>
          <div class="tooltip-row">
            <span
              class="tooltip-label"
              :style="{
                color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              }"
              >Link:</span
            >
            <span class="tooltip-value">{{
              colorInfo.linked ? `${colorInfo.multiplier}x` : 'unlinked'
            }}</span>
          </div>
        </div>
        <div
          class="tooltip-hint"
          :style="{
            color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
          }"
        >
          Scroll up to adjust
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.color-tooltip {
  position: fixed;
  z-index: 10000;
  padding: 10px 12px;
  border: 1px solid;
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  backdrop-filter: blur(8px);
  min-width: 180px;
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.tooltip-color-name {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tooltip-badge {
  font-size: 7px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: 3px;
}

.tooltip-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 6px;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
}

.tooltip-label {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tooltip-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 600;
  font-size: 10px;
}

.tooltip-hint {
  font-size: 8px;
  text-align: center;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-style: italic;
}

/* Transitions */
.tooltip-enter-active {
  transition: all 0.15s ease-out;
}

.tooltip-leave-active {
  transition: all 0.1s ease-in;
}

.tooltip-enter-from {
  opacity: 0;
  transform: translateY(-5px) scale(0.95);
}

.tooltip-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.95);
}
</style>
