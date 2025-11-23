import { describe, it, expect } from 'vitest'
import { exportBat } from '~/utils/exporters/bat'
import { createMockPalette, isValidHexColor, hasNoPlaceholders } from '../utils/test-helpers'
import { XMLParser } from 'fast-xml-parser'

describe('Bat Exporter', () => {
  const palette = createMockPalette()

  it('should export with correct filename', () => {
    const result = exportBat(palette, 'test-theme')
    expect(result.filename).toBe('test-theme.tmTheme')
    expect(result.format).toBe('bat')
  })

  it('should generate valid XML', () => {
    const result = exportBat(palette)
    const parser = new XMLParser()

    expect(() => {
      parser.parse(result.content)
    }).not.toThrow()
  })

  it('should be a valid plist', () => {
    const result = exportBat(palette)
    const content = result.content

    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(content).toContain('<!DOCTYPE plist')
    expect(content).toContain('<plist version="1.0">')
    expect(content).toContain('</plist>')
  })

  it('should include theme name', () => {
    const result = exportBat(palette, 'my-theme')
    expect(result.content).toContain('<string>my-theme</string>')
  })

  it('should include syntax scopes', () => {
    const result = exportBat(palette)
    const content = result.content

    const requiredScopes = [
      'comment',
      'string',
      'constant.numeric',
      'keyword',
      'entity.name.function',
      'storage.type',
    ]

    requiredScopes.forEach((scope) => {
      expect(content).toContain(scope)
    })
  })

  it('should use valid hex colors', () => {
    const result = exportBat(palette)
    const content = result.content

    const colorMatches = content.match(/#[0-9a-f]{6}/gi)
    expect(colorMatches).toBeTruthy()
    expect(colorMatches!.length).toBeGreaterThan(0)

    colorMatches!.forEach((color) => {
      expect(isValidHexColor(color)).toBe(true)
    })
  })

  it('should not contain placeholders', () => {
    const result = exportBat(palette)
    expect(hasNoPlaceholders(result.content)).toBe(true)
  })

  it('should include base editor colors', () => {
    const result = exportBat(palette)
    expect(result.content).toContain('<key>foreground</key>')
    expect(result.content).toContain('<key>background</key>')
  })

  it('should include markup support', () => {
    const result = exportBat(palette)
    const content = result.content

    expect(content).toContain('markup.heading')
    expect(content).toContain('markup.bold')
    expect(content).toContain('markup.inserted')
    expect(content).toContain('markup.deleted')
  })
})
