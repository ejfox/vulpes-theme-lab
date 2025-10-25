import type { ThemeColors } from '~/composables/useTheme'

export function serializeFzfTheme(theme: ThemeColors): string {
  const lines = [
    `# fzf color scheme`,
    `# Generated with theme-lab`,
    `# Add this to your shell rc file (.bashrc, .zshrc, etc.)`,
    ``,
    `export FZF_DEFAULT_OPTS="\\`,
    `  --color=fg:${theme.fg},bg:${theme.bg},hl:${theme.keyword} \\`,
    `  --color=fg+:${theme.fg},bg+:${theme.palette[0]},hl+:${theme.keyword} \\`,
    `  --color=info:${theme.comment},prompt:${theme.keyword},pointer:${theme.warning} \\`,
    `  --color=marker:${theme.warning},spinner:${theme.keyword},header:${theme.comment}"`,
  ]

  return lines.join('\n') + '\n'
}
