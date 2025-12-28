// Showcase page animation: hue rotation, semantic offset oscillation, focus handling
import { useRafFn, useWindowFocus, useMagicKeys, whenever } from '@vueuse/core'

const CONFIG = {
  baseRotationDuration: 35000, // ms for full 360° rotation
  semanticWavePeriod: 9200, // ms for sin wave cycle
  maxSemanticOffset: 18, // ±degrees
  stateUpdateInterval: 100, // throttle to prevent router spam
} as const

export function useShowcaseAnimation() {
  const { state, colors } = useTheme()

  // Speed control
  const speedMultiplier = ref(1)
  const isHoveringAccelerator = ref(false)
  const toggleSpeed = () => (speedMultiplier.value = speedMultiplier.value === 1 ? 4 : 1)

  // Keyboard shortcut: Space to toggle speed (when not typing)
  const { space } = useMagicKeys()
  whenever(space, () => {
    const active = document.activeElement
    const isTyping = active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA'
    if (!isTyping) toggleSpeed()
  })

  // Animation timing
  const lastFrameTime = ref(Date.now())
  const lastStateUpdate = ref(Date.now())
  const accumulatedTime = ref(0)

  // Animation loop
  const { pause, resume } = useRafFn(() => {
    const now = Date.now()
    const deltaMs = now - lastFrameTime.value
    lastFrameTime.value = now

    if (now - lastStateUpdate.value < CONFIG.stateUpdateInterval) return

    // Hue rotation
    const effectiveSpeed = CONFIG.baseRotationDuration / speedMultiplier.value
    state.value.baseHue = (state.value.baseHue + (360 / effectiveSpeed) * deltaMs) % 360

    // Semantic offset oscillation
    accumulatedTime.value += deltaMs * speedMultiplier.value
    const sinValue = Math.sin((accumulatedTime.value / CONFIG.semanticWavePeriod) * Math.PI * 2)
    state.value.hueOffset = sinValue * CONFIG.maxSemanticOffset

    lastStateUpdate.value = now
  })

  // Pause on blur, resume on focus
  const windowFocused = useWindowFocus()
  watch(windowFocused, (focused) => {
    if (focused) {
      lastFrameTime.value = Date.now()
      resume()
    } else {
      pause()
    }
  })

  // Dynamic selection color
  watch(
    () => colors.base,
    (baseColor) => {
      if (typeof document === 'undefined') return
      document.getElementById('vulpes-dynamic-selection')?.remove()
      const style = document.createElement('style')
      style.id = 'vulpes-dynamic-selection'
      style.textContent = `::selection { background-color: ${baseColor}33; color: ${colors.fg}; }`
      document.head.appendChild(style)
    },
    { immediate: true }
  )

  // Formatted display values
  const formattedOffset = computed(() => {
    const r = Math.round(state.value.hueOffset)
    return state.value.hueOffset >= 0 ? `+${r}°` : `${r}°`
  })

  const formattedOffsetAbs = computed(() => `±${Math.abs(Math.round(state.value.hueOffset))}°`)

  const formattedBaseHue = computed(() => `${Math.round(state.value.baseHue)}°`)

  const formattedWarningOffset = computed(() => {
    const r = Math.round(state.value.hueOffset)
    return state.value.hueOffset >= 0 ? `-${r}°` : `+${Math.abs(r)}°`
  })

  return {
    speedMultiplier: readonly(speedMultiplier),
    isHoveringAccelerator,
    toggleSpeed,
    pause,
    resume,
    formattedOffset,
    formattedOffsetAbs,
    formattedBaseHue,
    formattedWarningOffset,
  }
}
