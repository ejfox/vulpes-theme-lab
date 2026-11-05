/**
 * Generates install.sh scripts and per-app READMEs for exported theme bundles.
 *
 * This is pure string-template code (no Node-only APIs) so it can run both
 * in scripts/export-all.ts (Node, via vite-node) and in the browser
 * "download all" page, producing byte-identical output either way.
 *
 * Install philosophy, matching each tool's own idiomatic mechanism:
 *   - Never edit the user's main config file (ghostty config, .zshrc,
 *     lazygit config.yml, yazi theme.toml, alacritty.toml, tmux.conf, ...).
 *   - Only write into that tool's own include/theme directory.
 *   - Print the ONE line the user adds themselves to opt in.
 *   - Back up anything about to be replaced, never delete, be idempotent.
 */

export const APP_IDS = [
  'ghostty',
  'wezterm',
  'alacritty',
  'tmux',
  'iterm',
  'nvim',
  'bat',
  'lazygit',
  'yazi',
  'zsh',
  'neomutt',
  'tweakcc',
  'tailwind',
  'obsidian',
] as const

export type AppId = (typeof APP_IDS)[number]

/** The filename a given exporter writes for `${presetId}-${mode}`, mirroring
 * each exporter's own `filename:` template in utils/exporters/*.ts (and the
 * two "legacy" iterm/tmux serializers). Do not change these without checking
 * the exporter source -- this is a read-only mirror, not a new mapping. */
export function filenameFor(app: AppId, presetId: string, mode: 'dark' | 'light'): string {
  const themeName = `${presetId}-${mode}`
  switch (app) {
    case 'ghostty':
      return `${themeName}.ghostty`
    case 'wezterm':
      return `${themeName}.lua`
    case 'alacritty':
      return `${themeName}-alacritty.toml`
    case 'tmux':
      return `${themeName}.tmux.conf`
    case 'iterm':
      return `${themeName}.itermcolors`
    case 'nvim':
      return `${themeName}.lua`
    case 'bat':
      return `${themeName}.tmTheme`
    case 'lazygit':
      // exportLazygit always names its output 'lazygit-config.yml' regardless
      // of themeName -- it lives in a mode-specific directory, so no clash.
      return 'lazygit-config.yml'
    case 'yazi':
      // exportYazi always names its output 'theme.toml' -- same situation.
      return 'theme.toml'
    case 'zsh':
      return `${themeName}.zsh`
    case 'neomutt':
      return `${themeName}-neomutt.muttrc`
    case 'tweakcc':
      return `${themeName}-tweakcc.json`
    case 'tailwind':
      return `${themeName}.tailwind.css`
    case 'obsidian':
      return `${themeName}.css`
  }
}

/** One-sentence description of what each app export is, for the UI + README. */
export const APP_LABELS: Record<AppId, string> = {
  ghostty: 'Ghostty terminal theme',
  wezterm: 'WezTerm terminal color scheme',
  alacritty: 'Alacritty terminal color scheme',
  tmux: 'Tmux status/pane theme',
  iterm: 'iTerm2 color preset',
  nvim: 'Neovim colorscheme (colors/ plugin)',
  bat: 'Bat (TextMate) syntax theme',
  lazygit: 'Lazygit gui.theme overlay',
  yazi: 'Yazi file manager flavor',
  zsh: 'ZSH syntax highlighting + FZF colors',
  neomutt: 'Neomutt color theme',
  tweakcc: 'Claude Code (tweakcc) theme JSON',
  tailwind: 'Tailwind CSS custom properties',
  obsidian: 'Obsidian CSS snippet',
}

