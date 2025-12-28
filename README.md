# vulpes-theme-lab

🎨 **[Live Demo](https://ejfox.github.io/vulpes-theme-lab/)** — Try it now in your browser

<img width="898" height="1131" alt="screenshot 2025-12-28 at 5 48 34 PM" src="https://github.com/user-attachments/assets/3843023e-d9b1-41cb-9b23-38ce9e1e8575" />


a minimal theme builder for ghostty terminal with live previews of nvim, lazygit, htop, and tmux.

## design principles

tuftian minimalism. hue offset precision ±7° for maximum signal, minimal variation. monochrome mode available for absolute clarity.

## features

live color controls with real-time preview across multiple terminal scenarios:

- nvim with lsp diagnostics and telescope fuzzy finder
- lazygit interface with branch info and stash panel
- htop system monitor with process details
- tmux multi-pane layouts with realistic content
- codemirror-based code editor

export both dark and light theme variants for:

- ghostty terminal
- neovim (100+ highlight groups, LSP support)
- bat syntax highlighter
- yazi file manager
- lazygit git ui
- zsh (syntax highlighting + fzf colors + powerlevel10k colors)

**[🚀 Quick Start Guide](./QUICKSTART.md)** — 5-minute setup
**[📘 Complete Installation Guide](./INSTALLATION.md)** — Full setup instructions for all tools

## usage

```bash
npm install
npm run dev
```

navigate to http://localhost:3322

adjust hue, saturation, contrast, and lightness controls. toggle monochrome mode for single-hue themes. export generates both dark and light variants.

## theme generation

themes use precise hue offset mathematics:

```javascript
const error = chroma.hsl(baseHue + 7, 0.85, 0.55)
const warning = chroma.hsl(baseHue - 7, 0.85, 0.55)
const base = chroma.hsl(baseHue, 0.85, 0.5)
```

minimal variation. maximum signal.

## installation

exported themes work across your entire terminal ecosystem:

**auto-switching** (with system appearance):

- ghostty: `theme = light:yourtheme-light,dark:yourtheme-dark`
- neovim: via auto-dark-mode.nvim plugin
- bat: `--theme=auto:system`

**manual switching** (unified theme switcher):

- yazi file manager
- lazygit git ui
- zsh syntax highlighting

see **[INSTALLATION.md](./INSTALLATION.md)** for complete setup guide including:

- file installation locations
- configuration examples
- unified theme switcher functions
- auto-sync with macos appearance
- troubleshooting guide

## sample exports

example theme outputs for all supported TUI targets:

- **[nvim-example.lua](./samples/nvim-example.lua)** — Neovim colorscheme with 50+ highlight groups (LSP, syntax, UI)
- **[bat-example.tmTheme](./samples/bat-example.tmTheme)** — Bat syntax highlighter (TextMate theme format)
- **[yazi-example.toml](./samples/yazi-example.toml)** — Yazi file manager colors (light + dark variants)
- **[lazygit-example.yml](./samples/lazygit-example.yml)** — Lazygit Git UI color configuration
- **[zsh-example.sh](./samples/zsh-example.sh)** — ZSH syntax highlighting + FZF colors with theme switching functions

these samples show the exact structure and color mappings for each tool format.

## multi-format export

**status: ✓ implemented**

all formats now export in a single download:

- ghostty (dark + light .ghostty files)
- neovim (dark + light .lua colorschemes)
- bat (dark + light .tmTheme files)
- yazi (dark + light .toml themes)
- lazygit (dark + light .yml configs)
- zsh (dark + light .zsh with syntax highlighting, fzf, and p10k colors)
- tweak.cc json reference files

see **[THEME_EXPORT_FORMATS.md](./THEME_EXPORT_FORMATS.md)** for implementation details.

## stack

- nuxt 4
- vue 3
- codemirror 6
- chroma-js
- vueuse

built for terminal aesthetes who value precision over decoration.
