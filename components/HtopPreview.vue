<script setup lang="ts">
const { colors, options } = useTheme()

const cpuBars = [
  { id: 1, usage: 45, color: 'base' },
  { id: 2, usage: 23, color: 'hint' },
  { id: 3, usage: 89, color: 'warning' },
  { id: 4, usage: 67, color: 'base' },
  { id: 5, usage: 12, color: 'hint' },
  { id: 6, usage: 94, color: 'error' },
  { id: 7, usage: 34, color: 'base' },
  { id: 8, usage: 56, color: 'warning' },
]

const processes = [
  { pid: 1234, user: 'ejfox', pri: 20, ni: 0, virt: '12.5g', res: '2.1g', shr: '1.2g', s: 'R', cpu: 89.2, mem: 12.5, time: '45:23', command: 'node /theme-lab/server', selected: true },
  { pid: 5678, user: 'ejfox', pri: 20, ni: 0, virt: '8.2g', res: '1.8g', shr: '980m', s: 'S', cpu: 45.1, mem: 9.8, time: '12:45', command: 'nuxt dev', selected: false },
  { pid: 9012, user: 'root', pri: -20, ni: -20, virt: '2.1g', res: '456m', shr: '234m', s: 'S', cpu: 23.4, mem: 2.3, time: '89:12', command: 'system_kernel', selected: false },
  { pid: 3456, user: 'ejfox', pri: 20, ni: 0, virt: '4.5g', res: '890m', shr: '567m', s: 'S', cpu: 12.1, mem: 4.5, time: '3:34', command: 'ghostty', selected: false },
  { pid: 7890, user: 'ejfox', pri: 20, ni: 0, virt: '3.2g', res: '678m', shr: '345m', s: 'S', cpu: 8.7, mem: 3.2, time: '1:23', command: 'nvim', selected: false },
  { pid: 2345, user: 'ejfox', pri: 20, ni: 0, virt: '1.8g', res: '234m', shr: '123m', s: 'S', cpu: 2.3, mem: 1.2, time: '0:45', command: 'lazygit', selected: false },
  { pid: 6789, user: 'root', pri: 20, ni: 0, virt: '890m', res: '123m', shr: '67m', s: 'S', cpu: 0.7, mem: 0.6, time: '23:45', command: 'systemd', selected: false },
  { pid: 1357, user: 'ejfox', pri: 20, ni: 0, virt: '567m', res: '89m', shr: '45m', s: 'S', cpu: 0.3, mem: 0.4, time: '0:12', command: 'tmux: server', selected: false },
]

const getBarColor = (colorKey: string) => {
  const colorMap: Record<string, string> = {
    base: colors.value.base,
    hint: colors.value.hint,
    warning: colors.value.warning,
    error: colors.value.error,
  }
  return colorMap[colorKey] || colors.value.base
}
</script>

