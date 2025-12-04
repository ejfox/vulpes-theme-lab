# CLAUDE.md - vulpes-theme-lab

## Project Overview

Nuxt-based theme generator that exports color themes to multiple dotfiles formats (Ghostty, Neovim, Bat, Yazi, Lazygit, ZSH).

## TODOs

### Lazygit Exporter - Complete Theme Properties

The lazygit exporter needs to export ALL theme properties to avoid default blue colors bleeding through.

**Required `gui.theme` properties:**

- [ ] `activeBorderColor` - focused panel border (use primary accent + bold)
- [ ] `inactiveBorderColor` - unfocused panel border (use fg or muted)
- [ ] `searchingActiveBorderColor` - border during search (use warning/alert + bold)
- [ ] `optionsTextColor` - bottom menu options (use accent)
- [ ] `selectedLineBgColor` - selected line background (use bg_alt)
- [ ] `selectedRangeBgColor` - multi-select background (use bg_alt)
- [ ] `cherryPickedCommitBgColor` - cherry-pick highlight bg (use accent)
- [ ] `cherryPickedCommitFgColor` - cherry-pick highlight fg (use bg for contrast)
- [ ] `unstagedChangesColor` - unstaged file indicator (use error/red)
- [ ] `defaultFgColor` - default text color (use fg)
- [ ] `markedBaseCommitFgColor` - rebase base commit fg (use fg)
- [ ] `markedBaseCommitBgColor` - rebase base commit bg (use accent)
- [ ] `inactiveViewSelectedLineBgColor` - selected line in unfocused view (use bg_alt slightly lighter/darker)

**Required `gui` color mappings:**

- [ ] `authorColors."*"` - default author color (use primary accent)
- [ ] `branchColors.main` - main branch color
- [ ] `branchColors.master` - master branch color
- [ ] `branchColors.develop` - develop branch color (use secondary accent)
- [ ] `branchColors."feature/*"` - feature branch pattern (use info color)
- [ ] `branchColors."fix/*"` - fix branch pattern (use error color)

### Color Mapping Strategy

Map vulpes palette to lazygit properties:

```
activeBorderColor      <- primary accent (e.g., base hue at high saturation)
inactiveBorderColor    <- fg or white/black depending on light/dark
searchingActiveBorderColor <- warning or shifted hue
optionsTextColor       <- secondary accent
selectedLineBgColor    <- bg_alt (slightly off from main bg)
selectedRangeBgColor   <- bg_alt
cherryPickedCommitBgColor <- accent
cherryPickedCommitFgColor <- bg (for contrast)
unstagedChangesColor   <- error red
defaultFgColor         <- fg
markedBaseCommitFgColor <- fg
markedBaseCommitBgColor <- accent
inactiveViewSelectedLineBgColor <- bg_alt (between bg and selectedLineBgColor)
```

### Implementation Notes

- Colors are arrays: `['#hex']` or `['#hex', 'bold']`
- Generate BOTH light and dark variants
- Test with `lazygit -d` to confirm config is loading
- YAML indentation must be exactly 2 spaces

### Reference

See working config at `~/.config/lazygit/config.yml` for complete example.
