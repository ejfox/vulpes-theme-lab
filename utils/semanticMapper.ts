/**
 * Semantic color mapper
 * Converts imported themes to ThemePalette with intelligent fallbacks
 */

import chroma from 'chroma-js'
import type { ThemeImport } from './importers/types'
import type { ThemePalette } from './types'

/**
 * Generate missing colors using chroma-js color manipulation
 * Creates harmonious colors based on existing palette
 */
function generateMissingColor(
  base: string,
  role: 'warm' | 'cool' | 'muted' | 'bright' | 'error' | 'success' | 'warning' | 'info'
): string {
  const baseColor = chroma(base)

  switch (role) {
    case 'warm':
      return baseColor.set('hsl.h', '+30').hex()
    case 'cool':
      return baseColor.set('hsl.h', '-30').hex()
    case 'muted':
      return baseColor.desaturate(0.5).darken(0.3).hex()
    case 'bright':
      return baseColor.saturate(0.5).brighten(0.2).hex()
    case 'error':
      return chroma.hsl(0, 0.7, 0.5).hex() // Red
    case 'success':
      return chroma.hsl(120, 0.6, 0.4).hex() // Green
    case 'warning':
      return chroma.hsl(40, 0.9, 0.5).hex() // Orange
    case 'info':
      return chroma.hsl(210, 0.7, 0.5).hex() // Blue
  }
}

/**
 * Map imported theme to ThemePalette
 * Fills missing colors using intelligent fallbacks
 */
