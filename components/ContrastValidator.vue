<script setup lang="ts">
import { getAccessibilitySummary, getContrastRatio, meetsWCAG } from '../utils/contrast'
const { colors } = useTheme()

// Reactive accessibility summary
const accessibility = computed(() => {
  return getAccessibilitySummary(colors.value)
})

// Detailed contrast check for specific pairs
const contrastChecks = computed(() => {
  return [
    { label: 'Normal text', fg: colors.value.fg, bg: colors.value.bg },
    { label: 'Comments', fg: colors.value.comment, bg: colors.value.bg },
    { label: 'Strings', fg: colors.value.string, bg: colors.value.bg },
    { label: 'Keywords', fg: colors.value.keyword, bg: colors.value.bg },
    { label: 'Functions', fg: colors.value.function, bg: colors.value.bg },
    { label: 'Errors', fg: colors.value.error, bg: colors.value.bg },
    { label: 'Warnings', fg: colors.value.warning, bg: colors.value.bg },
    { label: 'Success', fg: colors.value.success, bg: colors.value.bg },
  ].map(pair => ({
    ...pair,
    ratio: getContrastRatio(pair.fg, pair.bg),
    meetsAA: meetsWCAG(getContrastRatio(pair.fg, pair.bg), 'AA'),
    meetsAAA: meetsWCAG(getContrastRatio(pair.fg, pair.bg), 'AAA'),
  }))
})
</script>

<template>
  <div class="contrast-validator" :style="{ background: colors.bg, color: colors.fg }">
    <!-- Header with overall status -->
    <div
      class="validator-header"
      :style="{
        background: accessibility.passed ? colors.success + '15' : colors.error + '15',
        borderBottom: `2px solid ${accessibility.passed ? colors.success : colors.error}`,
        color: accessibility.passed ? colors.success : colors.error
      }"
    >
      <span style="font-weight: bold;">
        {{ accessibility.passed ? '✓' : '⚠' }}
        WCAG Contrast Validation
      </span>
      <span :style="{ marginLeft: 'auto', fontSize: '8px', color: colors.comment }">
        {{ accessibility.total - accessibility.failed }}/{{ accessibility.total }} passing
      </span>
    </div>

    <!-- Summary -->
    <div class="summary" :style="{ borderBottom: `1px solid ${colors.comment}30`, padding: '12px' }">
      <div class="summary-item">
        <span :style="{ color: colors.success }">{{ accessibility.total - accessibility.failed }} passed</span>
      </div>
      <div v-if="accessibility.warnings > 0" class="summary-item">
        <span :style="{ color: colors.warning }">{{ accessibility.warnings }} warnings</span>
        <span :style="{ fontSize: '8px', color: colors.comment, marginLeft: '4px' }">(3:1 - 4.5:1)</span>
      </div>
      <div v-if="accessibility.critical > 0" class="summary-item">
        <span :style="{ color: colors.error }">{{ accessibility.critical }} critical</span>
        <span :style="{ fontSize: '8px', color: colors.comment, marginLeft: '4px' }">(< 3:1)</span>
      </div>
    </div>

    <!-- Detailed checks -->
    <div class="checks-container">
      <div
        v-for="check in contrastChecks"
        :key="check.label"
        class="check-item"
        :style="{
          borderLeft: `3px solid ${check.meetsAA ? colors.success : colors.error}`,
          background: check.meetsAA ? 'transparent' : colors.error + '08'
        }"
      >
        <div class="check-label">
          <span :style="{ color: colors.fg, fontWeight: '600' }">{{ check.label }}</span>
          <div class="color-swatches">
            <span class="swatch" :style="{ background: check.fg }" :title="check.fg"></span>
            <span :style="{ color: colors.comment, fontSize: '8px' }">on</span>
            <span class="swatch" :style="{ background: check.bg }" :title="check.bg"></span>
          </div>
        </div>

        <div class="check-result">
          <span
            class="ratio"
            :style="{
              color: check.meetsAAA ? colors.success : check.meetsAA ? colors.warning : colors.error,
              fontWeight: 'bold'
            }"
          >
            {{ check.ratio.toFixed(2) }}:1
          </span>
          <div class="badges">
            <span
              class="badge"
              :style="{
                background: check.meetsAA ? colors.success + '20' : colors.error + '20',
                color: check.meetsAA ? colors.success : colors.error,
                border: `1px solid ${check.meetsAA ? colors.success : colors.error}`
              }"
            >
              AA {{ check.meetsAA ? '✓' : '✗' }}
            </span>
            <span
              class="badge"
              :style="{
                background: check.meetsAAA ? colors.success + '20' : colors.comment + '10',
                color: check.meetsAAA ? colors.success : colors.comment,
                border: `1px solid ${check.meetsAAA ? colors.success : colors.comment}40`
              }"
            >
              AAA {{ check.meetsAAA ? '✓' : '✗' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer with info -->
    <div class="validator-footer" :style="{ background: colors.bg, borderTop: `1px solid ${colors.comment}30`, color: colors.comment }">
      <span style="font-size: 7px;">WCAG 2.1 Standards: AA ≥ 4.5:1 (minimum) · AAA ≥ 7:1 (enhanced)</span>
    </div>
  </div>
</template>

<style scoped>
.contrast-validator {
  border: 1px solid #222;
  font-family: 'Monaspace Krypton', monospace;
  font-size: 9px;
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.validator-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 10px;
}

.summary {
  display: flex;
  gap: 16px;
  font-size: 9px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.checks-container {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.check-item {
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border-radius: 2px;
}

.check-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.color-swatches {
  display: flex;
  align-items: center;
  gap: 4px;
}

.swatch {
  width: 12px;
  height: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  display: inline-block;
}

.check-result {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.ratio {
  font-size: 11px;
  font-family: 'Monaspace Krypton', monospace;
}

.badges {
  display: flex;
  gap: 4px;
}

.badge {
  padding: 2px 6px;
  font-size: 7px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 2px;
}

.validator-footer {
  padding: 6px 12px;
  font-size: 8px;
  font-style: italic;
}
</style>
