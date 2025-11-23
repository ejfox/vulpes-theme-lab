import { describe, it, expect } from 'vitest'
import { exportLazygit } from '~/utils/exporters/lazygit'
import { createMockPalette, isValidHexColor, hasNoPlaceholders } from '../utils/test-helpers'
import * as yaml from 'js-yaml'

describe('Lazygit Exporter', () => {
  const palette = createMockPalette()

  it('should export with correct filename', () => {
    const result = exportLazygit(palette, 'test-theme')
    expect(result.filename).toBe('lazygit-config.yml')
    expect(result.format).toBe('lazygit')
  })

  it('should generate valid YAML', () => {
    const result = exportLazygit(palette)

    expect(() => {
      yaml.load(result.content)
    }).not.toThrow()
  })

  it('should include gui.theme configuration', () => {
    const result = exportLazygit(palette)
    const content = result.content

    expect(content).toContain('gui:')
    expect(content).toContain('theme:')
  })

  it('should include all required theme colors', () => {
    const result = exportLazygit(palette)
    const content = result.content

    const requiredColors = [
      'activeBorderColor',
      'inactiveBorderColor',
      'searchingActiveBorderColor',
      'optionsTextColor',
      'selectedLineBgColor',
      'selectedRangeBgColor',
      'defaultFgColor',
    ]

    requiredColors.forEach((color) => {
      expect(content).toContain(color)
    })
  })

  it('should use valid hex colors', () => {
    const result = exportLazygit(palette)
    const content = result.content

    const colorMatches = content.match(/#[0-9a-f]{6}/gi)
    expect(colorMatches).toBeTruthy()
    expect(colorMatches!.length).toBeGreaterThan(0)

    colorMatches!.forEach((color) => {
      expect(isValidHexColor(color)).toBe(true)
    })
  })

  it('should not contain placeholders', () => {
    const result = exportLazygit(palette)
    expect(hasNoPlaceholders(result.content)).toBe(true)
  })

  it('should include branch color configuration', () => {
    const result = exportLazygit(palette)
    const content = result.content

    expect(content).toContain('branchColors:')
    expect(content).toContain('"main"')
    expect(content).toContain('"master"')
    expect(content).toContain('"develop"')
  })

  it('should include installation instructions', () => {
    const result = exportLazygit(palette)
    expect(result.content).toContain('~/.config/lazygit/config.yml')
  })

  it('should map palette colors correctly', () => {
    const result = exportLazygit(palette)
    const content = result.content

    expect(content).toContain(palette.base)
    expect(content).toContain(palette.fg)
    expect(content).toContain(palette.error)
    expect(content).toContain(palette.success)
  })
})
