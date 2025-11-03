import { describe, it, expect } from 'vitest'
import { exportZsh } from '~/utils/exporters/zsh'
import { createMockPalette, isValidHexColor, hasNoPlaceholders } from '../utils/test-helpers'

describe('ZSH Exporter', () => {
  const palette = createMockPalette()

  it('should export with correct filename', () => {
    const result = exportZsh(palette, 'test-theme')
    expect(result.filename).toBe('test-theme.zsh')
    expect(result.format).toBe('zsh')
  })

  it('should include ZSH syntax highlighting configuration', () => {
    const result = exportZsh(palette)
    const content = result.content

    expect(content).toContain('typeset -A ZSH_HIGHLIGHT_STYLES')
    expect(content).toContain('ZSH_HIGHLIGHT_STYLES[')
  })

  it('should include FZF configuration', () => {
    const result = exportZsh(palette)
    const content = result.content

    expect(content).toContain('export FZF_DEFAULT_OPTS=')
    expect(content).toContain('--color=')
  })

  it('should include all ZSH highlight types', () => {
    const result = exportZsh(palette)
    const content = result.content

    const requiredTypes = [
      'default',
      'alias',
      'builtin',
      'function',
      'command',
      'reserved-word',
      'comment',
      'path',
      'globbing',
      'redirection',
    ]

    requiredTypes.forEach(type => {
      expect(content).toContain(`ZSH_HIGHLIGHT_STYLES[${type}]`)
    })
  })

  it('should include FZF color keys', () => {
    const result = exportZsh(palette)
    const content = result.content

    const fzfKeys = [
      'fg:',
      'bg:',
      'hl:',
      'fg+:',
      'bg+:',
      'hl+:',
      'info:',
      'prompt:',
      'pointer:',
      'marker:',
      'spinner:',
      'header:',
    ]

    fzfKeys.forEach(key => {
      expect(content).toContain(key)
    })
  })

  it('should use valid hex colors for FZF', () => {
    const result = exportZsh(palette)
    const content = result.content

    // Only FZF section should have hex colors
    const fzfSection = content.split('# FZF Colors')[1]?.split('# Powerlevel10k')[0]
    expect(fzfSection).toBeTruthy()

    const colorMatches = fzfSection!.match(/#[0-9a-f]{6}/gi)
    expect(colorMatches).toBeTruthy()
    expect(colorMatches!.length).toBeGreaterThan(0)

    colorMatches!.forEach(color => {
      expect(isValidHexColor(color)).toBe(true)
    })
  })

  it('should not contain placeholders', () => {
    const result = exportZsh(palette)
    expect(hasNoPlaceholders(result.content)).toBe(true)
  })

  it('should include installation instructions', () => {
    const result = exportZsh(palette)
    expect(result.content).toContain('~/.zshrc')
  })

  it('should reference required dependencies', () => {
    const result = exportZsh(palette)
    const content = result.content

    expect(content).toContain('zsh-syntax-highlighting')
    expect(content).toContain('fzf')
  })

  it('should map palette colors correctly', () => {
    const result = exportZsh(palette)
    const content = result.content

    // FZF should use hex colors (color names can appear after --color= or after commas)
    expect(content).toMatch(/fg:#[0-9a-f]{6}/i)
    expect(content).toMatch(/bg:#[0-9a-f]{6}/i)
    expect(content).toMatch(/hl:#[0-9a-f]{6}/i)
    expect(content).toMatch(/info:#[0-9a-f]{6}/i)
    expect(content).toMatch(/prompt:#[0-9a-f]{6}/i)

    // ZSH_HIGHLIGHT_STYLES should use 256 color codes (numbers only, no # prefix)
    expect(content).toMatch(/ZSH_HIGHLIGHT_STYLES\[default\]='fg=\d+'/);
    expect(content).toMatch(/ZSH_HIGHLIGHT_STYLES\[comment\]='fg=\d+'/);
    expect(content).toMatch(/ZSH_HIGHLIGHT_STYLES\[command\]='fg=\d+'/);

    // Powerlevel10k should use 256 color codes without quotes
    expect(content).toMatch(/POWERLEVEL9K_DIR_BACKGROUND=\d+/);
    expect(content).toMatch(/POWERLEVEL9K_VCS_CLEAN_BACKGROUND=\d+/);
  })
})
