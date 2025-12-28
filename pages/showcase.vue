<script setup lang="ts">
import { VULPES_MONTHLY_PRESETS } from '~/utils/presets'

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

const { state, colors, lightColors } = useTheme()
const {
  speedMultiplier,
  isHoveringAccelerator,
  toggleSpeed,
  formattedOffset,
  formattedOffsetAbs,
  formattedWarningOffset,
} = useShowcaseAnimation()

const themes = VULPES_MONTHLY_PRESETS

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
  },
]

const stats = computed(() => [
  { label: 'Export Formats', value: '8' },
  { label: 'Semantic Offset', value: formattedOffsetAbs.value },
  { label: 'Config Files', value: '1' },
])

function applyPreset(preset: (typeof VULPES_MONTHLY_PRESETS)[0]) {
  state.value.themeName = preset.name
  state.value.baseHue = preset.baseHue
  state.value.saturation = preset.baseSaturation
  state.value.mode = preset.isDark ? 'dark' : 'light'

  const offsetKeys = [
    'errorOffset',
    'warningOffset',
    'keywordOffset',
    'stringOffset',
    'numberOffset',
    'functionOffset',
    'constantOffset',
    'typeOffset',
    'variableOffset',
    'operatorOffset',
    'builtinOffset',
    'parameterOffset',
    'propertyOffset',
    'namespaceOffset',
    'macroOffset',
    'tagOffset',
    'punctuationOffset',
    'headingOffset',
  ] as const
  for (const key of offsetKeys) state.value[key] = preset[key]
}
</script>

