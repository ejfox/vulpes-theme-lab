<script setup lang="ts">
/**
 * Inline color swatch — just a clickable dot that emits 'click'.
 * No popover. The parent manages the popover.
 * If override is set, shows a ring to indicate custom color.
 */
const props = defineProps<{
  modelValue: string
  override: string
  label?: string
  size?: 'sm' | 'md'
}>()

defineEmits<{
  (e: 'click'): void
}>()

const { state } = useTheme()
const modeColor = (dark: string, light: string) => (state.value.mode === 'dark' ? dark : light)
const isOverridden = computed(() => props.override !== '')
const displayColor = computed(() => props.override || props.modelValue)
</script>

<template>
  <button
    class="color-swatch-btn"
    :class="[props.size || 'md', { overridden: isOverridden }]"
    :style="{
      '--swatch-color': displayColor,
      '--ring-color': isOverridden
        ? modeColor('rgba(255,200,100,0.7)', 'rgba(180,120,0,0.7)')
        : 'transparent',
    }"
    :title="label ? `${label}: ${displayColor}` : displayColor"
    @click="$emit('click')"
  >
    <span class="dot"></span>
    <span
      v-if="label"
      class="label"
      :style="{ color: modeColor('rgba(255,255,255,0.6)', 'rgba(0,0,0,0.6)') }"
      >{{ label }}</span
    >
  </button>
</template>

<style scoped>
.color-swatch-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: background 0.15s;
}

.color-swatch-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dot {
  display: block;
  border-radius: 50%;
  background: var(--swatch-color);
  box-shadow: 0 0 0 1.5px var(--ring-color);
  transition: all 0.2s;
}

.md .dot {
  width: 20px;
  height: 20px;
}

.sm .dot {
  width: 12px;
  height: 12px;
}

.color-swatch-btn:hover .dot {
  transform: scale(1.1);
}

.label {
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
</style>
