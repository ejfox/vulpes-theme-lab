import { describe, it, expect } from 'vitest'
import { exportTweakcc } from '../../utils/exporters/tweakcc'
import { createSemanticPalette } from '../../utils/types'
import type { ThemeColors } from '~/composables/useTheme'

// Mock theme colors for testing
const mockDarkColors: ThemeColors = {
  bg: '#282a36',
  fg: '#f8f8f2',
  base: '#6272a4',
  error: '#ff5555',
  warning: '#ffb86c',
  hint: '#8be9fd',
  comment: '#6272a4',
  keyword: '#ff79c6',
  string: '#f1fa8c',
  number: '#bd93f9',
  constant: '#ff79c6',
  function: '#50fa7b',
  type: '#8be9fd',
  variable: '#f8f8f2',
  operator: '#ff79c6',
  builtin: '#8be9fd',
  parameter: '#ffb86c',
  property: '#50fa7b',
  namespace: '#8be9fd',
  macro: '#ff79c6',
  tag: '#ff79c6',
  punctuation: '#f8f8f2',
  heading: '#bd93f9',
  palette: {
    0: '#21222c',
    1: '#ff5555',
    2: '#50fa7b',
    3: '#f1fa8c',
    4: '#bd93f9',
    5: '#ff79c6',
    6: '#8be9fd',
    7: '#f8f8f2',
    8: '#6272a4',
    9: '#ff6e6e',
    10: '#69ff94',
    11: '#ffffa5',
    12: '#d6acff',
    13: '#ff92df',
    14: '#a4ffff',
    15: '#ffffff',
  },
}

