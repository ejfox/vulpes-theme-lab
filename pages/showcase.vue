<script setup lang="ts">
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

// Smooth hue rotation over 45 seconds with throttled state updates
onMounted(() => {
  let lastTime = Date.now()
  let lastStateUpdate = Date.now()
  const animationSpeed = 45000 // 45 seconds for full rotation
  const stateUpdateInterval = 100 // Update state max 10 times per second

  const animate = () => {
    const now = Date.now()
    const delta = now - lastTime
    lastTime = now

    // Only update reactive state every 100ms to avoid router history spam
    if (now - lastStateUpdate >= stateUpdateInterval) {
      state.value.baseHue = (state.value.baseHue + (360 / animationSpeed) * delta) % 360
      lastStateUpdate = now
    }

    requestAnimationFrame(animate)
  }
  animate()
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
    title: 'Monochrome Precision',
    desc: 'Single base hue. Semantic meaning through ±7° shifts. All signal, zero noise.',
  },
  {
    title: 'Eight Export Formats',
    desc: 'Neovim, Ghostty, Bat, Yazi, Lazygit, ZSH, Alacritty, Wezterm. One source of truth.',
  },
  {
    title: 'Hue Science',
    desc: 'Color theory baked in. Error at +7°, warning at -7°. Your eyes adapt, density increases.',
  },
]

const stats = [
  { label: 'Export Formats', value: '8' },
  { label: 'Hue Offset', value: '±7°' },
  { label: 'Base Colors', value: '16' },
]

// Example themes from vulpes-month
const themes = [
  { name: 'reddish-november', hue: 355, desc: 'deep crimson workspace' },
  { name: 'electric-lime', hue: 75, desc: 'acid green terminals' },
  { name: 'arctic-blue', hue: 195, desc: 'frozen tundra coding' },
  { name: 'sunset-orange', hue: 25, desc: 'warm canyon vibes' },
  { name: 'violet-dreams', hue: 270, desc: 'purple twilight aesthetic' },
  { name: 'miami-pink', hue: 330, desc: 'neon synthwave nights' },
]
</script>

