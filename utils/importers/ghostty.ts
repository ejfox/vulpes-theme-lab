/**
 * Ghostty terminal theme format parser
 * Parses key=value config format
 *
 * Example format:
 * background = #1a1b26
 * foreground = #c0caf5
 * cursor-color = #c0caf5
 * selection-background = #283457
 * palette = 0=#15161e
 * palette = 1=#f7768e
 * ...
 */

import type { ParseResult, ThemeImport, ThemeImportColors } from './types'

/**
 * Detect if theme is dark based on background luminance
 */
function detectDarkMode(bg: string): boolean {
  const hex = bg.replace('#', '')
  const num = parseInt(hex.substring(0, 2), 16)
  return num < 0x88
}

/**
 * Normalize hex color (ensure # prefix)
 */
function normalizeHex(color: string): string {
  if (!color) return color
  return color.startsWith('#') ? color : `#${color}`
}

/**
 * Parse Ghostty terminal config format
 */
export function parseGhostty(content: string): ParseResult {
  try {
    const lines = content.split('\n')
    const colors: ThemeImportColors = {
      palette: {},
      extra: {},
    }

    for (const line of lines) {
      // Skip comments and empty lines
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      // Parse key = value
      const match = trimmed.match(/^([^=]+)=(.+)$/)
      if (!match) continue

      const key = match[1].trim()
      const value = normalizeHex(match[2].trim())

      // Map Ghostty keys to semantic colors
      switch (key) {
        case 'background':
          colors.bg = value
          break
        case 'foreground':
          colors.fg = value
          break
        case 'cursor-color':
        case 'cursor_color':
          colors.cursor = value
          break
        case 'selection-background':
        case 'selection_background':
          colors.selection = value
          break
        case 'selection-foreground':
        case 'selection_foreground':
          colors.extra!.selectionFg = value
          break

        // ANSI palette colors
        case 'palette': {
          // Format: palette = 0=#color
          const paletteMatch = value.match(/^(\d+)=(.+)$/)
          if (paletteMatch) {
            const index = parseInt(paletteMatch[1])
            const color = normalizeHex(paletteMatch[2])
            colors.palette![index] = color
          }
          break
        }

        // Store other colors as extra
        default:
          if (value.match(/^#[0-9a-fA-F]{6}$/)) {
            colors.extra![key] = value
          }
      }
    }

    // Validate required fields
    if (!colors.bg || !colors.fg) {
      return {
        success: false,
        error: 'Invalid Ghostty theme: missing background or foreground color',
      }
    }

    // Map ANSI palette to semantic colors if available
    if (colors.palette && Object.keys(colors.palette).length > 0) {
      colors.error = colors.palette[1] // Red
      colors.success = colors.palette[2] // Green
      colors.warning = colors.palette[3] // Yellow
      colors.info = colors.palette[4] // Blue
      colors.hint = colors.palette[8] // Bright black
      colors.string = colors.palette[2] // Green
      colors.number = colors.palette[3] // Yellow
      colors.keyword = colors.palette[5] // Magenta
      colors.function = colors.palette[4] // Blue
      colors.constant = colors.palette[6] // Cyan
      colors.comment = colors.palette[8] // Bright black (muted)
      colors.type = colors.palette[4] // Blue
      colors.variable = colors.fg
      colors.operator = colors.fg
      colors.builtin = colors.palette[6] // Cyan
      colors.parameter = colors.fg
      colors.property = colors.fg
      colors.namespace = colors.palette[5] // Magenta
      colors.macro = colors.palette[5] // Magenta
      colors.tag = colors.palette[1] // Red
      colors.punctuation = colors.fg
      colors.heading = colors.palette[4] // Blue
      colors.boolean = colors.palette[3] // Yellow
    }

    // Fallback if no palette
    if (!colors.cursorline) {
      colors.cursorline = colors.bg // Use bg as fallback
    }

    // Extract theme name from comments if available
    let themeName = 'imported-ghostty'
    for (const line of lines) {
      const commentMatch = line.match(/^#\s*(.+?)(?:\s*-\s*Ghostty|\s*Theme)?$/i)
      if (commentMatch && !commentMatch[1].includes('Generated')) {
        themeName = commentMatch[1].trim().toLowerCase().replace(/\s+/g, '-')
        break
      }
    }

    const theme: ThemeImport = {
      name: themeName,
      colors,
      metadata: {
        source: 'ghostty',
        isDark: detectDarkMode(colors.bg),
      },
    }

    return {
      success: true,
      theme,
      format: 'ghostty',
    }
  } catch (error: any) {
    return {
      success: false,
      error: `Failed to parse Ghostty theme: ${error.message}`,
    }
  }
}
