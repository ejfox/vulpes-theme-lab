<script setup lang="ts">
const { colors, options } = useTheme()

const commits = [
  { hash: 'c0ffee0', msg: 'fix: patch reality.construct memory leak', author: 'neo', time: '2m ago', selected: false },
  { hash: 'deadbee', msg: 'feat: jack into the metaverse mainframe', author: 'hiro', time: '1h ago', selected: true },
  { hash: 'facade1', msg: 'refactor: simulacrum rendering pipeline', author: 'raven', time: '3h ago', selected: false },
  { hash: 'badc0de', msg: 'chore: update desert_of_the_real.toml', author: 'morpheus', time: '5h ago', selected: false },
  { hash: 'a11c47', msg: 'test: verify red pill compatibility', author: 'trinity', time: '1d ago', selected: false },
]

const files = [
  { name: 'avatar/neo.construct', status: 'M', insertions: 45, deletions: 12 },
  { name: 'street/yt-delivery.rs', status: 'M', insertions: 23, deletions: 8 },
  { name: 'core/simulacrum.ts', status: 'M', insertions: 12, deletions: 3 },
  { name: 'matrix/agent-smith.exe', status: 'D', insertions: 0, deletions: 89 },
  { name: 'metaverse/black-sun.wasm', status: 'A', insertions: 34, deletions: 0 },
]

const stashes = [
  { id: 'stash@{0}', msg: 'WIP: jack into Sense/Net mainframe', branch: 'feature/gibson' },
  { id: 'stash@{1}', msg: 'WIP: enhance hypercard protocol', branch: 'main' },
]

const branches = [
  { name: 'main', current: true, ahead: 3, behind: 0 },
  { name: 'feature/telescope', current: false, ahead: 5, behind: 2 },
  { name: 'fix/lsp-diagnostics', current: false, ahead: 1, behind: 0 },
]
</script>

