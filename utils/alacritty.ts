import type { ThemeColors } from '~/composables/useTheme'

export function serializeAlacrittyTheme(theme: ThemeColors, name = 'theme-lab'): string {
  const lines = [
    `# ${name} - Alacritty color scheme`,
    `# Generated with theme-lab`,
    ``,
    `[colors.primary]`,
    `background = '${theme.bg}'`,
    `foreground = '${theme.fg}'`,
    ``,
    `[colors.cursor]`,
    `text = 'CellBackground'`,
    `cursor = 'CellForeground'`,
    ``,
    `[colors.selection]`,
    `text = '${theme.bg}'`,
    `background = '${theme.warning}'`,
    ``,
    `[colors.normal]`,
    `black = '${theme.palette[0]}'`,
    `red = '${theme.palette[1]}'`,
    `green = '${theme.palette[2]}'`,
    `yellow = '${theme.palette[3]}'`,
    `blue = '${theme.palette[4]}'`,
    `magenta = '${theme.palette[5]}'`,
    `cyan = '${theme.palette[6]}'`,
    `white = '${theme.palette[7]}'`,
    ``,
    `[colors.bright]`,
    `black = '${theme.palette[8]}'`,
    `red = '${theme.palette[9]}'`,
    `green = '${theme.palette[10]}'`,
    `yellow = '${theme.palette[11]}'`,
    `blue = '${theme.palette[12]}'`,
    `magenta = '${theme.palette[13]}'`,
    `cyan = '${theme.palette[14]}'`,
    `white = '${theme.palette[15]}'`,
  ]

  return lines.join('\n') + '\n'
}
