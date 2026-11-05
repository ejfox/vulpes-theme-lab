<script setup lang="ts">
import { zipSync, type Zippable } from 'fflate'
import { VULPES_MONTHLY_PRESETS, type ThemePreset } from '~/utils/presets'
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
import { generateTweakccInstructions } from '~/utils/exporters/tweakcc'
import { serializeItermTheme } from '~/utils/iterm'
import { serializeTmuxTheme } from '~/utils/tmux'
import { APP_IDS, renderAppReadme, renderInstallScript, renderTopLevelInstallScript, type AppId } from '~/utils/installer'

useHead({
  title: 'vulpes — download all themes',
  meta: [
    {
      name: 'description',
      content: 'Every vulpes monthly preset, dark and light, exported to every supported app, zipped and ready to install.',
    },
  ],
})

const { state } = useTheme()

type Mode = 'dark' | 'light'

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

// Builds every file for one preset (both modes, every app, READMEs,
// install.sh) as a flat map of {relativePath: Uint8Array}, exactly mirroring
// the dist-themes/<preset-id>/... tree that `npm run export:all` writes on
// the server side. Same exporter functions, same installer templates --
// the web download and the CLI export can never drift apart.
function buildPresetFiles(preset: ThemePreset): Zippable {
  const files: Zippable = {}
  const enc = (s: string) => new TextEncoder().encode(s)

  for (const mode of ['dark', 'light'] as Mode[]) {
    const themeState = presetToThemeState(preset)
    const themeColors = generateThemeVariant(themeState, mode)
    const palette = createSemanticPalette(themeColors, mode)
    const themeName = `${preset.id}-${mode}`

    for (const [appId, exporter] of Object.entries(EXPORTERS)) {
      const result = exporter(palette, themeName)
      files[`${mode}/${appId}/${result.filename}`] = enc(result.content)
      if (appId === 'tweakcc') {
        files[`${mode}/${appId}/INSTRUCTIONS.md`] = enc(generateTweakccInstructions(themeName, palette))
      }
    }

    files[`${mode}/iterm/${themeName}.itermcolors`] = enc(serializeItermTheme(themeColors, themeName))
    files[`${mode}/tmux/${themeName}.tmux.conf`] = enc(serializeTmuxTheme(themeColors, themeName))
  }

  for (const appId of APP_IDS) {
    const readme = enc(renderAppReadme(appId, preset.id))
    files[`dark/${appId}/README.md`] = readme
    files[`light/${appId}/README.md`] = readme
  }

  files['install.sh'] = enc(renderInstallScript(preset.id))

  return files
}

