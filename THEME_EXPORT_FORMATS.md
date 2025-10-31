# Multi-Format Theme Export for vulpes-theme-lab

## Overview

This document outlines how to extend vulpes-theme-lab to export themes in all formats needed across the dotfiles ecosystem. Currently the tool generates **Ghostty config files**. We want to add export support for:

1. Neovim (Lua plugin)
2. Bat (config)
3. Yazi (theme.toml)
4. Lazygit (config.yml)
5. ZSH (syntax highlighting + FZF)
6. Tmux (via terminal colors)

## Architecture

```
Theme Builder (Vue UI)
    ↓
Color Generation (chroma-js)
    ├── Ghostty (already done)
    ├── Neovim ← ADD THIS
    ├── Bat ← ADD THIS
    ├── Yazi ← ADD THIS
    ├── Lazygit ← ADD THIS
    ├── ZSH ← ADD THIS
    └── Tmux (via terminal - inherits ghostty)
```

## Color Space & Mappings

The theme builder uses HSL with hue offset mathematics:
- Base Hue (user controlled)
- Saturation (user controlled)
- Lightness (user controlled)
- Monochrome mode available

### HSL to Hex Translation

For each export format, we need to convert HSL → Hex hex values.

**Recommended structure** (add to `composables/useTheme.ts`):

```typescript
interface ThemePalette {
  // Core colors (already defined)
  base: string        // #XXXXXX
  error: string       // ±7° hue offset
  warning: string
  success: string
  info: string

  // Extended palette
  fg: string         // foreground
  bg: string         // background
  bg_alt: string     // alternate background (for panels)
  comment: string
  string: string
  number: string
  boolean: string

  // UI colors (light/dark variant aware)
  selection: string
  cursor: string
  cursorline: string
}

// Generate from base HSL values
function generatePalette(baseHue, saturation, lightness, isDark): ThemePalette {
  // existing logic + new extended palette
}
```

---

## Format Specifications

### 1. Neovim (Lua Plugin)

**Output file**: `catppuccin-custom.lua` (goes in `~/.config/nvim/lua/colors/`)

**Structure**:
```lua
return {
  {
    "name/catppuccin-custom",  -- or create local file
    lazy = false,
    priority = 1000,
    config = function()
      require("catppuccin").setup({
        flavour = "custom",  -- or "mocha"/"latte"
        custom_highlights = function(colors)
          return {
            -- Map theme colors to nvim groups
            Normal = { fg = "<fg>", bg = "<bg>" },
            NormalFloat = { bg = "<bg_alt>" },
            Comment = { fg = "<comment>" },
            String = { fg = "<string>" },
            -- ... full group mapping
          }
        end,
      })
    end,
  },
}
```

**Color mappings needed**:
- 50+ Neovim highlight groups
- LSP diagnostic colors (error, warning, info, hint)
- UI elements (statusline, tabline, etc.)

**Implementation**: Create `utils/exporters/nvim.ts`

---

### 2. Bat (Syntax Highlighter)

**Output file**: `custom.tmTheme` (goes in `~/.config/bat/themes/`)

**Format**: XML plist (TextMate theme format)

**Structure**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC ...>
<plist version="1.0">
<dict>
  <key>name</key>
  <string>Custom Theme</string>

  <key>settings</key>
  <array>
    <dict>
      <key>scope</key>
      <string>comment</string>
      <key>settings</key>
      <dict>
        <key>foreground</key>
        <string><comment_color></string>
      </dict>
    </dict>
    <!-- ... more scopes -->
  </array>
</dict>
</plist>
```

**Required scopes**: comment, string, number, constant, variable, keyword, storage, entity, etc.

**Implementation**: Create `utils/exporters/bat.ts` + `utils/tmThemeBuilder.ts`

---

### 3. Yazi (File Manager)

**Output files**:
- `theme.toml` (dark version)
- `theme-light.toml` (light version)

**Format**: TOML

**Structure**:
```toml
# Dark theme
[colors]
black   = "<base_darkest>"
red     = "<error>"
green   = "<success>"
yellow  = "<warning>"
blue    = "<info>"
magenta = "<accent>"
cyan    = "<alt>"
white   = "<fg>"

