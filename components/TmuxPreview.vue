<script setup lang="ts">
const { colors } = useTheme()

// Your actual dense window setup
const windows = [
  { num: 1, name: 'metro', panes: 3, active: true },
  { num: 2, name: 'newswell', panes: 2, active: false },
  { num: 3, name: 'evs', panes: 3, active: false },
  { num: 4, name: 'artie', panes: 2, active: false },
  { num: 6, name: 'node', panes: 1, active: false },
]

// Dense, realistic pane content
const panes = [
  {
    id: 1,
    active: true,
    content: `637
638  const defaultFilename =
     generateSaveFilename(saveData.name || 'save',
     saveData.id);
639
640  defaultPath: path.join(
641    getSavesDirectory(),
642    \${saveData.name || 'save'}_\${new Date().toISOString().split('T')[0]}.json
643  )
644  defaultPath: path.join(
     getSavesDirectory(), defaultFilename),`
  },
  {
    id: 2,
    active: false,
    content: `import { cities } from 'shared-data/cities';
import { SaveGame } from '../types';

/**
 * Check if save has full game data loaded
 */
export function hasSaveFullData(save: SaveGame) {
  return save.data && Object.keys(save.data).length > 0;
}

/**
 * Determine if a save is an autosave based on name
 */
export function isAutosave(save: SaveGame) {
  return save.name.startsWith(searchStr);
}`
  },
  {
    id: 3,
    active: false,
    content: `● Search(pattern: "new Date.*toISOString|\.split\('T'\)|defaultPath",
  path: "app/game", output_mode: "content")
  Found 1 line (Ctrl+O to expand)

Found filename generation in the frontend too! Let me check
that:

● Read(app/game/helpers/gameSaving/unifiedSaveLoad.ts)
  Read 30 lines

Now let me create a shared helper that both Electron and
browser code can use:

● Write(app/game/helpers/gameSaving/filenameHelpers.ts)
  Wrote 50 lines to
  app/game/helpers/gameSaving/filenameHelpers.ts`
  }
]

const getPaneIndicator = (paneCount: number) => {
  const indicators = { 1: '', 2: '⚌', 3: '☰', 4: '⚍', 5: '⚏' }
  return indicators[paneCount as keyof typeof indicators] || '☷'
}
</script>

<template>
  <div class="tmux-preview" :style="{ background: colors.bg, color: colors.fg }">
    <!-- Dense status bar like your real setup -->
    <div class="tmux-status-bar">
      <div class="status-left">
        <span class="prefix-indicator">◼</span>
      </div>
      <div class="status-center">
        <span
          v-for="w in windows"
          :key="w.num"
          class="window-status"
          :class="{ active: w.active }"
          :style="w.active ? {
            background: colors.fg,
            color: colors.bg,
          } : {}"
        >
          {{ w.num }} {{ w.name }}{{ getPaneIndicator(w.panes) }}
        </span>
      </div>
      <div class="status-right"></div>
    </div>

    <!-- 3 dense panes with realistic content -->
    <div class="tmux-panes">
      <div
        v-for="(pane, idx) in panes"
        :key="pane.id"
        class="pane"
        :class="{ active: pane.active }"
        :style="{
          borderRight: idx < 2 ? `1px solid ${colors.comment}30` : 'none',
        }"
      >
        <div v-if="pane.active" class="pane-arrow" :style="{ color: colors.fg }">→</div>
        <div class="pane-content">
          <pre :style="{
            color: pane.id === 1 ? colors.keyword :
                   pane.id === 2 ? colors.string :
                   colors.fg,
            fontSize: '9px',
          }">{{ pane.content }}</pre>
        </div>
        <div
          v-if="pane.active"
          class="pane-cursor"
          :style="{ background: colors.base }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tmux-preview {
  border: 1px solid #222;
  font-family: 'Monaspace Krypton', monospace;
  font-size: 9px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
}

/* Ultra-compact status bar */
.tmux-status-bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  padding: 2px 0;
  font-size: 9px;
  border-bottom: 1px solid #222;
}

.status-left {
  padding: 0 8px;
  display: flex;
  align-items: center;
}

.prefix-indicator {
  font-size: 6px;
  opacity: 0.3;
}

.status-center {
  display: flex;
  justify-content: center;
  gap: 0;
}

.window-status {
  padding: 0 8px;
  white-space: nowrap;
  font-size: 9px;
}

.window-status.active {
  font-weight: normal;
}

.status-right {
  padding: 0 8px;
}

/* Dense 3-pane layout */
.tmux-panes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  flex: 1;
  overflow: hidden;
}

.pane {
  position: relative;
  padding: 8px;
  overflow: hidden;
}

.pane-arrow {
  position: absolute;
  top: 4px;
  right: 6px;
  font-size: 8px;
  opacity: 0.5;
}

.pane-content {
  font-size: 9px;
  line-height: 1.4;
  height: 100%;
  overflow: hidden;
}

.pane-content pre {
  margin: 0;
  font-family: inherit;
  white-space: pre;
  overflow: hidden;
}

.pane-cursor {
  position: absolute;
  bottom: 8px;
  left: 8px;
  width: 6px;
  height: 10px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
</style>
