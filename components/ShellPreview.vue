<script setup lang="ts">
const { colors, options } = useTheme()

const commands = [
  { prompt: '~/theme-lab', cmd: 'npm run dev', type: 'input' },
  { text: '> nuxt dev', type: 'output' },
  { text: '', type: 'empty' },
  { text: 'Nuxt 3.12.0 with Nitro 2.9.0', type: 'info' },
  { text: '  ➜ Local:    http://localhost:3322/', type: 'success', highlight: true },
  { text: '  ➜ Network:  http://192.168.1.10:3322/', type: 'success' },
  { text: '', type: 'empty' },
  { text: '✓ Vite client warmed up in 234ms', type: 'success' },
  { text: '✓ Nitro built in 123ms', type: 'success' },
  { text: '', type: 'empty' },
  { prompt: '~/theme-lab', cmd: 'git status', type: 'input' },
  { text: 'On branch main', type: 'output' },
  { text: 'Your branch is ahead of \'origin/main\' by 3 commits.', type: 'info' },
  { text: '', type: 'empty' },
  { text: 'Changes not staged for commit:', type: 'warning' },
  { text: '  (use "git add <file>..." to update)', type: 'comment' },
  { text: '  modified:   components/CodePreview.vue', type: 'modified' },
  { text: '  modified:   composables/useTheme.ts', type: 'modified' },
  { text: '', type: 'empty' },
  { text: 'Untracked files:', type: 'warning' },
  { text: '  (use "git add <file>..." to include)', type: 'comment' },
  { text: '  utils/iterm.ts', type: 'untracked' },
  { text: '  components/ShellPreview.vue', type: 'untracked' },
  { text: '', type: 'empty' },
  { prompt: '~/theme-lab', cmd: 'pnpm test', type: 'input' },
  { text: '> theme-lab@1.0.0 test', type: 'output' },
  { text: '> vitest run', type: 'output' },
  { text: '', type: 'empty' },
  { text: ' ✓ utils/ghostty.test.ts (12)', type: 'success' },
  { text: ' ✓ utils/tmux.test.ts (8)', type: 'success' },
  { text: ' ✗ composables/useTheme.test.ts (3)', type: 'error' },
  { text: '   × expects valid hue range', type: 'error' },
  { text: '', type: 'empty' },
  { text: 'Test Files  3 passed | 1 failed (4)', type: 'output' },
  { text: '     Tests  20 passed | 3 failed (23)', type: 'output' },
  { text: '  Duration  234ms', type: 'comment' },
]

const getColor = (type: string) => {
  switch (type) {
    case 'success': return colors.value.string
    case 'error': return colors.value.error
    case 'warning': return colors.value.warning
    case 'info': return colors.value.function
    case 'comment': return colors.value.comment
    case 'modified': return colors.value.warning
    case 'untracked': return colors.value.error
    case 'output': return colors.value.fg
    default: return colors.value.fg
  }
}
</script>

<template>
  <div class="shell" :style="{ background: colors.bg, color: colors.fg }">
    <div class="shell-header" :style="{ background: colors.bg, borderBottom: `1px solid ${colors.comment}30` }">
      <div class="tab" :style="{ background: colors.base + '20', color: colors.base, borderRight: `1px solid ${colors.base}40` }">
        zsh
      </div>
      <div class="tab-controls" :style="{ color: colors.comment }">
        <span>1</span>
        <span :style="{ color: colors.base }">2</span>
        <span>3</span>
      </div>
    </div>

    <div class="terminal-content">
      <div
        v-for="(line, i) in commands"
        :key="i"
        class="terminal-line"
        :style="{
          background: line.highlight ? colors.base + '10' : 'transparent',
          borderLeft: line.highlight ? `2px solid ${colors.base}` : 'none',
          paddingLeft: line.highlight ? '10px' : '12px'
        }"
      >
        <template v-if="line.type === 'input'">
          <span :style="{ color: colors.keyword }">❯</span>
          <span :style="{ color: colors.comment, opacity: 0.7 }"> {{ line.prompt }} </span>
          <span :style="{ color: colors.fg }">{{ line.cmd }}</span>
        </template>
        <template v-else>
          <span :style="{ color: getColor(line.type) }">{{ line.text }}</span>
        </template>
      </div>
    </div>

    <div class="shell-status" :style="{ background: colors.bg, borderTop: `1px solid ${colors.comment}30`, color: colors.comment }">
      <span :style="{ color: colors.base }">●</span>
      <span>zsh</span>
      <span :style="{ marginLeft: 'auto' }">3 jobs running</span>
    </div>
  </div>
</template>

<style scoped>
.shell {
  border: 1px solid #222;
  font-family: 'Monaspace Krypton', monospace;
  font-size: 9px;
  display: flex;
  flex-direction: column;
  min-height: 500px;
  max-height: 600px;
}

.shell-header {
  display: flex;
  align-items: center;
  padding: 4px 0;
  gap: 1px;
}

.tab {
  padding: 4px 12px;
  font-size: 9px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tab-controls {
  display: flex;
  gap: 12px;
  padding: 0 12px;
  font-size: 9px;
  margin-left: auto;
}

.tab-controls span {
  cursor: pointer;
}

.terminal-content {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  line-height: 1.6;
}

.terminal-line {
  min-height: 16px;
  padding: 2px 12px;
  position: relative;
}

.shell-status {
  display: flex;
  gap: 12px;
  padding: 4px 12px;
  font-size: 8px;
  align-items: center;
}
</style>
