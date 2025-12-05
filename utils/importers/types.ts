/**
 * Theme import system type definitions
 * Supports multiple theme format parsers
 */

/**
 * Supported theme import formats
 */
export type ThemeFormat =
  | 'base16'
  | 'neovim'
  | 'ghostty'
  | 'vscode'
  | 'iterm'
  | 'alacritty'
  | 'auto'

/**
 * Imported theme structure
 * Universal format that parsers output
 */
export interface ThemeImport {
  name: string
  colors: ThemeImportColors
  metadata: ThemeImportMetadata
}

/**
 * Color mappings from imported theme
 * Uses optional fields since different formats provide different colors
 */
export interface ThemeImportColors {
  // Core colors (nearly universal)
  bg?: string
  fg?: string

  // Semantic syntax highlighting (best effort)
  comment?: string
  keyword?: string
  string?: string
  number?: string
  boolean?: string
  function?: string
  constant?: string
  type?: string
  variable?: string
  operator?: string
  builtin?: string
  parameter?: string
  property?: string
  namespace?: string
  macro?: string
  tag?: string
  punctuation?: string
  heading?: string

  // Status/diagnostic colors
  error?: string
  warning?: string
  success?: string
  info?: string
  hint?: string

  // UI elements
  selection?: string
  cursor?: string
  cursorline?: string

  // ANSI 16-color palette (0-15)
  // Used by terminal emulator themes
  palette?: Record<number, string>

  // Additional colors that don't map directly
  // Stored for potential manual mapping
  extra?: Record<string, string>
}

/**
 * Metadata about the imported theme
 */
export interface ThemeImportMetadata {
  source: ThemeFormat
  isDark?: boolean
  author?: string
  description?: string
  url?: string
  license?: string
  // Original filename if imported from file
  filename?: string
}

/**
 * Result of attempting to parse a theme
 */
export interface ParseResult {
  success: boolean
  theme?: ThemeImport
  error?: string
  format?: ThemeFormat
}

/**
 * Parser function signature
 * Each format parser implements this interface
 */
export type ThemeParser = (content: string) => ParseResult
