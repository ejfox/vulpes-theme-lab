<script setup lang="ts">
const { colors, options } = useTheme()

// Powerlevel10k-style prompt segments with git status
const p10kPrompt = {
  dir: { text: '~/metaverse', bg: 'base', fg: 'bg' },
  git: { text: ' main', icon: '', bg: 'success', fg: 'bg' },
  status: { text: '✓', bg: 'success', fg: 'bg' },
}

const p10kPromptModified = {
  dir: { text: '~/metaverse', bg: 'base', fg: 'bg' },
  git: { text: ' main', icon: '', bg: 'warning', fg: 'bg' },
  status: { text: '±3', bg: 'warning', fg: 'bg' },
}

const commands = [
  // Show syntax-highlighted command with Powerlevel10k prompt
  {
    type: 'p10k-input',
    prompt: p10kPrompt,
    parts: [
      { text: 'npm', color: 'base' },
      { text: ' run', color: 'keyword' },
      { text: ' ', color: 'fg' },
      { text: 'dev', color: 'string' },
    ],
  },
  { text: '> nuxt dev', type: 'output' },
  { text: '', type: 'empty' },
  { text: 'Nuxt 3.12.0 with Nitro 2.9.0', type: 'info' },
  { text: '  ➜ Local:    http://localhost:3322/', type: 'success', highlight: true },
  { text: '  ➜ Network:  http://10.0.0.42:3322/', type: 'success' },
  { text: '', type: 'empty' },
  { text: '✓ Snow Crash module loaded in 234ms', type: 'success' },
  { text: '✓ Simulacrum engine built in 123ms', type: 'success' },
  { text: '', type: 'empty' },
  // Git status with modified prompt
  {
    type: 'p10k-input',
    prompt: p10kPromptModified,
    parts: [
      { text: 'git', color: 'base' },
      { text: ' status', color: 'keyword' },
    ],
  },
  { text: 'On branch main', type: 'output' },
  { text: "Your branch is ahead of 'origin/main' by 3 commits.", type: 'info' },
  { text: '', type: 'empty' },
  { text: 'Changes not staged for commit:', type: 'warning' },
  { text: '  (use "git add <file>..." to jack in)', type: 'comment' },
  { text: '  modified:   avatar/neo.construct', type: 'modified' },
  { text: '  modified:   street/yt-delivery.rs', type: 'modified' },
  { text: '', type: 'empty' },
  // File path with syntax highlighting
  {
    type: 'p10k-input',
    prompt: p10kPromptModified,
    parts: [
      { text: 'echo', color: 'base' },
      { text: ' ', color: 'fg' },
      { text: '"Welcome to the', color: 'string' },
      { text: ' $DESERT_OF_THE_REAL', color: 'variable' },
      { text: '"', color: 'string' },
      { text: ' >', color: 'operator' },
      { text: ' ~/.matrix/red_pill.txt', color: 'string' },
    ],
  },
  { text: '', type: 'empty' },
  {
    type: 'p10k-input',
    prompt: p10kPrompt,
    parts: [
      { text: 'pnpm', color: 'base' },
      { text: ' test', color: 'keyword' },
    ],
  },
  { text: '> metaverse@0.42.0 test', type: 'output' },
  { text: '> vitest run --mode=hyperreal', type: 'output' },
  { text: '', type: 'empty' },
  { text: ' ✓ core/simulacrum.test.ts (12)', type: 'success' },
  { text: ' ✓ avatar/hiro-protagonist.test.ts (8)', type: 'success' },
  { text: ' ✗ street/snow-crash.test.ts (3)', type: 'error' },
  { text: '   × yt.deliveryRate exceeds physics limit', type: 'error' },
  { text: '', type: 'empty' },
  { text: 'Test Files  3 passed | 1 failed (4)', type: 'output' },
  { text: '     Tests  20 passed | 3 failed (23)', type: 'output' },
  { text: '  Duration  234ms (faster than neuromancer)', type: 'comment' },
]

const getColor = (type: string) => {
  switch (type) {
    case 'success':
      return colors.value.string
    case 'error':
      return colors.value.error
    case 'warning':
      return colors.value.warning
    case 'info':
      return colors.value.function
    case 'comment':
      return colors.value.comment
    case 'modified':
      return colors.value.warning
    case 'untracked':
      return colors.value.error
    case 'output':
      return colors.value.fg
    default:
      return colors.value.fg
  }
}
</script>

<template>
  <div class="shell" :style="{ background: colors.bg, color: colors.fg }">
    <div
      class="shell-header"
      :style="{ background: colors.bg, borderBottom: `1px solid ${colors.comment}30` }"
    >
      <div
        class="tab"
        :style="{
          background: colors.base + '20',
          color: colors.base,
          borderRight: `1px solid ${colors.base}40`,
        }"
      >
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
          paddingLeft: line.highlight ? '10px' : '12px',
        }"
      >
        <!-- Powerlevel10k-style prompt with syntax highlighting -->
        <template v-if="line.type === 'p10k-input'">
          <div class="p10k-prompt">
            <!-- Directory segment -->
            <span
              class="p10k-segment"
              :style="{
                background: colors[line.prompt.dir.bg],
                color: colors[line.prompt.dir.fg],
                padding: '2px 8px',
                marginRight: '2px',
              }"
            >
              {{ line.prompt.dir.text }}
            </span>
            <!-- Git segment -->
            <span
              class="p10k-segment"
              :style="{
                background: colors[line.prompt.git.bg],
                color: colors[line.prompt.git.fg],
                padding: '2px 8px',
                marginRight: '2px',
              }"
            >
              <span>{{ line.prompt.git.icon }}</span>
              <span>{{ line.prompt.git.text }}</span>
            </span>
            <!-- Status segment -->
            <span
              class="p10k-segment"
              :style="{
                background: colors[line.prompt.status.bg],
                color: colors[line.prompt.status.fg],
                padding: '2px 8px',
                marginRight: '8px',
              }"
            >
              {{ line.prompt.status.text }}
            </span>
            <!-- Syntax-highlighted command parts -->
            <span v-for="(part, j) in line.parts" :key="j" :style="{ color: colors[part.color] }">{{
              part.text
            }}</span>
          </div>
        </template>
        <!-- Regular input (old style) -->
        <template v-else-if="line.type === 'input'">
          <span :style="{ color: colors.keyword }">❯</span>
          <span :style="{ color: colors.comment, opacity: 0.7 }"> {{ line.prompt }} </span>
          <span :style="{ color: colors.fg }">{{ line.cmd }}</span>
        </template>
        <!-- Output lines -->
        <template v-else>
          <span :style="{ color: getColor(line.type) }">{{ line.text }}</span>
        </template>
      </div>
    </div>

    <div
      class="shell-status"
      :style="{
        background: colors.bg,
        borderTop: `1px solid ${colors.comment}30`,
        color: colors.comment,
      }"
    >
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

.p10k-prompt {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.p10k-segment {
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.shell-status {
  display: flex;
  gap: 12px;
  padding: 4px 12px;
  font-size: 8px;
  align-items: center;
}
</style>
