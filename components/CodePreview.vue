<script setup lang="ts">
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'

const editorRef = ref<HTMLElement>()
const { state, colors, options } = useTheme()
let view: EditorView | null = null

// Meta-referential code that actually generates the theme
const demoCode = `// COMMENT: Theme-lab generates HSL-based color palettes
// ITALIC comments help explain the mathematical precision
import { useState, computed } from 'vue'  // STRINGS are italic too
import type { Ref } from 'vue'
import chroma from 'chroma-js'

// CONSTANT declarations showcase NUMBER colors
const HUE_OFFSET = 7        // Tuftian precision: ±7° hue offset
const SATURATION = 0.85     // 85% saturation for vivid colors
const LIGHTNESS = 0.50      // 50% lightness baseline
const MAX_HUE = 360         // Full color wheel

interface ThemeState {     // TYPE definitions
  baseHue: number
  offset: number
  colors: ColorPalette
}

type ColorPalette = {      // More TYPE examples
  error: string           // KEYWORD: string, number, boolean
  warning: string
  keyword: string
  string: string
  function: string
  variable: string
  operator: string
  constant: null | string  // Union types
}

// FUNCTION definitions get BOLD when enabled
async function generatePalette(hue: number): Promise<ColorPalette> {
  // Mathematical color generation using chroma.js
  const base = chroma.hsl(hue, SATURATION, LIGHTNESS)

  if (hue < 0 || hue > MAX_HUE) {
    throw new Error(\`Hue \${hue} out of range [0-360]\`)  // Template STRING
  }

  // OPERATORS: +, -, *, /, %, =, ===, &&, ||
  const offset = (hue + HUE_OFFSET) % MAX_HUE
  const multiplier = 1.5

  return {
    error: chroma.hsl(hue, 0.85, 0.55).hex(),
    warning: chroma.hsl(hue + 30, 0.85, 0.60).hex(),
    keyword: chroma.hsl(hue + 60, 0.85, 0.65).hex(),
    string: \`#\${Math.floor(hue).toString(16)}\`,
    function: await fetchColor(hue),  // KEYWORD: await, async
    variable: base.hex(),
    operator: chroma.hsl(offset * multiplier, 0.8, 0.5).hex(),
    constant: null  // KEYWORD: null
  }
}

export default generatePalette  // KEYWORD: export, default
`

const createTheme = () => {
  // Get fresh color values each time
  const currentColors = colors.value

  return EditorView.theme({
    '&': {
      color: currentColors.fg,
      backgroundColor: currentColors.bg,
      fontSize: '11px',
      fontFamily: 'Monaspace Krypton, monospace',
      height: '100%',
    },
    '.cm-content': {
      caretColor: currentColors.base,
      padding: '12px 0',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: currentColors.base,
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: currentColors.warning + '40',
    },
    '.cm-activeLine': {
      backgroundColor: 'transparent',
    },
    '.cm-gutters': {
      backgroundColor: currentColors.bg,
      color: currentColors.comment,
      border: 'none',
      paddingRight: '12px',
    },
    '.cm-line': {
      paddingLeft: '12px',
    },
  })
}

const createHighlighting = () => {
  // Get fresh color values each time
  const currentColors = colors.value
  const currentOptions = options.value

  return syntaxHighlighting(
    HighlightStyle.define([
      {
        tag: tags.keyword,
        color: currentColors.keyword,
        fontWeight: currentOptions.boldKeywords ? 'bold' : 'normal'
      },
      {
        tag: tags.comment,
        color: currentColors.comment,
        fontStyle: currentOptions.italicComments ? 'italic' : 'normal'
      },
      {
        tag: tags.string,
        color: currentColors.string,
        fontStyle: currentOptions.italicStrings ? 'italic' : 'normal'
      },
      { tag: tags.number, color: currentColors.number },
      { tag: tags.bool, color: currentColors.error },
      { tag: tags.null, color: currentColors.hint },
      { tag: tags.operator, color: currentColors.operator },
      {
        tag: tags.function(tags.variableName),
        color: currentColors.function,
        fontWeight: currentOptions.boldFunctions ? 'bold' : 'normal'
      },
      { tag: tags.className, color: currentColors.keyword },
      { tag: tags.typeName, color: currentColors.type },
      { tag: tags.propertyName, color: currentColors.variable },
      { tag: tags.variableName, color: currentColors.variable },
    ])
  )
}

onMounted(() => {
  if (!editorRef.value) return

  const startState = EditorState.create({
    doc: demoCode,
    extensions: [
      basicSetup,
      javascript({ typescript: true }),
      createTheme(),
      createHighlighting(),
      EditorView.editable.of(true),
      EditorView.lineWrapping,
    ],
  })

  view = new EditorView({
    state: startState,
    parent: editorRef.value,
  })
})

// Update theme when state changes
watch(state, () => {
  if (!view || !editorRef.value) return

  view.destroy()

  const startState = EditorState.create({
    doc: demoCode,
    extensions: [
      basicSetup,
      javascript({ typescript: true }),
      createTheme(),
      createHighlighting(),
      EditorView.editable.of(true),
      EditorView.lineWrapping,
    ],
  })

  view = new EditorView({
    state: startState,
    parent: editorRef.value,
  })
}, { deep: true })

onBeforeUnmount(() => {
  view?.destroy()
})
</script>

<template>
  <div class="code-preview">
    <div class="preview-label">nvim / code editor preview</div>
    <div ref="editorRef" class="editor-container"></div>
  </div>
</template>

<style>
.code-preview {
  border: 1px solid #333;
  background: var(--bg, #000);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
}

.preview-label {
  padding: 8px 12px;
  border-bottom: 1px solid #333;
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
  background: #0a0a0a;
}

.editor-container {
  flex: 1;
  overflow: auto;
}

.cm-editor {
  height: 100%;
}

.cm-scroller {
  font-family: Monaspace Krypton, monospace;
  line-height: 1.6;
}
</style>
