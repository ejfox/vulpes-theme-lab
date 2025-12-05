<script setup lang="ts">
type ContrastLevel = 'AAA' | 'AA' | 'fail'

const props = defineProps<{
  colors: Record<string, string>
  state: any
  highlightedColor?: string | null
  getTextColor: (bgColor: string) => string
  getContrastRatio: (color1: string, color2: string) => number
  getContrastLevel: (ratio: number) => ContrastLevel
  getContrastIcon: (ratio: number) => string
  getMultiplierGradient: (colorName: string) => string
  getOffsetGradient: (colorName: string) => string
  getLightnessGradient: (colorName: string) => string
}>()

const emit = defineEmits<{
  (e: 'update:linked', payload: { name: string; value: boolean }): void
  (e: 'update:multiplier', payload: { name: string; value: number }): void
  (e: 'update:offset', payload: { name: string; value: number }): void
  (e: 'update:lightness', payload: { name: string; value: number }): void
  (e: 'color-math', payload: { name: string; math: string }): void
  (e: 'shuffle', name: string): void
  (e: 'reset', name: string): void
  (e: 'lock', payload: { name: string; level: 'AA' | 'AAA' }): void
  (e: 'pick', payload: { name: string; color: string }): void
}>()

const orderedSwatches = [
  'base',
  'error',
  'warning',
  'hint',
  'keyword',
  'string',
  'number',
  'function',
  'constant',
  'type',
  'variable',
  'operator',
  'builtin',
  'parameter',
  'property',
  'namespace',
  'macro',
  'tag',
  'punctuation',
  'heading',
  'comment',
  'fg',
  'bg',
]

const editableSwatches = new Set([
  'error',
  'warning',
  'keyword',
  'string',
  'number',
  'function',
  'constant',
  'type',
  'variable',
  'operator',
  'builtin',
  'parameter',
  'property',
  'namespace',
  'macro',
  'tag',
  'punctuation',
  'heading',
  'comment',
])

const swatchesWithColorPicker = new Set(['error'])

const multiplierFor = (name: string) =>
  (props.state?.[`${name}Multiplier` as keyof typeof props.state] as number) ?? 0
const offsetFor = (name: string) =>
  (props.state?.[`${name}Offset` as keyof typeof props.state] as number) ?? 0
const lightnessFor = (name: string) =>
  (props.state?.[`${name}Lightness` as keyof typeof props.state] as number) ?? 0
const linkedFor = (name: string) =>
  (props.state?.[`${name}Linked` as keyof typeof props.state] as boolean) ?? false
</script>

<template>
  <div class="swatches-float">
    <div class="swatches">
      <template v-for="name in orderedSwatches" :key="name">
        <div
          v-if="!editableSwatches.has(name)"
          class="swatch"
          :style="
            name === 'bg'
              ? { background: colors.bg, border: '1px solid ' + colors.comment, color: colors.fg }
              : { background: colors[name], color: getTextColor(colors[name]) }
          "
        >
          <span>{{ name === 'fg' ? 'foreground' : name === 'bg' ? 'background' : name }}</span>
          <code>{{ colors[name] }}</code>
        </div>

        <div
          v-else
          class="swatch editable"
          :class="{ highlighted: highlightedColor === name }"
          :style="{ background: colors[name], color: getTextColor(colors[name]) }"
        >
          <div class="swatch-header">
            <span class="color-name">{{ name }}</span>
            <code class="color-hex">{{ colors[name] }}</code>
          </div>

          <div
            class="contrast-info"
            :title="`Contrast ratio: ${getContrastRatio(colors[name], colors.bg).toFixed(2)}:1 (WCAG ${getContrastLevel(getContrastRatio(colors[name], colors.bg))})`"
          >
            <span class="contrast-icon">{{
              getContrastIcon(getContrastRatio(colors[name], colors.bg))
            }}</span>
            <span class="contrast-ratio"
              >{{ getContrastRatio(colors[name], colors.bg).toFixed(1) }}:1</span
            >
            <span class="contrast-level">{{
              getContrastLevel(getContrastRatio(colors[name], colors.bg))
            }}</span>
          </div>

          <div class="wcag-locks">
            <button
              class="lock-btn lock-aa"
              title="lock to WCAG AA (4.5:1)"
              @click="emit('lock', { name, level: 'AA' })"
            >
              Lock AA
            </button>
            <button
              class="lock-btn lock-aaa"
              title="lock to WCAG AAA (7:1)"
              @click="emit('lock', { name, level: 'AAA' })"
            >
              Lock AAA
            </button>
          </div>

          <div v-if="swatchesWithColorPicker.has(name)" class="color-picker-wrapper">
            <input
              type="color"
              :value="colors[name]"
              class="color-picker"
              title="pick any color"
              @input="
                (e) =>
                  emit('pick', {
                    name,
                    color: (e.target as HTMLInputElement).value,
                  })
              "
            />
            <span class="picker-label">PICK</span>
          </div>

          <div class="swatch-tools">
            <button
              class="tool-btn"
              :class="{ active: linkedFor(name) }"
              :title="linkedFor(name) ? 'unlink from global offset' : 'link to global offset'"
              @click="emit('update:linked', { name, value: !linkedFor(name) })"
            >
              {{ linkedFor(name) ? 'LINK' : 'UNLNK' }}
            </button>
            <button class="tool-btn" title="randomize" @click="emit('shuffle', name)">RAND</button>
            <button class="tool-btn" title="reset" @click="emit('reset', name)">RESET</button>
            <select
              class="tool-select"
              title="color theory"
              @change="
                (e) => {
                  const el = e.target as HTMLSelectElement
                  if (el.value) {
                    emit('color-math', { name, math: el.value })
                    el.value = ''
                  }
                }
              "
            >
              <option value="">math</option>
              <option value="complementary">180°</option>
              <option value="triadic">120°</option>
              <option value="analogous">30°</option>
            </select>
          </div>

          <div class="value-display">
            {{
              linkedFor(name)
                ? (state.hueOffset * multiplierFor(name) + offsetFor(name)).toFixed(0)
                : offsetFor(name)
            }}° · L{{ lightnessFor(name) }}
          </div>

          <input
            v-if="linkedFor(name)"
            type="range"
            class="offset-slider linked"
            :style="{ background: getMultiplierGradient(name) }"
            min="-5"
            max="5"
            step="0.1"
            :value="multiplierFor(name)"
            title="multiplier: how this color relates to global offset"
            @input="
              emit('update:multiplier', {
                name,
                value: Number(($event.target as HTMLInputElement).value),
              })
            "
          />

          <input
            type="range"
            class="offset-slider"
            :class="{ 'add-mode': linkedFor(name) }"
            :style="{ background: getOffsetGradient(name) }"
            min="-180"
            max="180"
            step="1"
            :value="offsetFor(name)"
            :title="
              linkedFor(name)
                ? 'fine-tune: additional offset on top of global'
                : 'offset: direct hue adjustment'
            "
            @input="
              emit('update:offset', {
                name,
                value: Number(($event.target as HTMLInputElement).value),
              })
            "
          />

          <input
            type="range"
            class="lightness-slider"
            :style="{ background: getLightnessGradient(name) }"
            min="0"
            max="100"
            step="1"
            :value="lightnessFor(name)"
            title="lightness: brightness (50 = default)"
            @input="
              emit('update:lightness', {
                name,
                value: Number(($event.target as HTMLInputElement).value),
              })
            "
          />

          <code>{{ colors[name] }}</code>
        </div>
      </template>
    </div>
  </div>
</template>