<template>
  <div
    class="showcase-root min-h-screen transition-colors duration-1000 ease-out"
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
        <div :style="{ display: 'flex', alignItems: 'center', gap: '24px' }">
          <span :style="{ fontSize: '18px', fontWeight: 'bold', color: colors.fg }">vulpes</span>

          <!-- Live formula visualization - THE ACCELERATOR -->
          <div
            @click="toggleSpeed"
            @mouseenter="isHoveringAccelerator = true"
            @mouseleave="isHoveringAccelerator = false"
            :style="{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              borderRadius: '12px',
              backgroundColor: isHoveringAccelerator ? `${colors.base}25` : `${colors.fg}08`,
              border: `2px solid ${isHoveringAccelerator ? colors.base : colors.fg + '15'}`,
              cursor: 'pointer',
              transition:
                'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s, border-color 0.3s, box-shadow 0.3s',
              transform: isHoveringAccelerator
                ? `scale(1.08) skewX(-2deg) translateY(4px)`
                : speedMultiplier === 4
                  ? 'scale(1.02)'
                  : 'scale(1)',
              boxShadow: isHoveringAccelerator
                ? `0 8px 32px ${colors.base}40, 0 0 0 4px ${colors.base}15, inset 0 1px 0 ${colors.fg}20`
                : speedMultiplier === 4
                  ? `0 4px 20px ${colors.base}30`
                  : 'none',
              zIndex: isHoveringAccelerator ? 10 : 1,
              transformOrigin: 'center center',
            }"
          >
            <!-- Hover prompt - appears BELOW -->
            <div
              :style="{
                position: 'absolute',
                bottom: '-32px',
                left: '50%',
                transform: `translateX(-50%) ${isHoveringAccelerator ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.8)'}`,
                opacity: isHoveringAccelerator ? 1 : 0,
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }"
            >
              <span
                :style="{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: colors.base,
                  backgroundColor: colors.bg,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: `1px solid ${colors.base}`,
                  boxShadow: `0 4px 12px ${colors.base}30`,
                }"
              >
                {{ speedMultiplier === 4 ? 'slow down (space)' : 'speed up (space)' }}
              </span>
            </div>

            <!-- Animated background glow -->
            <div
              v-if="isHoveringAccelerator || speedMultiplier === 4"
              :style="{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '20px',
                background: `linear-gradient(90deg, ${colors.error}30, ${colors.base}30, ${colors.warning}30)`,
                filter: 'blur(12px)',
                opacity: isHoveringAccelerator ? 0.8 : 0.4,
                transition: 'opacity 0.3s',
                zIndex: -1,
                animation: speedMultiplier === 4 ? 'pulse 1s ease-in-out infinite' : 'none',
              }"
            ></div>

            <!-- Base hue -->
            <div :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
              <div
                :style="{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: colors.base,
                  boxShadow: isHoveringAccelerator
                    ? `0 0 16px ${colors.base}, 0 0 32px ${colors.base}66`
                    : `0 0 8px ${colors.base}66`,
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  transform: isHoveringAccelerator ? 'scale(1.3)' : 'scale(1)',
                }"
              ></div>
              <span
                :style="{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: colors.comment,
                }"
                >base</span
              >
              <span
                :style="{
                  fontSize: '16px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  color: colors.fg,
                  minWidth: '42px',
                  display: 'inline-block',
                  textAlign: 'right',
                }"
              >
                {{ String(Math.round(state.baseHue)).padStart(3, '\u2007') }}°
              </span>
            </div>

            <!-- Arrow - animated on hover -->
            <span
              :style="{
                color: isHoveringAccelerator ? colors.base : colors.comment,
                fontSize: '14px',
                transition: 'color 0.3s, transform 0.3s',
                transform: isHoveringAccelerator
                  ? 'translateX(4px) scale(1.3)'
                  : 'translateX(0) scale(1)',
                display: 'inline-block',
              }"
              >→</span
            >

            <!-- Error color -->
            <div :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
              <div
                :style="{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: colors.error,
                  boxShadow: isHoveringAccelerator
                    ? `0 0 16px ${colors.error}, 0 0 32px ${colors.error}66`
                    : `0 0 8px ${colors.error}66`,
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  transform: isHoveringAccelerator ? 'scale(1.3)' : 'scale(1)',
                }"
              ></div>
              <span
                :style="{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: colors.comment,
                }"
                >error</span
              >
              <span
                :style="{
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  color: colors.error,
                  minWidth: '38px',
                  display: 'inline-block',
                  textAlign: 'right',
                }"
              >
                {{
                  (state.hueOffset >= 0 ? '+' : '') +
                  String(Math.round(state.hueOffset)).padStart(2, '\u2007')
                }}°
              </span>
            </div>

            <!-- Warning color -->
            <div :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
              <div
                :style="{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: colors.warning,
                  boxShadow: isHoveringAccelerator
                    ? `0 0 16px ${colors.warning}, 0 0 32px ${colors.warning}66`
                    : `0 0 8px ${colors.warning}66`,
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  transform: isHoveringAccelerator ? 'scale(1.3)' : 'scale(1)',
                }"
              ></div>
              <span
                :style="{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: colors.comment,
                }"
                >warn</span
              >
              <span
                :style="{
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  color: colors.warning,
                  minWidth: '38px',
                  display: 'inline-block',
                  textAlign: 'right',
                }"
              >
                {{
                  (state.hueOffset >= 0 ? '-' : '+') +
                  String(Math.abs(Math.round(state.hueOffset))).padStart(2, '\u2007')
                }}°
              </span>
            </div>

            <!-- Speed indicator - NOW WITH PIZZAZZ -->
            <span
              v-if="speedMultiplier === 4"
              :style="{
                fontSize: '12px',
                color: colors.base,
                fontWeight: 'bold',
                animation: 'pulse 0.5s ease-in-out infinite',
              }"
              >⚡4x</span
            >
          </div>
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
            class="font-ui text-7xl md:text-8xl font-bold leading-tight mb-8 transition-colors duration-1000"
            :style="{ color: colors.fg }"
          >
            One hue. Eight apps. Zero drift.
          </h1>
          <p
            class="font-body text-2xl leading-relaxed mb-8 transition-colors duration-1000"
            :style="{ color: colors.comment }"
          >
            Watch this page shift through the entire color wheel while
            <span class="font-code" :style="{ color: colors.error }">errors</span>,
            <span class="font-code" :style="{ color: colors.warning }">warnings</span>, and
            <span class="font-code" :style="{ color: colors.base }">accents</span>
            stay semantically distinct. That's the trick:
            <span :style="{ color: colors.fg }"
              >pick any base hue, and vulpes derives every other color from it.</span
            >
          </p>
          <p
            class="font-body text-xl leading-relaxed mb-12 transition-colors duration-1000"
            :style="{ color: colors.comment }"
          >
            Export to <span class="font-code">Neovim</span>, <span class="font-code">Ghostty</span>,
            <span class="font-code">Bat</span>, <span class="font-code">Yazi</span>,
            <span class="font-code">Lazygit</span>, <span class="font-code">ZSH</span>,
            <span class="font-code">Alacritty</span>, and <span class="font-code">Wezterm</span>.
            Change your mind at 2am? Every tool updates together.
          </p>
          <div class="flex gap-4">
            <NuxtLink
              to="/"
              class="font-ui px-8 py-4 rounded-xl font-medium transition-all duration-300"
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
              class="font-ui px-8 py-4 rounded-xl font-medium border transition-colors duration-300"
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

    <!-- Export Formats Grid -->
    <section class="px-8 py-20 border-b" :style="{ borderColor: `${colors.fg}0d` }">
      <div class="max-w-7xl mx-auto">
        <p
          class="text-center text-sm uppercase tracking-widest mb-12 transition-colors duration-1000"
          :style="{ color: colors.comment }"
        >
          One theme, eight formats
        </p>
        <div class="grid grid-cols-4 md:grid-cols-8 gap-8 items-center justify-items-center">
          <!-- Neovim - Official Simple Icons logo -->
          <div class="flex flex-col items-center gap-3 group">
            <div
              class="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
              :style="{ backgroundColor: `${colors.base}15` }"
            >
              <svg viewBox="0 0 24 24" class="w-7 h-7" :style="{ fill: colors.base }">
                <path
                  d="M2.214 4.954v13.615L7.655 24V10.314L3.312 3.845 3.312 3.845 2.214 4.954zm4.999 17.98l-4.557-4.548V5.136l.59-.596 3.967 5.908v12.485zm14.573-4.457l-.862.937-4.24-6.376V0l5.068 5.092.034 13.385zM7.431.001l12.998 19.835-3.637 3.637L3.787 3.683 7.43 0z"
                />
              </svg>
            </div>
            <span
              class="text-xs font-medium transition-colors duration-300"
              :style="{ color: colors.comment }"
              >Neovim</span
            >
          </div>

          <!-- Ghostty - Pixelated text (no official simple icon) -->
          <div class="flex flex-col items-center gap-3 group">
            <div
              class="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
              :style="{ backgroundColor: `${colors.base}15` }"
            >
              <span
                class="transition-colors duration-300"
                :style="{
                  fontFamily: 'VT323, monospace',
                  fontSize: '22px',
                  color: colors.base,
                  letterSpacing: '-1px',
                }"
                >👻</span
              >
            </div>
            <span
              class="text-xs font-medium transition-colors duration-300"
              :style="{ color: colors.comment }"
              >Ghostty</span
            >
          </div>

          <!-- Alacritty - Official Simple Icons logo -->
          <div class="flex flex-col items-center gap-3 group">
            <div
              class="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
              :style="{ backgroundColor: `${colors.base}15` }"
            >
              <svg viewBox="0 0 24 24" class="w-7 h-7" :style="{ fill: colors.base }">
                <path
                  d="m10.065 0-8.57 21.269h3.595l6.91-16.244 6.91 16.244h3.594l-8.57-21.269zm1.935 9.935c-0.76666 1.8547-1.5334 3.7094-2.298 5.565 1.475 4.54 1.475 4.54 2.298 8.5 0.823-3.96 0.823-3.96 2.297-8.5-0.76637-1.8547-1.5315-3.7099-2.297-5.565z"
                />
              </svg>
            </div>
            <span
              class="text-xs font-medium transition-colors duration-300"
              :style="{ color: colors.comment }"
              >Alacritty</span
            >
          </div>

          <!-- Wezterm - Pixelated text (no official simple icon) -->
          <div class="flex flex-col items-center gap-3 group">
            <div
              class="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
              :style="{ backgroundColor: `${colors.base}15` }"
            >
              <span
                class="transition-colors duration-300"
                :style="{
                  fontFamily: 'VT323, monospace',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: colors.base,
                }"
                >WEZ</span
              >
            </div>
            <span
              class="text-xs font-medium transition-colors duration-300"
              :style="{ color: colors.comment }"
              >Wezterm</span
            >
          </div>

          <!-- Bat - Pixelated text (no official simple icon) -->
          <div class="flex flex-col items-center gap-3 group">
            <div
              class="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
              :style="{ backgroundColor: `${colors.base}15` }"
            >
              <span
                class="transition-colors duration-300"
                :style="{
                  fontFamily: 'VT323, monospace',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: colors.base,
                }"
                >BAT</span
              >
            </div>
            <span
              class="text-xs font-medium transition-colors duration-300"
              :style="{ color: colors.comment }"
              >Bat</span
            >
          </div>

          <!-- Yazi - Pixelated text with duck emoji (yazi means duck) -->
          <div class="flex flex-col items-center gap-3 group">
            <div
              class="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
              :style="{ backgroundColor: `${colors.base}15` }"
            >
              <span
                class="transition-colors duration-300"
                :style="{
                  fontFamily: 'VT323, monospace',
                  fontSize: '22px',
                  color: colors.base,
                }"
                >🦆</span
              >
            </div>
            <span
              class="text-xs font-medium transition-colors duration-300"
              :style="{ color: colors.comment }"
              >Yazi</span
            >
          </div>

          <!-- Lazygit - Git icon (official Simple Icons) -->
          <div class="flex flex-col items-center gap-3 group">
            <div
              class="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
              :style="{ backgroundColor: `${colors.base}15` }"
            >
              <svg viewBox="0 0 24 24" class="w-7 h-7" :style="{ fill: colors.base }">
                <path
                  d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"
                />
              </svg>
            </div>
            <span
              class="text-xs font-medium transition-colors duration-300"
              :style="{ color: colors.comment }"
              >Lazygit</span
            >
          </div>

          <!-- ZSH - GNU Bash icon (official Simple Icons) -->
          <div class="flex flex-col items-center gap-3 group">
            <div
              class="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
              :style="{ backgroundColor: `${colors.base}15` }"
            >
              <svg viewBox="0 0 24 24" class="w-7 h-7" :style="{ fill: colors.base }">
                <path
                  d="M21.038,4.9l-7.577-4.498C13.009,0.134,12.505,0,12,0c-0.505,0-1.009,0.134-1.462,0.403L2.961,4.9 C2.057,5.437,1.5,6.429,1.5,7.503v8.995c0,1.073,0.557,2.066,1.462,2.603l7.577,4.497C10.991,23.866,11.495,24,12,24 c0.505,0,1.009-0.134,1.461-0.402l7.577-4.497c0.904-0.537,1.462-1.529,1.462-2.603V7.503C22.5,6.429,21.943,5.437,21.038,4.9z M15.17,18.946l0.013,0.646c0.001,0.078-0.05,0.167-0.111,0.198l-0.383,0.22c-0.061,0.031-0.111-0.007-0.112-0.085L14.57,19.29 c-0.328,0.136-0.66,0.169-0.872,0.084c-0.04-0.016-0.057-0.075-0.041-0.142l0.139-0.584c0.011-0.046,0.036-0.092,0.069-0.121 c0.012-0.011,0.024-0.02,0.036-0.026c0.022-0.011,0.043-0.014,0.062-0.006c0.229,0.077,0.521,0.041,0.802-0.101 c0.357-0.181,0.596-0.545,0.592-0.907c-0.003-0.328-0.181-0.465-0.613-0.468c-0.55,0.001-1.064-0.107-1.072-0.917 c-0.007-0.667,0.34-1.361,0.889-1.8l-0.007-0.652c-0.001-0.08,0.048-0.168,0.111-0.2l0.37-0.236 c0.061-0.031,0.111,0.007,0.112,0.087l0.006,0.653c0.273-0.109,0.511-0.138,0.726-0.088c0.047,0.012,0.067,0.076,0.048,0.151 l-0.144,0.578c-0.011,0.044-0.036,0.088-0.065,0.116c-0.012,0.012-0.025,0.021-0.038,0.028c-0.019,0.01-0.038,0.013-0.057,0.009 c-0.098-0.022-0.332-0.073-0.699,0.113c-0.385,0.195-0.52,0.53-0.517,0.778c0.003,0.297,0.155,0.387,0.681,0.396 c0.7,0.012,1.003,0.318,1.01,1.023C16.105,17.747,15.736,18.491,15.17,18.946z M19.143,17.859c0,0.06-0.008,0.116-0.058,0.145 l-1.916,1.164c-0.05,0.029-0.09,0.004-0.09-0.056v-0.494c0-0.06,0.037-0.093,0.087-0.122l1.887-1.129 c0.05-0.029,0.09-0.004,0.09,0.056V17.859z M20.459,6.797l-7.168,4.427c-0.894,0.523-1.553,1.109-1.553,2.187v8.833 c0,0.645,0.26,1.063,0.66,1.184c-0.131,0.023-0.264,0.039-0.398,0.039c-0.42,0-0.833-0.114-1.197-0.33L3.226,18.64 c-0.741-0.44-1.201-1.261-1.201-2.142V7.503c0-0.881,0.46-1.702,1.201-2.142l7.577-4.498c0.363-0.216,0.777-0.33,1.197-0.33 c0.419,0,0.833,0.114,1.197,0.33l7.577,4.498c0.624,0.371,1.046,1.013,1.164,1.732C21.686,6.557,21.12,6.411,20.459,6.797z"
                />
              </svg>
            </div>
            <span
              class="text-xs font-medium transition-colors duration-300"
              :style="{ color: colors.comment }"
              >ZSH</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Code Examples - HERO SECTION -->
    <section class="px-8 py-24 border-b" :style="{ borderColor: `${colors.fg}0d` }">
      <div class="max-w-7xl mx-auto">
        <div class="mb-12 text-center">
          <h2
            class="text-6xl font-bold mb-6 transition-colors duration-1000"
            :style="{ color: colors.fg }"
          >
            One hue. Full spectrum.
          </h2>
          <p
            class="text-xl max-w-2xl mx-auto transition-colors duration-1000"
            :style="{ color: colors.comment }"
          >
            Keywords, strings, functions, types, constants, operators, comments. All derived from a
            single base hue with semantic shifts.
          </p>
        </div>

        <!-- Full-width code preview -->
        <div class="mx-auto" style="height: 720px; max-width: 1000px">
          <CodePreview />
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
              >{{ formattedOffset }}</span
            >, warnings at
            <span
              class="font-mono font-bold transition-colors duration-1000"
              :style="{ color: colors.warning }"
              >{{ formattedWarningOffset }}</span
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
                color: colors.fg,
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
                color: colors.fg,
              }"
            >
              error ({{ formattedOffset }})
            </div>
            <p class="text-lg transition-colors duration-1000" :style="{ color: colors.fg }">
              Failures, deletions, critical states. Shifted {{ formattedOffsetAbs }} from base.
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
                color: colors.fg,
              }"
            >
              warning ({{ formattedWarningOffset }})
            </div>
            <p class="text-lg transition-colors duration-1000" :style="{ color: colors.fg }">
              Cautions, deprecations, modified states. Shifted {{ formattedOffsetAbs }} opposite.
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
                color: colors.fg,
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
                    `<span class='font-mono font-bold transition-colors duration-1000' style='color: ${colors.error}'>${formattedOffset}</span>`
                  )
                  .replace(
                    '-7°',
                    `<span class='font-mono font-bold transition-colors duration-1000' style='color: ${colors.warning}'>${formattedWarningOffset}</span>`
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

    <!-- Maps Too -->
    <section class="px-8 py-32 border-t" :style="{ borderColor: `${colors.fg}0d` }">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div class="max-w-xl">
            <p
              class="text-sm font-mono uppercase tracking-widest mb-4 transition-colors duration-1000"
              :style="{ color: colors.base }"
            >
              But wait, there's more
            </p>
            <h2
              class="text-5xl font-bold mb-6 transition-colors duration-1000"
              :style="{ color: colors.fg }"
            >
              Cartography, themed.
            </h2>
            <p
              class="text-xl mb-8 transition-colors duration-1000"
              :style="{ color: colors.comment }"
            >
              Export MapLibre GL styles with semantic hue shifts. Water stays blue, parks stay
              green—but everything else adapts to your palette.
            </p>
            <div class="flex flex-wrap gap-3">
              <span
                v-for="feature in ['Water', 'Parks', 'Roads', 'Buildings', 'Labels']"
                :key="feature"
                class="px-3 py-1 rounded-full text-xs font-mono transition-colors duration-1000"
                :style="{
                  backgroundColor: `${colors.base}15`,
                  border: `1px solid ${colors.base}33`,
                  color: colors.fg,
                }"
              >
                {{ feature }}
              </span>
            </div>
          </div>

          <!-- Live Map -->
          <div
            class="rounded-2xl overflow-hidden border transition-colors duration-1000"
            :style="{
              borderColor: colors.base,
              minHeight: '500px',
              height: '500px',
              display: 'flex',
              flexDirection: 'column',
            }"
          >
            <ClientOnly>
              <div style="flex: 1; min-height: 0; display: flex; flex-direction: column">
                <MapPreview />
              </div>
              <template #fallback>
                <div
                  class="w-full h-full flex items-center justify-center"
                  :style="{ backgroundColor: colors.bg }"
                >
                  <span :style="{ color: colors.comment }">Loading map...</span>
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>
      </div>
    </section>

    <!-- One More Thing: Light Mode -->
    <section class="px-8 py-32 border-t" :style="{ borderColor: `${colors.fg}0d` }">
      <div class="max-w-7xl mx-auto">
        <div class="max-w-3xl mb-16">
          <p
            class="text-xl mb-4 transition-colors duration-1000"
            :style="{ color: colors.comment }"
          >
            Oh, and one more thing...
          </p>
          <h2
            class="text-5xl font-bold mb-6 transition-colors duration-1000"
            :style="{ color: colors.fg }"
          >
            Light mode. Same math.
          </h2>
          <p class="text-xl transition-colors duration-1000" :style="{ color: colors.comment }">
            Every theme exports both variants. The semantic relationships stay identical—only the
            lightness inverts.
          </p>
        </div>

        <!-- Light mode code preview -->
        <div
          class="max-w-5xl mx-auto rounded-2xl overflow-hidden border transition-colors duration-1000"
          :style="{
            backgroundColor: lightColors.bg,
            borderColor: lightColors.base,
          }"
        >
          <div
            class="px-4 py-2 border-b flex items-center justify-between transition-colors duration-1000"
            :style="{
              backgroundColor: `${lightColors.base}15`,
              borderColor: lightColors.base,
            }"
          >
            <span
              class="text-xs font-mono uppercase tracking-wider transition-colors duration-1000"
              :style="{ color: lightColors.base }"
              >Light Mode</span
            >
            <div class="flex gap-4 text-xs font-mono" :style="{ color: lightColors.comment }">
              <span
                >base
                <span :style="{ color: lightColors.base }"
                  >{{ Math.round(state.baseHue) }}°</span
                ></span
              >
              <span
                >error
                <span :style="{ color: lightColors.error }">{{ formattedOffset }}</span></span
              >
              <span
                >warn
                <span :style="{ color: lightColors.warning }">{{
                  formattedWarningOffset
                }}</span></span
              >
            </div>
          </div>
          <pre
            class="p-6 text-sm font-mono overflow-x-auto transition-colors duration-1000"
            :style="{ color: lightColors.fg }"
          ><span :style="{ color: lightColors.keyword }">const</span> <span :style="{ color: lightColors.variable }">theme</span> = {
  <span :style="{ color: lightColors.property }">name</span>: <span :style="{ color: lightColors.string }">'vulpes-light'</span>,
  <span :style="{ color: lightColors.property }">baseHue</span>: <span :style="{ color: lightColors.number }">{{ Math.round(state.baseHue) }}</span>,
  <span :style="{ color: lightColors.property }">semanticOffset</span>: <span :style="{ color: lightColors.number }">{{ Math.round(state.hueOffset) }}</span>,
}

