# Theme Import & Interpolation Feature Plan

## Overview

Transform vulpes-theme-lab into a **universal theme translator** that can import themes from various sources and export to all supported formats.

**Core Capability:** Drop a theme from nvim/ghostty/base16/vscode → Automatically interpolate to vulpes palette → Export to 13+ formats

---

## Architecture Components

### 1. Theme Parsers (`utils/importers/`)

Create parser modules for popular theme formats:

**Priority formats:**
- **Base16** (YAML/JSON) - widely supported standard with 16-color palette
- **Neovim Lua** - parse color table from lua colorschemes
- **Ghostty** - parse terminal config (palette 0-15, bg, fg)
- **VS Code** (JSON) - extract `colors` and `tokenColors`
- **iTerm2** (XML) - parse plist format
- **Alacritty** (YAML/TOML) - terminal config parser

**Parser Interface:**
```typescript
interface ThemeImport {
  name: string
  colors: {
    bg?: string
    fg?: string
    // Semantic mappings (best effort)
    comment?: string
    keyword?: string
    string?: string
    // ... etc
    // ANSI palette
    palette?: Record<number, string>
  }
  metadata?: {
    source: 'base16' | 'neovim' | 'ghostty' | 'vscode' | 'iterm' | 'alacritty'
    isDark?: boolean
    author?: string
  }
}

function parseTheme(content: string, format: ThemeFormat): ThemeImport
```

### 2. Semantic Color Mapper (`utils/semanticMapper.ts`)

**Challenge:** Different formats use different semantic naming conventions.

**Solution:** Smart mapping with fallback strategies:

```typescript
interface SemanticMapping {
  // Map imported colors to ThemePalette roles
  mapToSemanticPalette(imported: ThemeImport): Partial<ThemePalette>

  // Intelligent fallbacks when colors are missing
  // Example: no "function" color? Use keyword or fg as fallback
  inferMissingColors(partial: Partial<ThemePalette>): ThemePalette
}
```

**Mapping Strategies:**
1. **Direct semantic match** - `keyword` → `keyword`
2. **Heuristic matching** - analyze color usage patterns
3. **Palette extraction** - use ANSI palette if semantic colors unavailable
4. **Algorithmic generation** - generate missing colors from available ones

### 3. Reverse Theme Analysis (Optional Enhancement)

**Goal:** Approximate the original theme's "baseHue" and "offsets" to enable fine-tuning

```typescript
interface ThemeAnalysis {
  estimatedBaseHue: number // Dominant hue
  estimatedSaturation: number
  estimatedContrast: number
  colorDistribution: {
    // Which colors deviate from base
    keyword: number // hue offset from base
    string: number
    // etc
  }
}

function analyzeTheme(palette: ThemePalette): ThemeAnalysis
```

**Algorithm:**
1. Extract hues from all semantic colors
2. Find most common hue → `baseHue`
3. Calculate offsets for other colors
4. Estimate saturation/contrast from color distances

**Benefit:** After import, user can tweak individual color offsets using existing UI

### 4. UI Updates

#### 4.1 Import Section (New Component: `ImportModal.vue`)

**Features:**
- **Drag & drop zone** for theme files
- **Paste from clipboard** for theme code
- **Format auto-detection** (parse and detect format)
- **Preview imported colors** before applying
- **Name imported theme**

**Workflow:**
```
User drops nvim theme file
  ↓
Parse & detect format (Neovim Lua)
  ↓
Extract colors → map to semantic palette
  ↓
Show preview (before/after comparison)
  ↓
User clicks "Apply" → updates app state
  ↓
Can now export to all formats
```

#### 4.2 Export Modal Enhancement (`ExportModal.vue`)

**Current:** Format selection + export buttons

**Enhanced:**
- **Add "Import Theme" button** at top
- **Show source info** if theme was imported ("Source: Catppuccin Mocha")
- **"Import & Export" quick action** - import + immediately export to selected formats

#### 4.3 Main UI Flow Integration

**Add import button** next to existing export button:
```
[Import Theme] [Export Theme] [Accessibility Check]
```

### 5. Testing Strategy

**Test fixtures:**
- Popular themes to test parsing: Catppuccin, Gruvbox, Tokyo Night, Nord
- Edge cases: monochrome themes, high contrast, light themes
- Malformed inputs: partial color definitions, invalid hex

**Test scenarios:**
1. Import base16 → export to all formats → verify consistency
2. Import nvim theme → tweak offsets → export
3. Import light theme → export both dark/light variants

---

## Implementation Phases

### Phase 1: Core Import System (Foundation)
**Files to create:**
- `utils/importers/index.ts` - Main import orchestrator
- `utils/importers/base16.ts` - Base16 parser (simplest, standardized)
- `utils/importers/ghostty.ts` - Ghostty config parser
- `utils/importers/neovim.ts` - Neovim Lua parser (regex-based extraction)
- `utils/semanticMapper.ts` - Semantic color mapping logic

**Tests:**
- `test/importers/base16.test.ts`
- `test/importers/ghostty.test.ts`
- `test/importers/neovim.test.ts`

### Phase 2: UI Components
**Files to create:**
- `components/ImportModal.vue` - Import UI with drag & drop
- `components/ThemePreview.vue` - Before/after preview of imported theme

