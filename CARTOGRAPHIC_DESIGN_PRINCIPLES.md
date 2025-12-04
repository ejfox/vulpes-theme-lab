# Cartographic Design Principles for Vulpes Map Themes

Informed by Stamen's dark mode mapping research and cyberpunk aesthetics.

## Stamen's Core Insights

### The Invert + Hue Rotate Technique

From [Stamen's dark mode blog](https://stamen.com/more-ways-to-make-your-maps-go-dark-mode/):

```css
filter: invert(1) hue-rotate(180deg);
```

**Why this works:**
1. Simple inversion creates unnatural colors (green → purple)
2. Hue rotation brings colors back to natural positions on color wheel
3. Preserves cognitive associations (green parks, blue water)

**Our approach is different:**
- We **intentionally shift** all hues to the theme color
- November Reddish → everything becomes pink/red tones
- June Cyanish → everything becomes cyan/blue tones
- This is **thematic cartography**, not natural representation

## Hierarchy Through Brightness (Not Just Hue)

From [Dark Matter basemap](https://stamen.com/introducing-positron-dark-matter-new-basemap-styles-for-cartodb-d02172610baa/):

> "an appropriate hierarchy of importance at all zoom levels"

**Key principle:** Use **brightness relationships** to create visual hierarchy.

### Current Vulpes Approach

```typescript
// Roads: brightness hierarchy
roadMotorway = baseColor.brighten(0.5)   // Brightest
roadTrunk = baseColor.brighten(0.3)
roadPrimary = baseColor                  // Base
roadSecondary = baseColor.darken(0.3)
roadTertiary = baseColor.darken(0.6)     // Dimmest
```

**Problem:** These brightness steps might not be perceptually uniform!

### Improved Approach: Perceptual Brightness Steps

Use **lightness in LAB color space** for perceptually uniform steps:

```typescript
import chroma from 'chroma-js'

// Create perceptually uniform brightness scale
const baseLAB = chroma(baseColor).lab()
const steps = [
  baseLAB[0] + 20,  // Motorway (brightest)
  baseLAB[0] + 10,  // Trunk
  baseLAB[0],       // Primary (base)
  baseLAB[0] - 10,  // Secondary
  baseLAB[0] - 20,  // Tertiary
  baseLAB[0] - 30,  // Minor (dimmest)
]

const roadColors = steps.map(L => chroma.lab(L, baseLAB[1], baseLAB[2]).hex())
```

## Saturation Strategy for Feature Types

Different features should have different saturation levels:

| Feature | Saturation | Rationale |
|---------|-----------|-----------|
| **Water** | 100% (saturated) | Needs to "glow" and stand out |
| **Motorways** | 90% | High energy, important routes |
| **Major Roads** | 80% | Still vibrant but subordinate |
| **Minor Roads** | 60% | Recede into background |
| **Buildings** | 30% | Structural, not decorative |
| **Parks/Land** | 20% | Subtle variation from background |

```typescript
const createFeatureColor = (baseHue: number, featureType: string) => {
  const saturationMap = {
    water: 100,
    motorway: 90,
    trunk: 80,
    primary: 70,
    secondary: 60,
    building: 30,
    park: 20,
  }

  const sat = saturationMap[featureType] || 50
  return chroma.hsl(baseHue, sat / 100, baseLightness).hex()
}
```

## Opacity Layering for Depth

Use alpha channels to create depth perception:

```typescript
// Current approach
roadMinor = baseColor.darken(1.2).alpha(0.6).hex()

// Enhanced approach with zoom-aware opacity
{
  'line-opacity': [
    'interpolate', ['linear'], ['zoom'],
    10, 0.3,   // Barely visible at low zoom
    14, 0.6,   // Medium visibility at street level
    18, 0.8    // Fully visible when zoomed in
  ]
}
```

**Depth layers (back to front):**
1. Background land (alpha 1.0)
2. Parks/landuse (alpha 0.5-0.7)
3. Buildings (alpha 0.7-0.9)
4. Minor roads (alpha 0.4-0.6)
5. Major roads (alpha 0.8-1.0)
6. Water (alpha 0.7-0.9 with glow)
7. Labels (alpha 1.0 with halos)

## Label Legibility in Themed Maps

**Challenge:** Pink text on pink roads is hard to read!

**Stamen's principle:** "clear labeling for cities, parks, water bodies"

### Our solution: Context-aware label colors

```typescript
// For dark themes
const labelColor = palette.fg  // Light pink text
const labelHalo = palette.bg   // Dark background halo

// But for light-colored roads, we need darker text
const roadLabelColor = chroma(roadColor).luminance() > 0.5
  ? palette.bg  // Dark text on light roads
  : palette.fg  // Light text on dark roads

// Halos should be 2-3px thick for readability
'text-halo-width': 2.5,
'text-halo-blur': 0.5,
```

## Contrast Ratios

Ensure WCAG-compliant contrast for labels:

```typescript
import chroma from 'chroma-js'

const checkContrast = (fg: string, bg: string) => {
  return chroma.contrast(fg, bg)
}

// Minimum contrast ratios:
// - Large text (>18pt): 3:1
// - Small text: 4.5:1
// - Icons/UI: 3:1

// Example validation
if (checkContrast(labelColor, roadColor) < 4.5) {
  // Adjust label color for readability
  labelColor = chroma(labelColor)
    .darken(1)  // Make darker if bg is light
    .hex()
}
```

## Zoom-Aware Styling

Different features should appear/disappear at appropriate zooms:

```typescript
{
  id: 'road-path',
  minzoom: 15,  // Only show paths when zoomed in
  paint: {
    'line-width': [
      'interpolate', ['exponential', 1.5], ['zoom'],
      15, 1,   // Thin at min zoom
      18, 3    // Thicker when very close
    ],
    'line-opacity': [
      'interpolate', ['linear'], ['zoom'],
      15, 0.3,  // Faint when first visible
      16, 0.5,
      18, 0.7   // More visible when zoomed in
    ]
  }
}
```

**Hierarchy of visibility:**
- Zoom 0-4: Countries, major water bodies
- Zoom 5-8: Cities, major roads, large parks
- Zoom 9-12: Streets, neighborhoods, local parks
- Zoom 13-15: Minor streets, buildings
- Zoom 16+: Paths, building details, POIs

## Cyberpunk Aesthetic Principles

Our themes add cyberpunk/neon elements on top of cartographic best practices:

### Neon Glow Effects

Water should "glow" with neon energy:

```typescript
// Double-layer approach
[
  // Base water fill (saturated)
  {
    id: 'water-base',
    paint: {
      'fill-color': waterColor,
      'fill-opacity': 0.8
    }
  },
  // Neon outline (brighter)
  {
    id: 'water-glow',
    paint: {
      'line-color': chroma(waterColor).brighten(0.5).hex(),
      'line-width': 2,
      'line-opacity': 0.6,
      'line-blur': 4  // Soft glow effect
    }
  }
]
```

### Building Extrusion (3D Effect)

```typescript
{
  id: 'building-3d',
  type: 'fill-extrusion',
  paint: {
    'fill-extrusion-color': buildingColor,
    'fill-extrusion-height': ['get', 'height'],
    'fill-extrusion-opacity': 0.7,
    'fill-extrusion-base': 0
  }
}
```

### Animated Features (Future Enhancement)

MapLibre supports property animations:

```typescript
// Pulsing water glow
map.setPaintProperty('water-glow', 'line-opacity', [
  'interpolate', ['linear'], ['zoom'],
  10, 0.3,
  12, ['get', 'pulse']  // Animated property
])

// Animate pulse property
let pulse = 0.3
setInterval(() => {
  pulse = 0.3 + Math.sin(Date.now() / 1000) * 0.3
  map.setPaintProperty('water-glow', 'line-opacity', pulse)
}, 50)
```

## Color Temperature & Mood

Each monthly theme has a different "temperature":

### Warm Themes (December-April)
- Reds, oranges, yellows
- Feel: Energetic, intense, urban heat
- Brightness: Slightly higher for warmth

### Cool Themes (June-October)
- Cyans, blues, purples
- Feel: Calm, nocturnal, digital
- Brightness: Slightly lower for depth

**Implementation:**

```typescript
const getThemeTemperature = (hue: number) => {
  // Warm: 0-90° (red, orange, yellow)
  // Cool: 180-270° (cyan, blue, purple)
  return hue < 90 || hue > 330 ? 'warm' : 'cool'
}

const adjustForTemperature = (color: string, temp: string) => {
  return temp === 'warm'
    ? chroma(color).brighten(0.1).hex()
    : chroma(color).darken(0.1).hex()
}
```

## Anti-Patterns to Avoid

❌ **Don't:**
- Use same saturation for all features (kills hierarchy)
- Use pure black backgrounds (too harsh, use dark gray)
- Make all roads the same width (loses scale context)
- Use high saturation for everything (visual fatigue)
- Ignore zoom levels (causes clutter)

✅ **Do:**
- Create brightness steps for hierarchy
- Use saturation to indicate importance
- Vary line widths with zoom
- Add subtle opacity variations
- Test readability at all zoom levels

## Implementation Checklist

For each monthly theme export:

- [ ] Perceptually uniform brightness steps (LAB color space)
- [ ] Feature-specific saturation levels
- [ ] Zoom-aware opacity/width interpolation
- [ ] Label contrast validation (WCAG 4.5:1)
- [ ] Halo sizing for readability
- [ ] 3D pitch-aware building extrusion
- [ ] Neon glow effects for water
- [ ] Temperature-adjusted brightness
- [ ] Layer ordering (back to front)
- [ ] Minimum/maximum zoom levels per feature type

## Testing Methodology

1. **Visual Hierarchy Test**: Can you identify road importance at a glance?
2. **Label Legibility Test**: Can you read city names at zoom 8?
3. **Zoom Consistency Test**: Does hierarchy hold from z0 to z18?
4. **Color Fatigue Test**: Can you look at the map for 10 minutes without strain?
5. **Thematic Coherence Test**: Does it "feel" like the monthly theme?

## Future Enhancements

### Terrain Integration
```typescript
// Hillshade layer for depth
{
  id: 'hillshade',
  type: 'hillshade',
  source: 'terrain',
  paint: {
    'hillshade-shadow-color': chroma(baseColor).darken(2).hex(),
    'hillshade-illumination-direction': 315
  }
}
```

### POI Icons with Theme Colors
```typescript
// Color POI icons dynamically
{
  id: 'poi-icons',
  paint: {
    'icon-color': baseColor,
    'icon-halo-color': bgColor,
    'icon-halo-width': 1
  }
}
```

### Adaptive Styles by Time of Day
```typescript
const hour = new Date().getHours()
const isDusk = hour >= 18 || hour <= 6

if (isDusk) {
  // Increase glow effects
  waterOpacity = 0.9
  glowBlur = 6
}
```

---

## Sources

- [More ways to make your maps go Dark Mode | Stamen](https://stamen.com/more-ways-to-make-your-maps-go-dark-mode/)
- [Introducing Positron & Dark Matter | Stamen](https://stamen.com/introducing-positron-dark-matter-new-basemap-styles-for-cartodb-d02172610baa/)
- [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/)
- [Chroma.js Documentation](https://gka.github.io/chroma.js/)
- WCAG 2.1 Contrast Guidelines

---

**Next Steps:**
1. Implement LAB-based brightness calculations in `maplibre.ts`
2. Add saturation mapping per feature type
3. Create zoom-aware opacity interpolation
4. Add contrast validation for labels
5. Implement neon glow water layers
6. Test all 12 monthly themes for readability