<span :style="{ color: lightColors.keyword }">function</span> <span :style="{ color: lightColors.function }">deriveColors</span>(<span :style="{ color: lightColors.parameter }">hue</span>, <span :style="{ color: lightColors.parameter }">offset</span>) {
  <span :style="{ color: lightColors.comment }">// Same formula, inverted lightness</span>
  <span :style="{ color: lightColors.keyword }">return</span> {
    <span :style="{ color: lightColors.property }">error</span>: <span :style="{ color: lightColors.function }">hsl</span>(<span :style="{ color: lightColors.parameter }">hue</span> + <span :style="{ color: lightColors.parameter }">offset</span>),  <span :style="{ color: lightColors.comment }">// {{ formattedOffset }}</span>
    <span :style="{ color: lightColors.property }">warning</span>: <span :style="{ color: lightColors.function }">hsl</span>(<span :style="{ color: lightColors.parameter }">hue</span> - <span :style="{ color: lightColors.parameter }">offset</span>), <span :style="{ color: lightColors.comment }">// {{ formattedWarningOffset }}</span>
  }
}</pre>
        </div>
      </div>
    </section>

    <!-- Preset Showcase - Visual Grid -->
    <section
      class="border-t"
      :style="{ borderColor: `${colors.fg}33`, backgroundColor: colors.bg }"
    >
      <PresetShowcase @select="applyPreset" />
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
            @mouseenter="
              (e) => {
                e.currentTarget.style.backgroundColor = `${colors.fg}0d`
              }
            "
            @mouseleave="
              (e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            "
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

/* Page fade-in */
.showcase-root {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
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
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}
</style>
