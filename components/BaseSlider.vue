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
</script>

<template>
  <div class="base-slider" :class="variantClasses">
    <label v-if="label || showValue" class="slider-label">
      <span v-if="label" class="slider-label-text" :title="tooltip">{{ label }}</span>
      <span v-if="showValue" class="slider-value">{{ modelValue }}</span>
    </label>

    <div class="slider-track-wrapper">
      <div class="slider-track" :style="trackStyle">
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
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
  transition: all var(--timing-normal) var(--ease-spring);
}

.base-slider:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, var(--opacity-subtle)) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  padding: var(--spacing-md) 10px;
  margin: -4px -10px;
  border-radius: var(--radius-md);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 4px 12px rgba(0, 0, 0, 0.1);
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
  color: rgba(255, 255, 255, var(--opacity-text-muted));
  transition: all var(--timing-fast) var(--ease-spring);
  cursor: help;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.base-slider:hover .slider-label-text {
  color: rgba(255, 255, 255, 0.95);
  transform: translateX(2px);
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.slider-value {
  font-variant-numeric: tabular-nums;
  color: #fff;
  font-weight: 700;
  min-width: 42px;
  text-align: right;
  padding: 5px 10px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, var(--opacity-muted)) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
  border-radius: var(--radius-sm);
  font-size: 10.5px;
  transition: all var(--timing-slow) var(--ease-spring);
  box-shadow:
    inset 0 1px 3px rgba(0, 0, 0, 0.15),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  letter-spacing: 0.02em;
}

.base-slider:hover .slider-value {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.12) 100%);
  transform: scale(1.08) translateY(-1px);
  box-shadow:
    inset 0 1px 4px rgba(0, 0, 0, 0.2),
    inset 0 -1px 0 rgba(255, 255, 255, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.slider--dragging .slider-value {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.18) 100%);
  transform: scale(1.12) translateY(-2px);
  box-shadow:
    inset 0 2px 6px rgba(0, 0, 0, 0.25),
    inset 0 -1px 0 rgba(255, 255, 255, 0.2),
    0 6px 20px rgba(0, 0, 0, 0.2),
    0 0 0 2px rgba(255, 255, 255, 0.2),
    0 0 20px rgba(255, 255, 255, 0.15);
}

/* Track Wrapper */
.slider-track-wrapper {
  position: relative;
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
}

.slider-track {
  position: absolute;
  width: 100%;
  height: 6px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.12) 100%
  );
  border-radius: var(--radius-md);
  overflow: visible;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all var(--timing-slow) var(--ease-spring);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.slider-progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.35) 50%,
    rgba(255, 255, 255, 0.25) 100%
  );
  border-radius: var(--radius-md);
  pointer-events: none;
  transition: width var(--timing-fast) var(--ease-spring);
  box-shadow:
    0 0 12px rgba(255, 255, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.slider-input {
  position: absolute;
  width: 100%;
  height: 24px;
  opacity: 0;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  z-index: 2;
}

.slider-input:disabled {
  cursor: not-allowed;
}

/* Visible thumb */
.slider-input::before {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  left: calc(var(--progress, 50%) - 7px);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.3),
    0 0 0 2px rgba(0, 0, 0, 0.1);
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

/* Webkit-specific thumb styling */
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 100%);
  cursor: grab;
  border-radius: 50%;
  box-shadow:
    0 3px 12px rgba(0, 0, 0, 0.35),
    0 1px 4px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -2px 4px rgba(0, 0, 0, 0.1),
    0 0 0 3px rgba(255, 255, 255, 0.15);
  transition: all var(--timing-normal) var(--ease-spring);
  position: relative;
  z-index: 3;
}

.slider-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 100%);
  cursor: grab;
  border-radius: 50%;
  border: none;
  box-shadow:
    0 3px 12px rgba(0, 0, 0, 0.35),
    0 1px 4px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -2px 4px rgba(0, 0, 0, 0.1),
    0 0 0 3px rgba(255, 255, 255, 0.15);
  transition: all var(--timing-normal) var(--ease-spring);
}

/* Hover States */
.base-slider:hover .slider-track {
  height: 8px;
  box-shadow:
    inset 0 2px 6px rgba(0, 0, 0, 0.35),
    inset 0 -1px 0 rgba(255, 255, 255, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.15),
    0 0 20px rgba(255, 255, 255, 0.1);
}

.slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.35) translateY(-1px);
  cursor: grabbing;
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(245, 245, 255, 1) 100%);
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 1),
    inset 0 -2px 6px rgba(0, 0, 0, 0.12),
    0 0 0 4px rgba(255, 255, 255, 0.25),
    0 0 30px rgba(255, 255, 255, 0.3);
}

