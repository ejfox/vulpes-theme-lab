/**
 * Neovim Lua colorscheme parser
 * Extracts colors from Neovim Lua theme files using regex
 *
 * Supports common patterns like:
 * - colors = { bg = '#1a1b26', fg = '#c0caf5' }
 * - local colors = { ... }
 * - keyword = { fg = colors.purple }
 * - ['@keyword'] = { fg = '#ff0000' }
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
 * Extract all hex colors and their associated keys from Lua code
 */
function extractColors(content: string): Map<string, string> {
  const colorMap = new Map<string, string>()

  // Pattern 1: key = '#hex' or key = "#hex"
  const directHexPattern = /(\w+)\s*=\s*['"]?(#[0-9a-fA-F]{6})['"]?/g
  let match
  while ((match = directHexPattern.exec(content)) !== null) {
    const key = match[1].toLowerCase()
    const color = normalizeHex(match[2])
    colorMap.set(key, color)
  }

  // Pattern 2: ['@scope.key'] = { fg = '#hex' }
  const treesitterPattern =
    /\['@?(\w+)(?:\.(\w+))?\'\]\s*=\s*\{[^}]*fg\s*=\s*['"]?(#[0-9a-fA-F]{6})['"]?/g
  while ((match = treesitterPattern.exec(content)) !== null) {
    const scope = match[1].toLowerCase()
    const subscope = match[2]?.toLowerCase()
    const color = normalizeHex(match[3])

    // Use the most specific key
    const key = subscope ? `${scope}_${subscope}` : scope
    if (!colorMap.has(key)) {
      colorMap.set(key, color)
    }
  }

  // Pattern 3: Keyword = { fg = '#hex', bg = '#hex' }
  const highlightPattern = /(\w+)\s*=\s*\{[^}]*fg\s*=\s*['"]?(#[0-9a-fA-F]{6})['"]?/g
  while ((match = highlightPattern.exec(content)) !== null) {
    const key = match[1].toLowerCase()
    const color = normalizeHex(match[2])
    if (!colorMap.has(key)) {
      colorMap.set(key, color)
    }
  }

  return colorMap
}

/**
 * Find color by trying multiple key variations
 */
function findColor(colorMap: Map<string, string>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const color = colorMap.get(key.toLowerCase())
    if (color) return color
  }
  return undefined
}

/**
 * Parse Neovim Lua colorscheme
 */
export function parseNeovim(content: string): ParseResult {
  try {
    const colorMap = extractColors(content)

    if (colorMap.size === 0) {
      return {
        success: false,
        error: 'No colors found in Neovim theme file',
      }
    }

    const colors: ThemeImportColors = {
      extra: {},
    }

    // Map common keys to semantic colors
    colors.bg = findColor(colorMap, 'bg', 'background', 'bg0', 'bg_dim', 'base')
    colors.fg = findColor(colorMap, 'fg', 'foreground', 'fg0', 'fg1', 'normal')

    // Syntax colors - try multiple variations
    colors.comment = findColor(colorMap, 'comment', 'comments', 'gray', 'grey', 'bg2')
    colors.keyword = findColor(colorMap, 'keyword', 'purple', 'magenta', 'violet')
    colors.string = findColor(colorMap, 'string', 'strings', 'green', 'string_builtin')
    colors.number = findColor(colorMap, 'number', 'numbers', 'orange', 'const_builtin')
    colors.boolean = findColor(colorMap, 'boolean', 'bool', 'orange', 'constant')
    colors.function = findColor(colorMap, 'function', 'func', 'blue', 'function_builtin', 'method')
    colors.constant = findColor(colorMap, 'constant', 'const', 'orange', 'macro')
    colors.type = findColor(colorMap, 'type', 'types', 'yellow', 'type_builtin', 'class')
    colors.variable = findColor(colorMap, 'variable', 'var', 'identifier', 'fg')
    colors.operator = findColor(colorMap, 'operator', 'operators', 'fg')
    colors.builtin = findColor(colorMap, 'builtin', 'special', 'cyan', 'function_builtin')
    colors.parameter = findColor(colorMap, 'parameter', 'param', 'variable_parameter', 'fg')
    colors.property = findColor(colorMap, 'property', 'field', 'attribute', 'variable_member')
    colors.namespace = findColor(colorMap, 'namespace', 'module', 'purple', 'namespace_builtin')
    colors.macro = findColor(colorMap, 'macro', 'macros', 'purple', 'constant_macro')
    colors.tag = findColor(colorMap, 'tag', 'tags', 'red', 'tag_attribute')
    colors.punctuation = findColor(
      colorMap,
      'punctuation',
      'delimiter',
      'fg',
      'punctuation_delimiter'
    )
    colors.heading = findColor(colorMap, 'heading', 'title', 'blue', 'markup_heading')

    // Status/diagnostic colors
    colors.error = findColor(colorMap, 'error', 'red', 'red1', 'diagnostic_error')
    colors.warning = findColor(colorMap, 'warning', 'warn', 'yellow', 'orange', 'diagnostic_warn')
    colors.success = findColor(colorMap, 'success', 'ok', 'green', 'diagnostic_ok')
    colors.info = findColor(colorMap, 'info', 'blue', 'cyan', 'diagnostic_info')
    colors.hint = findColor(colorMap, 'hint', 'gray', 'grey', 'diagnostic_hint')

    // UI elements
    colors.selection = findColor(colorMap, 'selection', 'visual', 'bg_visual', 'bg2')
    colors.cursor = findColor(colorMap, 'cursor', 'fg')
    colors.cursorline = findColor(colorMap, 'cursorline', 'bg1', 'bg_highlight', 'cursorlinebg')

    // Validate required fields
    if (!colors.bg || !colors.fg) {
      return {
        success: false,
        error: 'Invalid Neovim theme: missing background or foreground color',
      }
    }

    // Store unmapped colors as extra
    colorMap.forEach((color, key) => {
      if (!Object.values(colors).includes(color)) {
        colors.extra![key] = color
      }
    })

    // Extract theme name from filename or comments
    let themeName = 'imported-nvim'
    const nameMatch =
      content.match(/vim\.g\.colors_name\s*=\s*['"]([^'"]+)['"]/) ||
      content.match(/M\.name\s*=\s*['"]([^'"]+)['"]/) ||
      content.match(/name\s*=\s*['"]([^'"]+)['"]/)

    if (nameMatch) {
      themeName = nameMatch[1].toLowerCase().replace(/\s+/g, '-')
    }

    const theme: ThemeImport = {
      name: themeName,
      colors,
      metadata: {
        source: 'neovim',
        isDark: detectDarkMode(colors.bg),
      },
    }

    return {
      success: true,
      theme,
      format: 'neovim',
    }
  } catch (error: any) {
    return {
      success: false,
      error: `Failed to parse Neovim theme: ${error.message}`,
    }
  }
}
