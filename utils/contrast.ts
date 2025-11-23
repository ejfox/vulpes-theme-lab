import chroma from 'chroma-js'
import type { ThemePalette } from './types'

/**
 * Calculate WCAG 2.1 contrast ratio between two colors
 * @param fg - Foreground color (hex)
 * @param bg - Background color (hex)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(fg: string, bg: string): number {
  try {
    const fgLum = chroma(fg).luminance()
    const bgLum = chroma(bg).luminance()

    const lighter = Math.max(fgLum, bgLum)
    const darker = Math.min(fgLum, bgLum)

    return (lighter + 0.05) / (darker + 0.05)
  } catch (e) {
    return 1
  }
}

/**
 * Check if contrast ratio meets WCAG AA standards
 * @param ratio - Contrast ratio
 * @param level - 'AA' (4.5:1) or 'AAA' (7:1) for normal text
 * @returns true if meets standard
 */
export function meetsWCAG(ratio: number, level: 'AA' | 'AAA' = 'AA'): boolean {
  return level === 'AAA' ? ratio >= 7 : ratio >= 4.5
}

/**
 * Detect if a theme is light or dark based on background luminance
 * @param palette - Theme palette
 * @returns 'light' or 'dark'
 */
export function detectThemeType(palette: ThemePalette): 'light' | 'dark' {
  try {
    const bgLuminance = chroma(palette.bg).luminance()
    // Threshold: 0.5 is middle gray (sRGB ~188)
    return bgLuminance > 0.5 ? 'light' : 'dark'
  } catch (e) {
    return 'dark'
  }
}

/**
 * Get an appropriate high-contrast foreground for a background
 * Uses WCAG AA standard (4.5:1 minimum)
 * @param bg - Background color
 * @param preferredFg - Preferred foreground color (will be used if contrast is sufficient)
 * @returns High-contrast foreground color
 */
export function ensureContrast(bg: string, preferredFg: string): string {
  try {
    const ratio = getContrastRatio(preferredFg, bg)

    // If preferred color already has good contrast, use it
    if (meetsWCAG(ratio, 'AA')) {
      return preferredFg
    }

    // Otherwise, use pure black or white based on background luminance
    const bgLum = chroma(bg).luminance()
    return bgLum > 0.5 ? '#000000' : '#ffffff'
  } catch (e) {
    return '#ffffff'
  }
}

/**
 * Validate all critical contrast ratios in a theme
 * @param palette - Theme palette
 * @returns Array of contrast issues
 */
export interface ContrastIssue {
  pair: string
  fg: string
  bg: string
  ratio: number
  required: number
  severity: 'critical' | 'warning'
}

export function validateThemeContrast(palette: ThemePalette): ContrastIssue[] {
  const issues: ContrastIssue[] = []

  // Critical UI elements that must meet WCAG AA
  const criticalPairs: Array<{ pair: string; fg: string; bg: string }> = [
    { pair: 'Normal text', fg: palette.fg, bg: palette.bg },
    { pair: 'Comments', fg: palette.comment, bg: palette.bg },
    { pair: 'Strings', fg: palette.string, bg: palette.bg },
    { pair: 'Keywords', fg: palette.keyword, bg: palette.bg },
    { pair: 'Functions', fg: palette.function, bg: palette.bg },
    { pair: 'Errors', fg: palette.error, bg: palette.bg },
    { pair: 'Warnings', fg: palette.warning, bg: palette.bg },
    { pair: 'Success', fg: palette.success, bg: palette.bg },
  ]

  for (const { pair, fg, bg } of criticalPairs) {
    const ratio = getContrastRatio(fg, bg)
    const required = 4.5 // WCAG AA for normal text

    if (ratio < required) {
      issues.push({
        pair,
        fg,
        bg,
        ratio,
        required,
        severity: ratio < 3 ? 'critical' : 'warning',
      })
    }
  }

  return issues
}

/**
 * Get a summary of theme accessibility
 * @param palette - Theme palette
 * @returns Summary with pass/fail counts
 */
export function getAccessibilitySummary(palette: ThemePalette) {
  const issues = validateThemeContrast(palette)
  const critical = issues.filter((i) => i.severity === 'critical').length
  const warnings = issues.filter((i) => i.severity === 'warning').length

  return {
    passed: issues.length === 0,
    total: 8, // Number of pairs we check
    failed: issues.length,
    critical,
    warnings,
    issues,
  }
}

