import type { ThemeColors } from '~/composables/useTheme'

export function serializeItermTheme(colors: ThemeColors, _name: string): string {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 0, g: 0, b: 0 }
  }

  const colorToXml = (hex: string, name: string) => {
    const { r, g, b } = hexToRgb(hex)
    return `  <key>${name}</key>
  <dict>
    <key>Color Space</key>
    <string>sRGB</string>
    <key>Red Component</key>
    <real>${r.toFixed(6)}</real>
    <key>Green Component</key>
    <real>${g.toFixed(6)}</real>
    <key>Blue Component</key>
    <real>${b.toFixed(6)}</real>
    <key>Alpha Component</key>
    <real>1</real>
  </dict>`
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
${colorToXml(colors.bg, 'Background Color')}
${colorToXml(colors.fg, 'Foreground Color')}
${colorToXml(colors.base, 'Cursor Color')}
${colorToXml(colors.base, 'Cursor Text Color')}
${colorToXml(colors.warning + '40', 'Selection Color')}
${colorToXml(colors.fg, 'Selection Text Color')}
${colorToXml(colors.base, 'Bold Color')}
${colorToXml(colors.comment, 'Ansi 0 Color')}
${colorToXml(colors.error, 'Ansi 1 Color')}
${colorToXml(colors.string, 'Ansi 2 Color')}
${colorToXml(colors.warning, 'Ansi 3 Color')}
${colorToXml(colors.function, 'Ansi 4 Color')}
${colorToXml(colors.keyword, 'Ansi 5 Color')}
${colorToXml(colors.variable, 'Ansi 6 Color')}
${colorToXml(colors.fg, 'Ansi 7 Color')}
${colorToXml(colors.comment, 'Ansi 8 Color')}
${colorToXml(colors.error, 'Ansi 9 Color')}
${colorToXml(colors.string, 'Ansi 10 Color')}
${colorToXml(colors.warning, 'Ansi 11 Color')}
${colorToXml(colors.function, 'Ansi 12 Color')}
${colorToXml(colors.keyword, 'Ansi 13 Color')}
${colorToXml(colors.variable, 'Ansi 14 Color')}
${colorToXml(colors.fg, 'Ansi 15 Color')}
</dict>
</plist>`
}
