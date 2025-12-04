/**
 * VS Code theme format parser
 * Parses JSON theme files with colors and tokenColors
 *
 * VS Code theme structure:
 * {
 *   "name": "Theme Name",
 *   "type": "dark",
 *   "colors": {
 *     "editor.background": "#1a1b26",
 *     "editor.foreground": "#c0caf5",
 *     ...
 *   },
 *   "tokenColors": [
 *     {
 *       "scope": ["comment", "punctuation.definition.comment"],
 *       "settings": { "foreground": "#565f89" }
 *     },
 *     ...
 *   ]
 * }
 */

import type { ParseResult, ThemeImport, ThemeImportColors } from './types'

interface VSCodeTheme {
  name?: string
  type?: 'dark' | 'light'
  colors?: Record<string, string>
  tokenColors?: Array<{
    name?: string
    scope?: string | string[]
    settings: {
      foreground?: string
      background?: string
      fontStyle?: string
    }
  }>
}

/**
 * Normalize hex color (ensure # prefix)
 */
function normalizeHex(color: string): string {
  if (!color) return color
  return color.startsWith('#') ? color : `#${color}`
}

/**
 * Find color for a specific TextMate scope
 * Matches scope against tokenColors array
 */
function findScopeColor(
  tokenColors: VSCodeTheme['tokenColors'],
  ...targetScopes: string[]
): string | undefined {
  if (!tokenColors) return undefined

  for (const target of targetScopes) {
    for (const token of tokenColors) {
      if (!token.scope) continue

      const scopes = Array.isArray(token.scope) ? token.scope : [token.scope]

      for (const scope of scopes) {
        // Exact match or prefix match
        if (scope === target || scope.startsWith(target + '.') || target.startsWith(scope + '.')) {
          return token.settings.foreground
        }
      }
    }
  }

  return undefined
}

/**
 * Parse VS Code JSON theme
 */
