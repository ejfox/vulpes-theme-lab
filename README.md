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

## install a vulpes theme

Two ways to get every Vulpes monthly preset (12 presets × dark/light × 14
apps) onto your machine, both built from the exact same exporter code:

**from the browser:** open `/downloads` in the app (linked from the sidebar)
and download a per-preset zip, a single app file, or everything in one zip.
Generated client-side.

**from the CLI:**

```bash
npm run export:all          # writes dist-themes/<preset-id>/<mode>/<app>/...
cd dist-themes
./install.sh vulpes-reddishnovember --all      # install everything for one preset
./install.sh vulpes-reddishnovember ghostty    # install just one app
./install.sh vulpes-reddishnovember --dry-run --all   # preview, change nothing
```

Each preset's `install.sh` is non-destructive: it only writes into each
tool's own theme/include directory (never your shell rc, ghostty config,
lazygit `config.yml`, yazi `theme.toml`, alacritty.toml, or tmux.conf), backs
up anything it would overwrite to `<file>.bak-<timestamp>`, never deletes,
and running it twice changes nothing the second time. It prints the one line
you add to your own config yourself. tweakcc, iTerm2, and Obsidian have no
safe system-wide install path, so those are print-only instructions.

See `dist-themes/<preset-id>/<app>/README.md` (after running `export:all`)
for per-app install steps.

## stack

- nuxt 4
- vue 3
- codemirror 6
- chroma-js
- vueuse

built for terminal aesthetes who value precision over decoration.
