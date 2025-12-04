/**
 * Theme importer orchestration
 * Auto-detects format and routes to appropriate parser
 */

import type { ParseResult, ThemeFormat, ThemeParser } from './types'
import { parseBase16 } from './base16'
import { parseGhostty } from './ghostty'
import { parseNeovim } from './neovim'
import { parseVSCode } from './vscode'

export * from './types'
export { parseBase16, parseGhostty, parseNeovim, parseVSCode }

/**
 * Parse theme with explicit format
 */
export function parseTheme(content: string, format: ThemeFormat): ParseResult {
  switch (format) {
    case 'base16':
      return parseBase16(content)
    case 'ghostty':
      return parseGhostty(content)
    case 'neovim':
      return parseNeovim(content)
    case 'vscode':
      return parseVSCode(content)
    case 'auto':
      return parseThemeAuto(content)
    default:
      return {
        success: false,
        error: `Unsupported format: ${format}`,
      }
  }
}

/**
 * Auto-detect theme format and parse
 * Tries parsers in order of likelihood based on content
 */
export function parseThemeAuto(content: string): ParseResult {
  const trimmed = content.trim()

  // VS Code: JSON with colors or tokenColors
  if (trimmed.startsWith('{')) {
    try {
      const json = JSON.parse(content)
      if (json.colors || json.tokenColors) {
        const result = parseVSCode(content)
        // Even if parsing failed, return the error so we know what went wrong
        if (result.success) return result
        // If VS Code parser failed but we detected it as VS Code format, return the error
        if (!result.success && (json.colors || json.tokenColors)) {
          return result
        }
      }
    } catch (error: any) {
      // Not JSON or invalid, continue
    }

    // Base16: JSON format
    try {
      const json = JSON.parse(content)
      if (json.scheme && json.base00) {
        const result = parseBase16(content)
        if (result.success) return result
      }
    } catch {
      // Not Base16 JSON
    }
  }

  // Base16: YAML format
  if (trimmed.includes('scheme:') && trimmed.includes('base00:')) {
    const result = parseBase16(content)
    if (result.success) return result
  }

  // Ghostty: key=value format with background/foreground
  if (
    (trimmed.includes('background =') || trimmed.includes('background=')) &&
    (trimmed.includes('foreground =') || trimmed.includes('foreground='))
  ) {
    const result = parseGhostty(content)
    if (result.success) return result
  }

  // Neovim: Lua code with color definitions
  if (
    trimmed.includes('local') ||
    trimmed.includes('vim.') ||
    trimmed.includes('colors') ||
    trimmed.includes('highlight')
  ) {
    const result = parseNeovim(content)
    if (result.success) return result
  }

  // Try all parsers as last resort
  const parsers: Array<{ name: ThemeFormat; parser: ThemeParser }> = [
    { name: 'base16', parser: parseBase16 },
    { name: 'vscode', parser: parseVSCode },
    { name: 'ghostty', parser: parseGhostty },
    { name: 'neovim', parser: parseNeovim },
  ]

  for (const { name, parser } of parsers) {
    const result = parser(content)
    if (result.success) {
      return result
    }
  }

  return {
    success: false,
    error:
      'Could not detect theme format. Supported formats: Base16 (YAML/JSON), Neovim (Lua), Ghostty (config), VS Code (JSON)',
  }
}

/**
 * Detect format from filename
 */
export function detectFormatFromFilename(filename: string): ThemeFormat {
  const lower = filename.toLowerCase()

  if (lower.endsWith('.lua')) return 'neovim'
  if (lower.includes('ghostty') || lower.endsWith('.ghostty')) return 'ghostty'
  if (lower.includes('vscode') || lower.includes('.json')) return 'vscode'
  if (lower.endsWith('.yaml') || lower.endsWith('.yml')) return 'base16'

  return 'auto'
}

/**
 * Parse theme from file content with optional filename hint
 */
export function parseThemeFromFile(content: string, filename?: string): ParseResult {
  if (filename) {
    const format = detectFormatFromFilename(filename)
    if (format !== 'auto') {
      const result = parseTheme(content, format)
      if (result.success) {
        // Add filename to metadata
        if (result.theme) {
          result.theme.metadata.filename = filename
        }
        return result
      }
    }
  }

  // Fall back to auto-detection
  return parseThemeAuto(content)
}
