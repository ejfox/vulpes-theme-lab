/**
 * Imported theme preset management
 * Stores user-imported themes as presets alongside monthly themes
 */

import type { ThemeImport } from './importers/types'
import type { ThemePalette } from './types'
import { mapThemeToSemanticPalette } from './semanticMapper'

/**
 * Imported preset structure
 * Simpler than full ThemePreset - stores direct colors instead of offsets
 */
export interface ImportedPreset {
  id: string
  name: string
  description: string
  isDark: boolean
  // Store the mapped palette directly
  palette: ThemePalette
  // Metadata from original import
  source: string // 'base16', 'neovim', 'ghostty', 'vscode'
  author?: string
  importedAt: number // timestamp
}

const STORAGE_KEY = 'vulpes-imported-presets'

/**
 * Convert ThemeImport to ImportedPreset
 */
export function themeImportToPreset(imported: ThemeImport): ImportedPreset {
  const palette = mapThemeToSemanticPalette(imported)

  return {
    id: `imported-${imported.name}-${Date.now()}`,
    name: imported.name,
    description: imported.metadata.description || `Imported from ${imported.metadata.source}`,
    isDark: imported.metadata.isDark ?? true,
    palette,
    source: imported.metadata.source,
    author: imported.metadata.author,
    importedAt: Date.now(),
  }
}

/**
 * Load imported presets from localStorage
 */
export function loadImportedPresets(): ImportedPreset[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to load imported presets:', error)
    return []
  }
}

/**
 * Save imported presets to localStorage
 */
export function saveImportedPresets(presets: ImportedPreset[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  } catch (error) {
    console.error('Failed to save imported presets:', error)
  }
}

/**
 * Add new imported preset
 */
export function addImportedPreset(preset: ImportedPreset): void {
  const presets = loadImportedPresets()
  presets.push(preset)
  saveImportedPresets(presets)
}

/**
 * Remove imported preset by ID
 */
export function removeImportedPreset(id: string): void {
  const presets = loadImportedPresets()
  const filtered = presets.filter((p) => p.id !== id)
  saveImportedPresets(filtered)
}

/**
 * Get imported preset by ID
 */
export function getImportedPreset(id: string): ImportedPreset | undefined {
  const presets = loadImportedPresets()
  return presets.find((p) => p.id === id)
}

/**
 * Clear all imported presets
 */
export function clearImportedPresets(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Apply imported preset to theme state
 * Returns the full theme palette for direct application
 */
export function applyImportedPreset(preset: ImportedPreset): {
  themeName: string
  mode: 'dark' | 'light'
  colors: ThemePalette
} {
  const { palette, name, isDark } = preset

  return {
    themeName: name,
    mode: isDark ? 'dark' : 'light',
    colors: palette, // Return the full palette directly
  }
}