[manager]
foreground = { fg = "<fg>" }
background = { bg = "<bg>" }
border     = { fg = "<info>" }

[status]
foreground = { fg = "<fg>" }
background = { bg = "<bg_alt>" }
```

**Implementation**: Create `utils/exporters/yazi.ts`

---

### 4. Lazygit (Git UI)

**Output file**: `config.yml` (goes in `~/.config/lazygit/`)

**Format**: YAML

**Structure**:
```yaml
gui:
  theme:
    # Colors are lazygit's internal names (black, red, green, etc.)
    selectedLineBgColor: ["<selection>"]
    selectedRangeBgColor: ["<bg_alt>"]
    inactiveBorderColor: ["<info>"]
    searchingActiveBorderColor: ["<success>"]

colors:
  selectedLineBg: ["<selection>"]
  selectedLineFile: ["<fg>"]
```

**Challenge**: Lazygit uses named color slots, not arbitrary hex values. Need to map our palette to lazygit's expected color names.

**Implementation**: Create `utils/exporters/lazygit.ts`

---

### 5. ZSH (Shell)

**Output file**: `.zshrc` snippet (user adds to ~/.zshrc)

**Two parts**:

#### A. Syntax Highlighting
```bash
ZSH_HIGHLIGHT_STYLES=(
  'alias:fg=<base>'
  'command:fg=<base>'
  'string:fg=<string>'
  'comment:fg=<comment>'
  'reserved-word:fg=<error>'
  # ... more styles
)
```

#### B. FZF Colors
```bash
export FZF_DEFAULT_OPTS=$'--color=fg:<fg>,bg:<bg>,hl:<info> \
  --color=fg+:<fg>,bg+:<bg_alt>,hl+:<info> \
  --color=info:<success>,prompt:<error>,pointer:<error>'
```

**Implementation**: Create `utils/exporters/zsh.ts`

---

### 6. Tmux (Terminal Multiplexer)

**Note**: Tmux inherits colors from terminal, so this is primarily **documentation** of how colors flow:

```
Ghostty theme → ANSI 256 color palette
    ↓
Tmux reads terminal colors automatically
    ↓
Content displayed with inherited colors
```

No additional export needed; Ghostty handles this.

---

## Implementation Roadmap

### Phase 1: Infrastructure (2-3 hours)
- [ ] Create `utils/exporters/` directory
- [ ] Create `utils/types.ts` with `ThemePalette` interface
- [ ] Extend `composables/useTheme.ts` to generate full palette
- [ ] Update `app.vue` to include export format selection UI

### Phase 2: Individual Exporters (1 hour each)
- [ ] Neovim exporter (`nvim.ts`)
- [ ] Bat exporter (`bat.ts`) + tmTheme builder
- [ ] Yazi exporter (`yazi.ts`)
- [ ] Lazygit exporter (`lazygit.ts`)
- [ ] ZSH exporter (`zsh.ts`)

### Phase 3: UI & Download (1-2 hours)
- [ ] Add checkbox UI to select which formats to export
- [ ] Create ZIP file downloader
- [ ] Generate installation instructions per format
- [ ] Add theme name input field

### Phase 4: Testing & Documentation (1-2 hours)
- [ ] Test exports with actual tools
- [ ] Create format-specific installation guides
- [ ] Document color mapping decisions
- [ ] Add troubleshooting section

---

## Key Challenges & Decisions

### Challenge 1: Tool-Specific Color Slots

**Problem**: Tools like Lazygit don't accept arbitrary hex colors in all places.

**Solution**: Create a "color slot mapping" that translates our palette to tool-specific names:
```typescript
const lazygitColorMap = {
  error: "red",
  warning: "yellow",
  success: "green",
  info: "blue",
  base: "white",
  comment: "gray",
}
```

### Challenge 2: Light vs Dark Generation

**Current approach**: User picks base hue, saturation, lightness

**For export**: Generate both light and dark variants:
```typescript
// Dark variant
const darkPalette = generatePalette(hue, sat, lightness, isDark=true)

