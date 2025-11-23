<script setup lang="ts">
const { colors, options } = useTheme()

const configFiles = [
  {
    name: 'package.json',
    lang: 'json',
    content: `{
  "name": "theme-lab",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "test": "vitest"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "nuxt": "^3.12.0",
    "chroma-js": "^2.4.2"
  },
  "devDependencies": {
    "@types/chroma-js": "^2.4.4",
    "vitest": "^1.6.0"
  }
}`,
  },
  {
    name: '.github/workflows/deploy.yml',
    lang: 'yaml',
    content: `name: Deploy Theme Lab
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/deploy@v3`,
  },
]

const activeTab = ref(0)

// Color JSON/YAML syntax with granular colors
const colorLine = (line: string, lang: string) => {
  if (lang === 'json') {
    // Highlight JSON: keys (property), strings, numbers, booleans, null, punctuation
    return line
      .replace(
        /"([^"]+)":/g,
        `<span style="color: ${colors.value.property}">"$1"</span><span style="color: ${colors.value.punctuation}">:</span>`
      )
      .replace(
        /: "([^"]+)"/g,
        ` <span style="color: ${colors.value.string}; ${options.value.italicStrings ? 'font-style: italic' : ''}">"$1"</span>`
      )
      .replace(/: (\d+\.?\d*)/g, ` <span style="color: ${colors.value.number}">$1</span>`)
      .replace(/: (true|false|null)/g, ` <span style="color: ${colors.value.constant}">$1</span>`)
      .replace(
        /[{}\[\],]/g,
        (match) => `<span style="color: ${colors.value.punctuation}">${match}</span>`
      )
  } else {
    // YAML highlighting: keys (property), strings, numbers, operators, comments
    return line
      .replace(
        /^(\s*)([a-zA-Z_-]+):/g,
        `$1<span style="color: ${colors.value.property}">$2</span><span style="color: ${colors.value.punctuation}">:</span>`
      )
      .replace(
        /: "?([^"\n]+)"?$/g,
        ` <span style="color: ${colors.value.string}; ${options.value.italicStrings ? 'font-style: italic' : ''}">$1</span>`
      )
      .replace(/: (\d+\.?\d*)$/g, ` <span style="color: ${colors.value.number}">$1</span>`)
      .replace(/- /g, `<span style="color: ${colors.value.punctuation}">-</span> `)
      .replace(
        /#.+$/g,
        (match) =>
          `<span style="color: ${colors.value.comment}; ${options.value.italicComments ? 'font-style: italic' : ''}">${match}</span>`
      )
  }
}
</script>

<template>
  <div class="config-viewer" :style="{ background: colors.bg, color: colors.fg }">
    <div class="tabs" :style="{ borderBottom: `1px solid ${colors.comment}30` }">
      <div
        v-for="(file, i) in configFiles"
        :key="i"
        class="tab"
        :class="{ active: activeTab === i }"
        :style="{
          background: activeTab === i ? colors.base + '20' : 'transparent',
          color: activeTab === i ? colors.base : colors.comment,
          borderRight: `1px solid ${colors.comment}20`,
        }"
        @click="activeTab = i"
      >
        {{ file.name }}
      </div>
    </div>

    <div class="file-content">
      <div
        class="line-numbers"
        :style="{
          background: colors.bg,
          borderRight: `1px solid ${colors.comment}20`,
          color: colors.comment,
        }"
      >
        <div v-for="(_, i) in configFiles[activeTab].content.split('\n')" :key="i" class="line-num">
          {{ i + 1 }}
        </div>
      </div>
      <div class="code-content">
        <div
          v-for="(line, i) in configFiles[activeTab].content.split('\n')"
          :key="i"
          class="code-line"
          v-html="colorLine(line, configFiles[activeTab].lang)"
        ></div>
      </div>
    </div>

    <div
      class="statusbar"
      :style="{
        background: colors.bg,
        borderTop: `1px solid ${colors.comment}30`,
        color: colors.comment,
      }"
    >
      <span :style="{ color: colors.function }">{{
        configFiles[activeTab].lang.toUpperCase()
      }}</span>
      <span>{{ configFiles[activeTab].content.split('\n').length }} lines</span>
      <span :style="{ marginLeft: 'auto', color: colors.string }">UTF-8</span>
    </div>
  </div>
</template>

<style scoped>
.config-viewer {
  border: 1px solid #222;
  font-family: 'Monaspace Krypton', monospace;
  font-size: 9px;
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.tabs {
  display: flex;
  padding: 0;
}

.tab {
  padding: 6px 12px;
  cursor: pointer;
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  transition: all 0.15s;
}

.tab:hover {
  opacity: 0.8;
}

.file-content {
  flex: 1;
  display: flex;
  overflow: auto;
}

.line-numbers {
  padding: 12px 8px;
  text-align: right;
  user-select: none;
  font-size: 8px;
  min-width: 40px;
}

.line-num {
  line-height: 1.6;
  height: 14px;
}

.code-content {
  flex: 1;
  padding: 12px;
  overflow-x: auto;
}

.code-line {
  line-height: 1.6;
  height: 14px;
  white-space: pre;
  font-size: 9px;
}

.statusbar {
  display: flex;
  gap: 16px;
  padding: 4px 12px;
  font-size: 8px;
}
</style>
