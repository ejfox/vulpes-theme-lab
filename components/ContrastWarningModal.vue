<script setup lang="ts">
import { applyContrastFixes } from '../utils/contrast'
import type { ThemePalette } from '../utils/types'

const props = defineProps<{
  show: boolean
  palettes: { mode: 'dark' | 'light'; palette: ThemePalette }[]
  themeName: string
  issues: any[]
  onAutoFix: () => void
  onExportAnyway: () => void
  onExportWithReport: () => void
  onCancel: () => void
}>()

// This dialog appears precisely when the theme being edited has unreadable
// colors, so its own chrome never uses theme colors: fixed black-and-white,
// with theme colors only in the before/after swatches (they're the data).

// One preview per exported palette (Export both = dark and light), matching
// what handleAutoFix actually changes.
const fixPreviews = computed(() => {
  return props.palettes.map(({ mode, palette }) => ({
    mode,
    changes: applyContrastFixes(palette).changes,
  }))
})

const totalFixes = computed(() => {
  return fixPreviews.value.reduce((n, p) => n + p.changes.length, 0)
})

// Only label rows with dark/light when both are being exported
function modeLabel(mode: string | undefined): string {
  if (!mode || props.palettes.length < 2) return ''
  return mode
}

const showPreview = ref(false)

function plural(n: number): string {
  if (n === 1) return ''
  return 's'
}

function severityLabel(severity: string): string {
  if (severity === 'critical') return 'critical'
  return 'warning'
}

function previewLabel(): string {
  if (showPreview.value) return 'Hide fixes'
  return 'Preview fixes'
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="onCancel">
    <div class="modal" role="alertdialog" aria-labelledby="cw-title" @click.stop>
      <div class="modal-header">
        <h2 id="cw-title">WCAG AA check failed</h2>
        <p class="meta">
          {{ issues.length }} color{{ plural(issues.length) }} below 4.5:1 contrast against the
          background. Low-vision readers will struggle with these.
        </p>
      </div>

      <div class="modal-body">
        <ul class="issues-list">
          <li v-for="issue in issues" :key="`${issue.mode}-${issue.pair}`" class="issue-item">
            <div class="issue-header">
              <span class="issue-name"
                >{{ issue.pair }}
                <span v-if="modeLabel(issue.mode)" class="mode-tag">{{
                  modeLabel(issue.mode)
                }}</span></span
              >
              <span class="badge" :class="`badge-${severityLabel(issue.severity)}`">
                {{ severityLabel(issue.severity) }}
              </span>
            </div>
            <div class="meta">
              {{ issue.ratio.toFixed(2) }}:1, needs 4.5:1 ({{ (4.5 - issue.ratio).toFixed(2) }}
              short)
            </div>
          </li>
        </ul>

        <p v-if="showPreview && totalFixes === 0" class="meta fix-preview">
          No automatic fixes to preview.
        </p>
        <div v-if="showPreview && totalFixes > 0" class="fix-preview">
          <h3>Auto-fix would change</h3>
          <template v-for="preview in fixPreviews" :key="preview.mode">
            <div
              v-for="change in preview.changes"
              :key="`${preview.mode}-${change.color}`"
              class="change-item"
            >
              <span class="issue-name"
                >{{ change.color }}
                <span v-if="modeLabel(preview.mode)" class="mode-tag">{{
                  modeLabel(preview.mode)
                }}</span></span
              >
              <div class="color-comparison">
                <div class="color-cell">
                  <div class="swatch" :style="{ background: change.old }"></div>
                  <span class="meta">{{ change.oldRatio.toFixed(2) }}:1</span>
                </div>
                <span class="meta" aria-hidden="true">→</span>
                <div class="color-cell">
                  <div class="swatch" :style="{ background: change.new }"></div>
                  <span>{{ change.newRatio.toFixed(2) }}:1</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="modal-actions">
        <button class="cw-btn" @click="showPreview = !showPreview">{{ previewLabel() }}</button>
        <button class="cw-btn" @click="onCancel">Cancel</button>
        <button class="cw-btn" @click="onExportWithReport">Export + report</button>
        <button class="cw-btn cw-btn-quiet" @click="onExportAnyway">Export anyway</button>
        <button class="cw-btn cw-btn-primary" @click="onAutoFix">Auto-fix &amp; export</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  --cw-bg: #000;
  --cw-fg: #f2f2f2;
  --cw-muted: #a3a3a3;
  --cw-rule: #333;

  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal {
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  background: var(--cw-bg);
  color: var(--cw-fg);
  border: 1px solid var(--cw-rule);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  font-family: 'Monaspace Krypton', monospace;
  font-size: 13px;
  line-height: 1.5;
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--cw-rule);
}

.modal-header h2 {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta {
  margin: 0;
  font-size: 12px;
  color: var(--cw-muted);
}

.modal-body {
  flex: 1;
  padding: 8px 20px 16px;
  overflow-y: auto;
}

.issues-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.issue-item {
  padding: 10px 0;
  border-bottom: 1px solid var(--cw-rule);
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.issue-name {
  font-weight: 700;
}

.mode-tag {
  margin-left: 6px;
  font-weight: 400;
  font-size: 12px;
  color: var(--cw-muted);
}

.badge {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 1px 6px;
  border-radius: 2px;
}

/* Severity reads without color: inverted = critical, outlined = warning */
.badge-critical {
  background: var(--cw-fg);
  color: var(--cw-bg);
  font-weight: 700;
}

.badge-warning {
  border: 1px solid var(--cw-muted);
  color: var(--cw-fg);
}

.fix-preview {
  margin-top: 16px;
}

.fix-preview h3 {
  margin: 0 0 8px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--cw-muted);
}

.change-item {
  padding: 8px 0;
  border-bottom: 1px solid var(--cw-rule);
}

.color-comparison {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}

.color-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.swatch {
  width: 40px;
  height: 20px;
  border: 1px solid var(--cw-rule);
  border-radius: 2px;
}

.modal-actions {
  padding: 16px 20px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
  border-top: 1px solid var(--cw-rule);
}

/* Own class: the global .btn in main.css forces width 100% and 8px type */
.cw-btn {
  padding: 8px 14px;
  font-size: 12px;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  border-radius: 2px;
  background: transparent;
  color: var(--cw-fg);
  border: 1px solid var(--cw-muted);
}

.cw-btn:hover {
  border-color: var(--cw-fg);
}

.cw-btn:focus-visible {
  outline: 2px solid var(--cw-fg);
  outline-offset: 2px;
}

.cw-btn-quiet {
  color: var(--cw-muted);
  border-color: var(--cw-rule);
}

.cw-btn-primary {
  background: var(--cw-fg);
  color: var(--cw-bg);
  border-color: var(--cw-fg);
  font-weight: 700;
}
</style>