<template>
  <div
    class="min-h-screen transition-colors duration-1000 ease-out"
    :style="{ backgroundColor: colors.bg, color: colors.fg }"
  >
    <!-- Nav -->
    <nav class="border-b" :style="{ borderColor: `${colors.fg}0d` }">
      <div class="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <span class="text-lg font-bold" :style="{ color: colors.fg }">vulpes</span>
          <span class="text-sm font-mono" :style="{ color: colors.comment }">
            {{ Math.round(state.baseHue) }}°
          </span>
        </div>
        <NuxtLink
          to="/"
          class="text-sm font-medium transition-colors duration-300"
          :style="{ color: colors.comment }"
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
            Monochrome themes for terminal aesthetes
          </h1>
          <p
            class="text-2xl leading-relaxed mb-12 transition-colors duration-1000"
            :style="{ color: colors.comment }"
          >
            One base hue. Eight export formats. Maximum signal, minimal variation.
            <span :style="{ color: colors.fg }">Watch the colors shift.</span>
          </p>
          <div class="flex gap-4">
            <NuxtLink
              to="/"
              class="px-8 py-4 rounded-xl font-medium transition-all duration-300"
              :style="{
                backgroundColor: colors.base,
                color: colors.bg,
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
            >
              {{ feature.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Themes Gallery -->
    <section class="px-8 py-32 border-t" :style="{ borderColor: `${colors.fg}0d` }">
      <div class="max-w-7xl mx-auto">
        <div class="mb-20">
          <h2
            class="text-5xl font-bold mb-4 transition-colors duration-1000"
            :style="{ color: colors.fg }"
          >
            From vulpes-month
          </h2>
          <p class="text-xl transition-colors duration-1000" :style="{ color: colors.comment }">
            A daily theme experiment. Same system, infinite variations.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="theme in themes"
            :key="theme.name"
            class="group relative p-8 rounded-2xl border transition-all duration-300"
            :style="{
              borderColor: `${colors.fg}1a`,
              backgroundColor: `${colors.fg}05`,
            }"
          >
            <div class="space-y-4">
              <div
                class="w-16 h-16 rounded-xl transition-colors duration-1000"
                :style="{ backgroundColor: colors.base }"
              ></div>
              <div>
                <h3
                  class="text-xl font-bold mb-2 transition-colors duration-1000"
                  :style="{ color: colors.fg }"
                >
                  {{ theme.name }}
                </h3>
                <p
                  class="text-sm transition-colors duration-1000"
                  :style="{ color: colors.comment }"
                >
                  {{ theme.desc }}
                </p>
                <p
                  class="text-xs font-mono mt-2 transition-colors duration-1000"
                  :style="{ color: colors.comment }"
                >
                  hue: {{ theme.hue }}°
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Semantic Colors Demo -->
    <section class="px-8 py-32 border-t" :style="{ borderColor: `${colors.fg}0d` }">
      <div class="max-w-7xl mx-auto">
        <div class="mb-20">
          <h2
            class="text-5xl font-bold mb-4 transition-colors duration-1000"
            :style="{ color: colors.fg }"
          >
            Semantic color system
          </h2>
          <p class="text-xl transition-colors duration-1000" :style="{ color: colors.comment }">
            Hue offsets create meaning. Your eyes adapt, information density increases.
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
              :style="{ backgroundColor: colors.base, color: colors.bg }"
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
              :style="{ backgroundColor: colors.error, color: colors.bg }"
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
              :style="{ backgroundColor: colors.warning, color: colors.bg }"
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
              backgroundColor: `${colors.success}1a`,
              borderColor: colors.success,
            }"
          >
            <div
              class="inline-block px-4 py-2 rounded-lg mb-4 font-mono text-sm transition-colors duration-1000"
              :style="{ backgroundColor: colors.success, color: colors.bg }"
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
    <section class="px-8 py-32">
      <div class="max-w-7xl mx-auto">
        <div class="mb-20">
          <h2
            class="text-5xl font-bold mb-4 transition-colors duration-1000"
            :style="{ color: colors.fg }"
          >
            Syntax highlighting
          </h2>
          <p class="text-xl transition-colors duration-1000" :style="{ color: colors.comment }">
            Monochrome code with semantic hue shifts. All signal, zero noise.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- TypeScript -->
          <div
            class="p-6 rounded-2xl border font-mono text-sm leading-relaxed transition-colors duration-1000"
            :style="{
              backgroundColor: colors.bg_alt,
              borderColor: `${colors.fg}1a`,
            }"
          >
            <div
              class="text-xs mb-4 uppercase tracking-wider transition-colors duration-1000"
              :style="{ color: colors.comment }"
            >
              TypeScript
            </div>
            <pre
              class="overflow-x-auto"
            ><code><span :style="{ color: colors.keyword }">interface</span> <span :style="{ color: colors.type }">User</span> {
  <span :style="{ color: colors.property }">id</span>: <span :style="{ color: colors.type }">number</span>
  <span :style="{ color: colors.property }">name</span>: <span :style="{ color: colors.type }">string</span>
  <span :style="{ color: colors.property }">isActive</span>: <span :style="{ color: colors.type }">boolean</span>
}

<span :style="{ color: colors.keyword }">async</span> <span :style="{ color: colors.keyword }">function</span> <span :style="{ color: colors.func }">getUser</span>(<span :style="{ color: colors.variable }">id</span>: <span :style="{ color: colors.type }">number</span>) {
  <span :style="{ color: colors.keyword }">const</span> <span :style="{ color: colors.variable }">response</span> <span :style="{ color: colors.operator }">=</span> <span :style="{ color: colors.keyword }">await</span> <span :style="{ color: colors.func }">fetch</span>(<span :style="{ color: colors.string }">`/api/users/${<span :style="{ color: colors.variable }">id</span>}`</span>)
  <span :style="{ color: colors.keyword }">return</span> <span :style="{ color: colors.variable }">response</span>.<span :style="{ color: colors.func }">json</span>()
}</code></pre>
          </div>

          <!-- Python -->
          <div
            class="p-6 rounded-2xl border font-mono text-sm leading-relaxed transition-colors duration-1000"
            :style="{
              backgroundColor: colors.bg_alt,
              borderColor: `${colors.fg}1a`,
            }"
          >
            <div
              class="text-xs mb-4 uppercase tracking-wider transition-colors duration-1000"
              :style="{ color: colors.comment }"
            >
              Python
            </div>
            <pre
              class="overflow-x-auto"
            ><code><span :style="{ color: colors.keyword }">class</span> <span :style="{ color: colors.type }">ThemeGenerator</span>:
    <span :style="{ color: colors.keyword }">def</span> <span :style="{ color: colors.func }">__init__</span>(<span :style="{ color: colors.variable }">self</span>, <span :style="{ color: colors.variable }">base_hue</span>):
        <span :style="{ color: colors.variable }">self</span>.<span :style="{ color: colors.property }">hue</span> <span :style="{ color: colors.operator }">=</span> <span :style="{ color: colors.variable }">base_hue</span>
        <span :style="{ color: colors.variable }">self</span>.<span :style="{ color: colors.property }">colors</span> <span :style="{ color: colors.operator }">=</span> {}

    <span :style="{ color: colors.keyword }">def</span> <span :style="{ color: colors.func }">generate</span>(<span :style="{ color: colors.variable }">self</span>):
        <span :style="{ color: colors.comment }"># Create semantic palette</span>
        <span :style="{ color: colors.keyword }">return</span> {
            <span :style="{ color: colors.string }">'error'</span>: <span :style="{ color: colors.variable }">self</span>.<span :style="{ color: colors.property }">hue</span> <span :style="{ color: colors.operator }">+</span> <span :style="{ color: colors.constant }">7</span>,
            <span :style="{ color: colors.string }">'warning'</span>: <span :style="{ color: colors.variable }">self</span>.<span :style="{ color: colors.property }">hue</span> <span :style="{ color: colors.operator }">-</span> <span :style="{ color: colors.constant }">7</span>
        }</code></pre>
          </div>

          <!-- Rust -->
          <div
            class="p-6 rounded-2xl border font-mono text-sm leading-relaxed transition-colors duration-1000"
            :style="{
              backgroundColor: colors.bg_alt,
              borderColor: `${colors.fg}1a`,
            }"
          >
            <div
              class="text-xs mb-4 uppercase tracking-wider transition-colors duration-1000"
              :style="{ color: colors.comment }"
            >
              Rust
            </div>
            <pre
              class="overflow-x-auto"
            ><code><span :style="{ color: colors.keyword }">use</span> <span :style="{ color: colors.type }">std</span>::<span :style="{ color: colors.type }">collections</span>::<span :style="{ color: colors.type }">HashMap</span>;

