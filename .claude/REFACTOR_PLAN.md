# Refactoring Plan: Quick Wins for Code Quality

**Priority:** Fix DOM manipulation + Add design tokens
**Effort Level:** Quick wins only
**Estimated Changes:** ~8 files

---

## 🎯 Goals

1. **Remove direct DOM manipulation** in showcase.vue (violates Vue reactivity)
2. **Create lightweight design token system** for opacity values and animations
3. **Add debouncing** to slider changes (performance quick win)

---

## 📋 Detailed Implementation Plan

### Phase 1: Design Tokens System (Foundation)

**Why first:** All other work depends on having consistent tokens

#### 1.1 Create Design Tokens File
**File:** `assets/css/tokens.css` (NEW)

**Content:**
```css
:root {
  /* Opacity scale (semantic) */
  --opacity-subtle: 0.05;
  --opacity-muted: 0.1;
  --opacity-hover: 0.15;
  --opacity-border: 0.3;
  --opacity-disabled: 0.5;
  --opacity-text-muted: 0.6;

  /* Hex opacity suffixes (for template literals) */
  /* These map to common alpha values */
  /* 0d = ~5%, 1a = ~10%, 33 = ~20%, 4d = ~30%, 80 = ~50%, b3 = ~70% */

  /* Animation timings */
  --timing-instant: 0.15s;
  --timing-fast: 0.2s;
  --timing-normal: 0.35s;
  --timing-slow: 0.5s;

  /* Spring animation curve */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);

  /* Border radius scale */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Spacing scale (if needed later) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
}
```

**Changes:**
- Create new tokens file
- Import in `assets/css/main.css`: `@import './tokens.css';`

**Testing:**
- Verify tokens load in browser DevTools
- Check CSS cascade order

---

### Phase 2: Fix DOM Manipulation in showcase.vue

**Why critical:** Bypasses Vue reactivity, breaks SSR, hard to test

#### 2.1 Current Problem (lines 266-267)
```vue
<!-- BAD: Direct DOM manipulation -->
@mouseenter="(e) => { e.currentTarget.style.backgroundColor = `${colors.fg}1a`; ... }"
@mouseleave="(e) => { e.currentTarget.style.backgroundColor = `${colors.fg}0d`; ... }"
```

#### 2.2 Solution: Reactive Hover State

**File:** `pages/showcase.vue`

**Changes:**

1. Add reactive hover tracking:
```typescript
// In <script setup>
const hoveredPrinciple = ref<string | null>(null)

function setHovered(title: string | null) {
  hoveredPrinciple.value = title
}
```

2. Replace event handlers:
```vue
<!-- Before -->
@mouseenter="(e) => { e.currentTarget.style.backgroundColor = ... }"
@mouseleave="(e) => { e.currentTarget.style.backgroundColor = ... }"

<!-- After -->
@mouseenter="setHovered(principle.title)"
@mouseleave="setHovered(null)"
:class="{ 'principle-hovered': hoveredPrinciple === principle.title }"
```

3. Add computed styles:
```vue
:style="{
  backgroundColor: hoveredPrinciple === principle.title
    ? `${colors.fg}1a`
    : `${colors.fg}0d`,
  borderColor: hoveredPrinciple === principle.title
    ? `${colors.fg}33`
    : `${colors.fg}1a`,
}"
```

**Alternative approach** (CSS-only, even better):
```vue
<!-- Template -->
<div
  class="principle-card"
  :style="{
    '--fg-color': colors.fg,
    '--bg-base': `${colors.fg}0d`,
    '--bg-hover': `${colors.fg}1a`,
    '--border-base': `${colors.fg}1a`,
    '--border-hover': `${colors.fg}33`,
  }"
>
```

```css
<!-- Add to scoped style -->
.principle-card {
  background-color: var(--bg-base);
  border-color: var(--border-base);
  transition: all var(--timing-normal) var(--ease-spring);
}

.principle-card:hover {
  background-color: var(--bg-hover);
  border-color: var(--border-hover);
}
```

**Recommended:** CSS-only approach (simpler, more performant)

**Files changed:** `pages/showcase.vue`

**Testing:**
- Hover over principle cards
- Verify smooth transitions
- Check no console errors

---

### Phase 3: Add Slider Debouncing (Performance Win)

**Why:** Firing 60 updates/second during drag is wasteful

