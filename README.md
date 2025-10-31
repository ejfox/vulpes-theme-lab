# vulpes-theme-lab

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

export both dark and light theme variants as ghostty config files.

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
const base = chroma.hsl(baseHue, 0.85, 0.50)
```

minimal variation. maximum signal.

## ghostty integration

exported themes install to `~/.config/ghostty/themes/`

```
theme = theme-lab-dark
```

## sample exports

example theme outputs for all supported TUI targets:

- **[nvim-example.lua](./samples/nvim-example.lua)** — Neovim colorscheme with 50+ highlight groups (LSP, syntax, UI)
- **[bat-example.tmTheme](./samples/bat-example.tmTheme)** — Bat syntax highlighter (TextMate theme format)
- **[yazi-example.toml](./samples/yazi-example.toml)** — Yazi file manager colors (light + dark variants)
- **[lazygit-example.yml](./samples/lazygit-example.yml)** — Lazygit Git UI color configuration
- **[zsh-example.sh](./samples/zsh-example.sh)** — ZSH syntax highlighting + FZF colors with theme switching functions

these samples show the exact structure and color mappings for each tool format.

## planned: multi-format export

next phase: generate all TUI target formats in a single export.

see **[THEME_EXPORT_FORMATS.md](./THEME_EXPORT_FORMATS.md)** for:
- comprehensive specification for adding multi-format export
- color mapping specifications for each tool
- implementation roadmap (8-12 hours, medium difficulty)
- challenge solutions and design decisions

current status: planning phase. ready for implementation.

## stack

- nuxt 4
- vue 3
- codemirror 6
- chroma-js
- vueuse

built for terminal aesthetes who value precision over decoration.