<span :style="{ color: colors.keyword }">fn</span> <span :style="{ color: colors.func }">create_palette</span>(<span :style="{ color: colors.variable }">hue</span>: <span :style="{ color: colors.type }">u16</span>) <span :style="{ color: colors.operator }">-></span> <span :style="{ color: colors.type }">HashMap</span><<span :style="{ color: colors.type }">String</span>, <span :style="{ color: colors.type }">u16</span>> {
    <span :style="{ color: colors.keyword }">let</span> <span :style="{ color: colors.keyword }">mut</span> <span :style="{ color: colors.variable }">colors</span> <span :style="{ color: colors.operator }">=</span> <span :style="{ color: colors.type }">HashMap</span>::<span :style="{ color: colors.func }">new</span>();
    <span :style="{ color: colors.variable }">colors</span>.<span :style="{ color: colors.func }">insert</span>(<span :style="{ color: colors.string }">"error"</span>.<span :style="{ color: colors.func }">to_string</span>(), <span :style="{ color: colors.variable }">hue</span> <span :style="{ color: colors.operator }">+</span> <span :style="{ color: colors.constant }">7</span>);
    <span :style="{ color: colors.variable }">colors</span>.<span :style="{ color: colors.func }">insert</span>(<span :style="{ color: colors.string }">"warning"</span>.<span :style="{ color: colors.func }">to_string</span>(), <span :style="{ color: colors.variable }">hue</span> <span :style="{ color: colors.operator }">-</span> <span :style="{ color: colors.constant }">7</span>);
    <span :style="{ color: colors.variable }">colors</span>
}</code></pre>
          </div>

          <!-- JSON -->
          <div
            class="p-6 rounded-2xl border font-mono text-sm leading-relaxed transition-colors duration-1000"
            :style="{
              backgroundColor: colors.bg_alt,
              borderColor: `${colors.fg}1a`,
            }"
          >
            <div
              class="text-xs mb-4 uppercase tracking-wider transition-colors duration-1000"
              :style="{ color: colors.comment }"
            >
              JSON Config
            </div>
            <pre class="overflow-x-auto"><code>{
  <span :style="{ color: colors.property }">"theme"</span>: <span :style="{ color: colors.string }">"vulpes-reddish"</span>,
  <span :style="{ color: colors.property }">"baseHue"</span>: <span :style="{ color: colors.constant }">355</span>,
  <span :style="{ color: colors.property }">"exports"</span>: [
    <span :style="{ color: colors.string }">"neovim"</span>,
    <span :style="{ color: colors.string }">"ghostty"</span>,
    <span :style="{ color: colors.string }">"bat"</span>
  ],
  <span :style="{ color: colors.property }">"dark"</span>: <span :style="{ color: colors.constant }">true</span>
}</code></pre>
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
            backgroundColor: colors.base,
            color: colors.bg,
          }"
        >
          Launch theme lab
        </NuxtLink>
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
