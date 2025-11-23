<script setup lang="ts">
useHead({
  title: 'vulpes theme lab — showcase',
  meta: [{ name: 'description', content: 'minimal theme generation for terminal aesthetes' }],
})

interface Screenshot {
  label: string
  rotation: number
  x: number
  y: number
}

interface ToolCluster {
  title: string
  subtitle: string
  screenshots: Screenshot[]
}

// Use existing theme system and animate it
const { state, colors } = useTheme()

// Dynamic selection color & CSS custom properties
watch(
  [() => colors.base, () => colors.error, () => colors.warning],
  ([base, error, warning]) => {
    if (typeof document !== 'undefined') {
      // Set CSS custom properties for dynamic animations
      document.documentElement.style.setProperty('--color-base', base)
      document.documentElement.style.setProperty('--color-error', error)
      document.documentElement.style.setProperty('--color-warning', warning)

      // Dynamic selection styles
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

// 2025 CSS: View Transitions API
if (typeof document !== 'undefined' && 'startViewTransition' in document) {
  onMounted(() => {
    // Enable view transitions for SPA navigation
    const meta = document.createElement('meta')
    meta.name = 'view-transition'
    meta.content = 'same-origin'
    document.head.appendChild(meta)
  })
}

onMounted(() => {
  let lastTime = Date.now()
  const animationSpeed = 20000 // 20 seconds per full cycle

  const animate = () => {
    const now = Date.now()
    const delta = now - lastTime
    lastTime = now

    state.value.baseHue = (state.value.baseHue + (360 / animationSpeed) * delta) % 360
    requestAnimationFrame(animate)
  }
  animate()
})

const toolClusters: ToolCluster[] = [
  {
    title: 'neovim',
    subtitle: 'LSP / diagnostics / telescope',
    screenshots: [
      { label: 'code editing', rotation: -2.3, x: 20, y: 40 },
      { label: 'LSP diagnostics', rotation: 1.8, x: -30, y: 80 },
      { label: 'telescope finder', rotation: -1.2, x: 40, y: 120 },
    ],
  },
  {
    title: 'lazygit',
    subtitle: 'branch / diff / stash',
    screenshots: [
      { label: 'branch view', rotation: 2.1, x: -20, y: 30 },
      { label: 'diff panel', rotation: -1.5, x: 30, y: 70 },
    ],
  },
  {
    title: 'bottom',
    subtitle: 'system monitor / resources',
    screenshots: [
      { label: 'process list', rotation: -1.8, x: 10, y: 50 },
      { label: 'cpu graphs', rotation: 2.4, x: -25, y: 90 },
    ],
  },
  {
    title: 'yazi',
    subtitle: 'file manager / preview',
    screenshots: [
      { label: 'file browser', rotation: 1.3, x: -15, y: 40 },
      { label: 'preview pane', rotation: -2.6, x: 35, y: 85 },
    ],
  },
  {
    title: 'zsh + fzf',
    subtitle: 'shell / fuzzy search',
    screenshots: [
      { label: 'syntax highlighting', rotation: -2.1, x: 25, y: 45 },
      { label: 'fuzzy finder', rotation: 1.7, x: -20, y: 80 },
      { label: 'completion', rotation: -0.8, x: 15, y: 115 },
    ],
  },
  {
    title: 'bat + tmux',
    subtitle: 'syntax / multiplexer',
    screenshots: [
      { label: 'code display', rotation: 2.5, x: -30, y: 35 },
      { label: 'multi-pane', rotation: -1.4, x: 20, y: 75 },
    ],
  },
  {
    title: 'neomutt + wezterm',
    subtitle: 'email / terminal',
    screenshots: [
      { label: 'inbox', rotation: -2.8, x: 10, y: 40 },
      { label: 'config', rotation: 1.6, x: -35, y: 85 },
    ],
  },
  {
    title: 'terminals',
    subtitle: 'ghostty / alacritty',
    screenshots: [
      { label: 'ghostty', rotation: 1.9, x: 15, y: 50 },
      { label: 'alacritty', rotation: -2.2, x: -25, y: 90 },
    ],
  },
]
</script>

<template>
  <div
    class="min-h-screen transition-colors duration-500"
    :style="{ backgroundColor: colors.bg, color: colors.fg }"
  >
    <!-- Navigation -->
    <nav
      class="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b transition-colors duration-500"
      :style="{
        backgroundColor: `${colors.bg}66`,
        borderColor: `${colors.fg}1a`,
      }"
    >
      <div class="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
        <NuxtLink
          to="/"
          class="text-sm font-medium transition-all duration-400"
          :style="{ color: colors.comment }"
          @mouseenter="$event.target.style.color = colors.fg"
          @mouseleave="$event.target.style.color = colors.comment"
        >
          ← theme lab
        </NuxtLink>
        <span class="text-sm font-medium" :style="{ color: colors.comment }">showcase</span>
      </div>
    </nav>

    <!-- Hero -->
    <section
      class="relative pt-40 pb-32 px-6 overflow-hidden"
      :style="{ backgroundColor: colors.bg }"
    >
      <!-- Animated gradient orb -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-30 pointer-events-none transition-all duration-500"
        :style="{ background: `radial-gradient(circle, ${colors.base} 0%, transparent 70%)` }"
      ></div>

      <div class="max-w-5xl mx-auto text-center relative z-10">
        <h1
          class="text-[120px] leading-none font-bold mb-12 tracking-tight bg-clip-text text-transparent transition-all duration-500"
          :style="{ backgroundImage: `linear-gradient(to bottom, ${colors.fg}, ${colors.fg}66)` }"
        >
          vulpes
        </h1>
        <p
          class="text-3xl font-light max-w-3xl mx-auto leading-relaxed mb-16 transition-colors duration-500"
          :style="{ color: `${colors.fg}b3` }"
        >
          minimal theme generation for terminal aesthetes.<br />
          <span :style="{ color: colors.comment }">maximum signal. minimal variation.</span>
        </p>
        <div class="flex gap-4 justify-center">
          <NuxtLink
            to="/"
            class="px-8 py-4 backdrop-blur-xl border rounded-full transition-all duration-400 hover:scale-105 hover:shadow-2xl"
            :style="{
              backgroundColor: `${colors.fg}1a`,
              borderColor: `${colors.fg}33`,
              color: colors.fg,
            }"
            @mouseenter="$event.target.style.backgroundColor = `${colors.fg}33`"
            @mouseleave="$event.target.style.backgroundColor = `${colors.fg}1a`"
          >
            try it now
          </NuxtLink>
          <a
            href="#demo"
            class="px-8 py-4 bg-transparent border rounded-full transition-all duration-400"
            :style="{
              borderColor: `${colors.fg}1a`,
              color: colors.fg,
            }"
            @mouseenter="$event.target.style.borderColor = `${colors.fg}4d`"
            @mouseleave="$event.target.style.borderColor = `${colors.fg}1a`"
          >
            see it in action
          </a>
        </div>
      </div>
    </section>

    <!-- Philosophy -->
    <section class="py-32 px-6" :style="{ backgroundColor: colors.bg }">
      <div class="max-w-6xl mx-auto">
        <h2
          class="text-6xl font-bold mb-20 text-center bg-clip-text text-transparent transition-all duration-500"
          :style="{ backgroundImage: `linear-gradient(to right, ${colors.fg}, ${colors.fg}99)` }"
        >
          design principles
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <article
            v-for="principle in [
              {
                title: 'tuftian minimalism',
                text: 'every hue serves a purpose. no decoration for decoration\'s sake. information density without visual noise.',
              },
              {
                title: 'hue offset precision',
                text: '±7° hue shifts create semantic meaning while maintaining monochrome aesthetics. error at baseHue+7°. warning at baseHue-7°. success at baseHue.',
                code: true,
              },
              {
                title: '\'all red\' but readable',
                text: 'monochrome doesn\'t mean monotone. subtle hue variations carry critical information while maintaining visual coherence. your eyes adapt, information density increases.',
              },
              {
                title: 'unified ecosystem',
                text: 'one theme. eight formats. nvim, ghostty, bat, yazi, lazygit, zsh, neomutt, wezterm, alacritty. your entire terminal environment speaks the same visual language.',
              },
            ]"
            :key="principle.title"
            class="group relative p-8 rounded-3xl backdrop-blur-xl border transition-all duration-400 hover:scale-[1.02] hover:shadow-2xl"
            :style="{
              backgroundColor: `${colors.fg}0d`,
              borderColor: `${colors.fg}1a`,
            }"
            @mouseenter="
              $event.currentTarget.style.backgroundColor = `${colors.fg}1a`;
              $event.currentTarget.style.borderColor = `${colors.fg}33`;
            "
            @mouseleave="
              $event.currentTarget.style.backgroundColor = `${colors.fg}0d`;
              $event.currentTarget.style.borderColor = `${colors.fg}1a`;
            "
          >
            <h3
              class="text-2xl font-semibold mb-4 transition-colors duration-500"
              :style="{ color: colors.fg }"
            >
              {{ principle.title }}
            </h3>
            <p
              class="leading-relaxed transition-colors duration-500"
              :style="{ color: colors.comment }"
            >
              {{ principle.text }}
            </p>
            <div
              v-if="principle.code"
              class="mt-6 p-4 backdrop-blur-sm rounded-xl border font-mono text-xs transition-all duration-500"
              :style="{
                backgroundColor: `${colors.bg}66`,
                borderColor: `${colors.fg}1a`,
                color: `${colors.fg}cc`,
              }"
            >
              <code>const error = chroma.hsl(baseHue + 7, 0.85, 0.55)</code><br />
              <code>const warning = chroma.hsl(baseHue - 7, 0.85, 0.55)</code><br />
              <code>const base = chroma.hsl(baseHue, 0.85, 0.50)</code>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Screenshots Section - Brutalist Grid with Overlapping Polaroids -->
    <section class="py-40 px-6 overflow-hidden" :style="{ backgroundColor: colors.bg }">
      <div class="max-w-[1800px] mx-auto">
        <h2
          class="text-7xl font-bold mb-6 uppercase tracking-tight bg-clip-text text-transparent transition-all duration-500"
          :style="{ backgroundImage: `linear-gradient(to right, ${colors.fg}, ${colors.fg}99)` }"
        >
          in the wild
        </h2>
        <p
          class="text-lg mb-32 font-light transition-colors duration-500"
          :style="{ color: colors.comment }"
        >
          terminal themes that actually work
        </p>

        <!-- Brutalist Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-32">
          <div
            v-for="(cluster, idx) in toolClusters"
            :key="cluster.title"
            class="relative min-h-[600px]"
          >
            <div class="absolute top-0 left-0 w-full">
              <h3
                class="text-5xl font-bold mb-2 uppercase transition-colors duration-500"
                :style="{ color: colors.fg }"
              >
                {{ cluster.title }}
              </h3>
              <p
                class="font-mono text-xs uppercase tracking-wider transition-colors duration-500"
                :style="{ color: colors.comment }"
              >
                {{ cluster.subtitle }}
              </p>
            </div>
            <div class="screenshot-cluster mt-24">
              <div
                v-for="(screenshot, sIdx) in cluster.screenshots"
                :key="screenshot.label"
                class="screenshot-card"
                :style="{
                  transform: `rotate(${screenshot.rotation}deg) translate(${screenshot.x}px, ${screenshot.y}px)`,
                  zIndex: sIdx + 1,
                }"
              >
                <div
                  class="aspect-video backdrop-blur-xl border-2 shadow-2xl flex items-center justify-center rounded-lg transition-all duration-500"
                  :style="{
                    backgroundColor: `${colors.fg}0d`,
                    borderColor: `${colors.fg}33`,
                  }"
                >
                  <span
                    class="font-mono text-xs transition-colors duration-500"
                    :style="{ color: colors.comment }"
                    >[ {{ screenshot.label }} ]</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Live Hue Demo -->
    <section id="demo" class="relative py-40 px-6 overflow-hidden">
      <!-- Massive animated gradient background -->
      <div
        class="absolute inset-0 opacity-20 blur-[150px] pointer-events-none"
        :style="{
          background: `radial-gradient(ellipse at 50% 50%, ${colors.error} 0%, ${colors.base} 50%, ${colors.warning} 100%)`,
        }"
      ></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="text-center mb-24">
          <h2
            class="text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
          >
            see it in action
          </h2>
          <p class="text-xl text-white/50 font-light">
            live hue offset demonstration — watch the magic unfold
          </p>
        </div>

        <!-- Animated Color Bars with Glass Effect -->
        <div class="mb-32">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div
              v-for="colorInfo in [
                {
                  name: 'error',
                  color: colors.error,
                  offset: state.errorOffset,
                  label: `base+${state.hueOffset}°`,
                },
                { name: 'base', color: colors.base, offset: 0, label: 'base' },
                {
                  name: 'warning',
                  color: colors.warning,
                  offset: state.warningOffset,
                  label: `base-${state.hueOffset}°`,
                },
              ]"
              :key="colorInfo.name"
              class="group relative"
            >
              <div
                class="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-400"
                :style="{ background: colorInfo.color }"
              ></div>
              <div
                class="relative p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 group-hover:bg-white/10 transition-all duration-400"
              >
                <div class="flex justify-between items-center mb-4">
                  <span class="text-xs font-medium text-white/60 uppercase tracking-wider">{{
                    colorInfo.label
                  }}</span>
                  <span class="text-xs font-mono text-white/40"
                    >{{ Math.round(state.baseHue + colorInfo.offset) }}°</span
                  >
                </div>
                <div
                  class="h-32 rounded-2xl transition-all duration-500 shadow-2xl"
                  :style="{ backgroundColor: colorInfo.color }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Terminal Output with Glassmorphism -->
        <div class="max-w-4xl mx-auto">
          <div class="relative p-1 rounded-3xl bg-gradient-to-b from-white/20 to-white/5">
            <div class="bg-black/80 backdrop-blur-2xl rounded-3xl p-10 border border-white/10">
              <div class="space-y-3 font-mono text-base">
                <div class="flex items-center gap-4">
                  <span class="text-white/40">$</span>
                  <span class="text-white/90">npm run build</span>
                </div>
                <div class="flex items-center gap-4">
                  <span
                    class="transition-colors duration-500 text-xl"
                    :style="{ color: colors.base }"
                    >✓</span
                  >
                  <span class="text-white/60">TypeScript compiled successfully</span>
                </div>
                <div class="flex items-center gap-4">
                  <span
                    class="transition-colors duration-500 text-xl"
                    :style="{ color: colors.warning }"
                    >⚠</span
                  >
                  <span class="text-white/60">3 warnings found in unused imports</span>
                </div>
                <div class="flex items-center gap-4">
                  <span
                    class="transition-colors duration-500 text-xl"
                    :style="{ color: colors.error }"
                    >✗</span
                  >
                  <span class="text-white/60">Error: Module not found</span>
                </div>
                <div class="flex items-center gap-4">
                  <span class="transition-colors duration-500" :style="{ color: colors.base }"
                    >→</span
                  >
                  <span class="transition-colors duration-500" :style="{ color: colors.string }"
                    >./src/index.ts</span
                  >
                </div>
              </div>

              <div class="mt-10 pt-8 border-t border-white/10">
                <p class="text-white/40 text-sm text-center font-light">
                  subtle hue shifts. maximum information. zero visual chaos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Color Science -->
    <section
      class="py-20 px-6 border-t transition-all duration-500"
      :style="{
        backgroundColor: colors.bg,
        borderColor: `${colors.fg}1a`,
      }"
    >
      <div class="max-w-4xl mx-auto">
        <h2
          class="text-4xl font-bold mb-12 transition-colors duration-500"
          :style="{ color: colors.fg }"
        >
          the science
        </h2>

        <div class="space-y-12">
          <div>
            <h3
              class="text-2xl font-bold mb-6 transition-colors duration-500"
              :style="{ color: colors.fg }"
            >
              why ±7° hue offset?
            </h3>
            <p
              class="text-lg font-mono leading-relaxed mb-4 transition-colors duration-500"
              :style="{ color: `${colors.fg}cc` }"
            >
              7° is the minimum perceptual difference for reliable color discrimination while
              maintaining monochrome coherence. enough signal to matter. not so much that it breaks
              the aesthetic.
            </p>
            <div class="grid grid-cols-3 gap-4 mt-6">
              <div
                v-for="colorInfo in [
                  { color: colors.error, label: 'error (hue+7)' },
                  { color: colors.base, label: 'base (hue)' },
                  { color: colors.warning, label: 'warning (hue-7)' },
                ]"
                :key="colorInfo.label"
                class="text-center"
              >
                <div
                  class="aspect-square rounded mb-2 transition-colors duration-500"
                  :style="{ backgroundColor: colorInfo.color }"
                ></div>
                <span
                  class="text-sm font-mono transition-colors duration-500"
                  :style="{ color: colors.comment }"
                  >{{ colorInfo.label }}</span
                >
              </div>
            </div>
          </div>

          <article
            v-for="info in [
              {
                title: 'dark + light variants',
                text: 'every theme exports both dark and light variants. same hue relationships. different lightness values. seamless switching based on system appearance.',
              },
              {
                title: 'WCAG contrast validation',
                text: 'built-in contrast checking ensures text remains readable. warnings when foreground/background combinations fail WCAG AA standards. because aesthetics shouldn\'t sacrifice accessibility.',
              },
            ]"
            :key="info.title"
          >
            <h3
              class="text-2xl font-bold mb-6 transition-colors duration-500"
              :style="{ color: colors.fg }"
            >
              {{ info.title }}
            </h3>
            <p
              class="text-lg font-mono leading-relaxed transition-colors duration-500"
              :style="{ color: `${colors.fg}cc` }"
            >
              {{ info.text }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative py-40 px-6 overflow-hidden" :style="{ backgroundColor: colors.bg }">
      <!-- Gradient orb -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none transition-all duration-500"
        :style="{ background: `radial-gradient(circle, ${colors.base} 0%, transparent 70%)` }"
      ></div>

      <div class="max-w-5xl mx-auto text-center relative z-10">
        <h2
          class="text-7xl font-bold mb-8 bg-clip-text text-transparent transition-all duration-500"
          :style="{ backgroundImage: `linear-gradient(to bottom, ${colors.fg}, ${colors.fg}66)` }"
        >
          try it yourself
        </h2>
        <p
          class="text-2xl font-light mb-16 max-w-2xl mx-auto transition-colors duration-500"
          :style="{ color: `${colors.fg}b3` }"
        >
          adjust hue. tweak contrast. export everywhere.<br />
          <span :style="{ color: colors.comment }">your terminal. your way.</span>
        </p>
        <div class="flex gap-4 justify-center">
          <NuxtLink
            to="/"
            class="group relative px-12 py-5 rounded-full hover:scale-105 transition-all duration-400 font-medium text-lg overflow-hidden"
            :style="{
              backgroundColor: colors.fg,
              color: colors.bg,
            }"
          >
            <span class="relative z-10">launch theme lab</span>
          </NuxtLink>
          <a
            href="https://github.com/ejfox/vulpes-theme-lab"
            target="_blank"
            class="px-12 py-5 backdrop-blur-xl border rounded-full transition-all duration-400 font-medium text-lg"
            :style="{
              backgroundColor: `${colors.fg}0d`,
              borderColor: `${colors.fg}33`,
              color: colors.fg,
            }"
            @mouseenter="$event.target.style.backgroundColor = `${colors.fg}1a`"
            @mouseleave="$event.target.style.backgroundColor = `${colors.fg}0d`"
          >
            view on github
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer
      class="py-20 px-6 border-t transition-all duration-500"
      :style="{
        backgroundColor: colors.bg,
        borderColor: `${colors.fg}0d`,
      }"
    >
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <p
            class="text-sm font-light transition-colors duration-500"
            :style="{ color: colors.comment }"
          >
            built for terminal aesthetes who value precision over decoration
          </p>
        </div>
        <div class="flex justify-center gap-8 text-sm">
          <a
            href="https://github.com/ejfox/vulpes-theme-lab"
            class="transition-colors duration-400"
            :style="{ color: colors.comment }"
            @mouseenter="$event.target.style.color = `${colors.fg}b3`"
            @mouseleave="$event.target.style.color = colors.comment"
          >
            github
          </a>
          <NuxtLink
            to="/"
            class="transition-colors duration-400"
            :style="{ color: colors.comment }"
            @mouseenter="$event.target.style.color = `${colors.fg}b3`"
            @mouseleave="$event.target.style.color = colors.comment"
          >
            theme lab
          </NuxtLink>
          <NuxtLink
            to="/showcase"
            class="transition-colors duration-400"
            :style="{ color: colors.comment }"
            @mouseenter="$event.target.style.color = `${colors.fg}b3`"
            @mouseleave="$event.target.style.color = colors.comment"
          >
            showcase
          </NuxtLink>
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