.slider-input::-moz-range-thumb:hover {
  transform: scale(1.35) translateY(-1px);
  cursor: grabbing;
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(245, 245, 255, 1) 100%);
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 1),
    inset 0 -2px 6px rgba(0, 0, 0, 0.12),
    0 0 0 4px rgba(255, 255, 255, 0.25),
    0 0 30px rgba(255, 255, 255, 0.3);
}

/* Active/Dragging States */
.slider--dragging .slider-track {
  height: 10px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.15) 100%
  );
}

.slider--dragging .slider-progress {
  box-shadow:
    0 0 20px rgba(255, 255, 255, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.slider-input::-webkit-slider-thumb:active,
.slider--dragging .slider-input::-webkit-slider-thumb {
  transform: scale(1.25) translateY(-2px);
  cursor: grabbing;
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(240, 240, 255, 1) 100%);
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.35),
    inset 0 2px 0 rgba(255, 255, 255, 1),
    inset 0 -3px 8px rgba(0, 0, 0, 0.15),
    0 0 0 5px rgba(255, 255, 255, 0.35),
    0 0 40px rgba(255, 255, 255, 0.4);
}

.slider-input::-moz-range-thumb:active,
.slider--dragging .slider-input::-moz-range-thumb {
  transform: scale(1.25) translateY(-2px);
  cursor: grabbing;
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(240, 240, 255, 1) 100%);
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.35),
    inset 0 2px 0 rgba(255, 255, 255, 1),
    inset 0 -3px 8px rgba(0, 0, 0, 0.15),
    0 0 0 5px rgba(255, 255, 255, 0.35),
    0 0 40px rgba(255, 255, 255, 0.4);
}

/* PRIMARY VARIANT - Hero slider (like base hue) */
.slider--primary .slider-track {
  height: 10px;
  border-radius: var(--radius-lg);
  box-shadow:
    inset 0 3px 8px rgba(0, 0, 0, 0.4),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    0 2px 12px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(255, 255, 255, 0.1);
}

.slider--primary:hover .slider-track {
  height: 12px;
  box-shadow:
    inset 0 4px 10px rgba(0, 0, 0, 0.45),
    inset 0 -2px 0 rgba(255, 255, 255, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(255, 255, 255, 0.15);
}

.slider--primary .slider-input::-webkit-slider-thumb {
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(250, 250, 255, 1) 100%);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.4),
    0 2px 6px rgba(0, 0, 0, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 1),
    inset 0 -3px 6px rgba(0, 0, 0, 0.12),
    0 0 0 3px rgba(0, 0, 0, 0.15),
    0 0 0 5px rgba(255, 255, 255, 0.25);
}

.slider--primary .slider-input::-moz-range-thumb {
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(250, 250, 255, 1) 100%);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.4),
    0 2px 6px rgba(0, 0, 0, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 1),
    inset 0 -3px 6px rgba(0, 0, 0, 0.12),
    0 0 0 3px rgba(0, 0, 0, 0.15),
    0 0 0 5px rgba(255, 255, 255, 0.25);
}

.slider--primary .slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.45) translateY(-2px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.4),
    inset 0 3px 0 rgba(255, 255, 255, 1),
    inset 0 -4px 10px rgba(0, 0, 0, 0.15),
    0 0 0 4px rgba(0, 0, 0, 0.2),
    0 0 0 7px rgba(255, 255, 255, 0.35),
    0 0 50px rgba(255, 255, 255, 0.4);
}

.slider--primary .slider-input::-moz-range-thumb:hover {
  transform: scale(1.45) translateY(-2px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.4),
    inset 0 3px 0 rgba(255, 255, 255, 1),
    inset 0 -4px 10px rgba(0, 0, 0, 0.15),
    0 0 0 4px rgba(0, 0, 0, 0.2),
    0 0 0 7px rgba(255, 255, 255, 0.35),
    0 0 50px rgba(255, 255, 255, 0.4);
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
  border-radius: 8px;
}

.slider--compact .slider-track {
  height: 5px;
  border-radius: 10px;
}

.slider--compact:hover .slider-track {
  height: 6px;
}

.slider--compact .slider-input::-webkit-slider-thumb {
  width: 14px;
  height: 14px;
}

.slider--compact .slider-input::-moz-range-thumb {
  width: 14px;
  height: 14px;
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

.slider--disabled .slider-track {
  background: rgba(255, 255, 255, 0.08);
}

.slider--disabled:hover {
  background: transparent;
  padding: 6px 0;
  margin: 0;
}

/* Dark/Light Mode Support */
@media (prefers-color-scheme: light) {
  .slider-label-text {
    color: rgba(0, 0, 0, 0.6);
  }

  .base-slider:hover .slider-label-text {
    color: rgba(0, 0, 0, 0.9);
  }

  .slider-value {
    color: #000;
    background: rgba(0, 0, 0, 0.08);
  }

  .slider-track {
    background: rgba(0, 0, 0, 0.15);
  }

  .slider-progress {
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
  }
}
</style>
