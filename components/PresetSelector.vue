<script setup lang="ts">
import { VULPES_MONTHLY_PRESETS, type ThemePreset } from '~/utils/presets'

const { colors } = useTheme()

const emit = defineEmits<{
  loadPreset: [preset: ThemePreset]
}>()

const currentMonth = new Date().getMonth() + 1

const loadPreset = (preset: ThemePreset) => {
  emit('loadPreset', preset)
}

// Get month abbreviation
const getMonthAbbr = (month: number): string => {
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ]
  return months[month - 1]
}

// Generate preview color for each preset
const getPreviewColor = (hue: number, sat: number, light: number): string => {
  return `hsl(${hue}, ${sat}%, ${light}%)`
}
</script>

<template>
  <div class="preset-selector" :style="{ background: colors.bg, borderColor: colors.base }">
    <div class="preset-header" :style="{ borderBottom: `1px solid ${colors.base}40` }">
      <span :style="{ color: colors.base, fontWeight: 'bold', fontSize: '11px' }">
        🦊 VULPES MONTHLY THEMES
      </span>
      <span :style="{ marginLeft: 'auto', fontSize: '8px', color: colors.hint }">
        chromatic journey through the year
      </span>
    </div>

    <div class="presets-grid">
      <button
        v-for="preset in VULPES_MONTHLY_PRESETS"
        :key="preset.id"
        class="preset-button"
        :class="{ 'is-current-month': preset.month === currentMonth }"
        :style="{
          borderColor: preset.month === currentMonth ? colors.base : colors.comment + '40',
          background: colors.bg,
        }"
        @click="loadPreset(preset)"
      >
        <div
          class="preset-month"
          :style="{ color: colors.base, fontSize: '9px', fontWeight: 'bold' }"
        >
          {{ getMonthAbbr(preset.month) }}
        </div>
        <div
          class="preset-color-preview"
          :style="{
            background: getPreviewColor(
              preset.baseHue,
              preset.baseSaturation,
              preset.baseLightness
            ),
            boxShadow: `0 0 8px ${getPreviewColor(preset.baseHue, preset.baseSaturation, preset.baseLightness)}40`,
          }"
        ></div>
        <div class="preset-name" :style="{ color: colors.fg, fontSize: '7px' }">
          {{ preset.name.split('-')[1] }}
        </div>
      </button>
    </div>

    <div
      class="preset-footer"
      :style="{
        borderTop: `1px solid ${colors.comment}40`,
        color: colors.hint,
        fontSize: '7px',
        padding: '4px 6px',
      }"
    >
      Click a month to load its theme • Current: {{ getMonthAbbr(currentMonth) }}
    </div>
  </div>
</template>

<style scoped>
.preset-selector {
  width: 100%;
  border: 1px solid;
  display: flex;
  flex-direction: column;
}

.preset-header {
  display: flex;
  padding: 6px 8px;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 4px;
  padding: 6px;
}

.preset-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px 2px;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s;
  background: none;
  position: relative;
  min-width: 0;
}

.preset-button:hover {
  transform: translateY(-2px);
  filter: brightness(1.2);
}

.preset-button.is-current-month {
  border-width: 2px;
}

.preset-button.is-current-month::after {
  content: '•';
  position: absolute;
  top: 1px;
  right: 2px;
  font-size: 10px;
}

.preset-color-preview {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
}

.preset-month {
  font-size: 8px;
  letter-spacing: 0.3px;
}

.preset-name {
  font-size: 6px;
  text-align: center;
  line-height: 1.1;
  text-transform: capitalize;
  word-break: break-word;
  hyphens: auto;
}

.preset-footer {
  text-align: center;
}
</style>