html {
  scroll-behavior: smooth;
}

/* 2025 CSS: Squircle corners using mask-image */
.group.relative.p-8,
.screenshot-card > div,
nav,
.px-8.py-4,
.px-12.py-5 {
  --squircle-radius: 24px;
  --squircle-smooth: 60%;
  border-radius: var(--squircle-radius);
  /* Smooth iOS-like corners */
  mask-image: paint(squircle);
}

/* Fallback for browsers without paint API */
@supports not (mask-image: paint(squircle)) {
  .group.relative.p-8,
  .screenshot-card > div,
  nav,
  .px-8.py-4,
  .px-12.py-5 {
    border-radius: clamp(12px, 3vw, 28px);
  }
}

.screenshot-cluster {
  position: relative;
  width: 100%;
  /* Scroll-driven animation */
  animation: scroll-reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}

@keyframes scroll-reveal {
  from {
    opacity: 0;
    transform: translateY(80px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.screenshot-card {
  position: relative;
  transition: all 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  cursor: pointer;
  will-change: transform;
  /* Modern 3D perspective */
  transform-style: preserve-3d;
}

.screenshot-card:hover {
  transform: rotate(0deg) translate(0, -20px) scale(1.05) !important;
  z-index: 999 !important;
  /* 3D lift effect */
  filter: brightness(1.1);
}

.screenshot-card > div {
  transition: box-shadow 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  /* Modern shadow with color */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.screenshot-card:hover > div {
  box-shadow:
    0 40px 80px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(255, 255, 255, 0.1) !important;
}

/* Principle cards with modern effects */
.group.relative.p-8 {
  /* Subtle inner glow */
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
    0 1px 3px rgba(0, 0, 0, 0.1);
}

.group.relative.p-8:hover {
  /* Enhanced glow on hover */
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
    0 20px 40px rgba(0, 0, 0, 0.2);
}

/* Apple-style smooth animations */
@media (prefers-reduced-motion: no-preference) {
  section {
    animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  }

  /* Stagger animation for grid items */
  .grid > * {
    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  }

  .grid > *:nth-child(1) {
    animation-delay: 0.05s;
  }
  .grid > *:nth-child(2) {
    animation-delay: 0.1s;
  }
  .grid > *:nth-child(3) {
    animation-delay: 0.15s;
  }
  .grid > *:nth-child(4) {
    animation-delay: 0.2s;
  }
  .grid > *:nth-child(5) {
    animation-delay: 0.25s;
  }
  .grid > *:nth-child(6) {
    animation-delay: 0.3s;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 2025 CSS: Scroll-driven progress indicator */
@supports (animation-timeline: scroll()) {
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-base, #ef4444), var(--color-error, #f97316));
    transform-origin: 0 0;
    animation: scroll-progress linear;
    animation-timeline: scroll(root);
    z-index: 9999;
    opacity: 0.8;
  }

  @keyframes scroll-progress {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
}

/* Smooth backdrop blur with layer optimization */
@supports (backdrop-filter: blur(20px)) {
  .backdrop-blur-xl {
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
  }

  .backdrop-blur-2xl {
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
  }
}

/* Modern gradient mesh backgrounds */
.relative.py-40.px-6 > div[class*='absolute'] {
  mix-blend-mode: screen;
  filter: blur(120px);
  animation: gradient-shift 20s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.4;
  }
}

/* Premium button effects */
button,
a {
  -webkit-tap-highlight-color: transparent;
}

/* Pill button hover effect with scale and shadow */
.rounded-full {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.rounded-full:hover {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* Text gradient shimmer on hover */
.bg-clip-text {
  background-size: 200% 100%;
  transition: background-position 0.6s ease;
}

.bg-clip-text:hover {
  background-position: 100% 0;
}

/* Container for smooth color transitions */
* {
  transition-property: color, background-color, border-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

/* Disable transitions on specific elements */
.screenshot-card,
button,
a,
[class*='transition-all'] {
  transition-property: all;
}

/* 2025 CSS: View Transitions */
@supports (view-transition-name: auto) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0.6s;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  h1,
  h2,
  h3 {
    view-transition-name: var(--view-transition-name);
  }
}

/* 2025 CSS: Container Queries */
@container (min-width: 400px) {
  .screenshot-card > div {
    padding: 1rem;
  }
}

/* 2025 CSS: :has() selector for contextual styling */
.group:has(code) {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
}

/* Micro-interaction: Magnetic cursor effect on buttons */
@media (hover: hover) and (pointer: fine) {
  .rounded-full {
    position: relative;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .rounded-full:hover {
    transform: translateY(-2px);
  }

  .rounded-full:active {
    transform: translateY(0);
    transition-duration: 0.1s;
  }
}

/* 2025 CSS: Scroll shadows */
.overflow-hidden {
  background:
    linear-gradient(to bottom, var(--color-bg, #000) 30%, transparent),
    linear-gradient(to bottom, transparent, var(--color-bg, #000) 70%),
    radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0.2), transparent),
    radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.2), transparent);
  background-repeat: no-repeat;
  background-size:
    100% 40px,
    100% 40px,
    100% 14px,
    100% 14px;
  background-attachment: local, local, scroll, scroll;
}

/* 2025 CSS: Modern glass morphism with noise texture */
@supports (backdrop-filter: blur(40px)) {
  .backdrop-blur-2xl::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.5;
    mix-blend-mode: overlay;
  }
}

/* 2025 CSS: Smooth color interpolation */
@supports (color-mix(in oklch, red, blue)) {
  * {
    color-interpolation-filters: linearRGB;
  }
}

/* Neon glow effect on interactive elements */
@media (prefers-color-scheme: dark) {
  .rounded-full:hover {
    filter: drop-shadow(0 0 20px var(--color-base, #ef4444));
  }
}

/* 2025 CSS: Scroll snap for smooth section transitions */
html {
  scroll-snap-type: y proximity;
}

section {
  scroll-snap-align: start;
  scroll-snap-stop: normal;
}
</style>
