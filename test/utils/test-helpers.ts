import type { ThemePalette } from '~/utils/types'

/**
 * Creates a mock theme palette for testing
 * Uses predictable hex color values for easy validation
 */
export function createMockPalette(): ThemePalette {
  return {
    // Base colors
    bg: '#0d0d0d',
    bg_alt: '#1a1a1a',
    fg: '#e0e0e0',
    base: '#ff0099',

    // Semantic status colors
    error: '#ff4444',
    warning: '#ffaa00',
    success: '#00ff00',
    info: '#0088ff',
    hint: '#888888',

    // Syntax highlighting
    comment: '#666666',
    keyword: '#ff66cc',
    string: '#00ffaa',
    number: '#ffaa00',
    boolean: '#ff8844',
    function: '#66ccff',
    constant: '#ff66ff',
    type: '#00cccc',
    variable: '#cccccc',
    operator: '#ffffff',
    builtin: '#ff9900',
    parameter: '#aaccff',
    property: '#99ff99',
    namespace: '#cc99ff',
    macro: '#ffcc66',
    tag: '#ff6699',
    punctuation: '#999999',
    heading: '#ffaa66',

    // UI elements
    selection: '#ffaa00',
    cursor: '#ff0099',
    cursorline: '#151515',

    // ANSI palette (0-15)
    palette: {
      0: '#0d0d0d',
      1: '#ff4444',
      2: '#00ff00',
      3: '#ffaa00',
      4: '#0088ff',
      5: '#ff00ff',
      6: '#00ffff',
      7: '#e0e0e0',
      8: '#666666',
      9: '#ff6666',
      10: '#00ff66',
      11: '#ffcc00',
      12: '#00aaff',
      13: '#ff66ff',
      14: '#00ffff',
      15: '#ffffff',
    },
  }
}

/**
 * Validates that a string is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color)
}

/**
 * Validates that content contains no placeholder values
 */
export function hasNoPlaceholders(content: string): boolean {
  return (
    !content.includes('undefined') &&
    !content.includes('null') &&
    !content.includes('[object Object]')
  )
}