#### 3.1 Add Debounced Emit to BaseSlider

**File:** `components/BaseSlider.vue`

**Changes:**

1. Import from VueUse:
```typescript
import { useDebounceFn } from '@vueuse/core'
```

2. Create debounced emitter:
```typescript
// Debounce emits during drag (fires max once per 16ms = ~60fps)
const debouncedEmit = useDebounceFn((value: number) => {
  emit('update:modelValue', value)
}, 16)

// Immediate emit on release
function handleInput(e: Event) {
  const value = Number((e.target as HTMLInputElement).value)
  if (isDragging.value) {
    debouncedEmit(value)
  } else {
    emit('update:modelValue', value)
  }
}

function handleMouseDown() {
  isDragging.value = true
}

function handleMouseUp() {
  isDragging.value = false
  // Emit final value immediately on release
  emit('update:modelValue', props.modelValue)
}
```

3. Update template:
```vue
<input
  type="range"
  @input="handleInput"
  @mousedown="handleMouseDown"
  @mouseup="handleMouseUp"
  @touchstart="handleMouseDown"
  @touchend="handleMouseUp"
  ...
/>
```

**Files changed:** `components/BaseSlider.vue`

**Testing:**
- Drag slider rapidly
- Verify smooth updates without lag
- Check final value is accurate on release

---

### Phase 4: Update BaseSlider to Use Design Tokens

**File:** `components/BaseSlider.vue` (style section)

**Changes:**

Replace hardcoded values with tokens:

```css
/* Before */
transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
border-radius: 12px;
background: rgba(255, 255, 255, 0.1);

/* After */
transition: all var(--timing-normal) var(--ease-spring);
border-radius: var(--radius-md);
background: rgba(255, 255, 255, var(--opacity-muted));
```

**Specific replacements:**
- `0.35s` → `var(--timing-normal)`
- `cubic-bezier(0.34, 1.56, 0.64, 1)` → `var(--ease-spring)`
- `12px` → `var(--radius-md)`
- `16px` → `var(--radius-lg)`
- Opacity values → use CSS variables where possible

**Files changed:** `components/BaseSlider.vue`

**Testing:**
- Visual regression check
- Verify animations still smooth
- Check responsive behavior

---

### Phase 5: Create Opacity Helper Composable (Optional Enhancement)

**Why:** Centralize hex opacity logic

**File:** `composables/useOpacity.ts` (NEW - OPTIONAL)

**Content:**
```typescript
/**
 * Centralized opacity scale using hex suffixes
 * Maps semantic names to hex alpha values
 */
export const OPACITY = {
  SUBTLE: '0d',    // ~5%
  MUTED: '1a',     // ~10%
  BORDER: '33',    // ~20%
  MEDIUM: '4d',    // ~30%
  HALF: '80',      // ~50%
  TEXT: 'b3',      // ~70%
  FULL: 'ff',      // 100%
} as const

/**
 * Helper to create color with opacity
 */
export function withOpacity(color: string, opacity: keyof typeof OPACITY): string {
  return `${color}${OPACITY[opacity]}`
}

// Usage example:
// withOpacity(colors.fg, 'MUTED') // returns '#e0e0e01a'
```

**Usage in showcase.vue:**
```typescript
// Before
backgroundColor: `${colors.fg}0d`

// After
import { withOpacity, OPACITY } from '~/composables/useOpacity'
backgroundColor: withOpacity(colors.fg, 'SUBTLE')

// Or directly
backgroundColor: `${colors.fg}${OPACITY.SUBTLE}`
```

**Files changed:**
- Create `composables/useOpacity.ts`
- Update `pages/showcase.vue` (if adopted)

**Note:** This is OPTIONAL - only add if user wants more type safety for opacity values

---

## 📊 Summary of Changes

### Files Modified (Required):
1. **`assets/css/tokens.css`** - NEW - Design tokens
2. **`assets/css/main.css`** - Add tokens import
3. **`pages/showcase.vue`** - Remove DOM manipulation, use CSS hover
4. **`components/BaseSlider.vue`** - Add debouncing + use design tokens

### Files Modified (Optional):
5. **`composables/useOpacity.ts`** - NEW - Opacity helper (if desired)

### Total Estimated Changes:
- **4-5 files** (4 required, 1 optional)
- **~200 lines changed** (mostly CSS replacements)
- **0 breaking changes**
- **0 new dependencies** (using existing @vueuse/core)

