<script setup lang="ts">
const props = defineProps<{
  show: boolean
  message: string
}>()

const visible = ref(false)

watch(() => props.show, (newVal) => {
  if (newVal) {
    visible.value = true
    setTimeout(() => {
      visible.value = false
    }, 3000)
  }
})
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" class="success-toast">
      <span class="icon">✓</span>
      <span class="message">{{ message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}

.success-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #50fa7b 0%, #5af78e 100%);
  color: #000;
  padding: 16px 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Monaspace Krypton', monospace;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 8px 24px rgba(80, 250, 123, 0.4);
  z-index: 10000;
  animation: slideInRight 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.icon {
  font-size: 18px;
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.3));
}

.toast-enter-active {
  animation: slideInRight 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  animation: slideOutRight 0.3s ease-in;
}
</style>
