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

## stack

- nuxt 4
- vue 3
- codemirror 6
- chroma-js
- vueuse

built for terminal aesthetes who value precision over decoration.
