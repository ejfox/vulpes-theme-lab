<script setup lang="ts">
import { VULPES_MONTHLY_PRESETS } from '~/utils/presets'
import { useRafFn, useWindowFocus } from '@vueuse/core'

useHead({
  title: 'vulpes — monochrome themes for terminal aesthetes',
  meta: [
    {
      name: 'description',
      content:
        'One theme, eight formats. Maximum signal, minimal variation. Watch hues shift in real-time.',
    },
  ],
})

const { state, colors } = useTheme()

// Use actual vulpes-month themes
const themes = VULPES_MONTHLY_PRESETS

// Speed multiplier for animation (1x or 4x)
const speedMultiplier = ref(1)

const toggleSpeed = () => {
  speedMultiplier.value = speedMultiplier.value === 1 ? 4 : 1
}

// Apply a preset theme to the page
const applyPreset = (preset: typeof VULPES_MONTHLY_PRESETS[0]) => {
  state.value.themeName = preset.name
  state.value.baseHue = preset.baseHue
  state.value.saturation = preset.baseSaturation
  state.value.mode = preset.isDark ? 'dark' : 'light'

  // Apply all offset properties
  state.value.errorOffset = preset.errorOffset
  state.value.warningOffset = preset.warningOffset
  state.value.keywordOffset = preset.keywordOffset
  state.value.stringOffset = preset.stringOffset
  state.value.numberOffset = preset.numberOffset
  state.value.functionOffset = preset.functionOffset
  state.value.constantOffset = preset.constantOffset
  state.value.typeOffset = preset.typeOffset
  state.value.variableOffset = preset.variableOffset
  state.value.operatorOffset = preset.operatorOffset
  state.value.builtinOffset = preset.builtinOffset
  state.value.parameterOffset = preset.parameterOffset
  state.value.propertyOffset = preset.propertyOffset
  state.value.namespaceOffset = preset.namespaceOffset
  state.value.macroOffset = preset.macroOffset
  state.value.tagOffset = preset.tagOffset
  state.value.punctuationOffset = preset.punctuationOffset
  state.value.headingOffset = preset.headingOffset
}

// Smooth hue rotation over 45 seconds with throttled state updates using VueUse
const lastTime = ref(Date.now())
const lastStateUpdate = ref(Date.now())
const baseAnimationSpeed = 45000 // 45 seconds for full rotation at 1x speed
const stateUpdateInterval = 100 // Update state max 10 times per second

const { pause, resume } = useRafFn(() => {
  const now = Date.now()
  const delta = now - lastTime.value
  lastTime.value = now

  // Only update reactive state every 100ms to avoid router history spam
  if (now - lastStateUpdate.value >= stateUpdateInterval) {
    const animationSpeed = baseAnimationSpeed / speedMultiplier.value
    state.value.baseHue = (state.value.baseHue + (360 / animationSpeed) * delta) % 360
    lastStateUpdate.value = now
  }
})

// Pause animation when window loses focus
const windowFocused = useWindowFocus()
watch(windowFocused, (focused) => {
  if (focused) {
    lastTime.value = Date.now() // Reset time to avoid huge delta jump
    resume()
  } else {
    pause()
  }
})

// Dynamic selection color
watch(
  () => colors.base,
  (base) => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style')
      style.id = 'dynamic-selection'
      const existing = document.getElementById('dynamic-selection')
      if (existing) existing.remove()

      style.textContent = `
        ::selection {
          background-color: ${base}33;
          color: ${colors.fg};
        }
      `
      document.head.appendChild(style)
    }
  },
  { immediate: true }
)

const features = [
  {
    title: 'Monochrome > Rainbow',
    desc: 'Traditional syntax highlighting uses 10+ colors fighting for attention. Vulpes uses one hue with ±7° semantic shifts. Your brain stops parsing colors and starts reading code. Information density goes up, cognitive load goes down.',
  },
  {
    title: 'Eight Formats, Zero Lock-In',
    desc: 'Export to Neovim, Ghostty, Bat, Yazi, Lazygit, ZSH, Alacritty, Wezterm. Change your hue at 2am? Every tool updates. No more maintaining 8 different theme files that drift out of sync.',
  },
  {
    title: 'Semantic Hue Shifts',
    desc: 'Errors shift +7° clockwise. Warnings shift -7° counter-clockwise. Success stays at base hue. Your eyes learn the pattern in minutes, never think about it again. Color becomes meaningful, not decorative.',
    hasColorDemo: true,
  },
]

