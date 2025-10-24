<script setup lang="ts">
const { colors } = useTheme()

const codeLines = [
  { num: 1, text: 'import { defineNuxtConfig } from "nuxt/config"', highlighted: false, error: false, type: 'import' },
  { num: 2, text: 'import type { Theme, ColorPalette } from "@/types"', highlighted: false, error: false, type: 'import' },
  { num: 3, text: '', highlighted: false, error: false, type: 'empty' },
  { num: 4, text: 'interface GhosttyTheme {', highlighted: false, error: false, type: 'keyword' },
  { num: 5, text: '  background: string', highlighted: true, error: false, type: 'property' },
  { num: 6, text: '  foreground: string', highlighted: true, error: false, type: 'property' },
  { num: 7, text: '  cursor: string', highlighted: false, error: false, type: 'property' },
  { num: 8, text: '  palette: Record<number, string>', highlighted: false, error: false, type: 'property' },
  { num: 9, text: '}', highlighted: false, error: false, type: 'keyword' },
  { num: 10, text: '', highlighted: false, error: false, type: 'empty' },
  { num: 11, text: 'export const useTheme = () => {', highlighted: false, error: false, type: 'keyword' },
  { num: 12, text: '  const state = useState<ThemeState>("theme", () => ({', highlighted: false, error: false, type: 'code' },
  { num: 13, text: '    baseHue: 180,', highlighted: false, error: false, type: 'code' },
  { num: 14, text: '    saturation: 0.85,', highlighted: false, error: false, type: 'code' },
  { num: 15, text: '    contrast: 0.50', highlighted: false, error: true, type: 'code' },
  { num: 16, text: '    lightness: 0.50  // Missing comma above', highlighted: false, error: false, type: 'comment' },
  { num: 17, text: '  }))', highlighted: false, error: false, type: 'code' },
  { num: 18, text: '', highlighted: false, error: false, type: 'empty' },
  { num: 19, text: '  const colors = computed(() => generatePalette(state.value))', highlighted: false, error: false, type: 'code' },
  { num: 20, text: '', highlighted: false, error: false, type: 'empty' },
  { num: 21, text: '  return { state, colors }', highlighted: false, error: false, type: 'code' },
  { num: 22, text: '}', highlighted: false, error: false, type: 'keyword' },
]
</script>

<template>
  <div class="nvim" :style="{ background: colors.bg, color: colors.fg }">
    <!-- Tab line -->
    <div class="tabline" :style="{ background: colors.bg, borderBottom: `1px solid ${colors.comment}30` }">
      <span class="tab active" :style="{ background: colors.base + '20', color: colors.base }">
        useTheme.ts
      </span>
      <span class="tab" :style="{ color: colors.comment }">
        ColorControls.vue
      </span>
      <span class="tab" :style="{ color: colors.comment }">
        index.vue
      </span>
    </div>

    <!-- Editor content -->
    <div class="editor-content">
      <div class="gutter" :style="{ background: colors.bg, borderRight: `1px solid ${colors.comment}20` }">
        <div
          v-for="line in codeLines"
          :key="line.num"
          class="line-number"
          :style="{
            color: line.highlighted ? colors.base : colors.comment,
            background: line.highlighted ? colors.warning + '10' : 'transparent'
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
            paddingLeft: line.highlighted ? '10px' : '12px'
          }"
        >
          <span v-if="line.text" :style="{
            color: line.error ? colors.error :
                   line.type === 'import' ? colors.keyword :
                   line.type === 'keyword' ? colors.keyword :
                   line.type === 'property' ? colors.fg :
                   line.type === 'comment' ? colors.comment :
                   line.type === 'empty' ? colors.fg :
                   colors.fg
          }">
            <template v-if="line.type === 'import'">
              <span :style="{ color: colors.keyword }">{{ line.text.split(' ')[0] }}</span>
              <span :style="{ color: colors.fg }"> {{ line.text.split(' ').slice(1).join(' ').replace(/["'].*?["']/g, (m) => m) }}</span>
            </template>
            <template v-else>{{ line.text }}</template>
          </span>
          <span v-if="line.error" class="error-underline" :style="{ background: colors.error }"></span>
        </div>
      </div>
    </div>

    <!-- Status line -->
    <div class="statusline" :style="{ background: colors.base + '30', color: colors.fg, borderTop: `1px solid ${colors.base}` }">
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
    <div class="cmdline" :style="{ background: colors.bg, borderTop: `1px solid ${colors.comment}20` }">
      <span :style="{ color: colors.keyword }">/</span>
      <span :style="{ color: colors.string }">saturation</span>
      <span class="cursor" :style="{ background: colors.base }"></span>
    </div>

    <!-- LSP diagnostic popup -->
    <div class="diagnostic-popup" :style="{
      background: colors.error + '20',
      borderLeft: `3px solid ${colors.error}`,
      color: colors.fg
    }">
      <div :style="{ color: colors.error, fontWeight: 'bold', marginBottom: '4px' }">
        <span :style="{ fontSize: '10px' }">●</span> typescript-ls
      </div>
      <div :style="{ fontSize: '8px', color: colors.comment, marginBottom: '2px' }">composables/useTheme.ts:15:20</div>
      <div :style="{ marginBottom: '4px' }">Expected ',' after property value</div>
      <div :style="{ fontSize: '8px', color: colors.hint }">TS1005</div>
    </div>

    <!-- Telescope/fzf floating window -->
    <div class="telescope-popup" :style="{
      background: colors.bg + 'f0',
      border: `1px solid ${colors.base}`,
      color: colors.fg
    }">
      <div class="telescope-prompt" :style="{ borderBottom: `1px solid ${colors.comment}30` }">
        <span :style="{ color: colors.base }">❯</span>
        <span :style="{ color: colors.fg }">useTheme</span>
        <span class="cursor" :style="{ background: colors.base }"></span>
      </div>
      <div class="telescope-results">
        <div class="result-item selected" :style="{ background: colors.base + '20', color: colors.base }">
          <span :style="{ color: colors.warning }">▶</span> composables/useTheme.ts:11
        </div>
        <div class="result-item" :style="{ color: colors.comment }">
          <span :style="{ opacity: 0 }">▶</span> utils/themeGenerator.ts:45
        </div>
        <div class="result-item" :style="{ color: colors.comment }">
          <span :style="{ opacity: 0 }">▶</span> components/ColorControls.vue:23
        </div>
      </div>
      <div class="telescope-footer" :style="{ borderTop: `1px solid ${colors.comment}30`, fontSize: '7px', color: colors.comment }">
        3/142 matches
      </div>
    </div>
  </div>
</template>

<style scoped>
.nvim {
  border: 1px solid #222;
  font-family: 'Monaspace Krypton', monospace;
  font-size: 9px;
  display: flex;
  flex-direction: column;
  height: 600px;
  position: relative;
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
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
</style>
