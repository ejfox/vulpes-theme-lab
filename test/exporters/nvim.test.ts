import { describe, it, expect } from 'vitest'
import { exportNeovim } from '~/utils/exporters/nvim'
import { createMockPalette, isValidHexColor, hasNoPlaceholders } from '../utils/test-helpers'

describe('Neovim Exporter', () => {
  const palette = createMockPalette()

  it('should export with correct filename', () => {
    const result = exportNeovim(palette, 'test-theme')
    expect(result.filename).toBe('test-theme.lua')
    expect(result.format).toBe('neovim')
  })

  it('should be valid Lua syntax', () => {
    const result = exportNeovim(palette)
    const content = result.content

    // Check for Lua structure
    expect(content).toContain('local M = {}')
    expect(content).toContain('function M.setup()')
    expect(content).toContain('return M')
    expect(content).not.toContain('${') // No unprocessed template literals
  })

  it('should include all core highlight groups', () => {
    const result = exportNeovim(palette)
    const content = result.content

    const requiredGroups = [
      'Normal',
      'Comment',
      'String',
      'Number',
      'Function',
      'Keyword',
      'Type',
      'Identifier',
      'Operator',
    ]

    requiredGroups.forEach(group => {
      expect(content).toContain(group)
    })
  })

  it('should include LSP diagnostic groups', () => {
    const result = exportNeovim(palette)
    const content = result.content

    expect(content).toContain('DiagnosticError')
    expect(content).toContain('DiagnosticWarn')
    expect(content).toContain('DiagnosticInfo')
    expect(content).toContain('DiagnosticHint')
  })

  it('should include TreeSitter groups', () => {
    const result = exportNeovim(palette)
    const content = result.content

    expect(content).toContain("['@comment']")
    expect(content).toContain("['@keyword']")
    expect(content).toContain("['@function']")
  })

  it('should use valid hex colors', () => {
    const result = exportNeovim(palette)
    const content = result.content

    const colorMatches = content.match(/#[0-9a-f]{6}/gi)
    expect(colorMatches).toBeTruthy()
    expect(colorMatches!.length).toBeGreaterThan(0)

    colorMatches!.forEach(color => {
      expect(isValidHexColor(color)).toBe(true)
    })
  })

  it('should respect font style options', () => {
    const result = exportNeovim(palette, 'test', {
      boldKeywords: true,
      italicComments: true,
      underlineErrors: true,
    })

    expect(result.content).toContain('bold = true')
    expect(result.content).toContain('italic = true')
    expect(result.content).toContain('underline')
  })

  it('should not contain placeholders', () => {
    const result = exportNeovim(palette)
    expect(hasNoPlaceholders(result.content)).toBe(true)
  })

  it('should define color palette in local variables', () => {
    const result = exportNeovim(palette)
    const content = result.content

    expect(content).toContain('local colors = {')
    expect(content).toContain(`bg = '${palette.bg}'`)
    expect(content).toContain(`fg = '${palette.fg}'`)
    expect(content).toContain(`error = '${palette.error}'`)
  })
})
