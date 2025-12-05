<script setup lang="ts">
import chroma from 'chroma-js'
const { colors } = useTheme()

interface ColorPoint {
  name: string
  color: string
  hue: number
  saturation: number
  lightness: number
  x: number
  y: number
}

// Computed color points - automatically updates when colors change
const colorPoints = computed(() => {
  const palette: ColorPoint[] = []
  const size = 200 // visualization radius

  // Base colors
  const colorMap: Record<string, string> = {
    bg: colors.value.bg,
    bg_alt: colors.value.bg_alt,
    fg: colors.value.fg,
    base: colors.value.base,
    error: colors.value.error,
    warning: colors.value.warning,
    success: colors.value.success,
    info: colors.value.info,
    hint: colors.value.hint,
    comment: colors.value.comment,
    keyword: colors.value.keyword,
    string: colors.value.string,
    number: colors.value.number,
    boolean: colors.value.boolean,
    function: colors.value.function,
    constant: colors.value.constant,
    type: colors.value.type,
    variable: colors.value.variable,
    operator: colors.value.operator,
    builtin: colors.value.builtin,
    parameter: colors.value.parameter,
    property: colors.value.property,
    namespace: colors.value.namespace,
    macro: colors.value.macro,
    tag: colors.value.tag,
    punctuation: colors.value.punctuation,
    heading: colors.value.heading,
    selection: colors.value.selection,
    cursor: colors.value.cursor,
    cursorline: colors.value.cursorline,
  }

  Object.entries(colorMap).forEach(([name, hex]) => {
    try {
      const c = chroma(hex)
      const [h, s, l] = c.hsl()

      // Convert hue to radians (0-360 -> 0-2π)
      const angle = ((h || 0) * Math.PI) / 180

      // Saturation determines distance from center (0-1 -> 0-radius)
      const radius = (s || 0) * size

      // Calculate x,y position
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      palette.push({
        name,
        color: hex,
        hue: h || 0,
        saturation: s || 0,
        lightness: l || 0,
        x,
        y,
      })
    } catch {
      // Skip invalid colors
    }
  })

  return palette
})

// ANSI palette as outer ring - also computed for reactivity
const ansiRing = computed(() => {
  return Array.from({ length: 16 }, (_, i) => {
    const color = colors.value.palette[i]
    const angle = (i / 16) * 2 * Math.PI
    const radius = 220 // Outer ring
    return {
      color,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      index: i,
    }
  })
})

const showLabels = ref(false)
</script>

<template>
  <div class="wheel-container">
    <!-- SVG Color Wheel -->
    <svg
      viewBox="-250 -250 500 500"
      class="color-wheel"
      @mouseenter="showLabels = true"
      @mouseleave="showLabels = false"
    >
      <!-- Radial gradient background (hue wheel) -->
      <defs>
        <radialGradient id="saturation-gradient">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.05" />
        </radialGradient>

        <!-- Hue circle for reference -->
        <linearGradient id="hue-0" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="hsl(0, 100%, 50%)" />
          <stop offset="100%" stop-color="hsl(360, 100%, 50%)" />
        </linearGradient>
      </defs>

      <!-- Center dot -->
      <circle cx="0" cy="0" r="2" :fill="colors.comment" opacity="0.3" />

      <!-- Concentric saturation rings -->
      <circle
        v-for="ring in [0.25, 0.5, 0.75, 1]"
        :key="ring"
        cx="0"
        cy="0"
        :r="ring * 200"
        fill="none"
        :stroke="colors.comment"
        stroke-width="0.5"
        opacity="0.1"
      />

      <!-- ANSI palette outer ring -->
      <g class="ansi-ring">
        <circle
          v-for="ansi in ansiRing"
          :key="ansi.index"
          :cx="ansi.x"
          :cy="ansi.y"
          r="8"
          :fill="ansi.color"
          :stroke="colors.bg"
          stroke-width="1"
          opacity="0.9"
          class="ansi-dot"
        >
          <title>ANSI {{ ansi.index }}</title>
        </circle>
      </g>

      <!-- Theme color points -->
      <g class="color-points">
        <g v-for="point in colorPoints" :key="point.name" class="point-group">
          <!-- Color dot -->
          <circle
            :cx="point.x"
            :cy="point.y"
            :r="4 + point.lightness * 3"
            :fill="point.color"
            :stroke="colors.fg"
            stroke-width="0.5"
            opacity="0.95"
            class="color-dot"
          >
            <title>{{ point.name }}: {{ point.color }}</title>
          </circle>

          <!-- Label (on hover) -->
          <text
            v-if="showLabels"
            :x="point.x + 8"
            :y="point.y + 2"
            :fill="colors.comment"
            font-size="6"
            font-family="monospace"
            opacity="0.7"
          >
            {{ point.name }}
          </text>
        </g>
      </g>

      <!-- Axis lines -->
      <line
        x1="-240"
        y1="0"
        x2="240"
        y2="0"
        :stroke="colors.comment"
        stroke-width="0.5"
        opacity="0.1"
      />
      <line
        x1="0"
        y1="-240"
        x2="0"
        y2="240"
        :stroke="colors.comment"
        stroke-width="0.5"
        opacity="0.1"
      />
    </svg>

    <!-- Legend -->
    <div class="legend" :style="{ color: colors.comment }">
      <div class="legend-item">
        <span class="key">angle</span>
        <span class="value">hue (0-360°)</span>
      </div>
      <div class="legend-item">
        <span class="key">radius</span>
        <span class="value">saturation (0-100%)</span>
      </div>
      <div class="legend-item">
        <span class="key">size</span>
        <span class="value">lightness (0-100%)</span>
      </div>
      <div class="legend-item">
        <span class="key">outer ring</span>
        <span class="value">ansi 0-15</span>
      </div>
      <div class="meta" :style="{ color: colors.comment, opacity: 0.5 }">
        hover to reveal labels
      </div>
    </div>
  </div>
</template>

<style scoped>
.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
}

.color-wheel {
  width: 100%;
  max-width: 500px;
  height: auto;
  filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.1));
}

.color-dot,
.ansi-dot {
  /* Smooth transitions when colors change */
  transition:
    cx 0.3s ease,
    cy 0.3s ease,
    r 0.2s ease,
    opacity 0.2s ease,
    fill 0.3s ease;
  cursor: pointer;
}

.color-dot:hover {
  r: 8;
  opacity: 1;
}

.ansi-dot:hover {
  opacity: 1;
}

.point-group text {
  pointer-events: none;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 9px;
  font-family: 'Monaspace Krypton', monospace;
  letter-spacing: 0.3px;
  opacity: 0.7;
}

.legend-item {
  display: flex;
  gap: 12px;
}

.key {
  text-transform: uppercase;
  font-weight: 600;
  font-size: 7px;
  letter-spacing: 0.8px;
  min-width: 60px;
}

.value {
  opacity: 0.6;
}

.meta {
  margin-top: 8px;
  font-style: italic;
  font-size: 7px;
  text-align: center;
}
</style>
