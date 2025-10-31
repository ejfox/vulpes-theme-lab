import chroma from 'chroma-js'
import type { ThemeColors } from '~/composables/useTheme'

/**
 * Extended theme palette with semantic color mappings for all export formats.
 * This interface provides a consistent set of colors for Neovim, Bat, Yazi,
 * Lazygit, ZSH, and other tools.
 */
export interface ThemePalette {
  // Base colors
  bg: string           // Main background
  bg_alt: string       // Alternate background (panels, sidebars)
  fg: string           // Main foreground text
  base: string         // Primary accent color

  // Semantic status colors
  error: string        // Red for errors
  warning: string      // Yellow/orange for warnings
  success: string      // Green for success states
  info: string         // Blue for informational
  hint: string         // Subtle hints/suggestions

  // Syntax highlighting
  comment: string      // Comments
  keyword: string      // Keywords (if, else, function)
  string: string       // String literals
  number: string       // Numeric literals
  boolean: string      // Boolean values
  function: string     // Function names
  constant: string     // Constants
  type: string         // Type names
  variable: string     // Variables
  operator: string     // Operators
  builtin: string      // Built-in functions/types
  parameter: string    // Function parameters
  property: string     // Object properties
  namespace: string    // Namespaces/modules
  macro: string        // Preprocessor macros
  tag: string          // HTML/XML tags
  punctuation: string  // Delimiters and punctuation
  heading: string      // Markdown headings

  // UI elements
  selection: string    // Selected text background
  cursor: string       // Cursor color
  cursorline: string   // Current line highlight

  // ANSI palette (0-15)
  palette: Record<number, string>
}

/**
 * Creates a semantic palette from the base theme colors.
 * Maps existing colors to semantic roles needed by various export formats.
 *
 * @param colors - Base theme colors from useTheme composable
 * @param mode - 'dark' or 'light' theme mode
 * @returns Extended palette with all semantic mappings
 */
export function createSemanticPalette(colors: ThemeColors, mode: 'dark' | 'light'): ThemePalette {
  const isDark = mode === 'dark'

  // Create alternate background (slightly lighter/darker than main bg)
  const bgColor = chroma(colors.bg)
  const bg_alt = isDark
    ? bgColor.brighten(0.3).hex()
    : bgColor.darken(0.15).hex()

  // Create subtle cursorline (very subtle bg variation)
  const cursorline = isDark
    ? bgColor.brighten(0.15).hex()
    : bgColor.darken(0.08).hex()

  return {
    // Base colors (direct mapping)
    bg: colors.bg,
    bg_alt,
    fg: colors.fg,
    base: colors.base,

    // Semantic status colors
    error: colors.error,
    warning: colors.warning,
    success: colors.palette[2],   // ANSI green - perfect for success
    info: colors.palette[4],      // ANSI blue - perfect for info
    hint: colors.hint,

    // Syntax highlighting (direct mapping from granular colors)
    comment: colors.comment,
    keyword: colors.keyword,
    string: colors.string,
    number: colors.number,
    boolean: colors.constant,     // Reuse constant color for booleans
    function: colors.function,
    constant: colors.constant,
    type: colors.type,
    variable: colors.variable,
    operator: colors.operator,
    builtin: colors.builtin,
    parameter: colors.parameter,
    property: colors.property,
    namespace: colors.namespace,
    macro: colors.macro,
    tag: colors.tag,
    punctuation: colors.punctuation,
    heading: colors.heading,

    // UI elements
    selection: colors.warning,    // Use warning color for selection (high visibility)
    cursor: colors.base,          // Use base accent for cursor
    cursorline,

    // ANSI palette (direct passthrough)
    palette: colors.palette,
  }
}

/**
 * Export format types supported by the theme lab
 */
export type ExportFormat = 'ghostty' | 'neovim' | 'bat' | 'yazi' | 'lazygit' | 'zsh'

/**
 * Result of a theme export operation
 */
export interface ExportResult {
  filename: string
  content: string
  format: ExportFormat
}