function triggerDownload(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const busyPresetId = ref<string | null>(null)
const busyAll = ref(false)

async function downloadPresetZip(preset: ThemePreset): Promise<void> {
  busyPresetId.value = preset.id
  await nextTick()
  try {
    const files = buildPresetFiles(preset)
    const zipped = zipSync(files, { level: 6 })
    triggerDownload(zipped, `${preset.id}.zip`)
  } finally {
    busyPresetId.value = null
  }
}

async function downloadAllZip(): Promise<void> {
  busyAll.value = true
  await nextTick()
  try {
    const files: Zippable = {}
    const enc = (s: string) => new TextEncoder().encode(s)
    for (const preset of VULPES_MONTHLY_PRESETS) {
      const presetFiles = buildPresetFiles(preset)
      for (const [path, data] of Object.entries(presetFiles)) {
        files[`${preset.id}/${path}`] = data as Uint8Array
      }
    }
    files['install.sh'] = enc(renderTopLevelInstallScript())
    const zipped = zipSync(files, { level: 6 })
    triggerDownload(zipped, 'vulpes-all-themes.zip')
  } finally {
    busyAll.value = false
  }
}

function downloadSingleFile(preset: ThemePreset, mode: Mode, appId: AppId): void {
  const themeState = presetToThemeState(preset)
  const themeColors = generateThemeVariant(themeState, mode)
  const palette = createSemanticPalette(themeColors, mode)
  const themeName = `${preset.id}-${mode}`

  if (appId === 'iterm') {
    const content = serializeItermTheme(themeColors, themeName)
    triggerDownload(new TextEncoder().encode(content), `${themeName}.itermcolors`)
    return
  }
  if (appId === 'tmux') {
    const content = serializeTmuxTheme(themeColors, themeName)
    triggerDownload(new TextEncoder().encode(content), `${themeName}.tmux.conf`)
    return
  }
  const exporter = EXPORTERS[appId]
  if (!exporter) return
  const result = exporter(palette, themeName)
  triggerDownload(new TextEncoder().encode(result.content), result.filename)
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const expandedPreset = ref<string | null>(null)
function toggleExpanded(id: string): void {
  if (expandedPreset.value === id) {
    expandedPreset.value = null
  } else {
    expandedPreset.value = id
  }
}

function pageBg(mode: string): string {
  if (mode === 'dark') return '#000'
  return '#fff'
}

function pageFg(mode: string): string {
  if (mode === 'dark') return '#fff'
  return '#000'
}

function zipAllLabel(busy: boolean): string {
  if (busy) return 'zipping…'
  return '⬇ download all 12 presets (one zip)'
}

function zipPresetLabel(busy: boolean): string {
  if (busy) return 'zipping…'
  return '⬇ zip'
}

function expandLabel(expanded: boolean): string {
  if (expanded) return 'hide files ▴'
  return 'per-app files ▾'
}
</script>

<template>
  <div
    class="downloads-page"
    :style="{
      background: pageBg(state.mode),
      color: pageFg(state.mode),
    }"
  >
    <header class="page-header">
      <NuxtLink to="/" class="back-link">&larr; back to editor</NuxtLink>
      <h1>download all vulpes themes</h1>
      <p class="subtitle">
        12 monthly presets &times; dark/light &times; {{ Object.keys(EXPORTERS).length + 2 }} apps.
        Generated client-side with the same exporter code the CLI uses
        (<code>npm run export:all</code>) -- every zip includes a non-destructive
        <code>install.sh</code> and a README per app.
      </p>
      <button class="btn-all" :disabled="busyAll" @click="downloadAllZip">
        {{ zipAllLabel(busyAll) }}
      </button>
    </header>

    <div class="preset-list">
      <div
        v-for="preset in VULPES_MONTHLY_PRESETS"
        :key="preset.id"
        class="preset-row"
      >
        <div class="preset-main">
          <div class="preset-info">
            <span class="preset-month">{{ monthNames[preset.month - 1] }}</span>
            <span class="preset-name">{{ preset.name }}</span>
            <span class="preset-hue">{{ preset.baseHue }}&deg;</span>
          </div>
          <div class="preset-actions">
            <button class="btn-link" @click="toggleExpanded(preset.id)">
              {{ expandLabel(expandedPreset === preset.id) }}
            </button>
            <button
              class="btn-preset"
              :disabled="busyPresetId === preset.id"
              @click="downloadPresetZip(preset)"
            >
              {{ zipPresetLabel(busyPresetId === preset.id) }}
            </button>
          </div>
        </div>

        <div v-if="expandedPreset === preset.id" class="preset-files">
          <div v-for="appId in APP_IDS" :key="appId" class="file-row">
            <span class="file-app">{{ appId }}</span>
            <button class="btn-file" @click="downloadSingleFile(preset, 'dark', appId)">dark</button>
            <button class="btn-file" @click="downloadSingleFile(preset, 'light', appId)">light</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.downloads-page {
  min-height: 100vh;
  padding: 32px 24px 80px;
  font-family: 'Monaspace Krypton', 'MonaspaceKr Nerd Font', monospace;
}

.page-header {
  max-width: 760px;
  margin: 0 auto 40px;
}

.back-link {
  display: inline-block;
  margin-bottom: 16px;
  font-size: 11px;
  opacity: 0.6;
  text-decoration: none;
  color: inherit;
}

.back-link:hover {
  opacity: 1;
}

h1 {
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.5px;
  margin: 0 0 12px;
  text-transform: lowercase;
}

.subtitle {
  font-size: 11px;
  line-height: 1.6;
  opacity: 0.65;
  margin: 0 0 20px;
}

.subtitle code {
  opacity: 0.9;
}

.btn-all,
.btn-preset,
.btn-file,
.btn-link {
  font-family: inherit;
  background: transparent;
  border: 1px solid currentColor;
  color: inherit;
  cursor: pointer;
  border-radius: 4px;
}

.btn-all {
  font-size: 11px;
  padding: 10px 16px;
  opacity: 0.9;
}

.btn-all:hover:not(:disabled) {
  opacity: 1;
  background: rgba(128, 128, 128, 0.1);
}

.btn-all:disabled {
  opacity: 0.4;
  cursor: wait;
}

.preset-list {
  max-width: 760px;
  margin: 0 auto;
  border-top: 1px solid rgba(128, 128, 128, 0.25);
}

.preset-row {
  border-bottom: 1px solid rgba(128, 128, 128, 0.25);
}

.preset-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
}

.preset-info {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-size: 12px;
}

.preset-month {
  opacity: 0.5;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preset-name {
  letter-spacing: 0.2px;
}

.preset-hue {
  opacity: 0.4;
  font-size: 10px;
}

.preset-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn-link {
  border-color: transparent;
  font-size: 10px;
  opacity: 0.6;
  padding: 4px 6px;
}

.btn-link:hover {
  opacity: 1;
}

.btn-preset {
  font-size: 10px;
  padding: 6px 10px;
  opacity: 0.85;
}

.btn-preset:hover:not(:disabled) {
  opacity: 1;
  background: rgba(128, 128, 128, 0.1);
}

.preset-files {
  padding: 4px 0 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
}

.file-app {
  width: 70px;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.btn-file {
  font-size: 9px;
  padding: 3px 8px;
  opacity: 0.7;
}

.btn-file:hover {
  opacity: 1;
  background: rgba(128, 128, 128, 0.1);
}
</style>
