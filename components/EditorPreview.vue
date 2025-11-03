<script setup lang="ts">
const { colors } = useTheme()

// Comprehensive editor UI with ALL elements visible
const tabItems = [
  { name: 'simulacrum.ts', active: true, modified: true },
  { name: 'neo.construct', active: false, modified: false },
  { name: 'metaverse.vue', active: false, modified: true }
]

const statusLineSegments = {
  left: [
    { text: ' NORMAL', bg: 'base', fg: 'bg' },
    { text: ' main', bg: 'success', fg: 'bg' },
    { text: ' ~/metaverse/core', bg: 'bg_alt', fg: 'fg' }
  ],
  right: [
    { text: 'TypeScript ', bg: 'bg_alt', fg: 'info' },
    { text: ' UTF-8', bg: 'bg_alt', fg: 'fg' },
    { text: ' 42:15', bg: 'bg_alt', fg: 'fg' },
    { text: ' 100%', bg: 'bg_alt', fg: 'comment' }
  ]
}

const popupMenuItems = [
  { label: 'simulateReality', kind: 'Function', selected: true },
  { label: 'SimulationError', kind: 'Class', selected: false },
  { label: 'simulate', kind: 'Keyword', selected: false },
  { label: 'SIMULATION_DEPTH', kind: 'Constant', selected: false }
]
</script>

