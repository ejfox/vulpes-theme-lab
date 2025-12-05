<script setup lang="ts">
interface Props {
  label: string
  mode?: 'dark' | 'light'
}

withDefaults(defineProps<Props>(), {
  mode: 'dark',
})
</script>

<template>
  <section class="scenario-section">
    <div
      class="scenario-label"
      :style="{
        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
      }"
    >
      {{ label }}
    </div>
    <div class="scenario-content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.scenario-section {
  margin: 24px 0;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scenario-section:first-child {
  border-top: none;
  padding-top: 0;
}

.scenario-section:hover {
  padding: 24px 12px;
  margin: 20px -12px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.02) 0%,
    rgba(255, 255, 255, 0.005) 100%
  );
  border-radius: 16px;
  border-top-color: transparent;
}

.scenario-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: lowercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  font-family: 'Monaco', 'Menlo', monospace;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scenario-section:hover .scenario-label {
  transform: translateX(4px);
  opacity: 0.9;
}

.scenario-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