<template>
  <div class="lazygit" :style="{ background: colors.bg, color: colors.fg, borderColor: colors.comment }">
    <!-- Branch info header -->
    <div class="branch-header" :style="{ background: colors.base + '15', borderBottom: `1px solid ${colors.base}` }">
      <span :style="{ color: colors.base, fontWeight: 'bold' }">
        <span :style="{ fontSize: '10px' }">⎇</span> main
      </span>
      <span :style="{ color: colors.hint, fontSize: '8px', marginLeft: '8px' }">
        ↑3 ↓0
      </span>
      <span :style="{ marginLeft: 'auto', fontSize: '8px', color: colors.comment }">
        origin/main
      </span>
    </div>

    <!-- Status panel -->
    <div class="panel status-panel">
      <div class="panel-header" :style="{ color: colors.keyword }">▼ Files</div>
      <div class="file-list">
        <div
          v-for="(file, idx) in files"
          :key="file.name"
          class="file-item"
          :class="{ selected: idx === 0 }"
          :style="idx === 0 ? { background: colors.base + '20', borderLeft: `2px solid ${colors.base}` } : {}"
        >
          <span
            class="file-status"
            :style="{
              color: file.status === 'M' ? colors.warning :
                     file.status === 'A' ? colors.hint :
                     file.status === 'D' ? colors.error : colors.fg
            }"
          >{{ file.status }}</span>
          <span class="file-name">{{ file.name }}</span>
          <span class="file-stats" :style="{ color: colors.comment }">
            <span :style="{ color: colors.hint }">+{{ file.insertions }}</span>
            <span :style="{ color: colors.error }"> -{{ file.deletions }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Stash panel -->
    <div class="panel stash-panel">
      <div class="panel-header" :style="{ color: colors.keyword }">▼ Stash</div>
      <div class="stash-list">
        <div
          v-for="stash in stashes"
          :key="stash.id"
          class="stash-item"
        >
          <span class="stash-id" :style="{ color: colors.warning }">{{ stash.id }}</span>
          <span class="stash-msg">{{ stash.msg }}</span>
          <span class="stash-branch" :style="{ color: colors.hint, fontSize: '8px' }">{{ stash.branch }}</span>
        </div>
      </div>
    </div>

    <!-- Commits panel -->
    <div class="panel commits-panel">
      <div class="panel-header" :style="{ color: colors.keyword }">▼ Commits</div>
      <div class="commit-list">
        <div
          v-for="commit in commits"
          :key="commit.hash"
          class="commit-item"
          :style="commit.selected ? { background: colors.base + '20', borderLeft: `2px solid ${colors.base}`, paddingLeft: '4px' } : {}"
        >
          <span class="commit-hash" :style="{ color: colors.warning }">{{ commit.hash }}</span>
          <span class="commit-msg" :style="{ color: commit.selected ? colors.base : colors.fg }">{{ commit.msg }}</span>
          <span class="commit-author" :style="{ color: colors.comment, fontSize: '8px' }">{{ commit.author }}</span>
          <span class="commit-time" :style="{ color: colors.comment }">{{ commit.time }}</span>
        </div>
      </div>
    </div>

    <!-- Command bar -->
    <div class="command-bar" :style="{ background: colors.base + '10', borderTop: `1px solid ${colors.comment}40` }">
      <span :style="{ color: colors.base }">▸</span>
      <span :style="{ color: colors.keyword }">s</span><span :style="{ color: colors.comment }">tage</span>
      <span :style="{ color: colors.comment, margin: '0 4px' }">|</span>
      <span :style="{ color: colors.keyword }">c</span><span :style="{ color: colors.comment }">ommit</span>
      <span :style="{ color: colors.comment, margin: '0 4px' }">|</span>
      <span :style="{ color: colors.keyword }">P</span><span :style="{ color: colors.comment }">ush</span>
      <span :style="{ color: colors.comment, margin: '0 4px' }">|</span>
      <span :style="{ color: colors.keyword }">p</span><span :style="{ color: colors.comment }">ull</span>
      <span :style="{ color: colors.comment, margin: '0 4px' }">|</span>
      <span :style="{ color: colors.keyword }">b</span><span :style="{ color: colors.comment }">ranch</span>
    </div>
  </div>
</template>

<style scoped>
.lazygit {
  border: 1px solid;
  font-family: 'Monaspace Krypton', monospace;
  font-size: 9px;
  display: flex;
  flex-direction: column;
  height: 600px;
}

.branch-header {
  padding: 6px 12px;
  display: flex;
  align-items: center;
  font-size: 9px;
}

.panel {
  padding: 8px;
  border-bottom: 1px solid #222;
  flex: 1;
  overflow-y: auto;
}

.stash-panel {
  flex: 0.5;
}

.panel-header {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 10px;
}

.file-list, .commit-list, .stash-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-item {
  display: flex;
  gap: 8px;
  padding: 4px 6px;
  font-size: 9px;
  line-height: 1.4;
}

.file-item.selected {
  padding-left: 4px;
}

.file-status {
  font-weight: bold;
  width: 12px;
}

.file-name {
  flex: 1;
}

.file-stats {
  font-size: 8px;
}

.stash-item {
  display: flex;
  gap: 8px;
  padding: 4px 6px;
  font-size: 9px;
  line-height: 1.4;
}

.stash-id {
  font-family: monospace;
  font-size: 8px;
  width: 80px;
}

.stash-msg {
  flex: 1;
}

.stash-branch {
  font-size: 8px;
}

.commit-item {
  display: flex;
  gap: 8px;
  padding: 4px 6px;
  line-height: 1.4;
}

.commit-hash {
  font-family: monospace;
  font-size: 8px;
}

.commit-msg {
  flex: 1;
}

.commit-author {
  font-size: 8px;
}

.commit-time {
  font-size: 8px;
}

.command-bar {
  padding: 6px 8px;
  display: flex;
  gap: 8px;
  font-size: 9px;
  font-weight: bold;
}
</style>
