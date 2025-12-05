<script setup lang="ts">
interface Props {
  mode: 'dark' | 'light'
}

defineProps<Props>()
</script>

<template>
  <Transition name="fade">
    <div
      class="global-drop-overlay"
      :style="{
        background: mode === 'dark' ? 'rgba(0, 0, 0, 0.92)' : 'rgba(255, 255, 255, 0.92)',
        borderColor: mode === 'dark' ? 'rgba(100, 150, 255, 0.6)' : 'rgba(100, 150, 255, 0.5)',
      }"
    >
      <div class="drop-prompt">
        <div class="drop-icon">📁</div>
        <div class="drop-text" :style="{ color: mode === 'dark' ? '#fff' : '#000' }">
          Drop theme file to import
        </div>
        <div
          class="drop-hint"
          :style="{
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
          }"
        >
          Supports VS Code, Neovim, Ghostty, Base16 themes
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.global-drop-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 4px dashed;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
}

.drop-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.drop-icon {
  font-size: 80px;
  animation: bounce 1s ease-in-out infinite;
  filter: drop-shadow(0 4px 20px rgba(100, 150, 255, 0.4));
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

.drop-text {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-align: center;
  text-shadow: 0 2px 20px rgba(100, 150, 255, 0.3);
}

.drop-hint {
  font-size: 14px;
  text-align: center;
  letter-spacing: 0.3px;
  font-weight: 500;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .drop-icon {
    font-size: 60px;
  }

  .drop-text {
    font-size: 20px;
  }

  .drop-hint {
    font-size: 12px;
  }
}
</style>
