<script setup lang="ts">
interface Props {
  columns?: number
  gap?: string
}

withDefaults(defineProps<Props>(), {
  columns: 2,
  gap: '12px',
})
</script>

<template>
  <div
    class="preview-grid"
    :style="{
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: gap,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.preview-grid {
  display: grid;
  width: 100%;
  margin: 16px 0;
}

@media (max-width: 1024px) {
  .preview-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
