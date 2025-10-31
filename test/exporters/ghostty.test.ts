import { describe, it, expect } from 'vitest'
import { exportGhostty } from '~/utils/exporters/ghostty'
import { createMockPalette, isValidHexColor, hasNoPlaceholders } from '../utils/test-helpers'

describe('Ghostty Exporter', () => {
  const palette = createMockPalette()

  it('should export with correct filename', () => {
    const result = exportGhostty(palette, 'test-theme')
    expect(result.filename).toBe('test-theme.ghostty')
    expect(result.format).toBe('ghostty')
  })

  it('should include all required config keys', () => {
    const result = exportGhostty(palette)
    const content = result.content

    expect(content).toContain('background =')
    expect(content).toContain('foreground =')
    expect(content).toContain('cursor-color =')
    expect(content).toContain('selection-background =')
    expect(content).toContain('selection-foreground =')
  })

  it('should include all 16 ANSI palette colors', () => {
    const result = exportGhostty(palette)
    const content = result.content

    for (let i = 0; i <= 15; i++) {
      expect(content).toContain(`palette = ${i}=`)
    }
  })

  it('should use valid hex colors', () => {
    const result = exportGhostty(palette)
    const content = result.content

    const colorMatches = content.match(/#[0-9a-f]{6}/gi)
    expect(colorMatches).toBeTruthy()
    expect(colorMatches!.length).toBeGreaterThan(0)

    colorMatches!.forEach(color => {
      expect(isValidHexColor(color)).toBe(true)
    })
  })

  it('should include theme name in comment', () => {
    const result = exportGhostty(palette, 'my-awesome-theme')
    expect(result.content).toContain('my-awesome-theme')
  })

  it('should not contain placeholders', () => {
    const result = exportGhostty(palette)
    expect(hasNoPlaceholders(result.content)).toBe(true)
  })

  it('should map palette colors correctly', () => {
    const result = exportGhostty(palette)
    expect(result.content).toContain(`background = ${palette.bg}`)
    expect(result.content).toContain(`foreground = ${palette.fg}`)
    expect(result.content).toContain(`cursor-color = ${palette.cursor}`)
  })
})
