import type { ThemePalette, ExportResult } from '../types'
import chroma from 'chroma-js'

/**
 * Generates a tweakcc theme configuration for Claude Code customization
 * Maps semantic theme colors to tweakcc's 56+ UI element properties
 *
 * Based on tweakcc schema research - see https://github.com/Piebald-AI/tweakcc
 *
 * @param palette - Semantic color palette
 * @param themeName - Name of the theme
 * @returns tweakcc theme configuration as JSON
 */
export function exportTweakcc(
  palette: ThemePalette,
  themeName: string = 'vulpes'
): ExportResult {
  // Helper: Create shimmer effect (lighter/more saturated version)
  const shimmer = (color: string): string => {
    try {
      return chroma(color).brighten(0.5).saturate(0.3).hex()
    } catch {
      return color
    }
  }

  // Helper: Create dimmed version for inactive states
  const dimmed = (color: string): string => {
    try {
      return chroma(color).darken(0.3).desaturate(0.2).hex()
    } catch {
      return color
    }
  }

  // Generate unique ID from theme name
  const themeId = themeName.toLowerCase().replace(/[^a-z0-9]/g, '-')

  const theme = {
    name: themeName,
    id: themeId,
    colors: {
      // ========================================================================
      // CORE UI ELEMENTS (8 properties)
      // ========================================================================
      autoAccept: palette.success,              // Auto-accept mode indicator
      bashBorder: palette.base,                 // Bash command border
      promptBorder: palette.base,               // Input prompt border
      promptBorderShimmer: shimmer(palette.base), // Input prompt shimmer
      background: palette.bg,                   // Background for UI elements
      planMode: palette.info,                   // Plan mode indicator
      ide: palette.info,                        // IDE-related messages
      remember: palette.hint,                   // Memory-related text

      // ========================================================================
      // CLAUDE BRANDING (4 properties)
      // ========================================================================
      claude: palette.base,                     // Logo, welcome, thinking text
      claudeShimmer: shimmer(palette.base),     // Thinking verb shimmer
      claudeBlue_FOR_SYSTEM_SPINNER: palette.base,
      claudeBlueShimmer_FOR_SYSTEM_SPINNER: shimmer(palette.base),

      // ========================================================================
      // TEXT STYLING (7 properties)
      // ========================================================================
      text: palette.fg,                         // Code color in diffs
      inverseText: palette.bg,                  // Tab text with filled background
      inactive: palette.comment,                // Line numbers, less prominent text
      subtle: dimmed(palette.comment),          // Help text, secondary info
      suggestion: palette.hint,                 // Theme name suggestions, UI hints
      permission: palette.warning,              // Permission prompt color
      permissionShimmer: shimmer(palette.warning), // Permission shimmer

      // ========================================================================
      // STATUS INDICATORS (4 properties)
      // ========================================================================
      success: palette.success,                 // Successful tool calls
      error: palette.error,                     // Error indicator
      warning: palette.warning,                 // Warning indicator
      warningShimmer: shimmer(palette.warning), // Warning shimmer

      // ========================================================================
      // DIFF DISPLAY (8 properties)
      // ========================================================================
      diffAdded: chroma(palette.success).alpha(0.2).hex(),
      diffRemoved: chroma(palette.error).alpha(0.2).hex(),
      diffAddedDimmed: chroma(palette.success).alpha(0.1).hex(),
      diffRemovedDimmed: chroma(palette.error).alpha(0.1).hex(),
      diffAddedWord: chroma(palette.success).alpha(0.4).hex(),
      diffRemovedWord: chroma(palette.error).alpha(0.4).hex(),
      diffAddedWordDimmed: chroma(palette.success).alpha(0.2).hex(),
      diffRemovedWordDimmed: chroma(palette.error).alpha(0.2).hex(),

      // ========================================================================
      // SUBAGENT COLORS (8 properties)
      // Assign different semantic colors to different subagent types
      // ========================================================================
      red_FOR_SUBAGENTS_ONLY: palette.error,
      blue_FOR_SUBAGENTS_ONLY: palette.info,
      green_FOR_SUBAGENTS_ONLY: palette.success,
      yellow_FOR_SUBAGENTS_ONLY: palette.warning,
      purple_FOR_SUBAGENTS_ONLY: palette.type,
      orange_FOR_SUBAGENTS_ONLY: palette.warning, // Reuse warning (orange-ish)
      pink_FOR_SUBAGENTS_ONLY: palette.macro,
      cyan_FOR_SUBAGENTS_ONLY: palette.info,      // Reuse info (cyan-ish)

      // ========================================================================
      // RAINBOW/ULTRATHINK COLORS (14 properties)
      // Create a perceptual rainbow from our semantic colors
      // ========================================================================
      rainbow_red: palette.error,
      rainbow_orange: palette.warning,
      rainbow_yellow: palette.string,
      rainbow_green: palette.success,
      rainbow_blue: palette.info,
      rainbow_indigo: palette.type,
      rainbow_violet: palette.macro,
      rainbow_red_shimmer: shimmer(palette.error),
      rainbow_orange_shimmer: shimmer(palette.warning),
      rainbow_yellow_shimmer: shimmer(palette.string),
      rainbow_green_shimmer: shimmer(palette.success),
      rainbow_blue_shimmer: shimmer(palette.info),
      rainbow_indigo_shimmer: shimmer(palette.type),
      rainbow_violet_shimmer: shimmer(palette.macro),

      // ========================================================================
      // CHARACTER & CONTEXT (5 properties)
      // ========================================================================
      professionalBlue: palette.base,           // Professional contexts
      clawd_body: palette.base,                 // "Clawd" character body
      clawd_background: palette.bg_alt,         // "Clawd" character background
      userMessageBackground: palette.bg_alt,    // User message background
      bashMessageBackgroundColor: chroma(palette.bg_alt).darken(0.2).hex(),
      memoryBackgroundColor: chroma(palette.hint).alpha(0.1).hex(),

      // ========================================================================
      // RATE LIMITING (2 properties)
      // ========================================================================
      rate_limit_fill: palette.warning,         // Rate limit indicator fill
      rate_limit_empty: dimmed(palette.comment), // Rate limit indicator empty
    }
  }

  // Generate JSON with proper formatting
  const content = JSON.stringify(theme, null, 2)

  // Add helpful header comment as a separate instruction file
  const instructions = `# ${themeName} - tweakcc Theme for Claude Code

## Installation Instructions

1. Install tweakcc if you haven't already:
   \`\`\`bash
   npm install -g tweakcc
   # or
   npx tweakcc
   \`\`\`

2. Import this theme:
   \`\`\`bash
   npx tweakcc
   # Navigate to: Themes → Import theme
   # Paste the contents of ${themeName}-tweakcc.json
   \`\`\`

3. Apply customizations:
   \`\`\`bash
   # In tweakcc menu:
   # Select: Apply customizations to cli.js
   \`\`\`

4. Launch Claude Code and select your theme:
   \`\`\`bash
   claude
   /theme
   # Select: ${themeName}
   \`\`\`

## Theme Configuration

This theme includes all 56+ tweakcc color properties mapped from your semantic palette:
- Core UI elements (prompts, borders, backgrounds)
- Claude branding colors with shimmer effects
- Text styling (normal, inactive, subtle, suggestions)
- Status indicators (success, error, warning)
- Diff display (added/removed with word-level highlighting)
- Subagent colors (8 distinct agent types)
- Rainbow colors for ultrathink mode
- Character and context backgrounds
- Rate limiting indicators

## Color Mapping

The following semantic colors were used:
- Base/Primary: ${palette.base}
- Background: ${palette.bg}
- Foreground: ${palette.fg}
- Success: ${palette.success}
- Error: ${palette.error}
- Warning: ${palette.warning}
- Info: ${palette.info}
- Hint: ${palette.hint}

Generated by vulpes-theme-lab
https://github.com/yourusername/vulpes-theme-lab
`

  return {
    filename: `${themeName}-tweakcc.json`,
    content,
    format: 'tweakcc',
    // Include instructions as metadata
    metadata: {
      instructions,
      schemaVersion: '1.0',
      colorCount: 56,
      generatedAt: new Date().toISOString()
    }
  }
}

