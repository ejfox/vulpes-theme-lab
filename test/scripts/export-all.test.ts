import { describe, it, expect, afterEach } from 'vitest'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync, existsSync, chmodSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

import { VULPES_MONTHLY_PRESETS } from '~/utils/presets'
import { generateThemeVariant, presetToThemeState } from '~/utils/generateTheme'
import {
  createSemanticPalette,
  exportGhostty,
  exportNeovim,
  exportBat,
  exportYazi,
  exportLazygit,
  exportZsh,
  exportTweakcc,
  exportNeomutt,
  exportWezterm,
  exportAlacritty,
  exportTailwind,
  exportObsidian,
  type ExportResult,
  type ThemePalette,
} from '~/utils/exporters'
import { serializeItermTheme } from '~/utils/iterm'
import { serializeTmuxTheme } from '~/utils/tmux'
import { renderInstallScript, APP_IDS } from '~/utils/installer'

const EXPORTERS: Record<string, (palette: ThemePalette, name: string) => ExportResult> = {
  ghostty: exportGhostty,
  wezterm: exportWezterm,
  alacritty: exportAlacritty,
  nvim: exportNeovim,
  bat: exportBat,
  lazygit: exportLazygit,
  yazi: exportYazi,
  zsh: exportZsh,
  neomutt: exportNeomutt,
  tweakcc: exportTweakcc,
  tailwind: exportTailwind,
  obsidian: exportObsidian,
}

function placeholderIssues(content: string): string[] {
  const issues: string[] = []
  if (content.includes('undefined')) issues.push('undefined')
  if (content.includes('NaN')) issues.push('NaN')
  if (content.includes('[object Object]')) issues.push('[object Object]')
  return issues
}

describe('every preset x mode x exporter', () => {
  for (const preset of VULPES_MONTHLY_PRESETS) {
    for (const mode of ['dark', 'light'] as const) {
      it(`${preset.id} / ${mode} produces clean, non-empty output for every exporter`, () => {
        const state = presetToThemeState(preset)
        const themeColors = generateThemeVariant(state, mode)
        const palette = createSemanticPalette(themeColors, mode)
        const themeName = `${preset.id}-${mode}`

        for (const [appId, exporter] of Object.entries(EXPORTERS)) {
          const result = exporter(palette, themeName)
          expect(result.content.length, `${appId} content should be non-empty`).toBeGreaterThan(0)
          expect(placeholderIssues(result.content), `${appId} should have no placeholders`).toEqual([])
        }

        const itermContent = serializeItermTheme(themeColors, themeName)
        expect(itermContent.length).toBeGreaterThan(0)
        expect(placeholderIssues(itermContent)).toEqual([])

        const tmuxContent = serializeTmuxTheme(themeColors, themeName)
        expect(tmuxContent.length).toBeGreaterThan(0)
        expect(placeholderIssues(tmuxContent)).toEqual([])
      })
    }
  }
})

/**
 * Builds a minimal but real preset export fixture (one app's worth of
 * dark+light files, generated with the actual exporters) plus a real
 * install.sh, in an isolated temp directory -- so the installer tests below
 * exercise the exact script scripts/export-all.ts generates, without
 * depending on a full `npm run export:all` having been run first.
 */
function buildFixturePreset(presetId: string): string {
  const presetDir = mkdtempSync(join(tmpdir(), 'vulpes-fixture-'))
  const preset = VULPES_MONTHLY_PRESETS.find((p) => p.id === presetId)!

  for (const mode of ['dark', 'light'] as const) {
    const state = presetToThemeState(preset)
    const themeColors = generateThemeVariant(state, mode)
    const palette = createSemanticPalette(themeColors, mode)
    const themeName = `${preset.id}-${mode}`

    for (const appId of APP_IDS) {
      const dir = join(presetDir, mode, appId)
      mkdirSync(dir, { recursive: true })
      if (appId === 'iterm') {
        writeFileSync(join(dir, `${themeName}.itermcolors`), serializeItermTheme(themeColors, themeName))
      } else if (appId === 'tmux') {
        writeFileSync(join(dir, `${themeName}.tmux.conf`), serializeTmuxTheme(themeColors, themeName))
      } else {
        const exporter = EXPORTERS[appId]
        const result = exporter(palette, themeName)
        writeFileSync(join(dir, result.filename), result.content)
      }
    }
  }

  const installPath = join(presetDir, 'install.sh')
  writeFileSync(installPath, renderInstallScript(preset.id))
  chmodSync(installPath, 0o755)
  return presetDir
}

describe('installer', () => {
  const cleanupDirs: string[] = []
  afterEach(() => {
    for (const d of cleanupDirs.splice(0)) {
      rmSync(d, { recursive: true, force: true })
    }
  })

  function freshHome(): string {
    const dir = mkdtempSync(join(tmpdir(), 'vulpes-home-'))
    cleanupDirs.push(dir)
    return dir
  }

  // Runs install.sh with a clean environment so XDG_CONFIG_HOME / BAT_CONFIG_DIR
  // / LG_CONFIG_FILE / YAZI_CONFIG_HOME inherited from the real shell can
  // never redirect the script at EJ's actual config directories.
  function runInstaller(presetDir: string, home: string, args: string[]): string {
    return execFileSync('bash', [join(presetDir, 'install.sh'), ...args], {
      cwd: presetDir,
      env: {
        PATH: process.env.PATH || '',
        HOME: home,
      },
      encoding: 'utf-8',
      // stdin MUST be 'ignore' here -- leaving the default (piped, never
      // written to or closed) makes the child hang waiting on stdin under
      // vite-node/vitest's process tree.
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  }

  it('dry-run touches nothing in a temp HOME', () => {
    const presetDir = buildFixturePreset('vulpes-orangish-january')
    cleanupDirs.push(presetDir)
    const home = freshHome()

    runInstaller(presetDir, home, ['--dry-run', '--all'])

    const touched = existsSync(join(home, '.config')) || existsSync(join(home, 'Library'))
    expect(touched).toBe(false)
  })

  it(
    'real run is idempotent and creates backups only when content differs',
    () => {
    const presetDir = buildFixturePreset('vulpes-greenish-april')
    cleanupDirs.push(presetDir)
    const home = freshHome()

    const first = runInstaller(presetDir, home, ['--all'])
    expect(first).toContain('wrote')

    const second = runInstaller(presetDir, home, ['--all'])
    expect(second).toContain('unchanged')
    expect(second).not.toContain('backed up')

    const ghosttyDark = join(home, '.config', 'ghostty', 'themes', 'vulpes-greenish-april-dark')
    expect(existsSync(ghosttyDark)).toBe(true)
    const before = readFileSync(ghosttyDark, 'utf-8')

    // Mutate the installed file to simulate local edits, then reinstall --
    // the installer must back it up before overwriting.
    writeFileSync(ghosttyDark, before + '\n# locally edited\n')
    const third = runInstaller(presetDir, home, ['ghostty'])
    expect(third).toContain('backed up')

    const backups = execFileSync(
      'bash',
      ['-c', `ls "${join(home, '.config', 'ghostty', 'themes')}"/*.bak-* 2>/dev/null | wc -l`],
      { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }
    ).trim()
    expect(Number(backups)).toBeGreaterThan(0)

    // Content is back to the generated theme (not the mutated version).
    const after = readFileSync(ghosttyDark, 'utf-8')
    expect(after).toBe(before)
    },
    30000
  )
})
