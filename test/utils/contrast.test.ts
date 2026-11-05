import { describe, it, expect } from 'vitest'
import chroma from 'chroma-js'
import { nudgeToContrast, getContrastRatio, applyContrastFixes } from '~/utils/contrast'
import { createMockPalette } from './test-helpers'

function hueDistance(a: string, b: string): number {
  const d = Math.abs(chroma(a).oklch()[2] - chroma(b).oklch()[2])
  return Math.min(d, 360 - d)
}

describe('nudgeToContrast', () => {
  it('fixes a dark-bg failure by lightening, keeping the hue (not jumping to white)', () => {
    const fixed = nudgeToContrast('#000000', '#1a1aff')
    expect(getContrastRatio(fixed, '#000000')).toBeGreaterThanOrEqual(4.5)
    expect(fixed).not.toBe('#ffffff')
    expect(hueDistance(fixed, '#1a1aff')).toBeLessThan(15)
  })

  it('fixes a light-bg failure by darkening, keeping the hue', () => {
    const fixed = nudgeToContrast('#ffffff', '#ffb3c8')
    expect(getContrastRatio(fixed, '#ffffff')).toBeGreaterThanOrEqual(4.5)
    expect(fixed).not.toBe('#000000')
    expect(hueDistance(fixed, '#ffb3c8')).toBeLessThan(15)
  })

  it('makes the smallest change: barely clears the target, not maximal contrast', () => {
    const fixed = nudgeToContrast('#000000', '#1a1aff')
    expect(getContrastRatio(fixed, '#000000')).toBeLessThan(6)
  })

  it('leaves passing colors alone', () => {
    expect(nudgeToContrast('#000000', '#f2cfdf')).toBe('#f2cfdf')
  })
})

describe('applyContrastFixes', () => {
  it('only changes failing colors, and every change passes AA', () => {
    const palette = { ...createMockPalette(), bg: '#000000', comment: '#1a1aff' }
    const { changes } = applyContrastFixes(palette)
    expect(changes.length).toBeGreaterThan(0)
    for (const c of changes) {
      expect(c.newRatio).toBeGreaterThanOrEqual(4.5)
      expect(c.new).not.toBe('#ffffff')
    }
  })
})