/** 1-3 step install README body for one app, both modes already generated. */
export function renderAppReadme(app: AppId, presetId: string): string {
  const dark = filenameFor(app, presetId, 'dark')
  const light = filenameFor(app, presetId, 'light')
  const header = `# ${APP_LABELS[app]}\n\npreset: ${presetId}\n\n`

  switch (app) {
    case 'ghostty':
      return (
        header +
        `1. Copy \`dark/${dark}\` and \`light/${light}\` into ` +
        '`~/.config/ghostty/themes/` (dropping the extension, e.g. `' +
        `${presetId}-dark` +
        '` and `' +
        `${presetId}-light` +
        '`).\n' +
        '2. Add this line to your ghostty config:\n   ```\n   theme = light:' +
        `${presetId}-light,dark:${presetId}-dark` +
        '\n   ```\n' +
        '3. Reload ghostty config (Cmd+Shift+,) or restart.\n' +
        '\n(`./install.sh ghostty` does step 1 for you and prints step 2.)\n'
      )
    case 'wezterm':
      return (
        header +
        `1. Copy \`dark/${dark}\` and \`light/${light}\` into \`~/.config/wezterm/colors/\`.\n` +
        `2. In wezterm.lua: \`config.color_scheme = '${presetId}-dark'\` (or \`-light\`), or use ` +
        "`wezterm.gui.get_appearance()` to pick automatically.\n"
      )
    case 'alacritty':
      return (
        header +
        `1. Copy \`dark/${dark}\` and \`light/${light}\` into \`~/.config/alacritty/themes/\`.\n` +
        '2. In alacritty.toml (0.13+):\n   ```\n   [general]\n   import = ["~/.config/alacritty/themes/' +
        dark +
        '"]\n   ```\n'
      )
    case 'tmux':
      return (
        header +
        `1. Copy \`dark/${dark}\` and \`light/${light}\` into \`~/.config/tmux/themes/\` (or \`~/.tmux/themes/\`).\n` +
        `2. Add to tmux.conf: \`source-file ~/.config/tmux/themes/${dark}\`\n` +
        '3. `tmux source-file ~/.tmux.conf` to reload.\n'
      )
    case 'iterm':
      return (
        header +
        `1. Copy \`dark/${dark}\` and \`light/${light}\` wherever you like (they are NOT auto-installed).\n` +
        '2. iTerm2 > Preferences > Profiles > Colors > Color Presets... > Import...\n' +
        '3. Select the imported preset from the same menu.\n'
      )
    case 'nvim':
      return (
        header +
        `1. Copy \`dark/${dark}\` and \`light/${light}\` into \`~/.config/nvim/colors/\`.\n` +
        `2. \`:colorscheme ${presetId}-dark\` (or \`-light\`), or set it in init.lua.\n`
      )
    case 'bat':
      return (
        header +
        `1. Copy \`dark/${dark}\` and \`light/${light}\` into \`~/.config/bat/themes/\`.\n` +
        '2. `bat cache --build`\n' +
        `3. \`bat --theme=${presetId}-dark somefile\` (or add \`--theme\` to \`BAT_THEME\`/your bat config).\n`
      )
    case 'lazygit':
      return (
        header +
        `1. Copy \`dark/${dark}\` to e.g. \`~/.config/lazygit/${presetId}-theme.yml\` (lazygit only applies one theme at a time -- pick dark or light).\n` +
        '2. Point lazygit at both files (comma-separated): `export LG_CONFIG_FILE="$XDG_CONFIG_HOME/lazygit/config.yml,' +
        `$XDG_CONFIG_HOME/lazygit/${presetId}-theme.yml` +
        '"` (macOS without `~/.config/lazygit`: use `~/Library/Application Support/lazygit/config.yml` instead).\n' +
        '3. Put the `export LG_CONFIG_FILE=...` line in your shell rc yourself -- the installer never edits it for you.\n'
      )
    case 'yazi':
      return (
        header +
        `1. Copy \`dark/${dark}\` to \`~/.config/yazi/flavors/${presetId}-dark.yazi/flavor.toml\` and ` +
        `\`light/${light}\` to \`~/.config/yazi/flavors/${presetId}-light.yazi/flavor.toml\`.\n` +
        '2. Add to `~/.config/yazi/theme.toml`:\n   ```\n   [flavor]\n   dark = "' +
        `${presetId}-dark` +
        '"\n   light = "' +
        `${presetId}-light` +
        '"\n   ```\n'
      )
    case 'zsh':
      return (
        header +
        `1. Copy \`dark/${dark}\` into \`~/.config/zsh/themes/\`.\n` +
        `2. Add \`source ~/.config/zsh/themes/${dark}\` to your .zshrc yourself.\n` +
        '3. `exec zsh` to reload.\n'
      )
    case 'neomutt':
      return (
        header +
        `1. Copy \`dark/${dark}\` and \`light/${light}\` into \`~/.config/neomutt/themes/\`.\n` +
        `2. Add \`source ~/.config/neomutt/themes/${dark}\` to your neomuttrc.\n`
      )
    case 'tweakcc':
      return (
        header +
        '1. `npm install -g tweakcc` then `npx tweakcc`.\n' +
        `2. Themes -> Import theme -> paste the contents of \`dark/${dark}\` (or \`light/${light}\`).\n` +
        '3. Apply customizations to cli.js, then `/theme` inside `claude` to select it.\n' +
        '(Full instructions are generated per-theme by utils/exporters/tweakcc.ts\'s own ' +
        '`generateTweakccInstructions` -- see INSTRUCTIONS.md next to this README if present.)\n'
      )
    case 'tailwind':
      return (
        header +
        `1. Copy \`dark/${dark}\` (or \`light/${light}\`) into your web project, e.g. \`src/styles/${presetId}.css\`.\n` +
        '2. `@import` it, or copy the CSS custom properties block into your existing stylesheet.\n' +
        '(This is a project-local asset, not a system config -- the installer only copies it next to where you run it.)\n'
      )
    case 'obsidian':
      return (
        header +
        `1. Copy \`dark/${dark}\` (or \`light/${light}\`) into \`<your vault>/.obsidian/snippets/\`.\n` +
        '2. Settings > Appearance > CSS snippets > enable it.\n' +
        '(Installed as a snippet, not a full theme, so it needs no manifest.json.)\n'
      )
  }
}

