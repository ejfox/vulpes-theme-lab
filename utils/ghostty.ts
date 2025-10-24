export interface GhosttyTheme {
  background: string
  foreground: string
  'cursor-color': string
  'selection-background': string
  'selection-foreground': string
  palette: Record<number, string>
}

export function serializeGhosttyTheme(theme: GhosttyTheme, name = 'theme-lab'): string {
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

  return lines.join('\n') + '\n'
}
