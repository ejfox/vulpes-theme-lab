<script setup lang="ts">
import { applyContrastFixes } from '../utils/contrast'
import type { ThemePalette } from '../utils/types'

const props = defineProps<{
  show: boolean
  palette: ThemePalette
  themeName: string
  issues: any[]
  onAutoFix: () => void
  onExportAnyway: () => void
  onExportWithReport: () => void
  onCancel: () => void
}>()

const { colors } = useTheme()

const fixPreview = computed(() => {
  return applyContrastFixes(props.palette)
})

const showPreview = ref(false)
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="onCancel">
    <div class="modal" :style="{ background: colors.bg, color: colors.fg }" @click.stop>
      <!-- Header -->
      <div class="modal-header" :style="{ borderBottom: `1px solid ${colors.error}` }">
        <span :style="{ color: colors.error, fontSize: '11px' }"
          >╔══[ <span class="blink">!</span> WCAG VALIDATION FAILED
          ]══════════════════════════════════╗</span
        >
      </div>

      <!-- Issue Summary -->
      <div class="modal-body">
        <div
          class="summary"
          :style="{
            background: colors.error + '10',
            borderLeft: `3px solid ${colors.error}`,
            padding: '12px',
          }"
        >
          <div :style="{ fontWeight: 'bold', marginBottom: '8px', color: colors.error }">
            ║ ERROR: {{ issues.length }} color{{ issues.length > 1 ? 's' : '' }} fail WCAG AA
            (4.5:1)
          </div>
          <div :style="{ fontSize: '9px', color: colors.comment }">
            ║ Insufficient contrast detected. Low vision accessibility compromised.
          </div>
        </div>

        <!-- Issue List -->
        <div class="issues-list">
          <div
            v-for="issue in issues"
            :key="issue.pair"
            class="issue-item"
            :style="{
              background: colors.bg_alt,
              borderLeft: `3px solid ${issue.severity === 'critical' ? colors.error : colors.warning}`,
            }"
          >
            <div class="issue-header">
              <span :style="{ fontWeight: 'bold' }">{{ issue.pair }}</span>
              <span
                class="badge"
                :style="{
                  background: issue.severity === 'critical' ? colors.error : colors.warning,
                  color: colors.bg,
                  fontSize: '7px',
                  padding: '2px 6px',
                  borderRadius: '2px',
                }"
              >
                {{ issue.severity === 'critical' ? 'CRITICAL' : 'WARNING' }}
              </span>
            </div>
            <div class="issue-details" :style="{ fontSize: '8px', color: colors.comment }">
              <div>Contrast: {{ issue.ratio.toFixed(2) }}:1 (need 4.5:1)</div>
              <div>Gap: {{ (4.5 - issue.ratio).toFixed(2) }}:1 below minimum</div>
            </div>
          </div>
        </div>

        <!-- Fix Preview -->
        <div v-if="showPreview && fixPreview.changes.length > 0" class="fix-preview">
          <div
            class="preview-header"
            :style="{ color: colors.success, fontWeight: 'bold', marginBottom: '8px' }"
          >
            Auto-Fix Preview
          </div>
          <div
            v-for="change in fixPreview.changes"
            :key="change.color"
            class="change-item"
            :style="{ background: colors.bg_alt, padding: '8px', marginBottom: '4px' }"
          >
            <div :style="{ fontWeight: 'bold', fontSize: '9px' }">{{ change.color }}</div>
            <div class="color-comparison">
              <div class="color-before">
                <div
                  class="swatch"
                  :style="{ background: change.old, width: '40px', height: '20px' }"
                ></div>
                <span :style="{ fontSize: '8px', color: colors.error }"
                  >{{ change.oldRatio.toFixed(2) }}:1</span
                >
              </div>
              <span :style="{ color: colors.comment }">→</span>
              <div class="color-after">
                <div
                  class="swatch"
                  :style="{ background: change.new, width: '40px', height: '20px' }"
                ></div>
                <span :style="{ fontSize: '8px', color: colors.success }"
                  >{{ change.newRatio.toFixed(2) }}:1 ✓</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button
          @click="showPreview = !showPreview"
          class="btn btn-secondary"
          :style="{
            background: 'transparent',
            border: `1px solid ${colors.comment}`,
            color: colors.comment,
          }"
        >
          {{ showPreview ? 'Hide' : 'Preview' }} Changes
        </button>

        <button
          @click="onCancel"
          class="btn btn-secondary"
          :style="{
            background: 'transparent',
            border: `1px solid ${colors.comment}`,
            color: colors.comment,
          }"
        >
          Cancel
        </button>

        <button
          @click="onExportWithReport"
          class="btn btn-secondary"
          :style="{
            background: colors.warning + '20',
            border: `1px solid ${colors.warning}`,
            color: colors.warning,
          }"
        >
          Export + Report
        </button>

        <button
          @click="onExportAnyway"
          class="btn btn-secondary"
          :style="{
            background: 'transparent',
            border: `1px solid ${colors.error}40`,
            color: colors.error,
            opacity: 0.6,
          }"
        >
          Export Anyway
        </button>

        <button
          @click="onAutoFix"
          class="btn btn-primary"
          :style="{
            background: colors.success,
            color: colors.bg,
            fontWeight: 'bold',
            border: 'none',
          }"
        >
          ✓ Auto-Fix & Export
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}

.modal {
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  font-family: 'Monaspace Krypton', monospace;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.02) 0px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 1;
}

.modal > * {
  position: relative;
  z-index: 2;
}

.modal-header {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-header span:first-child {
  animation: pulse 2s ease-in-out infinite;
  filter: drop-shadow(0 0 8px currentColor);
}

.modal-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 9px;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.issue-item {
  padding: 10px;
  border-radius: 2px;
  animation: slideUp 0.3s ease-out backwards;
}

.issue-item:nth-child(1) {
  animation-delay: 0.05s;
}
.issue-item:nth-child(2) {
  animation-delay: 0.1s;
}
.issue-item:nth-child(3) {
  animation-delay: 0.15s;
}
.issue-item:nth-child(4) {
  animation-delay: 0.2s;
}
.issue-item:nth-child(5) {
  animation-delay: 0.25s;
}
.issue-item:nth-child(6) {
  animation-delay: 0.3s;
}
.issue-item:nth-child(7) {
  animation-delay: 0.35s;
}
.issue-item:nth-child(8) {
  animation-delay: 0.4s;
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 9px;
}

.issue-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.fix-preview {
  border-radius: 2px;
  animation: slideUp 0.3s ease-out;
}

.summary {
  position: relative;
}

.color-comparison {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}

.color-before,
.color-after {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.swatch {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.change-item {
  /* No hover effects */
}

.modal-actions {
  padding: 16px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  font-size: 9px;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.btn:active::before {
  width: 300px;
  height: 300px;
}

.btn:active {
  transform: translateY(0);
  transition: all 0.05s;
}

.btn-primary {
  padding: 10px 20px;
  animation: pulse 2s ease-in-out infinite;
}
</style>
