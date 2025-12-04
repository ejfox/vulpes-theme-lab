#!/usr/bin/env node
/**
 * Quick test script to verify theme import parsers work
 */

import { readFileSync } from 'fs'
import { parseThemeFromFile } from './utils/importers/index.ts'
import { mapThemeToSemanticPalette } from './utils/semanticMapper.ts'

const themes = [
  'test-themes/gruvbox-dark.yml',
  'test-themes/ayu-dark.json',
  'test-themes/nord.json',
  'test-themes/tokyonight-night.json',
]

console.log('🧪 Testing Theme Import System\n')

for (const themePath of themes) {
  console.log(`\n📁 Testing: ${themePath}`)

  try {
    const content = readFileSync(themePath, 'utf-8')
    const result = parseThemeFromFile(content, themePath)

    if (result.success && result.theme) {
      console.log(`✅ Parsed successfully as ${result.format}`)
      console.log(`   Name: ${result.theme.name}`)
      console.log(`   Mode: ${result.theme.metadata.isDark ? 'dark' : 'light'}`)
      console.log(`   Author: ${result.theme.metadata.author || 'N/A'}`)

      // Test semantic mapping
      const palette = mapThemeToSemanticPalette(result.theme)
      console.log(`   Colors: bg=${palette.bg}, fg=${palette.fg}, base=${palette.base}`)
      console.log(`   Palette: ${Object.keys(palette.palette).length} ANSI colors`)
    } else {
      console.log(`❌ Failed: ${result.error}`)
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
  }
}

console.log('\n✨ Testing complete!\n')