/**
 * Apply contrast fixes to a theme palette
 * Returns a new palette with fixed colors and a list of changes made
 * @param palette - Original theme palette
 * @returns Fixed palette and list of changes
 */
export interface ContrastChange {
  color: string
  old: string
  new: string
  oldRatio: number
  newRatio: number
  reason: string
}

export function applyContrastFixes(palette: ThemePalette): {
  fixed: ThemePalette
  changes: ContrastChange[]
} {
  const changes: ContrastChange[] = []
  const fixed = { ...palette }

  // Critical color pairs that must meet WCAG AA
  const criticalColors: Array<keyof ThemePalette> = [
    'fg',
    'comment',
    'string',
    'keyword',
    'function',
    'error',
    'warning',
    'success',
  ]

  criticalColors.forEach((colorKey) => {
    const original = palette[colorKey] as string
    if (typeof original !== 'string') return

    const oldRatio = getContrastRatio(original, palette.bg)

    if (!meetsWCAG(oldRatio, 'AA')) {
      const fixedColor = ensureContrast(palette.bg, original)
      const newRatio = getContrastRatio(fixedColor, palette.bg)

      fixed[colorKey] = fixedColor as any
      changes.push({
        color: colorKey,
        old: original,
        new: fixedColor,
        oldRatio,
        newRatio,
        reason: `Contrast ${oldRatio.toFixed(2)}:1 < 4.5:1 (WCAG AA minimum)`,
      })
    }
  })

  return { fixed, changes }
}

/**
 * Generate an accessibility report for a theme
 * @param palette - Theme palette
 * @param themeName - Name of the theme
 * @returns Markdown accessibility report
 */
export function generateAccessibilityReport(palette: ThemePalette, themeName: string): string {
  const summary = getAccessibilitySummary(palette)
  const themeType = detectThemeType(palette)

  return `# Accessibility Report: ${themeName}

**Theme Type:** ${themeType}
**Background:** ${palette.bg}
**Generated:** ${new Date().toISOString()}

## Summary

- **Total Checks:** ${summary.total}
- **✓ Passed:** ${summary.total - summary.failed}
- **✗ Failed:** ${summary.failed}
- **⚠ Critical Issues:** ${summary.critical} (contrast < 3:1)
- **⚠ Warnings:** ${summary.warnings} (contrast 3:1 - 4.5:1)

${summary.passed ? '✅ **This theme meets WCAG AA accessibility standards!**' : '❌ **This theme has accessibility issues that should be addressed.**'}

## WCAG Standards

- **AA (Minimum):** 4.5:1 contrast ratio for normal text
- **AAA (Enhanced):** 7:1 contrast ratio for normal text

${
  summary.issues.length > 0
    ? `## Issues Detected

${summary.issues
  .map(
    (issue) => `
### ${issue.pair}

- **Foreground:** \`${issue.fg}\`
- **Background:** \`${issue.bg}\`
- **Contrast Ratio:** ${issue.ratio.toFixed(2)}:1
- **Required:** ${issue.required}:1
- **Severity:** ${issue.severity === 'critical' ? '🔴 CRITICAL' : '🟡 WARNING'}
- **Gap:** ${(issue.required - issue.ratio).toFixed(2)}:1 below minimum

`
  )
  .join('\n')}

## Recommended Actions

${
  summary.critical > 0
    ? `
### Critical Fixes Required

The following colors have **critically low contrast** (< 3:1) and are likely unreadable:

${summary.issues
  .filter((i) => i.severity === 'critical')
  .map((issue) => `- **${issue.pair}:** Increase contrast by ${(4.5 - issue.ratio).toFixed(2)}:1`)
  .join('\n')}

**Action:** Use the "Auto-Fix & Export" option to automatically adjust these colors to meet WCAG AA standards.
`
    : ''
}

${
  summary.warnings > 0
    ? `
### Warnings

The following colors have **insufficient contrast** for WCAG AA compliance but are still somewhat readable:

${summary.issues
  .filter((i) => i.severity === 'warning')
  .map((issue) => `- **${issue.pair}:** Increase contrast by ${(4.5 - issue.ratio).toFixed(2)}:1`)
  .join('\n')}

**Action:** Consider adjusting these colors for better accessibility, especially for users with low vision.
`
    : ''
}
`
    : `## ✅ No Issues Found

All color combinations meet or exceed WCAG AA standards. Great work!
`
}

## Resources

- [WCAG 2.1 Understanding Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Who Can Use This Color Combination?](https://www.whocanuse.com/)

---

*Generated by vulpes-theme-lab*
`
}