/**
 * Renders the per-preset install.sh. Pure string template -- the browser
 * download-all page ships this exact same script inside each preset's zip.
 */
export function renderInstallScript(presetId: string): string {
  const apps = APP_IDS.join(' ')
  return `#!/usr/bin/env bash
# vulpes-theme-lab installer for preset: ${presetId}
# Generated by scripts/export-all.ts (or the in-app "Download all" page) --
# do not hand-edit, regenerate it instead.
#
# Usage:
#   ./install.sh                  list apps, change nothing
#   ./install.sh <app> [app...]   install the named app(s)
#   ./install.sh --all            install every app
#   ./install.sh --dry-run ...    print what would happen, change nothing
#
# Non-destructive by design:
#   - honors \$XDG_CONFIG_HOME (falls back to ~/.config)
#   - backs up any file it would overwrite to <file>.bak-<timestamp>
#   - never deletes anything
#   - never edits your shell rc, ghostty config, lazygit config.yml,
#     yazi theme.toml, alacritty.toml, tmux.conf, or any other "main"
#     config -- it only writes into each tool's own theme/include dir and
#     prints the one line you add yourself
#   - running it twice with the same input changes nothing the second time
set -euo pipefail

# An empty HOME would turn every destination into a path under /.
if [ -z "\${HOME:-}" ] || [ ! -d "$HOME" ]; then
  printf 'install.sh: HOME is unset or not a directory; refusing to install\\n' >&2
  exit 1
fi

HERE="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PRESET_ID="${presetId}"
CONFIG_HOME="\${XDG_CONFIG_HOME:-$HOME/.config}"
DRY_RUN=0
WROTE_ANY=0
APPS=()

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --all) APPS=(${apps}) ;;
    *) APPS+=("$arg") ;;
  esac
done

say() { printf '%s\\n' "$*"; }

# install_file SRC DEST -- backs up DEST if present and different, then
# copies SRC over it. No-ops (prints "unchanged") if content is identical.
install_file() {
  local src="$1" dest="$2"
  if [ ! -f "$src" ]; then
    say "  ! missing $src (skipping)"
    return 0
  fi
  # A symlink or directory here could be the user's real config (cp follows
  # links and copies into dirs), so leave it alone.
  if [ -L "$dest" ] || [ -d "$dest" ]; then
    say "  ! $dest is a symlink or directory; skipping (move it aside to install)"
    return 0
  fi
  if [ -f "$dest" ] && cmp -s "$src" "$dest"; then
    say "  = unchanged: $dest"
    return 0
  fi
  if [ "$DRY_RUN" = "1" ]; then
    say "  [dry-run] would write $dest"
    return 0
  fi
  mkdir -p "$(dirname "$dest")"
  if [ -f "$dest" ]; then
    local bak="$dest.bak-$(date +%Y%m%d%H%M%S)"
    local n=1
    while [ -e "$bak" ]; do
      bak="$dest.bak-$(date +%Y%m%d%H%M%S)-$n"
      n=$((n + 1))
    done
    cp "$dest" "$bak"
    say "  backed up $dest -> $bak"
  fi
  cp "$src" "$dest"
  say "  wrote $dest"
  WROTE_ANY=1
}

lazygit_config_dir() {
  # lazygit's default is ~/Library/Application Support on macOS only;
  # everywhere else (and on a Mac that already uses it) it's the XDG dir.
  if [ -d "$CONFIG_HOME/lazygit" ] || [ "$(uname -s)" != "Darwin" ]; then
    printf '%s' "$CONFIG_HOME/lazygit"
  else
    printf '%s' "$HOME/Library/Application Support/lazygit"
  fi
}

if [ \${#APPS[@]} -eq 0 ]; then
  say "vulpes-theme-lab installer -- preset: $PRESET_ID"
  say ""
  say "Usage: ./install.sh <app...> | --all | --dry-run"
  say "Apps: ${apps}"
  exit 0
fi

for app in "\${APPS[@]}"; do
  say ""
  say "== $app =="
  case "$app" in
    ghostty)
      install_file "$HERE/dark/ghostty/${presetId}-dark.ghostty" "$CONFIG_HOME/ghostty/themes/${presetId}-dark"
      install_file "$HERE/light/ghostty/${presetId}-light.ghostty" "$CONFIG_HOME/ghostty/themes/${presetId}-light"
      say "  Add to your ghostty config: theme = light:${presetId}-light,dark:${presetId}-dark"
      ;;
    wezterm)
      install_file "$HERE/dark/wezterm/${presetId}-dark.lua" "$CONFIG_HOME/wezterm/colors/${presetId}-dark.lua"
      install_file "$HERE/light/wezterm/${presetId}-light.lua" "$CONFIG_HOME/wezterm/colors/${presetId}-light.lua"
      say "  In wezterm.lua: config.color_scheme = '${presetId}-dark' (or '-light')"
      ;;
    alacritty)
      install_file "$HERE/dark/alacritty/${presetId}-dark-alacritty.toml" "$CONFIG_HOME/alacritty/themes/${presetId}-dark-alacritty.toml"
      install_file "$HERE/light/alacritty/${presetId}-light-alacritty.toml" "$CONFIG_HOME/alacritty/themes/${presetId}-light-alacritty.toml"
      say "  In alacritty.toml: [general] import = [\\"$CONFIG_HOME/alacritty/themes/${presetId}-dark-alacritty.toml\\"]"
      ;;
    tmux)
      install_file "$HERE/dark/tmux/${presetId}-dark.tmux.conf" "$CONFIG_HOME/tmux/themes/${presetId}-dark.tmux.conf"
      install_file "$HERE/light/tmux/${presetId}-light.tmux.conf" "$CONFIG_HOME/tmux/themes/${presetId}-light.tmux.conf"
      say "  In tmux.conf: source-file $CONFIG_HOME/tmux/themes/${presetId}-dark.tmux.conf"
      ;;
    iterm)
      say "  iTerm2 themes are never auto-installed (no safe system path)."
      say "  Files are at: $HERE/dark/iterm/${presetId}-dark.itermcolors and $HERE/light/iterm/${presetId}-light.itermcolors"
      say "  iTerm2 > Preferences > Profiles > Colors > Color Presets... > Import..."
      ;;
    nvim)
      install_file "$HERE/dark/nvim/${presetId}-dark.lua" "$CONFIG_HOME/nvim/colors/${presetId}-dark.lua"
      install_file "$HERE/light/nvim/${presetId}-light.lua" "$CONFIG_HOME/nvim/colors/${presetId}-light.lua"
      say "  :colorscheme ${presetId}-dark (or ${presetId}-light)"
      ;;
    bat)
      WROTE_ANY=0
      install_file "$HERE/dark/bat/${presetId}-dark.tmTheme" "$CONFIG_HOME/bat/themes/${presetId}-dark.tmTheme"
      install_file "$HERE/light/bat/${presetId}-light.tmTheme" "$CONFIG_HOME/bat/themes/${presetId}-light.tmTheme"
      if [ "$WROTE_ANY" = "0" ]; then
        say "  (themes unchanged, bat cache left alone)"
      elif [ "$DRY_RUN" != "1" ] && command -v bat >/dev/null 2>&1; then
        bat cache --build >/dev/null 2>&1 && say "  ran: bat cache --build" || say "  ! 'bat cache --build' failed, run it yourself"
      else
        say "  (run 'bat cache --build' yourself to pick up the new theme)"
      fi
      say "  bat --theme=${presetId}-dark somefile"
      ;;
    lazygit)
      lg_dir="$(lazygit_config_dir)"
      install_file "$HERE/dark/lazygit/lazygit-config.yml" "$lg_dir/${presetId}-dark-theme.yml"
      install_file "$HERE/light/lazygit/lazygit-config.yml" "$lg_dir/${presetId}-light-theme.yml"
      say "  export LG_CONFIG_FILE=\\"$lg_dir/config.yml,$lg_dir/${presetId}-dark-theme.yml\\"  (comma-separated)"
      say "  (lazygit only applies one theme at a time -- swap -dark-theme.yml for -light-theme.yml to switch)"
      ;;
    yazi)
      install_file "$HERE/dark/yazi/theme.toml" "$CONFIG_HOME/yazi/flavors/${presetId}-dark.yazi/flavor.toml"
      install_file "$HERE/light/yazi/theme.toml" "$CONFIG_HOME/yazi/flavors/${presetId}-light.yazi/flavor.toml"
      # yazi 26 takes preview highlighting from the flavor's tmtheme.xml
      install_file "$HERE/dark/bat/${presetId}-dark.tmTheme" "$CONFIG_HOME/yazi/flavors/${presetId}-dark.yazi/tmtheme.xml"
      install_file "$HERE/light/bat/${presetId}-light.tmTheme" "$CONFIG_HOME/yazi/flavors/${presetId}-light.yazi/tmtheme.xml"
      say "  In $CONFIG_HOME/yazi/theme.toml:"
      say "    [flavor]"
      say "    dark = \\"${presetId}-dark\\""
      say "    light = \\"${presetId}-light\\""
      ;;
    zsh)
      install_file "$HERE/dark/zsh/${presetId}-dark.zsh" "$CONFIG_HOME/zsh/themes/${presetId}-dark.zsh"
      install_file "$HERE/light/zsh/${presetId}-light.zsh" "$CONFIG_HOME/zsh/themes/${presetId}-light.zsh"
      say "  Add to .zshrc: source $CONFIG_HOME/zsh/themes/${presetId}-dark.zsh"
      ;;
    neomutt)
      install_file "$HERE/dark/neomutt/${presetId}-dark-neomutt.muttrc" "$CONFIG_HOME/neomutt/themes/${presetId}-dark-neomutt.muttrc"
      install_file "$HERE/light/neomutt/${presetId}-light-neomutt.muttrc" "$CONFIG_HOME/neomutt/themes/${presetId}-light-neomutt.muttrc"
      say "  Add to neomuttrc: source $CONFIG_HOME/neomutt/themes/${presetId}-dark-neomutt.muttrc"
      ;;
    tweakcc)
      say "  tweakcc has no file-based install -- print-only (per tweakcc's own import flow):"
      say "  1. npm install -g tweakcc && npx tweakcc"
      say "  2. Themes -> Import theme -> paste $HERE/dark/tweakcc/${presetId}-dark-tweakcc.json"
      say "  3. Apply customizations to cli.js, then /theme inside claude"
      ;;
    tailwind)
      dest="./${presetId}-dark.tailwind.css"
      install_file "$HERE/dark/tailwind/${presetId}-dark.tailwind.css" "$dest"
      say "  Copied to $dest (project-local asset, not a system config) -- @import it or merge the custom properties"
      ;;
    obsidian)
      say "  Obsidian vault path is unknown to this script -- copy it yourself:"
      say "  cp \\"$HERE/dark/obsidian/${presetId}-dark.css\\" \\"<your vault>/.obsidian/snippets/\\""
      say "  Then: Settings > Appearance > CSS snippets > enable it"
      ;;
    *)
      say "  ! unknown app: $app"
      ;;
  esac
done
`
}