---

## ✅ Testing Checklist

### Functionality
- [ ] Showcase page loads without errors
- [ ] Hover states work on principle cards
- [ ] Sliders emit updates smoothly during drag
- [ ] Final slider value is accurate on release
- [ ] No console errors in browser
- [ ] No HMR errors during development

### Visual Regression
- [ ] Animations still feel smooth
- [ ] Border radius unchanged
- [ ] Opacity values look identical
- [ ] Hover states identical to before

### Performance
- [ ] No jank during slider drag
- [ ] Reduced update frequency verified (DevTools Performance)
- [ ] Page load time unchanged

---

## 🚫 Out of Scope (For Future Work)

These are **NOT** included in this quick wins plan:

1. **Full accessibility audit** - Skip for now
   - ARIA labels, keyboard nav, screen reader support
   - Would add ~50 more lines across components

2. **Component unit tests** - Skip for now
   - Would need 5+ test files
   - ~500+ lines of test code

3. **Error boundaries** - Skip for now
   - Low ROI for current app stability

4. **Full design token migration** - Partial only
   - Only migrating animations + opacity
   - Skipping colors, spacing in most places

5. **Type safety improvements** - Skip for now
   - State machine for mode
   - Discriminated unions

6. **Performance monitoring** - Skip for now
   - Bundle size tracking
   - Lighthouse CI

---

## 🎓 Architecture Decisions

### Why CSS-only hover instead of reactive state?
- **Simpler:** No extra state management
- **Faster:** Browser-native, no JS overhead
- **SSR-safe:** Works without hydration
- **Standard:** Matches CSS best practices

### Why 16ms debounce?
- **Matches 60fps:** 1000ms / 60fps ≈ 16.67ms
- **Imperceptible:** Feels instant to users
- **Big savings:** Reduces updates from ~1000/sec to ~60/sec during drag

### Why CSS custom properties instead of JS constants?
- **Dynamic:** Can change via media queries
- **Inspectable:** Visible in DevTools
- **Standard:** CSS-first approach
- **Theme-able:** Easy to override per-component

### Why hex opacity suffixes instead of rgba()?
- **Existing pattern:** Already used throughout codebase (`${colors.fg}1a`)
- **Smaller:** Less template literal overhead
- **Compatible:** Works with any color format

---

## 📈 Impact Analysis

### Before:
❌ Direct DOM manipulation (anti-pattern)
❌ 1000+ slider updates/second
❌ Hardcoded magic values everywhere
❌ Difficult to maintain consistency

### After:
✅ Vue-reactive hover states
✅ ~60 slider updates/second (16x reduction)
✅ Centralized design tokens
✅ Easy to maintain + extend

### Risk Assessment:
- **Low risk:** No breaking changes
- **High value:** Fixes critical anti-pattern
- **Quick turnaround:** ~2-3 hours implementation
- **Easy rollback:** Changes are isolated

---

## 🚀 Implementation Order

**Recommended sequence:**

1. **Create tokens.css** (10 min)
   - Easiest first, everything else depends on it

2. **Fix showcase.vue hover** (15 min)
   - Highest priority, critical bug fix

3. **Add slider debouncing** (20 min)
   - Second priority, clear performance win

4. **Migrate BaseSlider to tokens** (30 min)
   - Demonstrates token system value

5. **(Optional) Create opacity helper** (15 min)
   - Nice-to-have, not critical

**Total time estimate:** ~1.5 hours (without optional) or ~2 hours (with optional)

---

## 💭 Notes for Implementation

### Common Pitfalls to Avoid:

1. **Don't over-engineer tokens**
   - Start small (opacity + timing only)
   - Add more as needed, not speculatively

2. **Test hover states carefully**
   - Easy to break with CSS specificity issues
   - Check both dark and light modes

3. **Debouncing edge cases**
   - Always emit final value on mouseup/touchend
   - Handle cancelled drags (mouseout)

4. **CSS variable fallbacks**
   - Not needed for modern browsers
   - All targets support CSS custom properties

### Browser Compatibility:
- CSS custom properties: ✅ All modern browsers
- VueUse debounce: ✅ Already using @vueuse/core
- CSS :hover: ✅ Universal support
- No new compatibility concerns

---

**Plan Status:** Ready for approval
**Next Step:** User reviews and approves plan, then implementation begins
