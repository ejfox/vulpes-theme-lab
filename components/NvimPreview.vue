<script setup lang="ts">
const { colors, options, state } = useTheme()
const { setHighlightedColor, clearHighlightedColor } = useHighlightedColor()

const codeLines = [
  {
    num: 1,
    text: 'import { useState, computed } from "vue"',
    highlighted: false,
    error: false,
    keyword: 'import',
    builtin: 'useState, computed',
    string: '"vue"',
  },
  {
    num: 2,
    text: 'import type { ThemeColors, ColorPalette } from "@/types"',
    highlighted: false,
    error: false,
    keyword: 'import type',
    type: 'ThemeColors, ColorPalette',
    string: '"@/types"',
  },
  {
    num: 3,
    text: 'import chroma from "chroma-js"',
    highlighted: false,
    error: false,
    keyword: 'import',
    string: '"chroma-js"',
  },
  { num: 4, text: '', highlighted: false, error: false },
  {
    num: 5,
    text: '// HSL-based theme generation with mathematical precision',
    highlighted: false,
    error: false,
    comment: true,
  },
  {
    num: 6,
    text: '// Tuftian design: ±7° hue offset for minimal variation',
    highlighted: false,
    error: false,
    comment: true,
  },
  { num: 7, text: '', highlighted: false, error: false },
  {
    num: 8,
    text: 'interface ThemeConfig {',
    highlighted: false,
    error: false,
    keyword: 'interface',
    type: 'ThemeConfig',
    punctuation: '{',
  },
  {
    num: 9,
    text: '  baseHue: number',
    highlighted: false,
    error: false,
    property: 'baseHue',
    punctuation: ':',
    type: 'number',
  },
  {
    num: 10,
    text: '  offset: number',
    highlighted: false,
    error: false,
    property: 'offset',
    punctuation: ':',
    type: 'number',
  },
  {
    num: 11,
    text: '  saturation: number',
    highlighted: false,
    error: false,
    property: 'saturation',
    punctuation: ':',
    type: 'number',
  },
  {
    num: 12,
    text: '  palette: ColorPalette',
    highlighted: false,
    error: false,
    property: 'palette',
    punctuation: ':',
    type: 'ColorPalette',
  },
  { num: 13, text: '}', highlighted: false, error: false, punctuation: '}' },
  { num: 14, text: '', highlighted: false, error: false },
  {
    num: 15,
    text: 'export const useTheme = () => {',
    highlighted: false,
    error: false,
    keyword: 'export const',
    func: 'useTheme',
  },
  {
    num: 16,
    text: '  const state = useState<ThemeConfig>("theme", () => ({',
    highlighted: false,
    error: false,
    keyword: 'const',
    builtin: 'useState',
    type: 'ThemeConfig',
  },
  {
    num: 17,
    text: '    baseHue: 267,  // Catppuccin mauve',
    highlighted: true,
    error: false,
    property: 'baseHue',
    number: '267',
    comment: '// Catppuccin mauve',
  },
  {
    num: 18,
    text: '    offset: 7,',
    highlighted: true,
    error: false,
    property: 'offset',
    number: '7',
  },
  {
    num: 19,
    text: '    saturation: 0.85',
    highlighted: false,
    error: true,
    property: 'saturation',
    number: '0.85',
  },
  {
    num: 20,
    text: "    // Expected ',' after property value",
    highlighted: false,
    error: false,
    comment: true,
  },
  { num: 21, text: '  }))', highlighted: false, error: false, punctuation: '))' },
  { num: 22, text: '', highlighted: false, error: false },
  {
    num: 23,
    text: '  const generateColor = async (hue: number, offset: number) => {',
    highlighted: false,
    error: false,
    keyword: 'const async',
    func: 'generateColor',
    parameter: 'hue, offset',
    type: 'number',
  },
  {
    num: 24,
    text: '    return chroma.hsl(hue + offset, 0.85, 0.60).hex()',
    highlighted: false,
    error: false,
    keyword: 'return',
    namespace: 'chroma',
    func: 'hsl, hex',
    parameter: 'hue, offset',
  },
  { num: 25, text: '  }', highlighted: false, error: false, punctuation: '}' },
  { num: 26, text: '', highlighted: false, error: false },
  {
    num: 27,
    text: '  const colors = computed(() => ({',
    highlighted: false,
    error: false,
    keyword: 'const',
    builtin: 'computed',
  },
  {
    num: 28,
    text: '    error: "#f38ba8",    // Catppuccin red',
    highlighted: false,
    error: false,
    property: 'error',
    string: '"#f38ba8"',
    comment: '// Catppuccin red',
  },
  {
    num: 29,
    text: '    keyword: "#cba6f7",  // Catppuccin mauve',
    highlighted: false,
    error: false,
    property: 'keyword',
    string: '"#cba6f7"',
    comment: '// Catppuccin mauve',
  },
  {
    num: 30,
    text: '    string: "#a6e3a1",   // Catppuccin green',
    highlighted: false,
    error: false,
    property: 'string',
    string: '"#a6e3a1"',
    comment: '// Catppuccin green',
  },
  { num: 31, text: '  }))', highlighted: false, error: false, punctuation: '))' },
  { num: 32, text: '', highlighted: false, error: false },
  {
    num: 33,
    text: '  return { state, colors }',
    highlighted: false,
    error: false,
    keyword: 'return',
    variable: 'state, colors',
  },
  { num: 34, text: '}', highlighted: false, error: false, punctuation: '}' },
]
</script>

