<script setup lang="ts">
const { colors } = useTheme()

// ANSI colors demo
const ansiColors = Array.from({ length: 16 }, (_, i) => ({
  index: i,
  name: [
    'Black',
    'Red',
    'Green',
    'Yellow',
    'Blue',
    'Magenta',
    'Cyan',
    'White',
    'Bright Black',
    'Bright Red',
    'Bright Green',
    'Bright Yellow',
    'Bright Blue',
    'Bright Magenta',
    'Bright Cyan',
    'Bright White',
  ][i],
}))
</script>

<template>
  <div
    class="color-ref"
    :style="{ background: colors.bg, color: colors.fg, borderColor: colors.base }"
  >
    <!-- Header -->
    <div
      class="header"
      :style="{
        background: colors.base + '15',
        borderBottom: `1px solid ${colors.base}`,
        color: colors.base,
      }"
    >
      <span style="font-weight: bold; font-size: 10px">COLOR PALETTE</span>
      <span :style="{ marginLeft: 'auto', fontSize: '8px', color: colors.hint }"
        >45 semantic colors • 16 ANSI</span
      >
    </div>

    <div class="content">
      <!-- Base colors -->
      <div class="color-section">
        <div class="section-label" :style="{ color: colors.keyword }">Base (4)</div>
        <div class="color-grid">
          <div class="color-item" :style="{ background: colors.bg }">
            <span :style="{ color: colors.fg }">bg</span>
          </div>
          <div class="color-item" :style="{ background: colors.bg_alt }">
            <span :style="{ color: colors.fg }">bg_alt</span>
          </div>
          <div class="color-item" :style="{ background: colors.fg, border: `1px solid ${colors.bg}` }">
            <span :style="{ color: colors.bg }">fg</span>
          </div>
          <div class="color-item" :style="{ background: colors.base, border: `1px solid ${colors.base}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">base</span>
          </div>
        </div>
      </div>

      <!-- Status colors -->
      <div class="color-section">
        <div class="section-label" :style="{ color: colors.keyword }">Status (5)</div>
        <div class="color-grid">
          <div class="color-item" :style="{ background: colors.error, border: `1px solid ${colors.error}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">error</span>
          </div>
          <div class="color-item" :style="{ background: colors.warning, border: `1px solid ${colors.warning}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">warning</span>
          </div>
          <div class="color-item" :style="{ background: colors.success, border: `1px solid ${colors.success}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">success</span>
          </div>
          <div class="color-item" :style="{ background: colors.info, border: `1px solid ${colors.info}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">info</span>
          </div>
          <div class="color-item" :style="{ background: colors.hint, border: `1px solid ${colors.hint}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">hint</span>
          </div>
        </div>
      </div>

      <!-- Syntax colors - Part 1 -->
      <div class="color-section">
        <div class="section-label" :style="{ color: colors.keyword }">Syntax 1/2 (9)</div>
        <div class="color-grid">
          <div class="color-item" :style="{ background: colors.comment, border: `1px solid ${colors.comment}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">comment</span>
          </div>
          <div class="color-item" :style="{ background: colors.keyword, border: `1px solid ${colors.keyword}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">keyword</span>
          </div>
          <div class="color-item" :style="{ background: colors.string, border: `1px solid ${colors.string}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">string</span>
          </div>
          <div class="color-item" :style="{ background: colors.number, border: `1px solid ${colors.number}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">number</span>
          </div>
          <div class="color-item" :style="{ background: colors.boolean, border: `1px solid ${colors.boolean}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">boolean</span>
          </div>
          <div class="color-item" :style="{ background: colors.function, border: `1px solid ${colors.function}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">function</span>
          </div>
          <div class="color-item" :style="{ background: colors.constant, border: `1px solid ${colors.constant}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">constant</span>
          </div>
          <div class="color-item" :style="{ background: colors.type, border: `1px solid ${colors.type}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">type</span>
          </div>
          <div class="color-item" :style="{ background: colors.variable, border: `1px solid ${colors.variable}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">variable</span>
          </div>
        </div>
      </div>

      <!-- Syntax colors - Part 2 -->
      <div class="color-section">
        <div class="section-label" :style="{ color: colors.keyword }">Syntax 2/2 (8)</div>
        <div class="color-grid">
          <div class="color-item" :style="{ background: colors.operator, border: `1px solid ${colors.operator}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">operator</span>
          </div>
          <div class="color-item" :style="{ background: colors.builtin, border: `1px solid ${colors.builtin}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">builtin</span>
          </div>
          <div class="color-item" :style="{ background: colors.parameter, border: `1px solid ${colors.parameter}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">parameter</span>
          </div>
          <div class="color-item" :style="{ background: colors.property, border: `1px solid ${colors.property}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">property</span>
          </div>
          <div class="color-item" :style="{ background: colors.namespace, border: `1px solid ${colors.namespace}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">namespace</span>
          </div>
          <div class="color-item" :style="{ background: colors.macro, border: `1px solid ${colors.macro}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">macro</span>
          </div>
          <div class="color-item" :style="{ background: colors.tag, border: `1px solid ${colors.tag}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">tag</span>
          </div>
          <div class="color-item" :style="{ background: colors.punctuation, border: `1px solid ${colors.punctuation}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">punctuation</span>
          </div>
          <div class="color-item" :style="{ background: colors.heading, border: `1px solid ${colors.heading}` }">
            <span :style="{ color: colors.fg, fontWeight: 'bold' }">heading</span>
          </div>
        </div>
      </div>

      <!-- UI colors -->
      <div class="color-section">
        <div class="section-label" :style="{ color: colors.keyword }">UI (3)</div>
        <div class="ui-demo">
          <div class="demo-line" :style="{ background: colors.cursorline }">
            <span :style="{ background: colors.cursor, color: colors.bg, padding: '0 2px' }"
              >█</span
            >
            <span :style="{ color: colors.fg }"> Current line with cursor</span>
            <span :style="{ marginLeft: '8px', color: colors.comment, fontSize: '8px' }"
              >cursorline + cursor</span
            >
          </div>
          <div class="demo-line">
            <span :style="{ background: colors.selection, color: colors.fg, padding: '0 4px' }"
              >Selected text</span
            >
            <span :style="{ marginLeft: '8px', color: colors.comment, fontSize: '8px' }"
              >selection</span
            >
          </div>
        </div>
      </div>

      <!-- ANSI colors -->
      <div class="color-section">
        <div class="section-label" :style="{ color: colors.keyword }">ANSI Palette (16)</div>
        <div class="ansi-grid">
          <div
            v-for="ansi in ansiColors"
            :key="ansi.index"
            class="ansi-item"
            :style="{
              background: colors.palette[ansi.index],
              color: ansi.index < 8 && ansi.index !== 3 && ansi.index !== 6 ? '#ffffff' : '#000000',
            }"
          >
            <span style="font-weight: bold">{{ ansi.index }}</span>
            <span style="font-size: 7px">{{ ansi.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div
      class="footer"
      :style="{
        background: colors.bg,
        borderTop: `1px solid ${colors.comment}30`,
        color: colors.comment,
      }"
    >
      <span>The map is not the territory</span>
      <span :style="{ marginLeft: 'auto', color: colors.base }">✓ 45/45 jacked in</span>
    </div>
  </div>
</template>

<style scoped>
.color-ref {
  border: 1px solid;
  font-family: 'Monaspace Krypton', monospace;
  font-size: 9px;
  display: flex;
  flex-direction: column;
  min-height: 500px;
  max-height: 700px;
}

.header {
  display: flex;
  padding: 4px 6px;
  align-items: center;
  flex-shrink: 0;
}

.content {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.color-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-label {
  font-size: 9px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 4px;
}

.color-item {
  padding: 8px 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 7px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ui-demo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-line {
  padding: 6px;
  font-size: 9px;
  display: flex;
  align-items: center;
}

.ansi-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
}

.ansi-item {
  padding: 8px 4px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.footer {
  display: flex;
  gap: 12px;
  padding: 6px 12px;
  font-size: 8px;
  align-items: center;
}
</style>
