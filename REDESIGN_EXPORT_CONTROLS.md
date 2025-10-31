# Export Controls Redesign

## Template Section (Replace lines 729-812 in pages/index.vue)

```vue
<div class="actions" :style="{ borderTopColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }">
  <!-- Section 1: Export Configuration -->
  <div class="export-config">
    <h3 class="config-heading" :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)' }">
      Export Configuration
    </h3>

    <!-- Format selection with better touch targets -->
    <div class="format-selection">
      <label
        v-for="format in [
          { id: 'ghostty', label: 'Ghostty' },
          { id: 'iterm', label: 'iTerm2' },
          { id: 'tmux', label: 'Tmux' },
          { id: 'neovim', label: 'Neovim' },
          { id: 'lazygit', label: 'Lazygit' }
        ]"
        :key="format.id"
        class="format-option"
        :class="{ selected: exportFormats.includes(format.id) }"
        :style="{
          background: exportFormats.includes(format.id)
            ? (state.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)')
            : 'transparent',
          borderColor: exportFormats.includes(format.id)
            ? (state.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)')
            : (state.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'),
          color: state.mode === 'dark' ? '#fff' : '#000'
        }"
      >
        <input
          type="checkbox"
          v-model="exportFormats"
          :value="format.id"
          class="format-checkbox-input"
        />
        <span class="format-label">{{ format.label }}</span>
        <span
          v-if="exportFormats.includes(format.id)"
          class="check-indicator"
          :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)' }"
        >✓</span>
      </label>
    </div>

    <!-- Quick select action -->
    <button
      @click="selectAllFormats"
      class="quick-action-btn"
      :style="{
        borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
        color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
      }"
      title="Select all export formats"
    >
      Select All Formats
    </button>
  </div>

  <!-- Section 2: Primary Actions (most important - biggest buttons) -->
  <div class="primary-actions">
    <h3 class="action-heading" :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }">
      Export Themes
    </h3>

    <!-- Primary action: Export both (most common use case) -->
    <button
      @click="exportBoth"
      class="btn-export-primary"
      :style="{
        background: state.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(100, 150, 255, 0.25), rgba(150, 100, 255, 0.25))'
          : 'linear-gradient(135deg, rgba(100, 150, 255, 0.15), rgba(150, 100, 255, 0.15))',
        borderColor: state.mode === 'dark' ? 'rgba(150, 150, 255, 0.5)' : 'rgba(100, 100, 200, 0.5)',
        color: state.mode === 'dark' ? '#fff' : '#000',
        boxShadow: state.mode === 'dark'
          ? '0 4px 12px rgba(100, 150, 255, 0.15)'
          : '0 4px 12px rgba(100, 150, 255, 0.1)'
      }"
      title="Download both dark and light theme files for all selected formats"
    >
      <span class="btn-icon">⬇</span>
      <span class="btn-text">Download Both Themes</span>
    </button>

    <!-- Secondary download actions in a grid -->
    <div class="secondary-actions-grid">
      <button
        @click="exportDark"
        class="btn-export-secondary"
        :style="{
          borderColor: state.mode === 'dark' ? 'rgba(100, 150, 255, 0.4)' : 'rgba(100, 150, 255, 0.3)',
          color: state.mode === 'dark' ? 'rgba(150, 180, 255, 1)' : 'rgba(80, 120, 200, 1)'
        }"
        title="Download dark theme only"
      >
        <span class="theme-indicator dark-indicator">●</span>
        Dark Only
      </button>
      <button
        @click="exportLight"
        class="btn-export-secondary"
        :style="{
          borderColor: state.mode === 'dark' ? 'rgba(255, 200, 100, 0.4)' : 'rgba(255, 200, 100, 0.3)',
          color: state.mode === 'dark' ? 'rgba(255, 220, 120, 1)' : 'rgba(200, 160, 60, 1)'
        }"
        title="Download light theme only"
      >
        <span class="theme-indicator light-indicator">●</span>
        Light Only
      </button>
    </div>
  </div>

  <!-- Section 3: Quick Copy Actions -->
  <div class="copy-actions">
    <h3 class="action-heading" :style="{ color: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }">
      Copy to Clipboard
    </h3>

    <div class="copy-grid">
      <button
        @click="copyDark"
        class="btn-copy"
        :style="{
          borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
          color: state.mode === 'dark' ? '#fff' : '#000'
        }"
        title="Copy dark theme config to clipboard (first selected format)"
      >
        <span class="theme-indicator dark-indicator">●</span>
        Copy Dark
      </button>
      <button
        @click="copyLight"
        class="btn-copy"
        :style="{
          borderColor: state.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
          color: state.mode === 'dark' ? '#fff' : '#000'
        }"
        title="Copy light theme config to clipboard (first selected format)"
      >
        <span class="theme-indicator light-indicator">●</span>
        Copy Light
      </button>
    </div>
  </div>

  <!-- Section 4: Danger Zone -->
  <div class="danger-zone">
    <button
      @click="resetAll"
      class="btn-reset"
      :style="{
        borderColor: state.mode === 'dark' ? 'rgba(255, 80, 80, 0.4)' : 'rgba(200, 60, 60, 0.4)',
        color: state.mode === 'dark' ? 'rgba(255, 120, 120, 1)' : 'rgba(200, 60, 60, 1)'
      }"
      title="Reset all theme values to defaults"
    >
      ↺ Reset All Values
    </button>
  </div>
</div>
```

