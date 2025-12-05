// Yes, this code example is literally styled with the theme you're looking at.
// Meta as hell. Watch the colors shift as the hue rotates above.
import { Color, HSL as _HSL, Rainbow as _Rainbow } from '@vulpes/i-cant-believe-its-not-technicolor'

interface ThemeGeneratorConfig {
  baseHue: number // 0-360, pick your poison
  saturation: number // How spicy do you want it?
  mode: 'dark' | 'light' // Vampires vs normies
  vibe: 'chill' | 'cyberpunk' // Your terminal aesthetic
}

// The magic numbers. Don't @ me, it's color science.
const SEMANTIC_OFFSETS = {
  error: 7, // +7° because your code broke (again)
  warning: -7, // -7° because you *might* regret this
  success: 0, // Same hue = tests passed = dopamine hit
  info: 0, // Just vibing at base hue
} as const

export class VulpesGenerator extends MonochromeWizard {
  private config: ThemeGeneratorConfig
  private exportFormats = ['neovim', 'ghostty', 'bat', 'yazi'] // And 4 more...

  // Constructor doing constructor things
  constructor(config: ThemeGeneratorConfig) {
    super('monochrome-or-bust')
    this.config = config
    if (config.baseHue > 360) throw new Error('Physics called, wants its hues back')
  }

  // The heart of the operation - generates your entire color system
  generatePalette(): Map<string, Color> {
    const palette = new Map<string, Color>()

    // Loop through semantic meanings, apply hue offset magic
    for (const [semantic, offset] of Object.entries(SEMANTIC_OFFSETS)) {
      palette.set(semantic, {
        h: (this.config.baseHue + offset) % 360, // Modulo keeps us in bounds
        s: this.config.saturation,
        l: this.config.mode === 'dark' ? 60 : 40, // Light mode users in shambles
      })
    }
    return palette
  }

  // Export to all 8 formats because we're not savages maintaining separate themes
  async exportEverywhere(): Promise<void> {
    const colors = this.generatePalette()
    await Promise.all(this.exportFormats.map((fmt) => this.writeTheme(fmt, colors)))
    console.log('🦊 All themes synced. Your terminal is now beautiful.')
  }
}