<template>
  <div
    class="nvim"
    :style="{
      background: colors.bg,
      color: colors.fg,
      opacity: state.backgroundOpacity / 100,
      backdropFilter: `blur(${state.backgroundBlur}px)`,
      WebkitBackdropFilter: `blur(${state.backgroundBlur}px)`,
      borderColor: colors.base,
    }"
  >
    <div
      class="header"
      :style="{
        background: colors.base + '15',
        borderBottom: `1px solid ${colors.base}`,
        color: colors.base,
      }"
    >
      <span style="font-weight: bold; font-size: 10px">NEOVIM EDITOR</span>
      <span :style="{ marginLeft: 'auto', fontSize: '8px', color: colors.hint }">
        lsp • telescope • diagnostics
      </span>
    </div>
    <!-- Tab line -->
    <div
      class="tabline"
      :style="{ background: colors.bg, borderBottom: `1px solid ${colors.comment}30` }"
    >
      <span class="tab active" :style="{ background: colors.base + '20', color: colors.base }">
        useTheme.ts
      </span>
      <span class="tab" :style="{ color: colors.comment }"> ColorControls.vue </span>
      <span class="tab" :style="{ color: colors.comment }"> index.vue </span>
    </div>

    <!-- Editor content -->
    <div class="editor-content">
      <div
        class="gutter"
        :style="{ background: colors.bg, borderRight: `1px solid ${colors.comment}20` }"
      >
        <div
          v-for="line in codeLines"
          :key="line.num"
          class="line-number"
          :style="{
            color: line.highlighted ? colors.base : colors.comment,
            background: line.highlighted ? colors.warning + '10' : 'transparent',
          }"
        >
          {{ line.num }}
        </div>
      </div>

      <div class="code-area">
        <div
          v-for="line in codeLines"
          :key="line.num"
          class="code-line"
          :style="{
            background: line.highlighted ? colors.warning + '15' : 'transparent',
            borderLeft: line.highlighted ? `2px solid ${colors.warning}` : 'none',
            paddingLeft: line.highlighted ? '10px' : '12px',
          }"
        >
          <span v-if="line.text">
            <template v-if="line.comment">
              <span
                :style="{
                  color: colors.comment,
                  fontStyle: options.italicComments ? 'italic' : 'normal',
                }"
                >{{ line.text }}</span
              >
            </template>
            <template v-else-if="line.keyword">
              <span
                :style="{
                  color: colors.keyword,
                  fontWeight: options.boldKeywords ? 'bold' : 'normal',
                }"
                @mouseenter="setHighlightedColor('keyword')"
                @mouseleave="clearHighlightedColor()"
                title="keyword color"
                class="hoverable-color"
                >{{ line.keyword }}</span
              ><span :style="{ color: colors.fg }"> </span>
              <span
                v-if="line.builtin"
                :style="{ color: colors.builtin }"
                @mouseenter="setHighlightedColor('builtin')"
                @mouseleave="clearHighlightedColor()"
                title="builtin color"
                class="hoverable-color"
                >{{ line.builtin }}</span
              >
              <span
                v-if="line.type"
                :style="{ color: colors.type }"
                @mouseenter="setHighlightedColor('type')"
                @mouseleave="clearHighlightedColor()"
                title="type color"
                class="hoverable-color"
                >{{ line.type }}</span
              >
              <span
                v-if="line.func"
                :style="{
                  color: colors.function,
                  fontWeight: options.boldFunctions ? 'bold' : 'normal',
                }"
                @mouseenter="setHighlightedColor('function')"
                @mouseleave="clearHighlightedColor()"
                title="function color"
                class="hoverable-color"
                >{{ line.func }}</span
              >
              <span
                v-if="line.string"
                :style="{
                  color: colors.string,
                  fontStyle: options.italicStrings ? 'italic' : 'normal',
                }"
                @mouseenter="setHighlightedColor('string')"
                @mouseleave="clearHighlightedColor()"
                title="string color"
                class="hoverable-color"
              >
                {{ line.string }}</span
              >
              <span
                v-if="line.punctuation"
                :style="{ color: colors.punctuation }"
                @mouseenter="setHighlightedColor('punctuation')"
                @mouseleave="clearHighlightedColor()"
                title="punctuation color"
                class="hoverable-color"
                >{{ line.punctuation }}</span
              >
            </template>
            <template v-else-if="line.property">
              <span :style="{ color: colors.fg }"> </span>
              <span
                :style="{ color: colors.property }"
                @mouseenter="setHighlightedColor('property')"
                @mouseleave="clearHighlightedColor()"
                title="property color"
                class="hoverable-color"
                >{{ line.property }}</span
              >
              <span
                v-if="line.punctuation"
                :style="{ color: colors.punctuation }"
                @mouseenter="setHighlightedColor('punctuation')"
                @mouseleave="clearHighlightedColor()"
                title="punctuation color"
                class="hoverable-color"
                >{{ line.punctuation }}</span
              >
              <span
                v-if="line.type"
                :style="{ color: colors.type }"
                @mouseenter="setHighlightedColor('type')"
                @mouseleave="clearHighlightedColor()"
                title="type color"
                class="hoverable-color"
              >
                {{ line.type }}</span
              >
              <span
                v-if="line.number"
                :style="{ color: colors.number }"
                @mouseenter="setHighlightedColor('number')"
                @mouseleave="clearHighlightedColor()"
                title="number color"
                class="hoverable-color"
              >
                {{ line.number }}</span
              >
              <span
                v-if="line.string"
                :style="{
                  color: colors.string,
                  fontStyle: options.italicStrings ? 'italic' : 'normal',
                }"
                @mouseenter="setHighlightedColor('string')"
                @mouseleave="clearHighlightedColor()"
                title="string color"
                class="hoverable-color"
              >
                {{ line.string }}</span
              >
              <span
                v-if="line.comment"
                :style="{
                  color: colors.comment,
                  fontStyle: options.italicComments ? 'italic' : 'normal',
                }"
                @mouseenter="setHighlightedColor('comment')"
                @mouseleave="clearHighlightedColor()"
                title="comment color"
                class="hoverable-color"
              >
                {{ line.comment }}</span
              >
            </template>
            <template v-else-if="line.namespace">
              <span :style="{ color: colors.keyword }">{{ line.keyword }}</span>
              <span :style="{ color: colors.namespace }"> {{ line.namespace }}</span>
              <span
                v-if="line.func"
                :style="{
                  color: colors.function,
                  fontWeight: options.boldFunctions ? 'bold' : 'normal',
                }"
                >.{{ line.func }}</span
              >
              <span v-if="line.parameter" :style="{ color: colors.parameter }"
                >({{ line.parameter }}</span
              >
              <span v-if="line.punctuation" :style="{ color: colors.punctuation }">{{
                line.punctuation
              }}</span>
            </template>
            <template v-else-if="line.punctuation">
              <span :style="{ color: colors.punctuation }">{{ line.text }}</span>
            </template>
            <template v-else-if="line.variable">
              <span :style="{ color: colors.keyword }">{{ line.keyword }}</span>
              <span :style="{ color: colors.punctuation }"> {{ '{' }}</span>
              <span :style="{ color: colors.variable }"> {{ line.variable }}</span>
              <span :style="{ color: colors.punctuation }"> {{ '}' }}</span>
            </template>
            <template v-else>
              <span
                :style="{
                  color: line.error ? colors.error : colors.fg,
                  textDecoration: line.error && options.underlineErrors ? 'underline wavy' : 'none',
                  textDecorationColor: line.error ? colors.error : 'transparent',
                }"
                >{{ line.text }}</span
              >
            </template>
          </span>
        </div>
      </div>
    </div>

    <!-- Status line -->
    <div
      class="statusline"
      :style="{
        background: colors.base + '30',
        color: colors.fg,
        borderTop: `1px solid ${colors.base}`,
      }"
    >
      <span :style="{ color: colors.base, fontWeight: 'bold' }">NORMAL</span>
      <span :style="{ color: colors.comment }">|</span>
      <span>composables/useTheme.ts</span>
      <span :style="{ marginLeft: 'auto', color: colors.comment }">typescript</span>
      <span :style="{ color: colors.comment }">|</span>
      <span :style="{ color: colors.warning }">⚠ 1</span>
      <span :style="{ color: colors.comment }">|</span>
      <span>10:38</span>
    </div>

    <!-- Command line with search -->
    <div
      class="cmdline"
      :style="{ background: colors.bg, borderTop: `1px solid ${colors.comment}20` }"
    >
      <span :style="{ color: colors.keyword }">/</span>
      <span :style="{ color: colors.string }">saturation</span>
      <span class="cursor" :style="{ background: colors.base }"></span>
    </div>

    <!-- LSP diagnostic popup -->
    <div
      class="diagnostic-popup"
      :style="{
        background: colors.error + '20',
        borderLeft: `3px solid ${colors.error}`,
        color: colors.fg,
      }"
    >
      <div :style="{ color: colors.error, fontWeight: 'bold', marginBottom: '4px' }">
        <span :style="{ fontSize: '10px' }">●</span> typescript-ls
      </div>
      <div :style="{ fontSize: '8px', color: colors.comment, marginBottom: '2px' }">
        composables/useTheme.ts:15:20
      </div>
      <div :style="{ marginBottom: '4px' }">Expected ',' after property value</div>
      <div :style="{ fontSize: '8px', color: colors.hint }">TS1005</div>
    </div>

    <!-- Telescope/fzf floating window -->
    <div
      class="telescope-popup"
      :style="{
        background: colors.bg + 'f0',
        border: `1px solid ${colors.base}`,
        color: colors.fg,
      }"
    >
      <div class="telescope-prompt" :style="{ borderBottom: `1px solid ${colors.comment}30` }">
        <span :style="{ color: colors.base }">❯</span>
        <span :style="{ color: colors.fg }">useTheme</span>
      </div>
      <div class="telescope-results">
        <div
          class="result-item selected"
          :style="{ background: colors.base + '20', color: colors.base }"
        >
          <span :style="{ color: colors.warning }">▶</span> composables/useTheme.ts:11
        </div>
        <div class="result-item" :style="{ color: colors.comment }">
          <span :style="{ opacity: 0 }">▶</span> utils/themeGenerator.ts:45
        </div>
        <div class="result-item" :style="{ color: colors.comment }">
          <span :style="{ opacity: 0 }">▶</span> components/ColorControls.vue:23
        </div>
      </div>
      <div
        class="telescope-footer"
        :style="{
          borderTop: `1px solid ${colors.comment}30`,
          fontSize: '7px',
          color: colors.comment,
        }"
      >
        3/142 matches
      </div>
    </div>
  </div>
