import { describe, it, expect } from 'vitest'
import { exportYazi } from '~/utils/exporters/yazi'
import { createMockPalette, isValidHexColor, hasNoPlaceholders } from '../utils/test-helpers'
import * as TOML from '@iarna/toml'

describe('Yazi Exporter', () => {
  const palette = createMockPalette()

  it('should export with correct filename', () => {
    const result = exportYazi(palette, 'test-theme')
    expect(result.filename).toBe('theme.toml')
    expect(result.format).toBe('yazi')
  })

  it('should generate valid TOML', () => {
    const result = exportYazi(palette)

    expect(() => {
      TOML.parse(result.content)
    }).not.toThrow()
  })

  it('should include all required sections', () => {
    const result = exportYazi(palette)
    const content = result.content

    expect(content).toContain('[manager]')
    expect(content).toContain('[status]')
    expect(content).toContain('[input]')
    expect(content).toContain('[select]')
    expect(content).toContain('[tasks]')
    expect(content).toContain('[which]')
    expect(content).toContain('[help]')
    expect(content).toContain('[filetype]')
  })

  it('should use valid hex colors', () => {
    const result = exportYazi(palette)
    const content = result.content

    const colorMatches = content.match(/#[0-9a-f]{6}/gi)
    expect(colorMatches).toBeTruthy()
    expect(colorMatches!.length).toBeGreaterThan(0)

    colorMatches!.forEach(color => {
      expect(isValidHexColor(color)).toBe(true)
    })
  })

  it('should not contain placeholders', () => {
    const result = exportYazi(palette)
    expect(hasNoPlaceholders(result.content)).toBe(true)
  })

  it('should include file type rules', () => {
    const result = exportYazi(palette)
    const content = result.content

    expect(content).toContain('rules = [')
    expect(content).toContain('mime = "image/*"')
    expect(content).toContain('mime = "video/*"')
    expect(content).toContain('application/zip')
  })

  it('should include mode configurations', () => {
    const result = exportYazi(palette)
    const content = result.content

    expect(content).toContain('mode_normal')
    expect(content).toContain('mode_select')
    expect(content).toContain('mode_unset')
  })

  it('should include permissions styling', () => {
    const result = exportYazi(palette)
    const content = result.content

    expect(content).toContain('permissions_t')
    expect(content).toContain('permissions_r')
    expect(content).toContain('permissions_w')
    expect(content).toContain('permissions_x')
  })

  it('should map theme colors correctly', () => {
    const result = exportYazi(palette)
    const content = result.content

    expect(content).toContain(palette.base)
    expect(content).toContain(palette.bg)
    expect(content).toContain(palette.fg)
    expect(content).toContain(palette.success)
    expect(content).toContain(palette.error)
  })
})
