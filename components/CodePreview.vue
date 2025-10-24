<script setup lang="ts">
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'

const editorRef = ref<HTMLElement>()
const { colors } = useTheme()
let view: EditorView | null = null

// Meta-referential code that actually generates the theme
const demoCode = `// theme-lab - Tuftian hue offset precision
import chroma from 'chroma-js'

function generateTheme(baseHue: number, offset: number) {
  // Hue offset ±7° - minimal variation, maximum signal
  const error = chroma.hsl(baseHue + offset, 0.85, 0.55).hex()
  const warning = chroma.hsl(baseHue - offset, 0.85, 0.55).hex()
  const base = chroma.hsl(baseHue, 0.85, 0.50).hex()

  return {
    palette: {
      0: '#0d0d0d',  // black
      1: error,      // red (error)
      2: warning,    // yellow-ish (warning)
      15: '#f2f2f2', // white
    },
    // Export to ghostty config format
    serialize() {
      return \`background = #000000
foreground = #ffffff
cursor-color = \${base}
palette = 1=\${error}
palette = 2=\${warning}\`
    }
  }
}

// Usage in ~/.config/ghostty/themes/
const theme = generateTheme(0, 7)
console.log(theme.serialize())
`

const createTheme = () => {
  return EditorView.theme({
    '&': {
      color: colors.value.fg,
      backgroundColor: colors.value.bg,
      fontSize: '11px',
      fontFamily: 'Monaspace Krypton, monospace',
      height: '100%',
    },
    '.cm-content': {
      caretColor: colors.value.base,
      padding: '12px 0',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: colors.value.base,
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: colors.value.warning + '40',
    },
    '.cm-activeLine': {
      backgroundColor: 'transparent',
    },
    '.cm-gutters': {
      backgroundColor: colors.value.bg,
      color: colors.value.comment,
      border: 'none',
      paddingRight: '12px',
    },
    '.cm-line': {
      paddingLeft: '12px',
    },
  })
}

const createHighlighting = () => {
  return syntaxHighlighting(
    HighlightStyle.define([
      { tag: tags.keyword, color: colors.value.keyword },
      { tag: tags.comment, color: colors.value.comment, fontStyle: 'italic' },
      { tag: tags.string, color: colors.value.string },
      { tag: tags.number, color: colors.value.number },
      { tag: tags.bool, color: colors.value.error },
      { tag: tags.null, color: colors.value.hint },
      { tag: tags.operator, color: colors.value.fg },
      { tag: tags.function(tags.variableName), color: colors.value.function },
      { tag: tags.className, color: colors.value.keyword },
      { tag: tags.typeName, color: colors.value.base },
      { tag: tags.propertyName, color: colors.value.fg },
      { tag: tags.variableName, color: colors.value.fg },
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
      EditorView.editable.of(false),
      EditorView.lineWrapping,
    ],
  })

  view = new EditorView({
    state: startState,
    parent: editorRef.value,
  })
})

// Update theme when colors change
watch(colors, () => {
  if (!view || !editorRef.value) return

  view.destroy()

  const startState = EditorState.create({
    doc: demoCode,
    extensions: [
      basicSetup,
      javascript({ typescript: true }),
      createTheme(),
      createHighlighting(),
      EditorView.editable.of(false),
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