/** Top-level dispatcher: dist-themes/install.sh <preset-id> [mode] [-- app args] */
export function renderTopLevelInstallScript(): string {
  return `#!/usr/bin/env bash
# vulpes-theme-lab top-level installer.
# Generated by scripts/export-all.ts -- do not hand-edit, regenerate instead.
#
# Usage:
#   ./install.sh <preset-id> [app...]     install app(s) for one preset
#   ./install.sh <preset-id> --all        install every app for one preset
#   ./install.sh <preset-id> --dry-run ... preview, change nothing
#
# This just cd's into dist-themes/<preset-id>/ and forwards to that preset's
# own install.sh (see its --help text for the per-app details).
set -euo pipefail

# An empty HOME would turn every destination into a path under /.
if [ -z "\${HOME:-}" ] || [ ! -d "$HOME" ]; then
  printf 'install.sh: HOME is unset or not a directory; refusing to install\\n' >&2
  exit 1
fi

HERE="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PRESET_ID="\${1:-}"

if [ -z "$PRESET_ID" ] || [ ! -d "$HERE/$PRESET_ID" ]; then
  echo "Usage: ./install.sh <preset-id> [app...] | --all | --dry-run"
  echo ""
  echo "Available presets:"
  for d in "$HERE"/vulpes-*; do
    [ -d "$d" ] && echo "  $(basename "$d")"
  done
  exit 1
fi

shift
exec "$HERE/$PRESET_ID/install.sh" "$@"
`
}