/**
 * Generate a separate instructions file for tweakcc themes
 */
export function generateTweakccInstructions(themeName: string, palette: ThemePalette): string {
  return `# ${themeName} - Claude Code Theme Installation

## Quick Start

1. **Install tweakcc:**
   \`\`\`bash
   npm install -g tweakcc
   \`\`\`

2. **Run the interactive tool:**
   \`\`\`bash
   npx tweakcc
   \`\`\`

3. **Import your theme:**
   - Navigate to: **Themes → Import theme**
   - Paste the contents of \`${themeName}-tweakcc.json\`
   - Save the theme

4. **Apply to Claude Code:**
   - Return to main menu
   - Select: **Apply customizations to cli.js**

5. **Use your theme:**
   \`\`\`bash
   claude
   /theme
   # Select: ${themeName}
   \`\`\`

## Theme Features

Your ${themeName} theme includes:

### Core UI
- Clean prompt borders with shimmer effects
- Distinct backgrounds for different contexts
- Auto-accept and plan mode indicators

### Syntax & Diffs
- High-contrast text colors
- Clear diff highlighting (additions/removals)
- Word-level change detection

### Subagents
- 8 distinct colors for different agent types
- Visual distinction between concurrent agents

### Status
- Success (${palette.success})
- Error (${palette.error})
- Warning (${palette.warning})

## Troubleshooting

**Theme not appearing?**
- Make sure you selected "Apply customizations to cli.js"
- Restart Claude Code after applying
- Check \`~/.tweakcc/config.js\` for your theme

**Colors look wrong?**
- Some terminals may not support true color
- Set \`COLORTERM=truecolor\` in your shell
- Verify your terminal emulator supports 24-bit color

**Want to modify colors?**
- Edit colors in tweakcc's interactive color picker
- Or manually edit \`~/.tweakcc/config.js\`
- Re-apply customizations after changes

## Learn More

- tweakcc GitHub: https://github.com/Piebald-AI/tweakcc
- Claude Code docs: https://docs.claude.com/
- WCAG contrast guidelines: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html

---

Generated by vulpes-theme-lab
`
}