describe('tweakcc Exporter', () => {
  it('should export a valid tweakcc theme', () => {
    const palette = createSemanticPalette(mockDarkColors, 'dark')
    const result = exportTweakcc(palette, 'test-theme')

    expect(result).toBeDefined()
    expect(result.filename).toBe('test-theme-tweakcc.json')
    expect(result.format).toBe('tweakcc')
    expect(result.content).toBeTruthy()
  })

  it('should generate valid JSON', () => {
    const palette = createSemanticPalette(mockDarkColors, 'dark')
    const result = exportTweakcc(palette, 'test-theme')

    expect(() => JSON.parse(result.content)).not.toThrow()
  })

  it('should include theme name and id', () => {
    const palette = createSemanticPalette(mockDarkColors, 'dark')
    const result = exportTweakcc(palette, 'vulpes-dark')

    const theme = JSON.parse(result.content)
    expect(theme.name).toBe('vulpes-dark')
    expect(theme.id).toBe('vulpes-dark')
  })

  it('should include all 56+ required color properties', () => {
    const palette = createSemanticPalette(mockDarkColors, 'dark')
    const result = exportTweakcc(palette, 'test-theme')

    const theme = JSON.parse(result.content)
    expect(theme.colors).toBeDefined()

    // Core UI elements (8 properties)
    expect(theme.colors.autoAccept).toBeDefined()
    expect(theme.colors.bashBorder).toBeDefined()
    expect(theme.colors.promptBorder).toBeDefined()
    expect(theme.colors.promptBorderShimmer).toBeDefined()
    expect(theme.colors.background).toBeDefined()
    expect(theme.colors.planMode).toBeDefined()
    expect(theme.colors.ide).toBeDefined()
    expect(theme.colors.remember).toBeDefined()

    // Claude branding (4 properties)
    expect(theme.colors.claude).toBeDefined()
    expect(theme.colors.claudeShimmer).toBeDefined()
    expect(theme.colors.claudeBlue_FOR_SYSTEM_SPINNER).toBeDefined()
    expect(theme.colors.claudeBlueShimmer_FOR_SYSTEM_SPINNER).toBeDefined()

    // Text styling (7 properties)
    expect(theme.colors.text).toBeDefined()
    expect(theme.colors.inverseText).toBeDefined()
    expect(theme.colors.inactive).toBeDefined()
    expect(theme.colors.subtle).toBeDefined()
    expect(theme.colors.suggestion).toBeDefined()
    expect(theme.colors.permission).toBeDefined()
    expect(theme.colors.permissionShimmer).toBeDefined()

    // Status indicators (4 properties)
    expect(theme.colors.success).toBeDefined()
    expect(theme.colors.error).toBeDefined()
    expect(theme.colors.warning).toBeDefined()
    expect(theme.colors.warningShimmer).toBeDefined()

    // Diff display (8 properties)
    expect(theme.colors.diffAdded).toBeDefined()
    expect(theme.colors.diffRemoved).toBeDefined()
    expect(theme.colors.diffAddedDimmed).toBeDefined()
    expect(theme.colors.diffRemovedDimmed).toBeDefined()
    expect(theme.colors.diffAddedWord).toBeDefined()
    expect(theme.colors.diffRemovedWord).toBeDefined()
    expect(theme.colors.diffAddedWordDimmed).toBeDefined()
    expect(theme.colors.diffRemovedWordDimmed).toBeDefined()

    // Subagent colors (8 properties)
    expect(theme.colors.red_FOR_SUBAGENTS_ONLY).toBeDefined()
    expect(theme.colors.blue_FOR_SUBAGENTS_ONLY).toBeDefined()
    expect(theme.colors.green_FOR_SUBAGENTS_ONLY).toBeDefined()
    expect(theme.colors.yellow_FOR_SUBAGENTS_ONLY).toBeDefined()
    expect(theme.colors.purple_FOR_SUBAGENTS_ONLY).toBeDefined()
    expect(theme.colors.orange_FOR_SUBAGENTS_ONLY).toBeDefined()
    expect(theme.colors.pink_FOR_SUBAGENTS_ONLY).toBeDefined()
    expect(theme.colors.cyan_FOR_SUBAGENTS_ONLY).toBeDefined()

    // Rainbow colors (14 properties)
    expect(theme.colors.rainbow_red).toBeDefined()
    expect(theme.colors.rainbow_orange).toBeDefined()
    expect(theme.colors.rainbow_yellow).toBeDefined()
    expect(theme.colors.rainbow_green).toBeDefined()
    expect(theme.colors.rainbow_blue).toBeDefined()
    expect(theme.colors.rainbow_indigo).toBeDefined()
    expect(theme.colors.rainbow_violet).toBeDefined()
    expect(theme.colors.rainbow_red_shimmer).toBeDefined()
    expect(theme.colors.rainbow_orange_shimmer).toBeDefined()
    expect(theme.colors.rainbow_yellow_shimmer).toBeDefined()
    expect(theme.colors.rainbow_green_shimmer).toBeDefined()
    expect(theme.colors.rainbow_blue_shimmer).toBeDefined()
    expect(theme.colors.rainbow_indigo_shimmer).toBeDefined()
    expect(theme.colors.rainbow_violet_shimmer).toBeDefined()

    // Character & context (5 properties)
    expect(theme.colors.professionalBlue).toBeDefined()
    expect(theme.colors.clawd_body).toBeDefined()
    expect(theme.colors.clawd_background).toBeDefined()
    expect(theme.colors.userMessageBackground).toBeDefined()
    expect(theme.colors.bashMessageBackgroundColor).toBeDefined()

    // Rate limiting (2 properties)
    expect(theme.colors.rate_limit_fill).toBeDefined()
    expect(theme.colors.rate_limit_empty).toBeDefined()
  })

  it('should generate valid hex colors', () => {
    const palette = createSemanticPalette(mockDarkColors, 'dark')
    const result = exportTweakcc(palette, 'test-theme')

    const theme = JSON.parse(result.content)
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/

    // Test a few key colors
    expect(hexColorRegex.test(theme.colors.background)).toBe(true)
    expect(hexColorRegex.test(theme.colors.text)).toBe(true)
    expect(hexColorRegex.test(theme.colors.success)).toBe(true)
    expect(hexColorRegex.test(theme.colors.error)).toBe(true)
  })

  it('should include metadata with instructions', () => {
    const palette = createSemanticPalette(mockDarkColors, 'dark')
    const result = exportTweakcc(palette, 'test-theme')

    expect(result.metadata).toBeDefined()
    expect(result.metadata?.instructions).toBeDefined()
    expect(result.metadata?.schemaVersion).toBe('1.0')
    expect(result.metadata?.colorCount).toBe(56)
    expect(result.metadata?.generatedAt).toBeDefined()
  })

  it('should map semantic colors correctly', () => {
    const palette = createSemanticPalette(mockDarkColors, 'dark')
    const result = exportTweakcc(palette, 'test-theme')

    const theme = JSON.parse(result.content)

    // Verify mappings
    expect(theme.colors.background).toBe(palette.bg)
    expect(theme.colors.text).toBe(palette.fg)
    expect(theme.colors.success).toBe(palette.success)
    expect(theme.colors.error).toBe(palette.error)
    expect(theme.colors.warning).toBe(palette.warning)
    expect(theme.colors.bashBorder).toBe(palette.base)
  })

  it('should handle special characters in theme name', () => {
    const palette = createSemanticPalette(mockDarkColors, 'dark')
    const result = exportTweakcc(palette, 'my-awesome-theme!')

    const theme = JSON.parse(result.content)
    expect(theme.id).toBe('my-awesome-theme-')  // Special chars converted to hyphens
    expect(theme.name).toBe('my-awesome-theme!')  // Name keeps original
  })
})
