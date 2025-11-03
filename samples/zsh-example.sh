#!/bin/bash
# Example ZSH theme export from vulpes-theme-lab
# This demonstrates the correct format for ZSH syntax highlighting, FZF, and Powerlevel10k
# Updated to use 256-color palette for ZSH (not hex), hex for FZF

# ZSH Syntax Highlighting Colors
# NOTE: ZSH uses 256-color palette (0-255), NOT hex colors!
# Run this to see all colors: for i in {0..255}; do print -Pn "%K{$i} %k%F{$i}${(l:3::0:)i}%f " ${${(M)$((i%6)):#3}:+$'\n'}; done
typeset -A ZSH_HIGHLIGHT_STYLES

# Commands and keywords (using 256-color codes)
ZSH_HIGHLIGHT_STYLES[default]='fg=253'
ZSH_HIGHLIGHT_STYLES[unknown-token]='fg=203,bold'
ZSH_HIGHLIGHT_STYLES[reserved-word]='fg=212,bold'
ZSH_HIGHLIGHT_STYLES[alias]='fg=117'
ZSH_HIGHLIGHT_STYLES[builtin]='fg=81'
ZSH_HIGHLIGHT_STYLES[function]='fg=117'
ZSH_HIGHLIGHT_STYLES[command]='fg=81'
ZSH_HIGHLIGHT_STYLES[precommand]='fg=212'

# Strings and paths
ZSH_HIGHLIGHT_STYLES[path]='fg=228'
ZSH_HIGHLIGHT_STYLES[path_pathseparator]='fg=212'
ZSH_HIGHLIGHT_STYLES[single-quoted-argument]='fg=228'
ZSH_HIGHLIGHT_STYLES[double-quoted-argument]='fg=228'
ZSH_HIGHLIGHT_STYLES[dollar-quoted-argument]='fg=228'

# Variables and operators
ZSH_HIGHLIGHT_STYLES[assign]='fg=253'
ZSH_HIGHLIGHT_STYLES[dollar-double-quoted-argument]='fg=253'
ZSH_HIGHLIGHT_STYLES[commandseparator]='fg=212'
ZSH_HIGHLIGHT_STYLES[redirection]='fg=212'

# Comments
ZSH_HIGHLIGHT_STYLES[comment]='fg=241'

# FZF Colors
# NOTE: FZF DOES support hex colors (#RRGGBB format)
export FZF_DEFAULT_OPTS="\\
--color=fg:#f8f8f2,bg:#282a36,hl:#8be9fd \\
--color=fg+:#f8f8f2,bg+:#44475a,hl+:#8be9fd \\
--color=info:#bd93f9,prompt:#ff79c6,pointer:#ff79c6 \\
--color=marker:#50fa7b,spinner:#ffb86c,header:#6272a4 \\
--color=border:#44475a,label:#f8f8f2,query:#f8f8f2"

# Powerlevel10k Colors
# NOTE: Uses POWERLEVEL9K_ prefix (not 10K!) and 256-color palette
# Foreground colors are automatically calculated for contrast by chroma-js
typeset -g POWERLEVEL9K_DIR_BACKGROUND=81
typeset -g POWERLEVEL9K_DIR_FOREGROUND=16

typeset -g POWERLEVEL9K_VCS_CLEAN_BACKGROUND=84
typeset -g POWERLEVEL9K_VCS_CLEAN_FOREGROUND=16

typeset -g POWERLEVEL9K_VCS_MODIFIED_BACKGROUND=214
typeset -g POWERLEVEL9K_VCS_MODIFIED_FOREGROUND=16

typeset -g POWERLEVEL9K_VCS_UNTRACKED_BACKGROUND=141
typeset -g POWERLEVEL9K_VCS_UNTRACKED_FOREGROUND=16

typeset -g POWERLEVEL9K_STATUS_OK_BACKGROUND=84
typeset -g POWERLEVEL9K_STATUS_OK_FOREGROUND=16

typeset -g POWERLEVEL9K_STATUS_ERROR_BACKGROUND=203
typeset -g POWERLEVEL9K_STATUS_ERROR_FOREGROUND=231

# Usage:
# 1. Add to your ~/.zshrc
# 2. Make sure you have zsh-syntax-highlighting installed
# 3. Make sure you have fzf installed
# 4. For p10k, add BEFORE loading p10k in ~/.zshrc

echo "✓ ZSH theme configured (256-color palette)"
echo "  - ZSH syntax highlighting: 256-color codes"
echo "  - FZF: hex colors (#RRGGBB)"
echo "  - Powerlevel10k: 256-color codes with auto-contrast"
