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

// Compute opacity as reactive value
const editorOpacity = computed(() => state.value.backgroundOpacity / 100)
const editorBlur = computed(() => `blur(${state.value.backgroundBlur}px)`)

// Hero code sample - evocative, shows full breadth of syntax types
const demoCode = `// vulpes: a fox spinning through the color wheel
import { dream, weave, conjure } from "chromatic-alchemy"
import type { Spectrum, Hue, Palette } from "@vulpes/core"

const GOLDEN_ANGLE = 137.508    // nature's favorite number
const PHI = 1.618033988749      // the golden ratio
const TWELVE_MOONS = 12         // one hue per month

interface ColorAlchemy {
  baseHue: Hue
  harmony: number
  luminance: number
  saturation: number
}

type ThemeVariant = "dark" | "light" | "auto"

export async function conjureTheme(
  seed: Hue,
  variant: ThemeVariant = "dark"
): Promise<Spectrum> {
  // spin through the wheel like a fox chasing its tail
  const palette = await dream({
    baseHue: seed,
    harmony: GOLDEN_ANGLE,
    luminance: PHI * 0.382,
    saturation: 0.85
  })

  if (seed < 0 || seed > 360) {
    throw new Error(\`Hue \${seed} must be between 0-360\`)
  }

  // semantic shifts: errors clockwise, warnings counter
  const errorHue = (seed + 7) % 360
  const warningHue = (seed - 7 + 360) % 360
  const isNight = variant === "dark" || variant === "auto"

  return weave(palette)
    .with({ error: errorHue, warning: warningHue })
    .into(isNight ? "neon-midnight" : "paper-dawn")
}

// twelve moons, twelve hues, one complete journey
const vulpes = await conjureTheme(330, "dark")
console.log("theme ready:", vulpes.name)
`

const createTheme = () => {
  // Get fresh color values each time
  const currentColors = colors.value

  return EditorView.theme({
    '&': {
      color: currentColors.fg,
      backgroundColor: currentColors.bg,
      fontSize: '14px',
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
      // Keywords
      {
        tag: tags.keyword,
        color: currentColors.keyword,
        fontWeight: currentOptions.boldKeywords ? 'bold' : 'normal',
      },

      // Comments
      {
        tag: tags.comment,
        color: currentColors.comment,
        fontStyle: currentOptions.italicComments ? 'italic' : 'normal',
      },

      // Strings & Literals
      {
        tag: tags.string,
        color: currentColors.string,
        fontStyle: currentOptions.italicStrings ? 'italic' : 'normal',
      },
      { tag: tags.number, color: currentColors.number },
      { tag: tags.bool, color: currentColors.constant },
      { tag: tags.null, color: currentColors.constant },

      // Functions & Methods
      {
        tag: tags.function(tags.variableName),
        color: currentColors.function,
        fontWeight: currentOptions.boldFunctions ? 'bold' : 'normal',
      },
      { tag: tags.standard(tags.function(tags.variableName)), color: currentColors.builtin },

      // Types
      { tag: tags.className, color: currentColors.type },
      { tag: tags.typeName, color: currentColors.type },
      { tag: tags.standard(tags.typeName), color: currentColors.builtin },

      // Properties & Variables
      { tag: tags.propertyName, color: currentColors.property },
      { tag: tags.definition(tags.propertyName), color: currentColors.property },
      { tag: tags.variableName, color: currentColors.variable },
      { tag: tags.definition(tags.variableName), color: currentColors.parameter },
      { tag: tags.local(tags.variableName), color: currentColors.variable },
      { tag: tags.standard(tags.variableName), color: currentColors.builtin },

      // Operators & Punctuation
      { tag: tags.operator, color: currentColors.operator },
      { tag: tags.separator, color: currentColors.punctuation },
      { tag: tags.punctuation, color: currentColors.punctuation },
      { tag: tags.bracket, color: currentColors.punctuation },
      { tag: tags.brace, color: currentColors.punctuation },
      { tag: tags.paren, color: currentColors.punctuation },

      // Namespaces & Modules
      { tag: tags.namespace, color: currentColors.namespace },
      { tag: tags.moduleKeyword, color: currentColors.namespace },

      // Tags (HTML/JSX)
      { tag: tags.tagName, color: currentColors.tag },
      { tag: tags.attributeName, color: currentColors.property },

      // Macros & Preprocessor
      { tag: tags.macroName, color: currentColors.macro },
      { tag: tags.processingInstruction, color: currentColors.macro },

      // Headings (Markdown)
      { tag: tags.heading, color: currentColors.heading },
      { tag: tags.heading1, color: currentColors.heading },
      { tag: tags.heading2, color: currentColors.heading },
      { tag: tags.heading3, color: currentColors.heading },

      // Constants
      { tag: tags.constant(tags.variableName), color: currentColors.constant },
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
watch(
  state,
  () => {
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
  },
  { deep: true }
)

onBeforeUnmount(() => {
  view?.destroy()
})
</script>

<template>
  <div
    class="code-preview"
    :style="{
      opacity: editorOpacity,
      backdropFilter: editorBlur,
      WebkitBackdropFilter: editorBlur,
      background: colors.bg,
      borderColor: colors.base,
    }"
  >
    <div
      class="preview-label"
      :style="{
        background: colors.base + '15',
        borderBottom: `1px solid ${colors.base}`,
        color: colors.base,
      }"
    >
      <span style="font-weight: bold; font-size: 10px">CODE EDITOR</span>
      <span :style="{ marginLeft: 'auto', fontSize: '8px', color: colors.hint }">
        nvim • bat • syntax highlighting
      </span>
    </div>
    <div ref="editorRef" class="editor-container"></div>
  </div>
</template>

<style>
.code-preview {
  border: 1px solid;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
  overflow: hidden;
}

.preview-label {
  padding: 4px 6px;
  border-bottom: 1px solid;
  font-size: 10px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.editor-container {
  flex: 1;
  overflow: auto;
}

.cm-editor {
  height: 100%;
}

.cm-scroller {
  font-family:
    Monaspace Krypton,
    monospace;
  line-height: 1.7;
}
</style>
