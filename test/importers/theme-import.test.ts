import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parseThemeFromFile } from '../../utils/importers'
import { mapThemeToSemanticPalette } from '../../utils/semanticMapper'

describe('Theme Import System', () => {
  it('should parse Gruvbox base16 YAML', () => {
    const content = readFileSync(join(process.cwd(), 'test-themes/gruvbox-dark.yml'), 'utf-8')
    const result = parseThemeFromFile(content, 'gruvbox-dark.yml')

    expect(result.success).toBe(true)
    expect(result.format).toBe('base16')
    expect(result.theme?.name).toContain('gruvbox')
    expect(result.theme?.metadata.isDark).toBe(true)
    expect(result.theme?.colors.bg).toBe('#1d2021')
    expect(result.theme?.colors.fg).toBe('#d5c4a1')
  })

  it('should parse Ayu Dark VS Code JSON', () => {
    const content = readFileSync(join(process.cwd(), 'test-themes/ayu-dark.json'), 'utf-8')
    const result = parseThemeFromFile(content, 'ayu-dark.json')

    expect(result.success).toBe(true)
    expect(result.format).toBe('vscode')
    expect(result.theme?.name).toContain('ayu')
    expect(result.theme?.metadata.isDark).toBe(true)
    expect(result.theme?.colors.bg).toBeDefined()
    expect(result.theme?.colors.fg).toBeDefined()
  })

  it('should parse Nord VS Code JSON', () => {
    const content = readFileSync(join(process.cwd(), 'test-themes/nord.json'), 'utf-8')
    const result = parseThemeFromFile(content, 'nord.json')

    if (!result.success) {
      console.log('Nord parse error:', result.error)
    }

    expect(result.success).toBe(true)
    expect(result.format).toBe('vscode')
    expect(result.theme?.colors.bg).toBeDefined()
    expect(result.theme?.colors.fg).toBeDefined()
  })

  it('should parse Tokyo Night VS Code JSON', () => {
    const content = readFileSync(join(process.cwd(), 'test-themes/tokyonight-night.json'), 'utf-8')
    const result = parseThemeFromFile(content, 'tokyonight-night.json')

    expect(result.success).toBe(true)
    expect(result.format).toBe('vscode')
    expect(result.theme?.colors.bg).toBeDefined()
    expect(result.theme?.colors.fg).toBeDefined()
  })

  it('should map imported theme to semantic palette', () => {
    const content = readFileSync(join(process.cwd(), 'test-themes/gruvbox-dark.yml'), 'utf-8')
    const result = parseThemeFromFile(content, 'gruvbox-dark.yml')

    expect(result.success).toBe(true)

    const palette = mapThemeToSemanticPalette(result.theme!)

    // Check all required colors are present
    expect(palette.bg).toBeDefined()
    expect(palette.fg).toBeDefined()
    expect(palette.base).toBeDefined()
    expect(palette.comment).toBeDefined()
    expect(palette.keyword).toBeDefined()
    expect(palette.string).toBeDefined()
    expect(palette.function).toBeDefined()

    // Check ANSI palette
    expect(Object.keys(palette.palette)).toHaveLength(16)
    expect(palette.palette[0]).toBeDefined() // Black
    expect(palette.palette[15]).toBeDefined() // Bright White
  })
})
