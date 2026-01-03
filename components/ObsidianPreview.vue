<script setup lang="ts">
const { colors } = useTheme()

const documents = [
  { name: 'README.md', icon: '📝' },
  { name: 'Daily Notes', icon: '📅' },
  { name: 'Projects', icon: '🎯' },
]
</script>

<template>
  <div class="obsidian-wrapper" :style="{ background: colors.bg, color: colors.fg }">
    <!-- Header Bar -->
    <div class="obsidian-header" :style="{ background: colors.bg_alt, borderBottom: `1px solid ${colors.comment}30` }">
      <span class="header-icon">🔍</span>
      <span>Obsidian Vault</span>
      <span class="header-right">Edit • Preview</span>
    </div>

    <!-- Main Content -->
    <div class="obsidian-main">
      <!-- Left Sidebar -->
      <div class="sidebar-left" :style="{ background: colors.bg_alt, borderRight: `1px solid ${colors.comment}30` }">
        <div class="sidebar-title" :style="{ color: colors.comment }">Files</div>
        <div class="file-list">
          <div
            v-for="(doc, i) in documents"
            :key="i"
            class="file-item"
            :style="{
              background: i === 0 ? colors.base + '15' : 'transparent',
              color: i === 0 ? colors.base : colors.fg,
            }"
          >
            {{ doc.icon }} {{ doc.name }}
          </div>
        </div>
      </div>

      <!-- Editor -->
      <div class="editor">
        <div class="markdown-preview">
          <h1 :style="{ color: colors.keyword }">Welcome to Obsidian</h1>
          <p>This is a <strong :style="{ fontWeight: 'bold' }">themed</strong> preview of your colors in action.</p>

          <h2 :style="{ color: colors.keyword }">Code Example</h2>
          <div class="code-block" :style="{ background: colors.base + '08', borderLeft: `3px solid ${colors.base}` }">
            <div :style="{ color: colors.comment }">// Your theme applied</div>
            <div>
              <span :style="{ color: colors.keyword }">const</span>
              <span> theme = {</span>
            </div>
            <div class="code-indent">
              <span :style="{ color: colors.variable }">accent</span>
              <span>: </span>
              <span :style="{ color: colors.string }">{{ '"vulpes"' }}</span>
            </div>
            <div>}</div>
          </div>

          <h3 :style="{ color: colors.keyword }">Features</h3>
          <ul>
            <li><span :style="{ color: colors.base }">✓</span> Syntax highlighting</li>
            <li><span :style="{ color: colors.error }">✗</span> Error states</li>
            <li><span :style="{ color: colors.warning }">⚠</span> Warnings</li>
          </ul>

          <div class="blockquote" :style="{ color: colors.comment, borderLeft: `3px solid ${colors.comment}60` }">
            Blockquotes use muted colors for visual hierarchy
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="sidebar-right" :style="{ background: colors.bg_alt, borderLeft: `1px solid ${colors.comment}30` }">
        <div class="sidebar-title" :style="{ color: colors.comment }">Info</div>
        <div class="properties">
          <div class="property">
            <div class="prop-label" :style="{ color: colors.comment }">Type</div>
            <div>Markdown Note</div>
          </div>
          <div class="property">
            <div class="prop-label" :style="{ color: colors.comment }">Tags</div>
            <div>
              <span class="tag" :style="{ background: colors.base + '20', color: colors.base }">
                #design
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="obsidian-footer" :style="{ background: colors.bg_alt, borderTop: `1px solid ${colors.comment}30`, color: colors.comment }">
      <span>✓ Vault ready</span>
      <span class="footer-right">README.md</span>
    </div>
  </div>
</template>

<style scoped>
.obsidian-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 600px;
  border: 1px solid;
  border-radius: 4px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
  font-size: 11px;
  line-height: 1.5;
}

.obsidian-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.header-icon {
  font-size: 14px;
}

.header-right {
  margin-left: auto;
  font-size: 10px;
  opacity: 0.6;
}

.obsidian-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar-left,
.sidebar-right {
  width: 160px;
  padding: 8px 0;
  overflow-y: auto;
  flex-shrink: 0;
  font-size: 11px;
}

.sidebar-title {
  padding: 6px 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.file-list {
  padding: 0 4px;
}

.file-item {
  padding: 4px 8px;
  margin: 2px 4px;
  border-radius: 2px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s;
}

.file-item:hover {
  opacity: 0.8;
}

.editor {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.markdown-preview h1,
.markdown-preview h2,
.markdown-preview h3 {
  margin: 12px 0 6px 0;
  font-weight: 700;
}

.markdown-preview h1 {
  font-size: 24px;
}

.markdown-preview h2 {
  font-size: 18px;
}

.markdown-preview h3 {
  font-size: 14px;
}

.markdown-preview p {
  margin: 8px 0;
  font-size: 12px;
}

.markdown-preview ul {
  list-style: none;
  padding-left: 12px;
  margin: 8px 0;
}

.markdown-preview li {
  margin: 4px 0;
  font-size: 12px;
}

.markdown-preview strong {
  font-weight: 600;
}

.code-block {
  padding: 12px;
  border-radius: 3px;
  font-family: 'Monaspace Krypton', monospace;
  font-size: 11px;
  line-height: 1.4;
  overflow-x: auto;
  white-space: pre;
  margin: 8px 0;
}

.code-indent {
  padding-left: 20px;
}

.blockquote {
  padding: 12px;
  border-radius: 2px;
  font-style: italic;
  opacity: 0.85;
  margin: 12px 0;
}

.properties {
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.property {
  padding: 6px 8px;
  font-size: 10px;
}

.prop-label {
  text-transform: uppercase;
  font-size: 9px;
  letter-spacing: 0.4px;
  margin-bottom: 2px;
}

.tag {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 10px;
  white-space: nowrap;
}

.obsidian-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  font-size: 10px;
  flex-shrink: 0;
}

.footer-right {
  margin-left: auto;
}
</style>