<template>
  <div class="htop" :style="{ background: colors.bg, color: colors.fg }">
    <!-- Header with CPU/Memory bars -->
    <div class="header">
      <div class="cpu-grid">
        <div v-for="cpu in cpuBars" :key="cpu.id" class="cpu-bar-container">
          <span class="cpu-label" :style="{ color: colors.comment }">{{ cpu.id }}</span>
          <div class="bar-track" :style="{ background: colors.comment + '20' }">
            <div
              class="bar-fill"
              :style="{
                width: cpu.usage + '%',
                background: getBarColor(cpu.color)
              }"
            ></div>
          </div>
          <span class="cpu-value" :style="{ color: getBarColor(cpu.color) }">{{ cpu.usage }}%</span>
        </div>
      </div>

      <div class="mem-section">
        <div class="mem-bar-container">
          <span :style="{ color: colors.keyword }">Mem</span>
          <div class="bar-track" :style="{ background: colors.comment + '20' }">
            <div class="bar-fill" :style="{ width: '67%', background: colors.warning }"></div>
          </div>
          <span :style="{ color: colors.warning }">12.8G/19.2G</span>
        </div>
        <div class="mem-bar-container">
          <span :style="{ color: colors.keyword }">Swp</span>
          <div class="bar-track" :style="{ background: colors.comment + '20' }">
            <div class="bar-fill" :style="{ width: '23%', background: colors.hint }"></div>
          </div>
          <span :style="{ color: colors.hint }">2.3G/10.0G</span>
        </div>
      </div>

      <div class="stats-row" :style="{ color: colors.comment, borderTop: `1px solid ${colors.comment}20` }">
        <span>Tasks: <span :style="{ color: colors.fg }">156</span>, <span :style="{ color: colors.base }">1 running</span></span>
        <span>Load average: <span :style="{ color: colors.warning }">2.45</span> <span :style="{ color: colors.hint }">2.12</span> <span :style="{ color: colors.hint }">1.98</span></span>
        <span>Uptime: <span :style="{ color: colors.fg }">3 days, 14:23:45</span></span>
      </div>
    </div>

    <!-- Process table header -->
    <div class="table-header" :style="{ background: colors.base + '20', color: colors.base, borderBottom: `1px solid ${colors.base}` }">
      <span class="col-pid">PID</span>
      <span class="col-user">USER</span>
      <span class="col-pri">PRI</span>
      <span class="col-ni">NI</span>
      <span class="col-virt">VIRT</span>
      <span class="col-res">RES</span>
      <span class="col-shr">SHR</span>
      <span class="col-s">S</span>
      <span class="col-cpu">CPU%</span>
      <span class="col-mem">MEM%</span>
      <span class="col-time">TIME+</span>
      <span class="col-command">Command</span>
    </div>

    <!-- Process list -->
    <div class="process-list">
      <div
        v-for="proc in processes"
        :key="proc.pid"
        class="process-row"
        :style="{
          background: proc.selected ? colors.base + '30' : 'transparent',
          color: proc.selected ? colors.base : colors.fg,
          borderLeft: proc.selected ? `2px solid ${colors.base}` : 'none',
          paddingLeft: proc.selected ? '6px' : '8px'
        }"
      >
        <span class="col-pid" :style="{ color: proc.selected ? colors.base : colors.warning }">{{ proc.pid }}</span>
        <span class="col-user" :style="{ color: proc.user === 'root' ? colors.error : colors.hint }">{{ proc.user }}</span>
        <span class="col-pri">{{ proc.pri }}</span>
        <span class="col-ni">{{ proc.ni }}</span>
        <span class="col-virt" :style="{ color: colors.comment }">{{ proc.virt }}</span>
        <span class="col-res" :style="{ color: colors.comment }">{{ proc.res }}</span>
        <span class="col-shr" :style="{ color: colors.comment }">{{ proc.shr }}</span>
        <span class="col-s" :style="{
          color: proc.s === 'R' ? colors.base :
                 proc.s === 'S' ? colors.hint : colors.comment,
          fontWeight: proc.s === 'R' ? 'bold' : 'normal'
        }">{{ proc.s }}</span>
        <span class="col-cpu" :style="{
          color: proc.cpu > 80 ? colors.error :
                 proc.cpu > 50 ? colors.warning :
                 proc.cpu > 20 ? colors.base : colors.hint,
          fontWeight: proc.cpu > 50 ? 'bold' : 'normal'
        }">{{ proc.cpu.toFixed(1) }}</span>
        <span class="col-mem" :style="{
          color: proc.mem > 10 ? colors.warning :
                 proc.mem > 5 ? colors.base : colors.hint
        }">{{ proc.mem.toFixed(1) }}</span>
        <span class="col-time" :style="{ color: colors.comment }">{{ proc.time }}</span>
        <span class="col-command">{{ proc.command }}</span>
      </div>
    </div>

    <!-- Footer with keybindings -->
    <div class="footer" :style="{ background: colors.base + '10', borderTop: `1px solid ${colors.base}` }">
      <span :style="{ color: colors.keyword }">F1</span>Help
      <span :style="{ color: colors.keyword }">F2</span>Setup
      <span :style="{ color: colors.keyword }">F3</span>Search
      <span :style="{ color: colors.keyword }">F9</span>Kill
      <span :style="{ color: colors.keyword }">F10</span>Quit
    </div>
  </div>
</template>

<style scoped>
.htop {
  border: 1px solid #222;
  font-family: 'Monaspace Krypton', monospace;
  font-size: 9px;
  display: flex;
  flex-direction: column;
  height: 600px;
}

.header {
  padding: 8px;
  border-bottom: 1px solid #222;
}

.cpu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.cpu-bar-container {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 8px;
}

.cpu-label {
  width: 8px;
}

.bar-track {
  flex: 1;
  height: 10px;
  position: relative;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s;
}

.cpu-value {
  width: 28px;
  text-align: right;
  font-size: 8px;
}

.mem-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.mem-bar-container {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 8px;
}

.mem-bar-container > span:first-child {
  width: 30px;
  font-weight: bold;
}

.mem-bar-container > span:last-child {
  width: 80px;
  text-align: right;
}

.stats-row {
  display: flex;
  gap: 16px;
  padding-top: 8px;
  font-size: 8px;
}

.table-header {
  display: flex;
  padding: 4px 8px;
  font-weight: bold;
  font-size: 8px;
  position: sticky;
  top: 0;
}

.process-list {
  flex: 1;
  overflow-y: auto;
}

.process-row {
  display: flex;
  padding: 2px 8px;
  font-size: 8px;
  line-height: 1.6;
}

.col-pid { width: 50px; }
.col-user { width: 60px; }
.col-pri { width: 35px; text-align: right; }
.col-ni { width: 35px; text-align: right; }
.col-virt { width: 50px; text-align: right; }
.col-res { width: 50px; text-align: right; }
.col-shr { width: 50px; text-align: right; }
.col-s { width: 20px; text-align: center; }
.col-cpu { width: 45px; text-align: right; }
.col-mem { width: 45px; text-align: right; }
.col-time { width: 55px; text-align: right; }
.col-command { flex: 1; }

.footer {
  display: flex;
  gap: 12px;
  padding: 4px 8px;
  font-size: 8px;
}

.footer span {
  font-weight: bold;
  margin-right: 4px;
}
</style>
