<script setup lang="ts">
import chroma from 'chroma-js'
const { colors } = useTheme()

// Calculate perceptual distance - computed so it updates when colors change
const fidelityData = computed(() => {
  const palette = Object.values(colors.value.palette)

  // sRGB gamut can't reproduce all colors perfectly
  // Terminal emulators quantize to nearest displayable color
  // This is the gap between ideal and real

  let totalDistance = 0
  let count = 0

  // Sample a few key colors
  const samples = [
    colors.value.base,
    colors.value.error,
    colors.value.success,
    colors.value.string
  ]

  samples.forEach(color => {
    try {
      const intended = chroma(color)
      // Simulate 8-bit quantization per channel
      const [r, g, b] = intended.rgb()
      const quantized = chroma(
        Math.round(r / 255 * 255),
        Math.round(g / 255 * 255),
        Math.round(b / 255 * 255)
      )

      // Delta E - perceptual color difference
      const distance = chroma.deltaE(intended, quantized)
      totalDistance += distance
      count++
    } catch (e) {
      // Color parsing failed
    }
  })

  const avgDistance = count > 0 ? totalDistance / count : 0
  const fidelity = Math.max(0, Math.min(100, 100 - avgDistance))

  return {
    fidelity: fidelity.toFixed(1),
    // Gap between map and territory
    loss: (100 - fidelity).toFixed(1),
    shouldShow: (100 - fidelity) > 0.1
  }
})
</script>

<template>
  <div
    v-if="fidelityData.shouldShow"
    class="fidelity-note"
    :style="{
      color: colors.comment,
      borderTop: `1px solid ${colors.comment}15`
    }"
  >
    <span class="label">terminal fidelity:</span>
    <span :style="{ color: colors.hint }">{{ fidelityData.fidelity }}%</span>
    <span class="separator">·</span>
    <span class="loss" :style="{ color: colors.error, opacity: 0.6 }">
      {{ fidelityData.loss }}% lost to quantization
    </span>
    <span class="meta" :style="{ color: colors.comment, opacity: 0.5 }">
      (the map ≠ territory)
    </span>
  </div>
</template>

<style scoped>
.fidelity-note {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 4px 12px;
  font-size: 8px;
  font-family: 'Monaspace Krypton', monospace;
  letter-spacing: 0.3px;
  display: flex;
  gap: 6px;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  opacity: 0.4;
  transition: opacity 0.2s ease;
}

.fidelity-note:hover {
  opacity: 1;
}

.label {
  text-transform: uppercase;
  font-weight: 600;
  font-size: 7px;
  letter-spacing: 0.8px;
}

.separator {
  opacity: 0.3;
}

.meta {
  font-style: italic;
  font-size: 7px;
}
</style>