<template>
  <div class="editor-preview" :style="{ background: colors.bg, color: colors.fg }">
    <!-- Tab Bar -->
    <div class="tab-bar" :style="{ background: colors.bg, borderBottom: `1px solid ${colors.bg_alt}` }">
      <div
        v-for="tab in tabItems"
        :key="tab.name"
        class="tab"
        :style="{
          background: tab.active ? colors.bg_alt : colors.bg,
          color: tab.active ? colors.fg : colors.comment,
          borderRight: `1px solid ${colors.bg_alt}`
        }"
      >
        <span>{{ tab.name }}</span>
        <span v-if="tab.modified" class="modified-dot" :style="{ color: colors.warning }">●</span>
      </div>
      <div class="tab-fill" :style="{ background: colors.bg }"></div>
    </div>

    <!-- Editor Content -->
    <div class="editor-content" :style="{ background: colors.bg }">
      <!-- Line numbers column -->
      <div class="line-numbers" :style="{ background: colors.bg, color: colors.comment }">
        <div class="line-number">38</div>
        <div class="line-number">39</div>
        <div class="line-number">40</div>
        <div class="line-number" :style="{ color: colors.base, fontWeight: 'bold' }">41</div>
        <div class="line-number">42</div>
        <div class="line-number">43</div>
        <div class="line-number">44</div>
        <div class="line-number">45</div>
      </div>

      <!-- Code with current line highlight -->
      <div class="code-lines">
        <div class="code-line">
          <span :style="{ color: colors.keyword }">function</span>
          <span :style="{ color: colors.function }"> simulateReality</span>
          <span :style="{ color: colors.punctuation }">(</span>
          <span :style="{ color: colors.parameter }">depth</span>
          <span :style="{ color: colors.operator }">:</span>
          <span :style="{ color: colors.type }"> number</span>
          <span :style="{ color: colors.punctuation }">)</span>
          <span :style="{ color: colors.punctuation }"> {</span>
        </div>
        <div class="code-line">
          <span :style="{ color: colors.keyword }">  if</span>
          <span :style="{ color: colors.punctuation }"> (</span>
          <span :style="{ color: colors.variable }">depth</span>
          <span :style="{ color: colors.operator }"> ></span>
          <span :style="{ color: colors.constant }"> SIMULATION_DEPTH</span>
          <span :style="{ color: colors.punctuation }">)</span>
          <span :style="{ color: colors.punctuation }"> {</span>
        </div>
        <div class="code-line">
          <span :style="{ color: colors.keyword }">    throw</span>
          <span :style="{ color: colors.keyword }"> new</span>
          <span :style="{ color: colors.type }"> SimulationError</span>
          <span :style="{ color: colors.punctuation }">(</span>
          <span :style="{ color: colors.string }">"Desert of the real"</span>
          <span :style="{ color: colors.punctuation }">)</span>
        </div>
        <!-- Current line with cursor -->
        <div class="code-line current-line" :style="{ background: colors.cursorline }">
          <span :style="{ color: colors.punctuation }">  }</span>
          <span class="cursor" :style="{ background: colors.cursor }"></span>
          <span :style="{ color: colors.comment }"> // The map ≠ territory</span>
        </div>
        <div class="code-line">
          <span :style="{ color: colors.keyword }">  return</span>
          <span :style="{ color: colors.variable }"> hyperreal</span>
          <span :style="{ color: colors.punctuation }">.</span>
          <span :style="{ color: colors.property }">construct</span>
          <span :style="{ color: colors.punctuation }">(</span>
          <span :style="{ color: colors.variable }">depth</span>
          <span :style="{ color: colors.punctuation }">)</span>
        </div>
        <div class="code-line">
          <span :style="{ color: colors.punctuation }">}</span>
        </div>
        <!-- Diagnostic error line -->
        <div class="code-line">
          <span :style="{ color: colors.comment }">// </span>
          <span class="error-underline" :style="{ color: colors.error, textDecoration: 'underline wavy' }">hyperreal</span>
          <span :style="{ color: colors.comment }"> is not defined</span>
        </div>
        <div class="code-line"></div>
      </div>

      <!-- Floating popup menu (autocomplete) -->
      <div
        class="popup-menu"
        :style="{
          background: colors.bg_alt,
          border: `1px solid ${colors.base}`,
          boxShadow: `0 4px 12px ${colors.bg}80`
        }"
      >
        <div
          v-for="item in popupMenuItems"
          :key="item.label"
          class="popup-item"
          :style="{
            background: item.selected ? colors.base : 'transparent',
            color: item.selected ? colors.bg : colors.fg
          }"
        >
          <span class="kind-badge" :style="{ color: item.selected ? colors.bg : colors.type }">
            {{ item.kind.slice(0, 1) }}
          </span>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- Status Line -->
    <div class="status-line" :style="{ background: colors.bg_alt, borderTop: `1px solid ${colors.bg_alt}` }">
      <div class="status-left">
        <span
          v-for="(seg, i) in statusLineSegments.left"
          :key="i"
          class="status-segment"
          :style="{
            background: colors[seg.bg as keyof typeof colors] as string,
            color: colors[seg.fg as keyof typeof colors] as string
          }"
        >
          {{ seg.text }}
        </span>
      </div>
      <div class="status-right">
        <span
          v-for="(seg, i) in statusLineSegments.right"
          :key="i"
          class="status-segment"
          :style="{
            background: colors[seg.bg as keyof typeof colors] as string,
            color: colors[seg.fg as keyof typeof colors] as string
          }"
        >
          {{ seg.text }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-preview {
  border: 1px solid #222;
  font-family: 'Monaspace Krypton', monospace;
  font-size: 9px;
  display: flex;
  flex-direction: column;
  height: 400px;
  position: relative;
}

.tab-bar {
  display: flex;
  height: 24px;
  overflow-x: auto;
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  font-size: 8px;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.1s;
}

.modified-dot {
  font-size: 6px;
}

.tab-fill {
  flex: 1;
}

.editor-content {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

.line-numbers {
  padding: 8px 8px 8px 12px;
  text-align: right;
  user-select: none;
  font-size: 8px;
  min-width: 40px;
}

.line-number {
  line-height: 1.6;
}

.code-lines {
  flex: 1;
  padding: 8px 12px;
  overflow-x: auto;
}

.code-line {
  line-height: 1.6;
  white-space: pre;
  position: relative;
}

.current-line {
  padding-left: 4px;
  margin-left: -4px;
  padding-right: 4px;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 14px;
  vertical-align: middle;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.error-underline {
  text-decoration-color: currentColor;
  text-decoration-thickness: 2px;
}

.popup-menu {
  position: absolute;
  top: 140px;
  left: 80px;
  min-width: 200px;
  border-radius: 4px;
  overflow: hidden;
  z-index: 10;
}

.popup-item {
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 8px;
  cursor: pointer;
}

.kind-badge {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  font-size: 7px;
  font-weight: bold;
  background: currentColor;
  color: inherit;
  opacity: 0.2;
}

.status-line {
  display: flex;
  justify-content: space-between;
  height: 20px;
  font-size: 8px;
  overflow: hidden;
}

.status-left,
.status-right {
  display: flex;
}

.status-segment {
  padding: 2px 8px;
  display: flex;
  align-items: center;
  font-weight: 500;
}
</style>