// Light variant
const lightPalette = generatePalette(hue, sat, lightness, isDark=false)
```

This requires adjusting lightness values for light mode (typically L+30-40%).

### Challenge 3: LSP Diagnostic Colors (Neovim)

**Problem**: 4 diagnostic levels (error, warning, info, hint) need distinct colors

**Solution**: Use hue offset mathematics (already in theme builder):
```typescript
const error = chroma.hsl(baseHue + 7, 0.85, 0.55)
const warning = chroma.hsl(baseHue - 7, 0.85, 0.55)
const info = chroma.hsl(baseHue + 120, 0.85, 0.55)  // Complementary
const hint = chroma.hsl(baseHue - 120, 0.85, 0.55)
```

---

## File Structure (After Implementation)

```
vulpes-theme-lab/
├── composables/
│   └── useTheme.ts                    (updated with full palette)
├── utils/
│   ├── types.ts                       (new - ThemePalette interface)
│   ├── colorHelpers.ts                (new - hex/hsl conversion)
│   └── exporters/                     (new directory)
│       ├── index.ts                   (export all formats)
│       ├── ghostty.ts                 (move existing logic here)
│       ├── nvim.ts
│       ├── bat.ts
│       ├── yazi.ts
│       ├── lazygit.ts
│       ├── zsh.ts
│       └── tmThemeBuilder.ts          (XML plist builder)
├── components/
│   ├── ExportDialog.vue               (new - format selection)
│   └── ...
└── pages/
    └── index.vue                      (updated with export UI)
```

---

## Color Space Reference

### HSL to 8-bit RGB Conversion

```typescript
function hslToHex(h: number, s: number, l: number): string {
  // h: 0-360, s: 0-100, l: 0-100
  // Returns: "#RRGGBB"

  const c = (1 - Math.abs(2 * l / 100 - 1)) * (s / 100);
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l / 100 - c / 2;

  let r = 0, g = 0, b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  // ... etc

  return `#${Math.round((r + m) * 255).toString(16).padStart(2, '0')}...`
}
```

Already handled by chroma-js, but documented here for reference.

---

## Testing Checklist

After implementation:

- [ ] Export Neovim theme → install → verify syntax highlighting
- [ ] Export Bat theme → test with `bat somefile.py`
- [ ] Export Yazi theme → test file browser colors
- [ ] Export Lazygit theme → test git UI colors
- [ ] Export ZSH theme → test shell syntax highlighting + FZF
- [ ] Generate light variant → verify readable contrast
- [ ] ZIP download → unzip → all files present
- [ ] Theme switching → `theme-dark` and `theme-light` work across all tools

---

## Future Enhancements

1. **Preset themes**: Save "Dracula", "Gruvbox", etc. as presets
2. **Color harmony**: Auto-suggest complementary colors
3. **Accessibility**: WCAG contrast checking for readability
4. **Live Neovim preview**: Embed Neovim preview (requires server-side setup)
5. **Share themes**: Generate shareable URLs with theme parameters
6. **Import existing**: Parse Catppuccin/Dracula → editable in tool
7. **Tmux support**: Generate tmux.conf color definitions

---

## Notes for Future Implementation

- Use `chroma-js` (already in dependencies) for color math
- Keep export logic pure functions (testable, reusable)
- Document color mapping decisions (why blue → info, etc.)
- Consider performance if generating 1000+ highlight groups
- Test with actual dotfiles directory structure
- Validate generated TOML/YAML/Lua syntax before download

---

**Status**: Ready for implementation
**Estimated Total Time**: 8-12 hours (all phases)
**Priority**: HIGH (solves dotfiles theme management problem)
**Difficulty**: MEDIUM (color math + format knowledge, but straightforward)
