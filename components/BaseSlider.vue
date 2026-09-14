<script setup lang="ts">
import { useDebounceFn, useVModel, useMousePressed } from '@vueuse/core'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
  description?: string
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

// Bipolar sliders (range crosses zero, e.g. hue offset -180..180) origin their
// fill from the zero mark so the bar reads as signed deviation, not just amount.
const isBipolar = computed(() => props.min < 0 && props.max > 0)

const zeroPercent = computed(() => ((0 - props.min) / (props.max - props.min)) * 100)

const fillLeft = computed(() =>
  isBipolar.value ? Math.min(zeroPercent.value, progress.value) : 0
)

const fillWidth = computed(() =>
  isBipolar.value ? Math.abs(progress.value - zeroPercent.value) : progress.value
)

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

const valueBg = computed(() => 'transparent')
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
      <div class="slider-track" :style="{ background: trackBg, ...trackStyle }">
        <div
          v-if="!gradient"
          class="slider-fill"
          :style="{ left: `${fillLeft}%`, width: `${fillWidth}%` }"
        />
      </div>

      <div v-if="isBipolar && !gradient" class="slider-zero" :style="{ left: `${zeroPercent}%` }" />

      <div class="slider-thumb" :style="{ left: `${progress}%` }" />

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

    <p v-if="description" class="slider-desc" :style="{ color: mutedTextColor }">
      {{ description }}
    </p>
  </div>
</template>

<style scoped>
.base-slider {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 8px;
  margin: 0 -8px;
  border-radius: 3px;
  transition: background 0.15s ease;
}

.base-slider:hover {
  background: rgba(255, 255, 255, 0.04);
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

.slider-desc {
  margin: 2px 0 0;
  font-size: 8px;
  line-height: 1.35;
  letter-spacing: 0.2px;
  opacity: 0.75;
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
  padding: 3px 0;
  font-size: 10px;
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
  height: 3px;
  border-radius: 999px;
  overflow: visible;
  transition: none;
}

.slider-fill {
  position: absolute;
  top: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.55);
  border-radius: 999px;
  pointer-events: none;
}

/* Signed-zero reference tick for bipolar sliders */
.slider-zero {
  position: absolute;
  top: 50%;
  width: 1px;
  height: 9px;
  background: rgba(255, 255, 255, 0.28);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2;
}

/* Visible thumb knob (the native input on top is transparent, handles interaction) */
.slider-thumb {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.22),
    0 2px 7px rgba(0, 0, 0, 0.32);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 3;
  transition:
    transform 0.16s cubic-bezier(0.2, 0.7, 0.3, 1),
    box-shadow 0.16s ease;
}

.base-slider:hover .slider-thumb {
  transform: translate(-50%, -50%) scale(1.12);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.26),
    0 3px 11px rgba(0, 0, 0, 0.42);
}

.slider--dragging .slider-thumb {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 5px 16px rgba(0, 0, 0, 0.5);
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
  width: 13px;
  height: 13px;
  background: #fff;
  cursor: grab;
  border-radius: 0;
  border: 1px solid rgba(0, 0, 0, 0.35);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
  position: relative;
  z-index: 3;
}

.slider-input::-moz-range-thumb {
  width: 13px;
  height: 13px;
  background: #fff;
  cursor: grab;
  border-radius: 0;
  border: 1px solid rgba(0, 0, 0, 0.35);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
}

/* Hover States */
.slider-input::-webkit-slider-thumb:hover {
  cursor: grab;
  transform: scale(1.18);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.slider-input::-moz-range-thumb:hover {
  cursor: grab;
  transform: scale(1.18);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

/* Active/Dragging States */
.slider-input::-webkit-slider-thumb:active,
.slider--dragging .slider-input::-webkit-slider-thumb {
  cursor: grabbing;
  transform: scale(1.08);
  box-shadow:
    0 0 0 4px rgba(255, 255, 255, 0.18),
    0 1px 4px rgba(0, 0, 0, 0.5);
}

.slider-input::-moz-range-thumb:active,
.slider--dragging .slider-input::-moz-range-thumb {
  cursor: grabbing;
  transform: scale(1.08);
  box-shadow:
    0 0 0 4px rgba(255, 255, 255, 0.18),
    0 1px 4px rgba(0, 0, 0, 0.5);
}

/* PRIMARY VARIANT - Hero slider (like base hue) */
.slider--primary .slider-track {
  height: 5px;
}

.slider--primary .slider-thumb {
  width: 17px;
  height: 17px;
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
  padding: 3px 0;
}

.slider--compact .slider-track {
  height: 3px;
  border-radius: 999px;
}

.slider--compact .slider-thumb {
  width: 11px;
  height: 11px;
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