const stats = [
  { label: 'Export Formats', value: '8' },
  { label: 'Semantic Offset', value: '±7°' },
  { label: 'Config Files', value: '1' },
]
</script>

<template>
  <div
    class="min-h-screen transition-colors duration-1000 ease-out"
    :style="{ backgroundColor: colors.bg, color: colors.fg }"
  >
    <!-- Nav -->
    <nav
      :style="{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: colors.bg,
        borderBottom: `1px solid ${colors.fg}0d`,
        backdropFilter: 'blur(8px)',
      }"
    >
      <div
        :style="{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }"
      >
        <div :style="{ display: 'flex', alignItems: 'center', gap: '32px' }">
          <span :style="{ fontSize: '18px', fontWeight: 'bold', color: colors.fg }">vulpes</span>
          <span
            @click="toggleSpeed"
            :style="{
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: colors.fg,
              backgroundColor: `${colors.base}33`,
              border: `1px solid ${colors.base}`,
              padding: '4px 12px',
              borderRadius: '8px',
              transition: 'all 0.1s',
              cursor: 'pointer',
              transform: speedMultiplier === 4 ? 'scale(1.1)' : 'scale(1)',
            }"
            :title="speedMultiplier === 4 ? 'Click to slow down (4x)' : 'Click to speed up (4x)'"
          >
            {{ Math.round(state.baseHue) }}°{{ speedMultiplier === 4 ? ' ⚡' : '' }}
          </span>
        </div>
        <NuxtLink
          to="/"
          :style="{
            fontSize: '14px',
            fontWeight: '500',
            color: colors.comment,
            textDecoration: 'none',
            transition: 'color 0.3s',
          }"
        >
          launch theme lab →
        </NuxtLink>
      </div>
    </nav>

    <!-- Hero -->
    <section class="px-8 pt-32 pb-24">
      <div class="max-w-7xl mx-auto">
        <div class="max-w-4xl">
          <h1
            class="text-7xl md:text-8xl font-bold leading-tight mb-8 transition-colors duration-1000"
            :style="{ color: colors.fg }"
          >
            Stop maintaining 8 theme files
          </h1>
          <p
            class="text-2xl leading-relaxed mb-12 transition-colors duration-1000"
            :style="{ color: colors.comment }"
          >
            Pick one hue. Generate themes for Neovim, Ghostty, Bat, Yazi, Lazygit, ZSH, Alacritty,
            and Wezterm.
            <span :style="{ color: colors.fg }"
              >Monochrome syntax highlighting that actually makes code more readable.</span
            >
          </p>
          <div class="flex gap-4">
            <NuxtLink
              to="/"
              class="px-8 py-4 rounded-xl font-medium transition-all duration-300"
              :style="{
                backgroundColor: `${colors.base}33`,
                border: `2px solid ${colors.base}`,
                color: colors.fg,
              }"
            >
              Try it now
            </NuxtLink>
            <a
              href="https://github.com/ejfox/vulpes-theme-lab"
              target="_blank"
              class="px-8 py-4 rounded-xl font-medium border transition-colors duration-300"
              :style="{
                borderColor: `${colors.fg}33`,
                color: colors.fg,
              }"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="px-8 py-16 border-t border-b" :style="{ borderColor: `${colors.fg}0d` }">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-3 gap-16">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div
              class="text-5xl font-bold mb-2 transition-colors duration-1000"
              :style="{ color: colors.base }"
            >
              {{ stat.value }}
            </div>
            <div
              class="text-sm font-medium uppercase tracking-wider transition-colors duration-1000"
              :style="{ color: colors.comment }"
            >
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Semantic Colors Demo -->
    <section class="px-8 py-32" :style="{ borderColor: `${colors.fg}0d` }">
      <div class="max-w-7xl mx-auto">
        <div class="mb-20">
          <h2
            class="text-5xl font-bold mb-4 transition-colors duration-1000"
            :style="{ color: colors.fg }"
          >
            How semantic hue shifts work
          </h2>
          <p class="text-xl transition-colors duration-1000" :style="{ color: colors.comment }">
            Errors at
            <span
              class="font-mono font-bold transition-colors duration-1000"
              :style="{ color: colors.error }"
              >+7°</span
            >, warnings at
            <span
              class="font-mono font-bold transition-colors duration-1000"
              :style="{ color: colors.warning }"
              >-7°</span
            >. Your eyes learn the pattern instantly.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-12">
          <!-- Base -->
          <div
            class="p-8 rounded-2xl border transition-colors duration-1000"
            :style="{
              backgroundColor: `${colors.base}1a`,
              borderColor: colors.base,
            }"
          >
            <div
              class="inline-block px-4 py-2 rounded-lg mb-4 font-mono text-sm transition-colors duration-1000"
              :style="{
                backgroundColor: `${colors.base}33`,
                border: `1px solid ${colors.base}`,
                color: colors.fg
              }"
            >
              base ({{ Math.round(state.baseHue) }}°)
            </div>
            <p class="text-lg transition-colors duration-1000" :style="{ color: colors.fg }">
              Primary accent. Buttons, links, highlights. The foundation of your theme.
            </p>
          </div>

          <!-- Error -->
          <div
            class="p-8 rounded-2xl border transition-colors duration-1000"
            :style="{
              backgroundColor: `${colors.error}1a`,
              borderColor: colors.error,
            }"
          >
            <div
              class="inline-block px-4 py-2 rounded-lg mb-4 font-mono text-sm transition-colors duration-1000"
              :style="{
                backgroundColor: `${colors.error}33`,
                border: `1px solid ${colors.error}`,
                color: colors.fg
              }"
            >
              error (+7°)
            </div>
            <p class="text-lg transition-colors duration-1000" :style="{ color: colors.fg }">
              Failures, deletions, critical states. Shifted 7° clockwise from base.
            </p>
          </div>

          <!-- Warning -->
          <div
            class="p-8 rounded-2xl border transition-colors duration-1000"
            :style="{
              backgroundColor: `${colors.warning}1a`,
              borderColor: colors.warning,
            }"
          >
            <div
              class="inline-block px-4 py-2 rounded-lg mb-4 font-mono text-sm transition-colors duration-1000"
              :style="{
                backgroundColor: `${colors.warning}33`,
                border: `1px solid ${colors.warning}`,
                color: colors.fg
              }"
            >
              warning (-7°)
            </div>
            <p class="text-lg transition-colors duration-1000" :style="{ color: colors.fg }">
              Cautions, deprecations, modified states. Shifted 7° counter-clockwise.
            </p>
          </div>

          <!-- Success -->
          <div
            class="p-8 rounded-2xl border transition-colors duration-1000"
            :style="{
              backgroundColor: `${colors.base}1a`,
              borderColor: colors.base,
            }"
          >
            <div
              class="inline-block px-4 py-2 rounded-lg mb-4 font-mono text-sm transition-colors duration-1000"
              :style="{
                backgroundColor: `${colors.base}33`,
                border: `1px solid ${colors.base}`,
                color: colors.fg
              }"
            >
              success (base hue)
            </div>
            <p class="text-lg transition-colors duration-1000" :style="{ color: colors.fg }">
              Completions, additions, confirmations. Same hue as base, different lightness.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Code Examples -->
    <section class="px-8 py-32 border-t" :style="{ borderColor: `${colors.fg}0d` }">
      <div class="max-w-7xl mx-auto">
        <div class="mb-20">
          <h2
            class="text-5xl font-bold mb-4 transition-colors duration-1000"
            :style="{ color: colors.fg }"
          >
            Monochrome syntax highlighting
          </h2>
          <p class="text-xl transition-colors duration-1000" :style="{ color: colors.comment }">
            Watch how code stays readable with just lightness variation. Colors indicate semantic
            meaning, not decoration.
          </p>
        </div>

        <!-- One killer example showing all syntax types -->
        <div class="max-w-5xl mx-auto" style="height: 600px">
          <CodePreview />
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="px-8 py-32">
      <div class="max-w-7xl mx-auto">
        <h2
          class="text-5xl font-bold mb-20 transition-colors duration-1000"
          :style="{ color: colors.fg }"
        >
          Why vulpes?
        </h2>
        <div class="grid md:grid-cols-3 gap-12">
          <div v-for="feature in features" :key="feature.title" class="space-y-4">
            <h3
              class="text-2xl font-bold transition-colors duration-1000"
              :style="{ color: colors.fg }"
            >
              {{ feature.title }}
            </h3>
            <p
              class="text-lg leading-relaxed transition-colors duration-1000"
              :style="{ color: colors.comment }"
              v-html="
                feature.desc
                  .replace(
                    '+7°',
                    `<span class='font-mono font-bold transition-colors duration-1000' style='color: ${colors.error}'>+7°</span>`
                  )
                  .replace(
                    '-7°',
                    `<span class='font-mono font-bold transition-colors duration-1000' style='color: ${colors.warning}'>-7°</span>`
                  )
              "
            ></p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="px-8 py-32 border-t" :style="{ borderColor: `${colors.fg}0d` }">
      <div class="max-w-7xl mx-auto text-center">
        <h2
          class="text-6xl font-bold mb-8 transition-colors duration-1000"
          :style="{ color: colors.fg }"
        >
          Start building your theme
        </h2>
        <p
          class="text-2xl mb-12 max-w-2xl mx-auto transition-colors duration-1000"
          :style="{ color: colors.comment }"
        >
          Pick a hue. Export everywhere. Watch the colors shift in real-time.
        </p>
        <NuxtLink
          to="/"
          class="inline-block px-12 py-5 rounded-xl text-lg font-medium transition-all duration-300"
          :style="{
            backgroundColor: `${colors.base}33`,
            border: `2px solid ${colors.base}`,
            color: colors.fg,
          }"
        >
          Launch theme lab
        </NuxtLink>
      </div>
    </section>

    <!-- Themes Data Table (Brutalist) -->
    <section class="border-t" :style="{ borderColor: `${colors.fg}33` }">
      <div class="max-w-7xl mx-auto px-8 py-16">
        <div class="mb-8">
          <h3
            class="text-xs font-mono uppercase tracking-wider mb-2"
            :style="{ color: colors.comment }"
          >
            vulpes-month
          </h3>
          <p class="text-sm font-mono" :style="{ color: colors.fg }">
            Daily theme experiments / {{ themes.length }} variations
          </p>
        </div>

        <!-- Brutalist data table -->
        <div
          class="border font-mono text-xs"
          :style="{
            borderColor: `${colors.fg}33`,
            backgroundColor: colors.bg,
          }"
        >
          <!-- Table header -->
          <div
            class="grid grid-cols-12 border-b font-bold"
            :style="{
              borderColor: `${colors.fg}33`,
              backgroundColor: `${colors.fg}0d`,
              color: colors.fg,
            }"
          >
            <div class="col-span-4 p-2 border-r" :style="{ borderColor: `${colors.fg}33` }">
              NAME
            </div>
            <div
              class="col-span-2 p-2 border-r text-right"
              :style="{ borderColor: `${colors.fg}33` }"
            >
              HUE
            </div>
            <div
              class="col-span-2 p-2 border-r text-right"
              :style="{ borderColor: `${colors.fg}33` }"
            >
              ERROR
            </div>
            <div
              class="col-span-2 p-2 border-r text-right"
              :style="{ borderColor: `${colors.fg}33` }"
            >
              WARN
            </div>
            <div class="col-span-2 p-2">PALETTE</div>
          </div>

          <!-- Table rows -->
          <div
            v-for="(theme, idx) in themes"
            :key="theme.name"
            class="grid grid-cols-12 border-b"
            :style="{
              borderColor: `${colors.fg}1a`,
              color: colors.fg,
              cursor: 'pointer',
              transition: 'all 0.1s',
            }"
            @click="applyPreset(theme)"
            @mouseenter="(e) => { e.currentTarget.style.backgroundColor = `${colors.fg}0d` }"
            @mouseleave="(e) => { e.currentTarget.style.backgroundColor = 'transparent' }"
          >
            <div class="col-span-4 p-2 border-r" :style="{ borderColor: `${colors.fg}1a` }">
              {{ theme.name }}
            </div>
            <div
              class="col-span-2 p-2 border-r text-right"
              :style="{
                borderColor: `${colors.fg}1a`,
                color: `hsl(${theme.baseHue}, ${theme.baseSaturation}%, ${theme.baseLightness}%)`,
              }"
            >
              {{ theme.baseHue }}°
            </div>
            <div
              class="col-span-2 p-2 border-r text-right"
              :style="{
                borderColor: `${colors.fg}1a`,
                color: `hsl(${(theme.baseHue + theme.errorOffset) % 360}, ${theme.baseSaturation}%, ${theme.baseLightness}%)`,
              }"
            >
              {{ (theme.baseHue + theme.errorOffset) % 360 }}°
            </div>
            <div
              class="col-span-2 p-2 border-r text-right"
              :style="{
                borderColor: `${colors.fg}1a`,
                color: `hsl(${(theme.baseHue + theme.warningOffset) % 360}, ${theme.baseSaturation}%, ${theme.baseLightness}%)`,
              }"
            >
              {{ (theme.baseHue + theme.warningOffset) % 360 }}°
            </div>
            <div class="col-span-2 p-2 flex gap-1">
              <!-- Base -->
              <div
                class="w-4 h-4 border"
                :style="{
                  backgroundColor: `hsl(${theme.baseHue}, ${theme.baseSaturation}%, ${theme.baseLightness}%)`,
                  borderColor: `${colors.fg}33`,
                }"
                :title="`base ${theme.baseHue}°`"
              ></div>
              <!-- Error offset -->
              <div
                class="w-4 h-4 border"
                :style="{
                  backgroundColor: `hsl(${(theme.baseHue + theme.errorOffset) % 360}, ${theme.baseSaturation}%, ${theme.baseLightness}%)`,
                  borderColor: `${colors.fg}33`,
                }"
                :title="`error +${theme.errorOffset}°`"
              ></div>
              <!-- Warning offset -->
              <div
                class="w-4 h-4 border"
                :style="{
                  backgroundColor: `hsl(${(theme.baseHue + theme.warningOffset) % 360}, ${theme.baseSaturation}%, ${theme.baseLightness}%)`,
                  borderColor: `${colors.fg}33`,
                }"
                :title="`warning +${theme.warningOffset}°`"
              ></div>
              <!-- Keyword offset -->
              <div
                class="w-4 h-4 border"
                :style="{
                  backgroundColor: `hsl(${(theme.baseHue + theme.keywordOffset) % 360}, ${theme.baseSaturation}%, ${theme.baseLightness}%)`,
                  borderColor: `${colors.fg}33`,
                }"
                :title="`keyword +${theme.keywordOffset}°`"
              ></div>
              <!-- String offset -->
              <div
                class="w-4 h-4 border"
                :style="{
                  backgroundColor: `hsl(${(theme.baseHue + theme.stringOffset + 360) % 360}, ${theme.baseSaturation}%, ${theme.baseLightness}%)`,
                  borderColor: `${colors.fg}33`,
                }"
                :title="`string ${theme.stringOffset}°`"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t" :style="{ borderColor: `${colors.fg}0d` }">
      <div class="max-w-7xl mx-auto px-8 py-16">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-lg font-bold mb-2" :style="{ color: colors.fg }">vulpes</div>
            <p class="text-sm" :style="{ color: colors.comment }">
              minimal theme generation for terminal aesthetes
            </p>
          </div>
          <div class="flex gap-8">
            <a
              href="https://github.com/ejfox/vulpes-theme-lab"
              target="_blank"
              class="text-sm font-medium transition-colors duration-300"
              :style="{ color: colors.comment }"
            >
              GitHub
            </a>
            <NuxtLink
              to="/"
              class="text-sm font-medium transition-colors duration-300"
              :style="{ color: colors.comment }"
            >
              Theme Lab
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
