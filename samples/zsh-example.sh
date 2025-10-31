#!/bin/bash
# Example ZSH theme export from vulpes-theme-lab
# Add these functions to your ~/.zshrc
#
# This demonstrates the ZSH syntax highlighting and FZF color configuration
# exported from vulpes-theme-lab.

# Dark theme function (Dracula-inspired)
theme-dark() {
  # ZSH Syntax Highlighting Colors (dark mode)
  # Format: 'scope:fg=#HEX_COLOR' or 'scope:fg=COLOR_NAME,bold'
  ZSH_HIGHLIGHT_STYLES=(
    # Commands and keywords
    'alias:fg=#50fa7b'
    'builtin:fg=#8be9fd'
    'command:fg=#50fa7b'
    'function:fg=#50fa7b'
    'hashed-command:fg=#50fa7b'
    'reserved-word:fg=#ff79c6,bold'
    'suffix-alias:fg=#50fa7b'

    # Strings and quoting
    'string:fg=#f1fa8c'
    'double-quoted-argument:fg=#f1fa8c'
    'single-quoted-argument:fg=#f1fa8c'
    'dollar-quoted-argument:fg=#f1fa8c'

    # Variables and parameters
    'dollar-double-quoted-argument:fg=#f1fa8c'
    'parameter:fg=#f8f8f2'
    'unknown-token:fg=#ff5555,bold'

    # Paths and globbing
    'path:fg=#f8f8f2'
    'path-separator:fg=#6272a4'
    'globbing:fg=#f1fa8c'
    'history-expansion:fg=#f1fa8c'

    # Comments and special
    'comment:fg=#6272a4,italic'
    'comment-delimiter:fg=#6272a4'
    'default:fg=#f8f8f2'
    'unmatched-bracket:fg=#ff5555,bold'

    # Options and redirection
    'option-flag:fg=#bd93f9'
    'option-letter:fg=#bd93f9'
    'redirection:fg=#ff79c6'
    'exec-descriptor:fg=#f1fa8c'
  )

  # FZF Configuration (dark mode)
  # Format: --color=element:hex_or_name,...
  export FZF_DEFAULT_OPTS=$'--color=fg:#f8f8f2,bg:#282a36,hl:#8be9fd \
    --color=fg+:#f8f8f2,bg+:#44475a,hl+:#8be9fd \
    --color=info:#f1fa8c,prompt:#ff79c6,pointer:#ff79c6 \
    --color=marker:#ff79c6,spinner:#f1fa8c,header:#6272a4 \
    --color=border:#6272a4,preview-bg:#282a36 \
    --border-label-pos=2 \
    --scrollbar="▐"'

  echo "🌙 Switched to dark mode (Dracula-inspired)"
}

# Light theme function
theme-light() {
  # ZSH Syntax Highlighting Colors (light mode)
  # Lighter/brighter colors for better contrast on light backgrounds
  ZSH_HIGHLIGHT_STYLES=(
    # Commands and keywords
    'alias:fg=#0064c6'
    'builtin:fg=#00649f'
    'command:fg=#0064c6'
    'function:fg=#0064c6'
    'hashed-command:fg=#0064c6'
    'reserved-word:fg=#9e0d65,bold'
    'suffix-alias:fg=#0064c6'

    # Strings and quoting
    'string:fg=#a68700'
    'double-quoted-argument:fg=#a68700'
    'single-quoted-argument:fg=#a68700'
    'dollar-quoted-argument:fg=#a68700'

    # Variables and parameters
    'dollar-double-quoted-argument:fg=#a68700'
    'parameter:fg=#4c5668'
    'unknown-token:fg=#d20f39,bold'

    # Paths and globbing
    'path:fg=#4c5668'
    'path-separator:fg=#acb0be'
    'globbing:fg=#a68700'
    'history-expansion:fg=#a68700'

    # Comments and special
    'comment:fg:#7287a8,italic'
    'comment-delimiter:fg:#7287a8'
    'default:fg=#4c5668'
    'unmatched-bracket:fg=#d20f39,bold'

    # Options and redirection
    'option-flag:fg:#6b68b6'
    'option-letter:fg:#6b68b6'
    'redirection:fg:#9e0d65'
    'exec-descriptor:fg:#a68700'
  )

  # FZF Configuration (light mode)
  export FZF_DEFAULT_OPTS=$'--color=fg:#4c5668,bg:#eff1f5,hl:#0064c6 \
    --color=fg+:#4c5668,bg+:#e6e9ef,hl+:#0064c6 \
    --color=info:#a68700,prompt:#9e0d65,pointer:#9e0d65 \
    --color=marker:#9e0d65,spinner:#a68700,header:#acb0be \
    --color=border:#acb0be,preview-bg:#eff1f5 \
    --border-label-pos=2 \
    --scrollbar="▐"'

  echo "☀️ Switched to light mode"
}

# Initialize with dark mode by default
theme-dark

# Optional: Source this file from your ~/.zshrc
# Add this line to ~/.zshrc:
#   [ -f ~/path/to/this/theme-export.sh ] && source ~/path/to/this/theme-export.sh
#
# Or add the functions directly to ~/.zshrc without a separate file.
