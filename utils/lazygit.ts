import type { ThemeColors } from '~/composables/useTheme'

export function serializeLazygitTheme(theme: ThemeColors, lightMode = false): string {
  const lines = [
    `# Lazygit theme configuration`,
    `# Generated with theme-lab`,
    `# Add this to ~/.config/lazygit/config.yml under the 'gui' section`,
    ``,
    `gui:`,
    `  theme:`,
    `    lightTheme: ${lightMode}`,
    `    activeBorderColor:`,
    `      - '${theme.keyword}'`,
    `      - bold`,
    `    inactiveBorderColor:`,
    `      - '${theme.palette[8]}'`,
    `    searchingActiveBorderColor:`,
    `      - '${theme.warning}'`,
    `      - bold`,
    `    optionsTextColor:`,
    `      - '${theme.keyword}'`,
    `    selectedLineBgColor:`,
    `      - '${theme.palette[0]}'`,
    `    selectedRangeBgColor:`,
    `      - '${theme.palette[0]}'`,
    `    cherryPickedCommitBgColor:`,
    `      - '${theme.warning}'`,
    `    cherryPickedCommitFgColor:`,
    `      - '${theme.bg}'`,
    `    unstagedChangesColor:`,
    `      - '${theme.error}'`,
    `    defaultFgColor:`,
    `      - '${theme.fg}'`,
  ]

  return lines.join('\n') + '\n'
}