export function mapThemeToSemanticPalette(imported: ThemeImport): ThemePalette {
  const { colors } = imported
  const isDark = imported.metadata.isDark ?? true

  // Core colors (required)
  const bg = colors.bg || (isDark ? '#000000' : '#ffffff')
  const fg = colors.fg || (isDark ? '#ffffff' : '#000000')
  const base = colors.cursor || colors.selection || fg

  // Helper: Use provided color or generate fallback
  const getColor = (
    primary: string | undefined,
    fallback1?: string | undefined,
    fallback2?: string | undefined,
    generator?: () => string
  ): string => {
    return primary || fallback1 || fallback2 || generator?.() || fg
  }

  // Build ANSI palette (0-15)
  const palette: Record<number, string> = {}
  if (colors.palette) {
    // Use provided palette
    for (let i = 0; i <= 15; i++) {
      palette[i] = colors.palette[i] || fg
    }
  } else {
    // Generate standard ANSI palette from semantic colors
    palette[0] = bg // Black
    palette[1] = colors.error || generateMissingColor(fg, 'error') // Red
    palette[2] = colors.success || colors.string || generateMissingColor(fg, 'success') // Green
    palette[3] = colors.warning || colors.number || generateMissingColor(fg, 'warning') // Yellow
    palette[4] = colors.info || colors.function || generateMissingColor(fg, 'info') // Blue
    palette[5] = colors.keyword || generateMissingColor(fg, 'warm') // Magenta
    palette[6] = colors.constant || colors.builtin || generateMissingColor(fg, 'cool') // Cyan
    palette[7] = fg // White
    palette[8] = colors.comment || generateMissingColor(fg, 'muted') // Bright Black (gray)
    palette[9] = palette[1] // Bright Red
    palette[10] = palette[2] // Bright Green
    palette[11] = palette[3] // Bright Yellow
    palette[12] = palette[4] // Bright Blue
    palette[13] = palette[5] // Bright Magenta
    palette[14] = palette[6] // Bright Cyan
    palette[15] = chroma(fg).brighten(0.5).hex() // Bright White
  }

  // Create alternate background (slightly lighter/darker than main)
  const bgColor = chroma(bg)
  const bg_alt = isDark ? bgColor.brighten(0.3).hex() : bgColor.darken(0.15).hex()

  // Cartographic color rules (absolute hues, not theme-relative)
  // These preserve the semantic meaning of map features across all themes
  const CARTOGRAPHIC_HUES = {
    water: 200, // Blue (cyan-blue for water bodies)
    park: 120, // Green (grass/vegetation)
    motorway: 20, // Orange-yellow (high-traffic roads)
    trunk: 40, // Yellow (major roads)
    primary: 50, // Warm yellow (primary roads)
    secondary: 60, // Muted yellow-green (secondary roads)
    building: 280, // Purple-blue (structures)
    poi: 0, // Red (points of interest - landmarks)
  }

  // Lightness values for map features based on theme mode
  const getMapLightness = (feature: keyof typeof CARTOGRAPHIC_HUES) => {
    const lightness = {
      dark: {
        water: 15, // Subtle, close to bg
        park: 45,
        motorway: 60,
        trunk: 58,
        primary: 55,
        secondary: 52,
        building: 35,
        poi: 58,
      },
      light: {
        water: 85, // Subtle, close to bg
        park: 40,
        motorway: 42,
        trunk: 43,
        primary: 44,
        secondary: 46,
        building: 50,
        poi: 42,
      },
    }
    return isDark ? lightness.dark[feature] : lightness.light[feature]
  }

  // Saturation values for map features (consistent across modes)
  const getMapSaturation = (feature: keyof typeof CARTOGRAPHIC_HUES) => {
    const saturation = {
      water: 0.15, // Subtle hint of blue, close to bg
      park: 0.5, // Natural green
      motorway: 0.7, // High-visibility highways
      trunk: 0.6, // Major roads
      primary: 0.5, // Standard roads
      secondary: 0.4, // Muted roads
      building: 0.3, // Subtle structures
      poi: 0.6, // Noticeable landmarks
    }
    return saturation[feature]
  }

  // Generate MapLibre-specific colors using cartographic wisdom
  // Parks are green, water is blue - these are SEMANTIC constants, not relative
  const generateMapColor = (feature: keyof typeof CARTOGRAPHIC_HUES) => {
    const hue = CARTOGRAPHIC_HUES[feature]
    const lightness = getMapLightness(feature) / 100
    const saturation = getMapSaturation(feature)
    return chroma.hsl(hue, saturation, lightness).hex()
  }

  // Map all semantic roles with intelligent fallbacks
  const mappedPalette: ThemePalette = {
    // Core
    bg,
    bg_alt,
    fg,
    base,

    // Status colors
    error: getColor(colors.error, palette[1], undefined, () => generateMissingColor(fg, 'error')),
    warning: getColor(colors.warning, palette[3], undefined, () =>
      generateMissingColor(fg, 'warning')
    ),
    success: getColor(colors.success, palette[2], colors.string, () =>
      generateMissingColor(fg, 'success')
    ),
    info: getColor(colors.info, palette[4], colors.function, () =>
      generateMissingColor(fg, 'info')
    ),
    hint: getColor(colors.hint, palette[8], colors.comment, () => chroma(fg).alpha(0.5).hex()),

    // Syntax highlighting
    comment: getColor(colors.comment, palette[8], undefined, () =>
      generateMissingColor(fg, 'muted')
    ),
    keyword: getColor(colors.keyword, palette[5], undefined, () =>
      generateMissingColor(fg, 'warm')
    ),
    string: getColor(colors.string, palette[2], undefined, () =>
      generateMissingColor(fg, 'success')
    ),
    number: getColor(colors.number, palette[3], colors.constant, () =>
      generateMissingColor(fg, 'warning')
    ),
    boolean: getColor(colors.boolean, colors.number, palette[3], () =>
      generateMissingColor(fg, 'warning')
    ),
    function: getColor(colors.function, palette[4], undefined, () =>
      generateMissingColor(fg, 'info')
    ),
    constant: getColor(colors.constant, palette[6], colors.number, () =>
      generateMissingColor(fg, 'cool')
    ),
    type: getColor(colors.type, palette[3], colors.function, () =>
      generateMissingColor(fg, 'warning')
    ),
    variable: getColor(colors.variable, fg),
    operator: getColor(colors.operator, fg),
    builtin: getColor(colors.builtin, palette[6], colors.function, () =>
      generateMissingColor(fg, 'cool')
    ),
    parameter: getColor(colors.parameter, colors.variable, fg),
    property: getColor(colors.property, colors.variable, fg),
    namespace: getColor(colors.namespace, palette[5], colors.type, () =>
      generateMissingColor(fg, 'warm')
    ),
    macro: getColor(colors.macro, palette[5], colors.keyword, () =>
      generateMissingColor(fg, 'warm')
    ),
    tag: getColor(colors.tag, palette[1], colors.keyword, () => generateMissingColor(fg, 'error')),
    punctuation: getColor(colors.punctuation, fg),
    heading: getColor(colors.heading, palette[4], colors.function, () =>
      generateMissingColor(fg, 'info')
    ),

    // UI elements
    selection: getColor(colors.selection, bg_alt, undefined, () =>
      isDark ? bgColor.brighten(0.5).hex() : bgColor.darken(0.3).hex()
    ),
    cursor: getColor(colors.cursor, base, fg),
    cursorline: getColor(colors.cursorline, bg_alt, undefined, () =>
      isDark ? bgColor.brighten(0.15).hex() : bgColor.darken(0.08).hex()
    ),

    // ANSI palette
    palette,

    // MapLibre-specific colors using cartographic wisdom
    // Absolute semantic hues: water is blue, parks are green, regardless of theme
    mapWater: generateMapColor('water'),
    mapPark: generateMapColor('park'),
    mapRoadMotorway: generateMapColor('motorway'),
    mapRoadTrunk: generateMapColor('trunk'),
    mapRoadPrimary: generateMapColor('primary'),
    mapRoadSecondary: generateMapColor('secondary'),
    mapBuilding: generateMapColor('building'),
    mapPoi: generateMapColor('poi'),
  }

  return mappedPalette
}

/**
 * Convert ThemePalette to preset-compatible structure
 * Extracts basic theme properties for preset storage
 */
export function paletteToPreset(
  palette: ThemePalette,
  _name: string,
  _isDark: boolean
): {
  baseHue: number
  saturation: number
  contrast: number
} {
  // Analyze base color to extract hue/saturation
  const baseColor = chroma(palette.base)
  const [h, s] = baseColor.hsl()

  // Calculate contrast from bg/fg luminance difference
  const bgLum = chroma(palette.bg).luminance()
  const fgLum = chroma(palette.fg).luminance()
  const contrastRatio = (Math.max(bgLum, fgLum) + 0.05) / (Math.min(bgLum, fgLum) + 0.05)

  // Normalize contrast to 0-100 scale (typical range 1-21, aim for ~7-15)
  const normalizedContrast = Math.min(100, Math.max(0, ((contrastRatio - 1) / 20) * 100))

  return {
    baseHue: h || 0,
    saturation: (s || 0) * 100,
    contrast: normalizedContrast,
  }
}
