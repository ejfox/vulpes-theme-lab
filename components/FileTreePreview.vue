<script setup lang="ts">
const { colors } = useTheme()

const fileTree = [
  { name: '.matrix', type: 'folder', level: 0, expanded: true },
  { name: 'agents', type: 'folder', level: 1, expanded: true },
  { name: 'smith.yml', type: 'file', level: 2, modified: false },
  { name: 'sentinels.yml', type: 'file', level: 2, modified: false },
  { name: 'avatar', type: 'folder', level: 0, expanded: true },
  { name: 'neo.construct', type: 'file', level: 1, modified: true },
  { name: 'trinity.construct', type: 'file', level: 1, modified: true },
  { name: 'morpheus.vue', type: 'file', level: 1, modified: false },
  { name: 'hiro-protagonist.vue', type: 'file', level: 1, modified: true, untracked: true },
  { name: 'oracle.vue', type: 'file', level: 1, modified: false },
  { name: 'core', type: 'folder', level: 0, expanded: true },
  { name: 'simulacrum.ts', type: 'file', level: 1, modified: true },
  { name: 'street', type: 'folder', level: 0, expanded: true },
  { name: 'metaverse.vue', type: 'file', level: 1, modified: true },
  { name: 'hyperreal', type: 'folder', level: 0, expanded: true },
  { name: 'baudrillard.ts', type: 'file', level: 1, modified: false },
  { name: 'desert-of-real.ts', type: 'file', level: 1, modified: true, untracked: true },
  { name: 'yt-delivery.rs', type: 'file', level: 1, modified: false },
  { name: 'snow-crash.ts', type: 'file', level: 1, modified: false },
  { name: '.gibson', type: 'file', level: 0, modified: false },
  { name: 'neuromancer.config.ts', type: 'file', level: 0, modified: false },
  { name: 'package.json', type: 'file', level: 0, modified: true },
  { name: 'SPRAWL.md', type: 'file', level: 0, modified: false },
  { name: 'tsconfig.json', type: 'file', level: 0, modified: false },
]

const getIcon = (item: any) => {
  if (item.type === 'folder') return item.expanded ? '▼' : '▶'
  if (item.name.endsWith('.vue')) return '󰡄'
  if (item.name.endsWith('.ts')) return ''
  if (item.name.endsWith('.json')) return ''
  if (item.name.endsWith('.md')) return ''
  if (item.name.endsWith('.yml') || item.name.endsWith('.yaml')) return ''
  return ''
}

const getColor = (item: any) => {
  if (item.untracked) return colors.value.error
  if (item.modified) return colors.value.warning
  if (item.type === 'folder') return colors.value.function
  return colors.value.fg
}
</script>

<template>
  <div class="file-tree" :style="{ background: colors.bg, color: colors.fg }">
    <div
      class="tree-header"
      :style="{
        background: colors.bg,
        borderBottom: `1px solid ${colors.comment}30`,
        color: colors.base,
      }"
    >
      <span>📁</span>
      <span>theme-lab</span>
      <span :style="{ marginLeft: 'auto', fontSize: '7px', color: colors.comment }">main</span>
    </div>

    <div class="tree-content">
      <div
        v-for="(item, i) in fileTree"
        :key="i"
        class="tree-item"
        :style="{
          paddingLeft: item.level * 16 + 8 + 'px',
          color: getColor(item),
          fontWeight: item.modified || item.untracked ? 'bold' : 'normal',
        }"
      >
        <span
          class="icon"
          :style="{ color: item.type === 'folder' ? colors.function : colors.comment }"
        >
          {{ getIcon(item) }}
        </span>
        <span class="name">{{ item.name }}</span>
        <span
          v-if="item.untracked"
          class="badge"
          :style="{ color: colors.error, fontSize: '7px', marginLeft: '4px' }"
          >U</span
        >
        <span
          v-else-if="item.modified"
          class="badge"
          :style="{ color: colors.warning, fontSize: '7px', marginLeft: '4px' }"
          >M</span
        >
      </div>
    </div>

    <div
      class="tree-footer"
      :style="{
        background: colors.bg,
        borderTop: `1px solid ${colors.comment}30`,
        color: colors.comment,
      }"
    >
      <span :style="{ color: colors.warning }">5 modified</span>
      <span :style="{ color: colors.error }">2 untracked</span>
      <span :style="{ marginLeft: 'auto' }">24 files</span>
    </div>
  </div>
</template>

<style scoped>
.file-tree {
  border: 1px solid #222;
  font-family: 'Monaspace Krypton', monospace;
  font-size: 9px;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  max-height: 600px;
}

.tree-header {
  padding: 8px 12px;
  font-size: 9px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.tree-item {
  padding: 3px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: background 0.1s;
  line-height: 1.4;
}

.tree-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.icon {
  font-size: 10px;
  width: 12px;
  display: inline-block;
}

.name {
  font-size: 9px;
}

.tree-footer {
  padding: 6px 12px;
  font-size: 8px;
  display: flex;
  gap: 12px;
}
</style>
