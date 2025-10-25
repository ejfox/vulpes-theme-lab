import type { ThemeColors } from '~/composables/useTheme'

export function serializeTmuxTheme(theme: ThemeColors, name = 'theme-lab'): string {
  const lines = [
    `# ${name} tmux theme`,
    `# Generated with theme-lab`,
    '',
    `# Status bar`,
    `set -g status-style bg='${theme.bg}',fg='${theme.fg}'`,
    '',
    `# Active window`,
    `set -g window-status-current-style bg='${theme.keyword}',fg='${theme.bg}',bold`,
    '',
    `# Inactive window`,
    `set -g window-status-style fg='${theme.fg}'`,
    '',
    `# Pane borders`,
    `set -g pane-border-style fg='${theme.palette[8]}'`,
    `set -g pane-active-border-style fg='${theme.keyword}',bold`,
    '',
    `# Message text`,
    `set -g message-style bg='${theme.keyword}',fg='${theme.bg}'`,
    '',
    `# Clock mode`,
    `set -g clock-mode-colour '${theme.keyword}'`,
    '',
    `# Copy mode highlight`,
    `set -g mode-style bg='${theme.warning}',fg='${theme.bg}'`,
  ]

  return lines.join('\n') + '\n'
}
