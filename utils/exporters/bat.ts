import type { ThemePalette, ExportResult } from '../types'

/**
 * Generates a Bat (TextMate) theme in XML plist format
 * @param palette - Semantic color palette
 * @param themeName - Name of the theme
 * @returns TextMate .tmTheme file content
 */
export function exportBat(palette: ThemePalette, themeName: string = 'vulpes'): ExportResult {
  const scopes = [
    { scope: '', fg: palette.fg, bg: palette.bg }, // Base editor colors
    { scope: 'comment', fg: palette.comment },
    { scope: 'string', fg: palette.string },
    { scope: 'constant.numeric', fg: palette.number },
    { scope: 'constant.language', fg: palette.boolean },
    { scope: 'constant.character, constant.other', fg: palette.constant },
    { scope: 'variable', fg: palette.variable },
    { scope: 'variable.parameter', fg: palette.variable },
    { scope: 'keyword', fg: palette.keyword },
    { scope: 'keyword.control', fg: palette.keyword },
    { scope: 'keyword.operator', fg: palette.operator },
    { scope: 'storage', fg: palette.keyword },
    { scope: 'storage.type', fg: palette.type },
    { scope: 'entity.name.function', fg: palette.function },
    { scope: 'entity.name.type, entity.name.class', fg: palette.type },
    { scope: 'entity.name.tag', fg: palette.keyword },
    { scope: 'entity.other.attribute-name', fg: palette.variable },
    { scope: 'support.function', fg: palette.function },
    { scope: 'support.class, support.type', fg: palette.type },
    { scope: 'support.constant', fg: palette.constant },
    { scope: 'invalid', fg: palette.error },
    { scope: 'invalid.deprecated', fg: palette.warning },
    { scope: 'markup.heading', fg: palette.keyword },
    { scope: 'markup.bold', fg: palette.base },
    { scope: 'markup.italic', fg: palette.string },
    { scope: 'markup.list', fg: palette.base },
    { scope: 'markup.quote', fg: palette.comment },
    { scope: 'markup.raw, markup.inline.raw', fg: palette.string },
    { scope: 'meta.diff.header', fg: palette.info },
    { scope: 'markup.inserted', fg: palette.success },
    { scope: 'markup.deleted', fg: palette.error },
    { scope: 'markup.changed', fg: palette.warning },
  ]

  const scopeItems = scopes
    .map(({ scope, fg, bg }) => {
      const settings: string[] = []
      if (fg) settings.push(`        <key>foreground</key>\n        <string>${fg}</string>`)
      if (bg) settings.push(`        <key>background</key>\n        <string>${bg}</string>`)

      return `    <dict>
      <key>scope</key>
      <string>${scope}</string>
      <key>settings</key>
      <dict>
${settings.join('\n')}
      </dict>
    </dict>`
    })
    .join('\n')

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>name</key>
  <string>${themeName}</string>
  <key>semanticClass</key>
  <string>theme.${themeName}</string>
  <key>settings</key>
  <array>
${scopeItems}
  </array>
</dict>
</plist>
`

  return {
    filename: `${themeName}.tmTheme`,
    content,
    format: 'bat',
  }
}
