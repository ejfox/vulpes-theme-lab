/**
 * Base16 theme format parser
 * Supports both YAML and JSON formats
 *
 * Base16 color scheme specification:
 * base00 - Default Background
 * base01 - Lighter Background (status bars, line numbers)
 * base02 - Selection Background
 * base03 - Comments, Invisibles
 * base04 - Dark Foreground (status bars)
 * base05 - Default Foreground, Caret
 * base06 - Light Foreground (not often used)
 * base07 - Light Background (not often used)
 * base08 - Variables, Tags, Markup Bold
 * base09 - Integers, Boolean, Constants, XML Attributes
 * base0A - Classes, Markup Bold, Search Text Background
 * base0B - Strings, Inherited Class, Markup Code
 * base0C - Support, Regex, Escape Characters
 * base0D - Functions, Methods, Attribute IDs, Headings
 * base0E - Keywords, Storage, Selector, Markup Italic
 * base0F - Deprecated, Opening/Closing Embedded Tags
 */

import type { ParseResult, ThemeImport, ThemeImportColors } from './types'
import { parse as parseYAML } from 'yaml'

interface Base16Scheme {
  scheme: string
  author: string
  base00: string
  base01: string
  base02: string
  base03: string
  base04: string
  base05: string
  base06: string
  base07: string
  base08: string
  base09: string
  base0A: string
  base0B: string
  base0C: string
  base0D: string
  base0E: string
  base0F: string
}

/**
 * Normalize hex color (add # prefix if missing)
 */
function normalizeHex(color: string): string {
  if (!color) return color
  return color.startsWith('#') ? color : `#${color}`
}

/**
 * Detect if theme is dark based on background luminance
 */
function detectDarkMode(bg: string): boolean {
  // Simple heuristic: if hex value > 0x888888, it's light mode
  const hex = bg.replace('#', '')
  const num = parseInt(hex.substring(0, 2), 16)
  return num < 0x88
}

/**
 * Parse Base16 YAML or JSON theme format
 */
export function parseBase16(content: string): ParseResult {
  try {
    let scheme: Base16Scheme

    // Try JSON first
    if (content.trim().startsWith('{')) {
      try {
        scheme = JSON.parse(content)
      } catch {
        // Fall back to YAML
        scheme = parseYAML(content)
      }
    } else {
      // Try YAML
      scheme = parseYAML(content)
    }

    // Validate required fields
    if (!scheme.base00 || !scheme.base05) {
      return {
        success: false,
        error: 'Invalid Base16 theme: missing base00 (background) or base05 (foreground)',
      }
    }

    // Map Base16 colors to semantic roles
    const colors: ThemeImportColors = {
      // Core colors
      bg: normalizeHex(scheme.base00),
      fg: normalizeHex(scheme.base05),

      // Semantic syntax highlighting (following Base16 spec)
      comment: normalizeHex(scheme.base03),
      keyword: normalizeHex(scheme.base0E), // base0E = keywords, storage
      string: normalizeHex(scheme.base0B), // base0B = strings
      number: normalizeHex(scheme.base09), // base09 = integers, booleans
      boolean: normalizeHex(scheme.base09),
      function: normalizeHex(scheme.base0D), // base0D = functions, methods
      constant: normalizeHex(scheme.base09), // base09 = constants
      type: normalizeHex(scheme.base0A), // base0A = classes
      variable: normalizeHex(scheme.base08), // base08 = variables
      operator: normalizeHex(scheme.base05), // Use fg for operators
      builtin: normalizeHex(scheme.base0C), // base0C = support, regex
      parameter: normalizeHex(scheme.base08),
      property: normalizeHex(scheme.base08),
      namespace: normalizeHex(scheme.base08),
      macro: normalizeHex(scheme.base0E),
      tag: normalizeHex(scheme.base08), // base08 = tags
      punctuation: normalizeHex(scheme.base05),
      heading: normalizeHex(scheme.base0D), // base0D = headings

      // Status colors (heuristic mapping)
      error: normalizeHex(scheme.base08), // Red-ish (base08)
      warning: normalizeHex(scheme.base0A), // Yellow-ish (base0A)
      success: normalizeHex(scheme.base0B), // Green-ish (base0B)
      info: normalizeHex(scheme.base0D), // Blue-ish (base0D)
      hint: normalizeHex(scheme.base03), // Muted (base03)

      // UI elements
      selection: normalizeHex(scheme.base02), // base02 = selection
      cursor: normalizeHex(scheme.base05),
      cursorline: normalizeHex(scheme.base01), // base01 = lighter bg

      // Build ANSI palette from Base16 colors
      // Standard mapping used by base16-shell and others
      palette: {
        0: normalizeHex(scheme.base00), // Black
        1: normalizeHex(scheme.base08), // Red
        2: normalizeHex(scheme.base0B), // Green
        3: normalizeHex(scheme.base0A), // Yellow
        4: normalizeHex(scheme.base0D), // Blue
        5: normalizeHex(scheme.base0E), // Magenta
        6: normalizeHex(scheme.base0C), // Cyan
        7: normalizeHex(scheme.base05), // White
        8: normalizeHex(scheme.base03), // Bright Black
        9: normalizeHex(scheme.base08), // Bright Red (same as red)
        10: normalizeHex(scheme.base0B), // Bright Green (same as green)
        11: normalizeHex(scheme.base0A), // Bright Yellow (same as yellow)
        12: normalizeHex(scheme.base0D), // Bright Blue (same as blue)
        13: normalizeHex(scheme.base0E), // Bright Magenta (same as magenta)
        14: normalizeHex(scheme.base0C), // Bright Cyan (same as cyan)
        15: normalizeHex(scheme.base07), // Bright White
      },

      // Store remaining base16 colors for reference
      extra: {
        base01: normalizeHex(scheme.base01),
        base02: normalizeHex(scheme.base02),
        base04: normalizeHex(scheme.base04),
        base06: normalizeHex(scheme.base06),
        base0F: normalizeHex(scheme.base0F),
      },
    }

    const theme: ThemeImport = {
      name: scheme.scheme || 'imported-base16',
      colors,
      metadata: {
        source: 'base16',
        isDark: detectDarkMode(colors.bg!),
        author: scheme.author,
      },
    }

    return {
      success: true,
      theme,
      format: 'base16',
    }
  } catch (error: any) {
    return {
      success: false,
      error: `Failed to parse Base16 theme: ${error.message}`,
    }
  }
}
