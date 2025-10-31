export interface GhosttyTheme {
  background: string
  foreground: string
  'cursor-color': string
  'selection-background': string
  'selection-foreground': string
  palette: Record<number, string>
}

export function serializeGhosttyTheme(
  theme: GhosttyTheme,
  name = 'theme-lab',
  visualEffects?: { backgroundOpacity?: number; backgroundBlur?: number }
): string {
  const lines = [
    `# ${name}`,
    `# Generated with theme-lab - Tuftian hue offset precision`,
    `background = ${theme.background}`,
    `foreground = ${theme.foreground}`,
    `cursor-color = ${theme['cursor-color']}`,
    `selection-background = ${theme['selection-background']}`,
    `selection-foreground = ${theme['selection-foreground']}`,
    '',
  ]

  for (let i = 0; i < 16; i++) {
    if (theme.palette[i]) {
      lines.push(`palette = ${i}=${theme.palette[i]}`)
    }
  }

  // Add visual effects if provided
  if (visualEffects) {
    lines.push('')
    lines.push('# Visual Effects')

    if (visualEffects.backgroundOpacity !== undefined && visualEffects.backgroundOpacity < 100) {
      const opacity = (visualEffects.backgroundOpacity / 100).toFixed(2)
      lines.push(`background-opacity = ${opacity}`)
    }

    if (visualEffects.backgroundBlur !== undefined && visualEffects.backgroundBlur > 0) {
      lines.push(`background-blur-radius = ${visualEffects.backgroundBlur}`)
    }
  }

  return lines.join('\n') + '\n'
}
