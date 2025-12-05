<script setup lang="ts">
import { useDebounceFn, useVModel, useMousePressed } from '@vueuse/core'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
  tooltip?: string
  variant?: 'primary' | 'standard' | 'compact'
  gradient?: string
  showValue?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  variant: 'standard',
  showValue: true,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

// Get theme state for dynamic colors
const { state } = useTheme()

const sliderRef = ref<HTMLInputElement>()

// Use VueUse composables
const localValue = useVModel(props, 'modelValue', emit)
const { pressed: isDragging } = useMousePressed({ target: sliderRef })

// Debounce emits during drag (fires max once per 16ms = ~60fps)
const debouncedUpdate = useDebounceFn((value: number) => {
  localValue.value = value
}, 16)

// Handle input with debouncing during drag
function handleInput(e: Event) {
  const value = Number((e.target as HTMLInputElement).value)
  if (isDragging.value) {
    debouncedUpdate(value)
  } else {
    localValue.value = value
  }
}

const variantClasses = computed(() => {
  const classes = [`slider--${props.variant}`]
  if (isDragging.value) classes.push('slider--dragging')
  if (props.disabled) classes.push('slider--disabled')
  return classes
})

const trackStyle = computed(() => {
  if (props.gradient) {
    return { background: props.gradient }
  }
  return {}
})

const progress = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100
})

// Dynamic colors based on theme mode
const textColor = computed(() => {
  return state.value.mode === 'dark' ? '#fff' : '#000'
})

const mutedTextColor = computed(() => {
  return state.value.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
})

const trackBg = computed(() => {
  return state.value.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.15)'
})

const valueBg = computed(() => {
  return state.value.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.08)'
})
</script>

<template>
  <div class="base-slider" :class="variantClasses">
    <label v-if="label || showValue" class="slider-label">
      <span
        v-if="label"
        class="slider-label-text"
        :title="tooltip"
        :style="{ color: mutedTextColor }"
      >{{ label }}</span>
      <span
        v-if="showValue"
        class="slider-value"
        :style="{ color: textColor, background: valueBg }"
      >{{ modelValue }}</span>
    </label>

    <div class="slider-track-wrapper">
      <div class="slider-track" :style="{ ...trackStyle, background: trackBg }">
        <div class="slider-progress" :style="{ width: `${progress}%` }" />
      </div>

      <input
        ref="sliderRef"
        type="range"
        class="slider-input"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :title="tooltip"
        @input="handleInput"
      />
    </div>
  </div>
</template>

<style scoped>
.base-slider {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 0;
  transition: none;
}

.base-slider:hover {
  background: rgba(255, 255, 255, 0.03);
  padding: 8px 6px;
  margin: -2px -6px;
}

.slider-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  user-select: none;
}

.slider-label-text {
  cursor: help;
  font-weight: 500;
  font-size: 9px;
}

.slider-value {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  min-width: 38px;
  text-align: right;
  padding: 3px 8px;
  font-size: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Track Wrapper */
.slider-track-wrapper {
  position: relative;
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
}

.slider-track {
  position: absolute;
  width: 100%;
  height: 4px;
  border-radius: 0;
  overflow: visible;
  transition: none;
}

.slider-progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 0;
  pointer-events: none;
  transition: width 0.05s linear;
}

.slider-input {
  position: absolute;
  width: 100%;
  height: 20px;
  opacity: 0;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  z-index: 2;
}

.slider-input:disabled {
  cursor: not-allowed;
}

/* Webkit-specific thumb styling */
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #fff;
  cursor: grab;
  border-radius: 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  transition: none;
  position: relative;
  z-index: 3;
}

.slider-input::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #fff;
  cursor: grab;
  border-radius: 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  transition: none;
}

/* Hover States */
.slider-input::-webkit-slider-thumb:hover {
  cursor: grabbing;
}

.slider-input::-moz-range-thumb:hover {
  cursor: grabbing;
}

/* Active/Dragging States */
.slider-input::-webkit-slider-thumb:active,
.slider--dragging .slider-input::-webkit-slider-thumb {
  cursor: grabbing;
}

.slider-input::-moz-range-thumb:active,
.slider--dragging .slider-input::-moz-range-thumb {
  cursor: grabbing;
}

/* PRIMARY VARIANT - Hero slider (like base hue) */
.slider--primary .slider-track {
  height: 8px;
}

.slider--primary .slider-input::-webkit-slider-thumb {
  width: 16px;
  height: 16px;
}

.slider--primary .slider-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
}

/* COMPACT VARIANT - Minimal slider */
.slider--compact {
  gap: 6px;
  padding: 5px 0;
}

.slider--compact .slider-label {
  font-size: 8.5px;
}

.slider--compact .slider-value {
  min-width: 36px;
  font-size: 9px;
  padding: 3px 8px;
  border-radius: 0;
}

.slider--compact .slider-track {
  height: 3px;
  border-radius: 0;
}

.slider--compact .slider-input::-webkit-slider-thumb {
  width: 10px;
  height: 10px;
}

.slider--compact .slider-input::-moz-range-thumb {
  width: 10px;
  height: 10px;
}

.slider--compact .slider-track-wrapper {
  height: 20px;
}

/* DISABLED STATE */
.slider--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slider--disabled .slider-label-text,
.slider--disabled .slider-value {
  opacity: 0.6;
}

.slider--disabled:hover {
  background: transparent;
  padding: 6px 0;
  margin: 0;
}
</style>
