<script setup lang="ts">
import chroma from 'chroma-js'
import { VULPES_MONTHLY_PRESETS } from '~/utils/presets'

// Generate colors for a preset at a specific mode
// Light mode needs LOWER lightness for AAA contrast on light bg
const generatePresetColors = (preset: (typeof VULPES_MONTHLY_PRESETS)[0], mode: 'dark' | 'light') => {
  const isDark = mode === 'dark'
  const sat = preset.baseSaturation / 100
  const baseHue = preset.baseHue

  const colorAt = (offset: number, darkL: number, lightL: number) => {
    const hue = (baseHue + offset + 360) % 360
    const l = isDark ? darkL : lightL
    return chroma.hsl(hue, sat, l / 100).hex()
  }

  return {
    bg: chroma.hsl(0, 0, isDark ? 0.08 : 0.97).hex(),
    fg: chroma.hsl(0, 0, isDark ? 0.9 : 0.1).hex(),
    // Light mode: 20-28% lightness for AAA contrast on white
    // Dark mode: 55-65% lightness for contrast on dark bg
    base: colorAt(0, 55, 25),
    keyword: colorAt(preset.keywordOffset, 60, 22),
    string: colorAt(preset.stringOffset, 55, 28),
    function: colorAt(preset.functionOffset, 58, 24),
    number: colorAt(preset.numberOffset, 62, 30),
    comment: colorAt(0, 45, 45),
    type: colorAt(preset.typeOffset, 60, 26),
    constant: colorAt(preset.constantOffset, 58, 27),
  }
}

// Mini code sample for each preset
const miniCode = [
  { type: 'keyword', text: 'const' },
  { type: 'space', text: ' ' },
  { type: 'constant', text: 'VULPES' },
  { type: 'space', text: ' = ' },
  { type: 'function', text: 'dream' },
  { type: 'punct', text: '(' },
  { type: 'number', text: '330' },
  { type: 'punct', text: ')' },
]

// Format month name
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const getMonthName = (month: number) => monthNames[month - 1]

// Emit preset selection
const emit = defineEmits<{
  (e: 'select', preset: (typeof VULPES_MONTHLY_PRESETS)[0]): void
}>()
</script>

<template>
  <div class="preset-showcase">
    <div class="showcase-header">
      <h2>Twelve Moons</h2>
      <p>A year-long journey through the color wheel</p>
    </div>

    <div class="preset-grid">
      <div
        v-for="preset in VULPES_MONTHLY_PRESETS"
        :key="preset.id"
        class="preset-card"
        @click="emit('select', preset)"
      >
        <!-- Month label -->
        <div class="preset-label">
          <span class="month">{{ getMonthName(preset.month) }}</span>
          <span class="hue">{{ preset.baseHue }}°</span>
        </div>

        <!-- Dark dominant with light accent strip -->
        <div class="split-preview">
          <!-- Dark mode - dominant -->
          <div
            class="preview-main"
            :style="{ background: generatePresetColors(preset, 'dark').bg }"
          >
            <div class="mini-code">
              <template v-for="(token, i) in miniCode" :key="i">
                <span
                  v-if="token.type !== 'space'"
                  :style="{
                    color:
                      token.type === 'punct'
                        ? generatePresetColors(preset, 'dark').fg
                        : generatePresetColors(preset, 'dark')[token.type as keyof ReturnType<typeof generatePresetColors>],
                  }"
                  >{{ token.text }}</span
                >
                <span v-else :style="{ color: generatePresetColors(preset, 'dark').fg }">{{
                  token.text
                }}</span>
              </template>
            </div>
          </div>

          <!-- Light mode - thin accent strip -->
          <div
            class="preview-accent"
            :style="{ background: generatePresetColors(preset, 'light').bg }"
          >
            <div
              class="accent-dot"
              :style="{ background: generatePresetColors(preset, 'light').base }"
            ></div>
          </div>
        </div>

        <!-- Color accent bar -->
        <div
          class="accent-bar"
          :style="{
            background: `linear-gradient(90deg,
              ${generatePresetColors(preset, 'dark').base},
              ${generatePresetColors(preset, 'dark').keyword},
              ${generatePresetColors(preset, 'dark').string},
              ${generatePresetColors(preset, 'dark').function})`,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preset-showcase {
  padding: 24px;
}

.showcase-header {
  text-align: center;
  margin-bottom: 32px;
}

.showcase-header h2 {
  font-size: 24px;
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin: 0 0 8px 0;
  opacity: 0.9;
}

.showcase-header p {
  font-size: 12px;
  opacity: 0.6;
  letter-spacing: 1px;
  margin: 0;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1200px) {
  .preset-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 800px) {
  .preset-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.preset-card {
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid rgba(128, 128, 128, 0.2);
}

.preset-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.preset-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(128, 128, 128, 0.1);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.preset-label .month {
  font-weight: bold;
}

.preset-label .hue {
  opacity: 0.6;
  font-family: monospace;
}

.split-preview {
  display: flex;
  height: 72px;
}

.preview-main {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 12px 10px;
}

.preview-accent {
  width: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.accent-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  opacity: 0.8;
}

.mini-code {
  font-family: 'Monaspace Krypton', 'Monaco', monospace;
  font-size: 9px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.accent-bar {
  height: 3px;
}
</style>