**Files to modify:**
- `components/ExportModal.vue` - Add import trigger button
- `pages/index.vue` - Add import button to main UI

### Phase 3: Theme Gallery
**Files to create:**
- `utils/themes/gallery.ts` - Curated theme definitions
- `components/ThemeGallery.vue` - Browse & import popular themes

**Bundled themes:**
- Catppuccin (Mocha, Latte, Frappe, Macchiato)
- Gruvbox (Dark, Light)
- Tokyo Night (Night, Storm, Day)
- Nord
- Dracula
- One Dark / One Light
- Solarized (Dark, Light)

Each as parsed ThemeImport ready to convert to preset

### Phase 4: Polish & Documentation
- Error handling & validation
- User guide for import workflow
- Example themes bundled as templates
- Export "import report" (which colors were mapped, which were inferred)

---

## Key Design Decisions

### Decision 1: Lossy vs Lossless Import

**Challenge:** External themes don't map 1:1 to vulpes palette

**Approach: Lossy with transparency**
- Accept that import is best-effort semantic mapping
- Show user which colors were mapped vs inferred
- Allow manual adjustment after import

### Decision 2: State Management After Import

**Options:**
1. **Replace current theme** - imported theme becomes active theme
2. **Create new preset** - add to presets list
3. **Temporary overlay** - preview mode, doesn't modify existing theme

**Recommendation:** Option 1 (replace) + save as preset option
- Import replaces active theme state
- Offer "Save as preset" button after import
- User can export or further customize

### Decision 3: Format Auto-Detection

**Strategy:**
- Try parsing with each parser until one succeeds
- Use filename extension hints (.lua, .ghostty, .yml)
- Validate parsed result (must have at least bg + fg)

---

## Potential Challenges & Solutions

### Challenge 1: Ambiguous Semantic Roles
**Problem:** Theme has "function" but is it our "function" or "builtin"?

**Solution:**
- Use conservative mapping (prefer more common role)
- Provide "import hints" (user selects source theme template)
- Show mapping preview before applying

### Challenge 2: Missing Colors
**Problem:** Imported theme only defines 8 colors, but we need 23+ semantic roles

**Solution:**
- Generate missing colors algorithmically:
  - Calculate hue from existing colors
  - Apply consistent offsets
  - Use chroma-js to ensure harmony
- Clearly mark auto-generated colors in preview

### Challenge 3: Dark vs Light Detection
**Problem:** Need to know if imported theme is dark or light

**Solution:**
- Analyze background luminance (existing `detectThemeType` utility)
- Default to dark if ambiguous
- Let user override in preview

### Challenge 4: Parsing Lua/Complex Formats
**Problem:** Neovim themes use Lua with variable references

**Solution:**
- Use regex to extract color values (hex patterns)
- Build color table from extracted values
- Fall back to manual extraction if dynamic

---

## Success Criteria

**Feature is successful if:**
1. ✅ Can import at least 3 popular formats (base16, ghostty, neovim)
2. ✅ Imported theme looks "close enough" to original (90%+ color accuracy)
3. ✅ Can export imported theme to all 13 formats
4. ✅ UI is intuitive (drag & drop works, preview is clear)
5. ✅ Import process completes in <2 seconds for typical theme
6. ✅ Handles errors gracefully (invalid files, malformed themes)

---

## Future Enhancements

- **Theme Gallery:** Browse & import popular themes from curated list
- **GitHub Integration:** Import directly from repo URL
- **AI-Assisted Mapping:** Use LLM to analyze theme and suggest semantic mappings
- **Bulk Import:** Import multiple themes to compare
- **Theme Interpolation:** Blend two imported themes to create hybrid
- **Export Metadata:** Include original source info in exported themes

---

## User Decisions ✅

1. **Format Priority:** ALL formats (base16, neovim, ghostty, vscode)
   - Build parsers for all major theme formats
   - Priority: Base16 → Neovim → Ghostty → VS Code

2. **Import UX:** Drag & drop + Browse gallery
   - Drag & drop for user-owned themes
   - Curated gallery for popular themes (Catppuccin, Gruvbox, Tokyo Night, etc.)

3. **State Management:** Add as new preset
   - Import creates new entry in presets list
   - Doesn't modify current theme
   - User can switch between presets via UI

4. **Reverse Engineering:** NOT important
   - Skip complex hue analysis
   - Direct color mapping only
   - Simplifies implementation significantly

---

## Estimated Complexity

**Phase 1 (Core Import):** Medium - 4 parsers + semantic mapper
- Base16: Low (standardized YAML/JSON)
- Ghostty: Low (simple key=value format)
- Neovim: Medium (regex extraction from Lua)
- VS Code: Medium (nested JSON with tokenColors)

**Phase 2 (UI):** Low-Medium - Vue components with drag & drop
- ImportModal: Standard file upload + preview
- Integration with existing preset system

**Phase 3 (Gallery):** Low - Pre-parsed theme objects
- Manual curation of popular themes
- No dynamic fetching initially

**Phase 4 (Polish):** Low - Error handling + docs

**Total:** ~2-3 days of focused development (simplified by skipping reverse analysis)

**Highest Risk:** VS Code tokenColors mapping (complex scope selectors)
**Lowest Risk:** Base16 parsing (standardized format with semantic naming)