</template>

<style scoped>
.nvim {
  border: 1px solid;
  font-family: 'Monaspace Krypton', monospace;
  font-size: 9px;
  display: flex;
  flex-direction: column;
  height: 600px;
  position: relative;
}

.header {
  display: flex;
  padding: 4px 6px;
  align-items: center;
  flex-shrink: 0;
}

.tabline {
  display: flex;
  gap: 2px;
  padding: 4px 8px;
  font-size: 9px;
}

.tab {
  padding: 4px 12px;
  cursor: pointer;
}

.tab.active {
  font-weight: bold;
}

.editor-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.gutter {
  width: 40px;
  display: flex;
  flex-direction: column;
  text-align: right;
  padding: 8px 8px 8px 0;
  user-select: none;
}

.line-number {
  height: 16px;
  line-height: 16px;
  font-size: 8px;
  padding-right: 8px;
}

.code-area {
  flex: 1;
  padding: 8px 12px;
  overflow-y: auto;
}

.code-line {
  height: 16px;
  line-height: 16px;
  position: relative;
  font-size: 9px;
}

.error-underline {
  position: absolute;
  bottom: 2px;
  left: 12px;
  right: 12px;
  height: 2px;
  opacity: 0.6;
}

.statusline {
  display: flex;
  gap: 8px;
  padding: 4px 12px;
  font-size: 9px;
  align-items: center;
}

.cmdline {
  padding: 4px 12px;
  font-size: 9px;
  display: flex;
  gap: 4px;
  min-height: 20px;
}

.cursor {
  width: 6px;
  height: 12px;
  animation: blink 1s infinite;
}

.diagnostic-popup {
  position: absolute;
  top: 240px;
  right: 20px;
  padding: 8px 12px;
  font-size: 9px;
  max-width: 280px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.telescope-popup {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
}

.telescope-prompt {
  padding: 8px 12px;
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 10px;
}

.telescope-results {
  padding: 4px 0;
}

.result-item {
  padding: 4px 12px;
  font-size: 9px;
  display: flex;
  gap: 6px;
}

.result-item.selected {
  font-weight: bold;
}

.telescope-footer {
  padding: 4px 12px;
  text-align: right;
}

@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

.hoverable-color {
  cursor: help;
  transition: opacity 0.15s ease;
}

.hoverable-color:hover {
  opacity: 0.8;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
}
</style>