export function parseVSCode(content: string): ParseResult {
  try {
    const theme: VSCodeTheme = JSON.parse(content)

    if (!theme.colors && !theme.tokenColors) {
      return {
        success: false,
        error: 'Invalid VS Code theme: missing colors or tokenColors',
      }
    }

    const colors: ThemeImportColors = {
      extra: {},
    }

    // Extract editor colors from colors object
    if (theme.colors) {
      colors.bg = normalizeHex(
        theme.colors['editor.background'] ||
          theme.colors['background'] ||
          theme.colors['editor.bg']
      )

      colors.fg = normalizeHex(
        theme.colors['editor.foreground'] ||
          theme.colors['foreground'] ||
          theme.colors['editor.fg']
      )

      colors.selection = normalizeHex(
        theme.colors['editor.selectionBackground'] ||
          theme.colors['editor.selection'] ||
          theme.colors['selection.background']
      )

      colors.cursor = normalizeHex(
        theme.colors['editorCursor.foreground'] || theme.colors['cursor'] || colors.fg
      )

      colors.cursorline = normalizeHex(
        theme.colors['editor.lineHighlightBackground'] ||
          theme.colors['editorLineNumber.activeForeground']
      )

      // Diagnostic/status colors from UI
      colors.error = normalizeHex(
        theme.colors['errorForeground'] ||
          theme.colors['editorError.foreground'] ||
          theme.colors['terminal.ansiRed']
      )

      colors.warning = normalizeHex(
        theme.colors['editorWarning.foreground'] ||
          theme.colors['warningForeground'] ||
          theme.colors['terminal.ansiYellow']
      )

      colors.info = normalizeHex(
        theme.colors['editorInfo.foreground'] ||
          theme.colors['infoForeground'] ||
          theme.colors['terminal.ansiBlue']
      )

      colors.success = normalizeHex(theme.colors['terminal.ansiGreen'])
      colors.hint = normalizeHex(theme.colors['editorHint.foreground'])

      // Store all editor colors as extra
      Object.entries(theme.colors).forEach(([key, value]) => {
        if (value && typeof value === 'string' && value.startsWith('#')) {
          colors.extra![key] = normalizeHex(value)
        }
      })
    }

    // Extract syntax colors from tokenColors
    if (theme.tokenColors) {
      colors.comment = normalizeHex(
        findScopeColor(theme.tokenColors, 'comment', 'punctuation.definition.comment') ||
          colors.comment
      )

      colors.keyword = normalizeHex(
        findScopeColor(
          theme.tokenColors,
          'keyword',
          'keyword.control',
          'storage.type',
          'storage.modifier'
        ) || colors.keyword
      )

      colors.string = normalizeHex(
        findScopeColor(theme.tokenColors, 'string', 'string.quoted', 'string.template') ||
          colors.string
      )

      colors.number = normalizeHex(
        findScopeColor(theme.tokenColors, 'constant.numeric', 'number') || colors.number
      )

      colors.boolean = normalizeHex(
        findScopeColor(theme.tokenColors, 'constant.language.boolean', 'constant.language') ||
          colors.boolean
      )

      colors.function = normalizeHex(
        findScopeColor(
          theme.tokenColors,
          'entity.name.function',
          'support.function',
          'meta.function-call'
        ) || colors.function
      )

      colors.constant = normalizeHex(
        findScopeColor(theme.tokenColors, 'constant', 'variable.other.constant') || colors.constant
      )

      colors.type = normalizeHex(
        findScopeColor(
          theme.tokenColors,
          'entity.name.type',
          'entity.name.class',
          'support.type',
          'support.class'
        ) || colors.type
      )

      colors.variable = normalizeHex(
        findScopeColor(
          theme.tokenColors,
          'variable',
          'variable.other',
          'variable.other.readwrite'
        ) || colors.variable
      )

      colors.operator = normalizeHex(
        findScopeColor(theme.tokenColors, 'keyword.operator', 'operator') || colors.operator
      )

      colors.builtin = normalizeHex(
        findScopeColor(
          theme.tokenColors,
          'support.function.builtin',
          'support.class.builtin',
          'variable.language'
        ) || colors.builtin
      )

      colors.parameter = normalizeHex(
        findScopeColor(theme.tokenColors, 'variable.parameter', 'parameter') || colors.parameter
      )

      colors.property = normalizeHex(
        findScopeColor(
          theme.tokenColors,
          'variable.other.property',
          'support.type.property-name'
        ) || colors.property
      )

      colors.namespace = normalizeHex(
        findScopeColor(theme.tokenColors, 'entity.name.namespace', 'entity.name.module') ||
          colors.namespace
      )

      colors.macro = normalizeHex(
        findScopeColor(theme.tokenColors, 'entity.name.function.preprocessor', 'meta.preprocessor') ||
          colors.macro
      )

      colors.tag = normalizeHex(
        findScopeColor(
          theme.tokenColors,
          'entity.name.tag',
          'meta.tag',
          'support.class.component'
        ) || colors.tag
      )

      colors.punctuation = normalizeHex(
        findScopeColor(theme.tokenColors, 'punctuation', 'meta.brace', 'meta.bracket') ||
          colors.punctuation
      )

      colors.heading = normalizeHex(
        findScopeColor(
          theme.tokenColors,
          'markup.heading',
          'entity.name.section',
          'markup.heading.markdown'
        ) || colors.heading
      )
    }

    // Validate required fields
    if (!colors.bg || !colors.fg) {
      return {
        success: false,
        error: 'Invalid VS Code theme: missing editor.background or editor.foreground',
      }
    }

    const themeName = theme.name?.toLowerCase().replace(/\s+/g, '-') || 'imported-vscode'
    const isDark = theme.type === 'dark' || theme.type === undefined // Default to dark if not specified

    const importedTheme: ThemeImport = {
      name: themeName,
      colors,
      metadata: {
        source: 'vscode',
        isDark,
      },
    }

    return {
      success: true,
      theme: importedTheme,
      format: 'vscode',
    }
  } catch (error: any) {
    return {
      success: false,
      error: `Failed to parse VS Code theme: ${error.message}`,
    }
  }
}