## Styles Section (Replace/update in the <style> section)

```css
/* ===== EXPORT CONTROLS REDESIGN ===== */

.actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid currentColor;
  border-opacity: 0.1;
}

/* Section headings */
.config-heading {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0 0 12px 0;
  color: rgba(255, 255, 255, 0.9);
}

.action-heading {
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 0 0 10px 0;
  color: rgba(255, 255, 255, 0.6);
}

/* ===== SECTION 1: Export Configuration ===== */
.export-config {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.format-selection {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.format-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-height: 44px; /* Mobile-friendly touch target */
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.format-option:hover {
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(2px);
}

.format-option.selected {
  border-width: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.format-checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.format-label {
  flex: 1;
  user-select: none;
}

.check-indicator {
  font-size: 14px;
  font-weight: bold;
  opacity: 0.9;
  margin-left: auto;
}

.quick-action-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.7);
  padding: 10px 14px;
  font-family: inherit;
  font-size: 9px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
  min-height: 40px;
}

.quick-action-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
}

/* ===== SECTION 2: Primary Actions ===== */
.primary-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-export-primary {
  background: linear-gradient(135deg, rgba(100, 150, 255, 0.25), rgba(150, 100, 255, 0.25));
  border: 2px solid rgba(150, 150, 255, 0.5);
  color: #fff;
  padding: 16px 20px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 8px;
  min-height: 52px; /* Larger for primary action */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(100, 150, 255, 0.15);
}

.btn-export-primary:hover {
  background: linear-gradient(135deg, rgba(120, 170, 255, 0.35), rgba(170, 120, 255, 0.35));
  border-color: rgba(170, 170, 255, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(100, 150, 255, 0.25);
}

.btn-export-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(100, 150, 255, 0.2);
}

.btn-icon {
  font-size: 16px;
  opacity: 0.9;
}

.btn-text {
  font-size: 11px;
}

.secondary-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.btn-export-secondary {
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 12px 16px;
  font-family: inherit;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 6px;
  min-height: 46px; /* Good touch target */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-export-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-width: 2px;
  transform: translateY(-1px);
}

.btn-export-secondary:active {
  transform: translateY(0);
}

/* ===== SECTION 3: Copy Actions ===== */
.copy-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.copy-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.btn-copy {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  padding: 10px 14px;
  font-family: inherit;
  font-size: 9px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 5px;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-copy:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

/* ===== SECTION 4: Danger Zone ===== */
.danger-zone {
  padding-top: 8px;
  border-top: 1px solid rgba(255, 80, 80, 0.2);
}

.btn-reset {
  background: transparent;
  border: 1px solid rgba(255, 80, 80, 0.4);
  color: rgba(255, 120, 120, 1);
  padding: 10px 16px;
  font-family: inherit;
  font-size: 9px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 5px;
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-reset:hover {
  background: rgba(255, 80, 80, 0.1);
  border-color: rgba(255, 80, 80, 0.6);
  color: rgba(255, 140, 140, 1);
}

/* ===== Theme Indicators ===== */
.theme-indicator {
  font-size: 10px;
  opacity: 0.8;
}

.dark-indicator {
  filter: brightness(0.7);
}

.light-indicator {
  filter: brightness(1.3);
}

/* ===== Remove old styles (delete these) ===== */
/* Remove: .export-section, .section-label, .format-checkboxes, .format-checkbox,
   .btn-select-all (old version), .button-grid, .btn (generic), .btn-primary, .btn-secondary,
   .btn-reset (old version if different) */
```

## Key Improvements:

### 1. **Information Hierarchy** (Visual Weight)
- **Primary action (Download Both)**: 52px tall, gradient background, largest text, icon
- **Secondary actions**: 46px tall, bordered style, medium prominence
- **Tertiary actions (copy)**: 42px tall, subtle borders, smaller text
- **Danger action (reset)**: Separated, red-tinted, bottom of panel

### 2. **Touch-Friendly Sizing**
- All interactive elements **minimum 40px tall** (mobile-friendly)
- Format options: **44px minimum height** (Apple's recommended minimum)
- Primary button: **52px** (easy to tap, signals importance)
- Adequate spacing between elements (8-12px gaps)

### 3. **Logical Grouping**
- **Step 1**: Configure (select formats)
- **Step 2**: Export (download themes)
- **Step 3**: Quick copy (for testing)
- **Step 4**: Reset (danger zone at bottom)

### 4. **Better Scanability**
- Clear section headings with visual hierarchy
- Format checkboxes redesigned as card-style buttons (easier to scan/tap)
- Visual indicators (● symbols) for dark/light modes
- Color coding: blue for primary, red for danger
- Less visual noise (removed excessive borders)

### 5. **Visual Polish**
- Smooth transitions (cubic-bezier easing)
- Subtle hover states with transforms
- Card-style format selection (modern, scannable)
- Gradient on primary button (draws eye to main action)
- Consistent border radius throughout

