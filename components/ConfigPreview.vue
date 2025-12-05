<script setup lang="ts">
interface Props {
  colors: any
  format: string
  mode: 'dark' | 'light'
  config: string
  additionalFormats?: number
}

withDefaults(defineProps<Props>(), {
  additionalFormats: 0,
})

const getFileExtension = (format: string): string => {
  const extensions: Record<string, string> = {
    ghostty: '',
    neovim: '.lua',
    bat: '.tmTheme',
    yazi: '.toml',
    lazygit: '.yml',
    zsh: '.zsh',
    tweakcc: '.json',
    neomutt: '.muttrc',
    wezterm: '.toml',
    alacritty: '.yml',
    iterm: '.itermcolors',
    tmux: '.tmux.conf',
  }
  return extensions[format] || ''
}
</script>

<template>
  <div
    class="config-preview"
    :style="{
      background: colors.bg,
      borderColor: colors.comment,
    }"
  >
    <div
      class="config-header"
      :style="{
        color: colors.comment,
        borderBottomColor: colors.comment,
      }"
    >
      {{ format }} - theme-lab-{{ mode }}{{ getFileExtension(format) }}
      <span v-if="additionalFormats > 0" class="additional-formats">
        (+{{ additionalFormats }} more)
      </span>
    </div>
    <pre class="config-content" :style="{ color: colors.string }">{{ config }}</pre>
  </div>
</template>

<style scoped>
.config-preview {
  border: 1px solid;
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.config-preview:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.15);
}

.config-header {
  padding: 10px 16px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border-bottom: 1px solid;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Monaco', 'Menlo', monospace;
}

.additional-formats {
  font-size: 7px;
  opacity: 0.6;
  font-weight: 400;
}

.config-content {
  padding: 16px;
  font-size: 9px;
  line-height: 1.6;
  overflow-x: auto;
  margin: 0;
  font-family: 'Monaco', 'Menlo', monospace;
}

.config-content::-webkit-scrollbar {
  height: 6px;
}

.config-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.config-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.config-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
