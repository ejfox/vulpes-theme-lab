<script setup lang="ts">
import type { MapEditorState } from '~/composables/useMapTheme'

const props = defineProps<{
  mapState: MapEditorState
  featureColors: {
    water: string
    park: string
    motorway: string
    building: string
    poi: string
    bg: string
    fg: string
  }
  extendedColors: Record<string, string>
  viewPresets: readonly { name: string; pitch: number; bearing: number }[]
}>()

const emit = defineEmits<{
  (e: 'flyTo', preset: { center: [number, number]; zoom: number; name: string }): void
  (e: 'setView', opts: { pitch: number; bearing: number }): void
  (e: 'reset'): void
  (e: 'export'): void
  (e: 'copy'): void
  (e: 'share'): void
}>()

const { state } = useTheme()
const modeColor = (dark: string, light: string) => (state.value.mode === 'dark' ? dark : light)
const borderColor = computed(() => modeColor('rgba(255, 255, 255, 0.1)', 'rgba(0, 0, 0, 0.1)'))
const textColor = computed(() => modeColor('#fff', '#000'))
const mutedColor = computed(() => modeColor('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.5)'))

// Generate rainbow gradient for base hue
const baseHueGradient = `linear-gradient(to right, ${Array.from(
  { length: 13 },
  (_, i) => `hsl(${i * 30}, 85%, 55%)`
).join(', ')})`

// Color sliders (theme-level controls that affect the whole palette)
const colorSliders = [
  {
    key: 'baseHue',
    label: 'base hue',
    min: 0,
    max: 360,
    step: 1,
    gradient: baseHueGradient,
    tooltip: 'Root hue angle (0-360°) — all derived colors rotate from this',
  },
  {
    key: 'hueOffset',
    label: 'hue spread',
    min: 1,
    max: 45,
    step: 1,
    tooltip: 'Degrees between derived colors — higher = more variety',
  },
  {
    key: 'saturation',
    label: 'dark sat %',
    min: 0,
    max: 100,
    step: 1,
    tooltip: 'Color intensity in dark mode (0% = gray, 100% = vivid)',
  },
  {
    key: 'lightModeSaturation',
    label: 'light sat %',
    min: 0,
    max: 100,
    step: 1,
    tooltip: 'Color intensity in light mode',
  },
  {
    key: 'contrast',
    label: 'contrast',
    min: 1,
    max: 100,
    step: 1,
    tooltip: 'Lightness spread between elements — higher = sharper distinction',
  },
]

const saturationSliders = [
  {
    key: 'mapWaterSaturation',
    label: 'water sat %',
    min: 0,
    max: 100,
    step: 1,
    color: 'water' as const,
    overrideKey: 'colorWater' as keyof MapEditorState,
    tooltip: 'Water color intensity — 0% gray, 100% vivid blue',
  },
  {
    key: 'mapParkSaturation',
    label: 'park sat %',
    min: 0,
    max: 100,
    step: 1,
    color: 'park' as const,
    overrideKey: 'colorPark' as keyof MapEditorState,
    tooltip: 'Park/vegetation intensity — 0% gray, 100% vivid green',
  },
  {
    key: 'mapRoadSaturation',
    label: 'road sat %',
    min: 0,
    max: 100,
    step: 1,
    color: 'motorway' as const,
    overrideKey: 'colorRoadMotorway' as keyof MapEditorState,
    tooltip: 'Road color intensity — shared by all road types',
  },
  {
    key: 'mapBuildingSaturation',
    label: 'bldg sat %',
    min: 0,
    max: 100,
    step: 1,
    color: 'building' as const,
    overrideKey: 'colorBuilding' as keyof MapEditorState,
    tooltip: 'Building extrusion color intensity',
  },
]

const hueShiftSliders = [
  {
    key: 'mapWaterOffset',
    label: 'water hue ±°',
    min: -180,
    max: 180,
    step: 1,
    tooltip: 'Shift water hue from base blue (200°)',
  },
  {
    key: 'mapParkOffset',
    label: 'park hue ±°',
    min: -180,
    max: 180,
    step: 1,
    tooltip: 'Shift park hue from base green (120°)',
  },
  {
    key: 'mapRoadMotorwayOffset',
    label: 'hwy hue ±°',
    min: -180,
    max: 180,
    step: 1,
    tooltip: 'Shift highway hue from base orange (20°)',
  },
  {
    key: 'mapRoadTrunkOffset',
    label: 'trunk hue ±°',
    min: -180,
    max: 180,
    step: 1,
    tooltip: 'Shift trunk road hue from base yellow (40°)',
  },
  {
    key: 'mapRoadPrimaryOffset',
    label: 'primary hue ±°',
    min: -180,
    max: 180,
    step: 1,
    tooltip: 'Shift primary road hue from base warm (50°)',
  },
  {
    key: 'mapRoadSecondaryOffset',
    label: 'secondary hue ±°',
    min: -180,
    max: 180,
    step: 1,
    tooltip: 'Shift secondary road hue (60°)',
  },
  {
    key: 'mapBuildingOffset',
    label: 'bldg hue ±°',
    min: -180,
    max: 180,
    step: 1,
    tooltip: 'Shift building hue from base purple (280°)',
  },
  {
    key: 'mapPoiOffset',
    label: 'POI hue ±°',
    min: -180,
    max: 180,
    step: 1,
    tooltip: 'Shift POI hue from base red (0°)',
  },
]

// Palette strip swatches — each maps to an override key, saturation key, and hue key
const paletteSwatches = [
  {
    label: 'Water',
    colorKey: 'water' as const,
    overrideKey: 'colorWater' as keyof MapEditorState,
    satKey: 'mapWaterSaturation',
    hueKey: 'mapWaterOffset',
  },
  {
    label: 'Parks',
    colorKey: 'park' as const,
    overrideKey: 'colorPark' as keyof MapEditorState,
    satKey: 'mapParkSaturation',
    hueKey: 'mapParkOffset',
  },
  {
    label: 'Roads',
    colorKey: 'motorway' as const,
    overrideKey: 'colorRoadMotorway' as keyof MapEditorState,
    satKey: 'mapRoadSaturation',
    hueKey: 'mapRoadMotorwayOffset',
  },
  {
    label: 'Buildings',
    colorKey: 'building' as const,
    overrideKey: 'colorBuilding' as keyof MapEditorState,
    satKey: 'mapBuildingSaturation',
    hueKey: 'mapBuildingOffset',
  },
  {
    label: 'POIs',
    colorKey: 'poi' as const,
    overrideKey: 'colorPoi' as keyof MapEditorState,
    satKey: 'mapRoadSaturation',
    hueKey: 'mapPoiOffset',
  },
]

// Shared popover state — only one open at a time
const activeSwatch = ref<string | null>(null)
const toggleSwatch = (key: string) => {
  activeSwatch.value = activeSwatch.value === key ? null : key
}

// Hex override input
const hexInputVal = ref('')
const applyHexOverride = (overrideKey: keyof MapEditorState) => {
  const cleaned = hexInputVal.value.trim()
  if (/^#?[0-9a-fA-F]{3,8}$/.test(cleaned)) {
    const hex = cleaned.startsWith('#') ? cleaned : `#${cleaned}`
    ;(props.mapState[overrideKey] as string) = hex
  }
}
const clearOverride = (overrideKey: keyof MapEditorState) => {
  ;(props.mapState[overrideKey] as string) = ''
}

// Extended color overrides — grouped by category
const extendedColorGroups = [
  {
    label: 'Roads',
    items: [
      { key: 'colorRoadTertiary', label: 'Tertiary', colorKey: 'roadTertiary' },
      { key: 'colorRoadPedestrian', label: 'Pedestrian', colorKey: 'roadPedestrian' },
      { key: 'colorTunnel', label: 'Tunnel', colorKey: 'tunnel' },
      { key: 'colorBridge', label: 'Bridge', colorKey: 'bridge' },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { key: 'colorRailway', label: 'Railway', colorKey: 'railway' },
      { key: 'colorBoundary', label: 'Boundary', colorKey: 'boundary' },
      { key: 'colorRunway', label: 'Runway', colorKey: 'runway' },
      { key: 'colorWaterway', label: 'Waterway', colorKey: 'waterway' },
    ],
  },
  {
    label: 'Landuse',
    items: [
      { key: 'colorLanduseResidential', label: 'Residential', colorKey: 'landuseResidential' },
      { key: 'colorLanduseCommercial', label: 'Commercial', colorKey: 'landuseCommercial' },
      { key: 'colorLanduseIndustrial', label: 'Industrial', colorKey: 'landuseIndustrial' },
    ],
  },
  {
    label: 'POI Categories',
    items: [
      { key: 'colorPoiMedical', label: 'Medical', colorKey: 'poiMedical' },
      { key: 'colorPoiEducation', label: 'Education', colorKey: 'poiEducation' },
      { key: 'colorPoiTransport', label: 'Transport', colorKey: 'poiTransport' },
      { key: 'colorPoiFood', label: 'Food', colorKey: 'poiFood' },
      { key: 'colorPoiShopping', label: 'Shopping', colorKey: 'poiShopping' },
      { key: 'colorPoiCulture', label: 'Culture', colorKey: 'poiCulture' },
      { key: 'colorPoiReligion', label: 'Religion', colorKey: 'poiReligion' },
    ],
  },
  {
    label: 'Labels',
    items: [
      { key: 'colorLabelText', label: 'Text', colorKey: 'labelText' },
      { key: 'colorLabelHalo', label: 'Halo', colorKey: 'labelHalo' },
    ],
  },
]
</script>

<template>
  <div class="map-sidebar">
    <!-- Header -->
    <div class="sidebar-header" :style="{ borderBottomColor: borderColor }">
      <div class="sidebar-title" :style="{ color: textColor }">
        <NuxtLink to="/" class="back-link" :style="{ color: mutedColor }"> &larr; </NuxtLink>
        basemap editor
      </div>
      <div class="mode-toggle-group">
        <button
          class="mode-btn"
          :class="{ active: state.mode === 'dark' }"
          :style="{
            color:
              state.mode === 'dark'
                ? 'rgba(150, 180, 255, 1)'
                : modeColor('rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)'),
            borderColor: state.mode === 'dark' ? 'rgba(100, 150, 255, 0.5)' : 'transparent',
            background: state.mode === 'dark' ? 'rgba(100, 150, 255, 0.1)' : 'transparent',
          }"
          @click="state.mode = 'dark'"
        >
          DARK
        </button>
        <span
          :style="{
            color: modeColor('rgba(255, 255, 255, 0.2)', 'rgba(0, 0, 0, 0.2)'),
            fontSize: '8px',
          }"
          >|</span
        >
        <button
          class="mode-btn"
          :class="{ active: state.mode === 'light' }"
          :style="{
            color:
              state.mode === 'light'
                ? 'rgba(255, 200, 0, 1)'
                : modeColor('rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)'),
            borderColor: state.mode === 'light' ? 'rgba(255, 200, 0, 0.5)' : 'transparent',
            background: state.mode === 'light' ? 'rgba(255, 200, 0, 0.1)' : 'transparent',
          }"
          @click="state.mode = 'light'"
        >
          LIGHT
        </button>
      </div>
    </div>

    <!-- Palette strip — click to open sliders + hex -->
    <div class="palette-strip-wrapper" :style="{ borderBottomColor: borderColor }">
      <div class="palette-strip">
        <div class="swatch-dot readonly" :style="{ background: featureColors.bg }" title="BG"></div>
        <MapColorInput
          v-for="sw in paletteSwatches"
          :key="sw.colorKey"
          :model-value="featureColors[sw.colorKey]"
          :override="props.mapState[sw.overrideKey] as string"
          :label="sw.label"
          size="md"
          @click="toggleSwatch(sw.colorKey)"
        />
        <div class="swatch-dot readonly" :style="{ background: featureColors.fg }" title="FG"></div>
      </div>

      <!-- Palette popover: sliders + hex input -->
      <Transition name="popover">
        <div
          v-if="activeSwatch"
          class="swatch-popover"
          :style="{
            background: modeColor('rgba(15, 15, 20, 0.97)', 'rgba(245, 245, 250, 0.97)'),
            borderColor: modeColor('rgba(255,255,255,0.15)', 'rgba(0,0,0,0.15)'),
          }"
        >
          <div
            v-for="sw in paletteSwatches.filter((s) => s.colorKey === activeSwatch)"
            :key="sw.colorKey"
            class="popover-content"
          >
            <div class="popover-header">
              <div
                class="popover-swatch-preview"
                :style="{ background: featureColors[sw.colorKey] }"
              ></div>
              <span :style="{ color: textColor }">{{ sw.label }}</span>
              <button
                class="popover-close"
                :style="{ color: mutedColor }"
                @click="activeSwatch = null"
              >
                &times;
              </button>
            </div>
            <BaseSlider
              v-model="state[sw.hueKey as keyof typeof state]"
              label="hue shift ±°"
              :min="-180"
              :max="180"
              :step="1"
              variant="compact"
            />
            <BaseSlider
              v-model="state[sw.satKey as keyof typeof state]"
              label="saturation %"
              :min="0"
              :max="100"
              :step="1"
              variant="compact"
            />
            <!-- Hex override row -->
            <div class="hex-row">
              <input
                type="color"
                :value="featureColors[sw.colorKey]"
                class="native-picker"
                @input="
                  (props.mapState[sw.overrideKey] as string) = (
                    $event.target as HTMLInputElement
                  ).value
                "
              />
              <input
                :value="(props.mapState[sw.overrideKey] as string) || featureColors[sw.colorKey]"
                class="hex-text"
                :style="{
                  background: modeColor('rgba(255,255,255,0.08)', 'rgba(0,0,0,0.06)'),
                  color: modeColor('#fff', '#000'),
                  borderColor: modeColor('rgba(255,255,255,0.15)', 'rgba(0,0,0,0.15)'),
                }"
                placeholder="#hex"
                spellcheck="false"
                @focus="hexInputVal = ($event.target as HTMLInputElement).value"
                @input="hexInputVal = ($event.target as HTMLInputElement).value"
                @keydown.enter="applyHexOverride(sw.overrideKey)"
                @blur="applyHexOverride(sw.overrideKey)"
              />
              <button
                v-if="props.mapState[sw.overrideKey]"
                class="hex-clear"
                :style="{ color: modeColor('rgba(255,100,100,0.7)', 'rgba(200,0,0,0.7)') }"
                title="Revert to auto"
                @click="clearOverride(sw.overrideKey)"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Color Engine -->
    <div class="section" :style="{ borderBottomColor: borderColor }">
      <div class="section-header" :style="{ color: mutedColor }">COLOR ENGINE</div>
      <BaseSlider
        v-for="slider in colorSliders"
        :key="slider.key"
        v-model="state[slider.key as keyof typeof state]"
        :label="slider.label"
        :min="slider.min"
        :max="slider.max"
        :step="slider.step"
        :gradient="(slider as any).gradient"
        :tooltip="(slider as any).tooltip"
      />
    </div>

    <!-- Map Feature Colors with swatches -->
    <div class="section" :style="{ borderBottomColor: borderColor }">
      <div class="section-header" :style="{ color: mutedColor }">MAP COLORS</div>
      <div v-for="slider in saturationSliders" :key="slider.key" class="swatch-slider-row">
        <MapColorInput
          :model-value="featureColors[slider.color]"
          :override="props.mapState[slider.overrideKey] as string"
          size="sm"
          @update:override="(v: string) => ((props.mapState[slider.overrideKey] as string) = v)"
        />
        <BaseSlider
          v-model="state[slider.key as keyof typeof state]"
          :label="slider.label"
          :min="slider.min"
          :max="slider.max"
          :step="slider.step"
          :tooltip="(slider as any).tooltip"
          class="swatch-slider"
        />
      </div>

      <details class="advanced-hues">
        <summary :style="{ color: modeColor('rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)') }">
          hue shifts
        </summary>
        <BaseSlider
          v-for="slider in hueShiftSliders"
          :key="slider.key"
          v-model="state[slider.key as keyof typeof state]"
          :label="slider.label"
          :min="slider.min"
          :max="slider.max"
          :step="slider.step"
          :tooltip="(slider as any).tooltip"
          variant="compact"
        />
      </details>
    </div>

    <!-- Extended Color Overrides -->
    <div class="section" :style="{ borderBottomColor: borderColor }">
      <details class="extended-colors">
        <summary :style="{ color: mutedColor }">EXTENDED COLORS</summary>
        <div class="extended-hint" :style="{ color: mutedColor }">
          Click a swatch to override with a custom hex. Clear to revert.
        </div>
        <div v-for="group in extendedColorGroups" :key="group.label" class="ext-group">
          <div class="ext-group-label" :style="{ color: mutedColor }">{{ group.label }}</div>
          <div class="ext-grid">
            <div v-for="item in group.items" :key="item.key" class="ext-item">
              <label class="ext-color-label">
                <input
                  type="color"
                  :value="
                    props.mapState[item.key as keyof MapEditorState] ||
                    extendedColors[item.colorKey]
                  "
                  class="ext-color-input"
                  @input="
                    (props.mapState[item.key as keyof MapEditorState] as string) = (
                      $event.target as HTMLInputElement
                    ).value
                  "
                />
                <div
                  class="ext-swatch"
                  :style="{
                    background: extendedColors[item.colorKey],
                    boxShadow: props.mapState[item.key as keyof MapEditorState]
                      ? `0 0 0 1px ${modeColor('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)')}`
                      : 'none',
                  }"
                ></div>
                <span :style="{ color: modeColor('rgba(255,255,255,0.6)', 'rgba(0,0,0,0.6)') }">{{
                  item.label
                }}</span>
              </label>
              <button
                v-if="props.mapState[item.key as keyof MapEditorState]"
                class="ext-clear"
                :style="{ color: mutedColor }"
                title="Revert to auto"
                @click="(props.mapState[item.key as keyof MapEditorState] as string) = ''"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      </details>
    </div>

    <!-- Geometry -->
    <div class="section" :style="{ borderBottomColor: borderColor }">
      <div class="section-header" :style="{ color: mutedColor }">GEOMETRY</div>
      <BaseSlider
        v-model="props.mapState.buildingHeightScale"
        label="bldg height ×"
        :min="0.1"
        :max="3"
        :step="0.1"
        tooltip="3D building extrusion multiplier — 1× = real height, 3× = tripled"
      />
      <BaseSlider
        v-model="props.mapState.roadWidthScale"
        label="road width ×"
        :min="0.3"
        :max="3"
        :step="0.1"
        tooltip="Road line width multiplier — applies to all road types"
      />
      <BaseSlider
        v-model="props.mapState.waterOutlineWidth"
        label="water outline px"
        :min="0"
        :max="4"
        :step="0.5"
        tooltip="Stroke width around water bodies in pixels"
      />
      <BaseSlider
        v-model="props.mapState.boundaryWidth"
        label="boundary px"
        :min="0.5"
        :max="5"
        :step="0.5"
        tooltip="Country/state boundary line width in pixels"
      />
    </div>

    <!-- Typography -->
    <div class="section" :style="{ borderBottomColor: borderColor }">
      <div class="section-header" :style="{ color: mutedColor }">TYPOGRAPHY</div>
      <MapTypographyControls :map-state="props.mapState" />
    </div>

    <!-- Layer Visibility -->
    <div class="section" :style="{ borderBottomColor: borderColor }">
      <div class="section-header" :style="{ color: mutedColor }">LAYERS</div>
      <MapLayerToggles :map-state="props.mapState" />
    </div>

    <!-- View + Location -->
    <div class="section" :style="{ borderBottomColor: borderColor }">
      <div class="section-header" :style="{ color: mutedColor }">VIEW</div>
      <div class="view-presets">
        <button
          v-for="vp in viewPresets"
          :key="vp.name"
          class="view-btn"
          :style="{
            background: modeColor('rgba(255, 255, 255, 0.05)', 'rgba(0, 0, 0, 0.05)'),
            color: modeColor('rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.7)'),
            borderColor: modeColor('rgba(255, 255, 255, 0.1)', 'rgba(0, 0, 0, 0.1)'),
          }"
          @click="emit('setView', { pitch: vp.pitch, bearing: vp.bearing })"
        >
          {{ vp.name }}
        </button>
      </div>
      <div class="section-sublabel" :style="{ color: mutedColor }">LOCATIONS</div>
      <MapLocationPresets @fly-to="(p) => emit('flyTo', p)" />
    </div>

    <!-- Export + Share -->
    <div class="section export-section">
      <button
        class="export-btn"
        :style="{
          background: modeColor('rgba(100, 200, 255, 0.15)', 'rgba(0, 100, 200, 0.15)'),
          borderColor: modeColor('rgba(100, 200, 255, 0.4)', 'rgba(0, 100, 200, 0.4)'),
          color: modeColor('rgba(100, 200, 255, 1)', 'rgba(0, 80, 160, 1)'),
        }"
        @click="emit('export')"
      >
        DOWNLOAD JSON
      </button>
      <div class="export-row">
        <button
          class="export-btn secondary flex-1"
          :style="{
            background: 'transparent',
            borderColor: modeColor('rgba(255, 255, 255, 0.2)', 'rgba(0, 0, 0, 0.2)'),
            color: modeColor('rgba(255, 255, 255, 0.6)', 'rgba(0, 0, 0, 0.6)'),
          }"
          @click="emit('copy')"
        >
          COPY JSON
        </button>
        <button
          class="export-btn secondary flex-1"
          :style="{
            background: 'transparent',
            borderColor: modeColor('rgba(255, 200, 100, 0.3)', 'rgba(180, 120, 0, 0.3)'),
            color: modeColor('rgba(255, 200, 100, 0.8)', 'rgba(180, 120, 0, 0.8)'),
          }"
          @click="emit('share')"
        >
          SHARE URL
        </button>
      </div>
      <button
        class="export-btn secondary reset-btn"
        :style="{
          background: 'transparent',
          borderColor: modeColor('rgba(255, 100, 100, 0.2)', 'rgba(200, 0, 0, 0.2)'),
          color: modeColor('rgba(255, 100, 100, 0.5)', 'rgba(200, 0, 0, 0.5)'),
          borderStyle: 'dashed',
        }"
        @click="emit('reset')"
      >
        RESET ALL
      </button>
    </div>
  </div>
</template>

<style scoped>
.map-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 12px;
  height: 100%;
  overflow-y: auto;
}

.sidebar-header {
  padding-bottom: 10px;
  border-bottom: 1px solid;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar-title {
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-link {
  text-decoration: none;
  font-size: 12px;
  opacity: 0.5;
  transition: opacity 0.15s;
}

.back-link:hover {
  opacity: 1;
}

.mode-toggle-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mode-btn {
  background: transparent;
  border: 1px solid transparent;
  padding: 4px 8px;
  font-family: inherit;
  font-size: 7px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.15s;
  flex: 1;
}

.mode-btn:hover {
  opacity: 0.8;
}

.mode-btn.active {
  font-weight: bold;
  border: 1px solid;
}

/* Palette strip */
.palette-strip-wrapper {
  position: relative;
  border-bottom: 1px solid;
}

.palette-strip {
  display: flex;
  gap: 2px;
  padding: 8px 0;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.swatch-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: default;
  flex-shrink: 0;
}

.swatch-dot.readonly {
  opacity: 0.5;
}

/* Swatch popover — floats over content */
.swatch-popover {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 20;
  padding: 10px;
  border: 1px solid;
  border-radius: 6px;
  backdrop-filter: blur(16px);
}

.popover-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.popover-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 9px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.popover-swatch-preview {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  flex-shrink: 0;
  transition: background 0.3s;
}

.popover-close {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  opacity: 0.5;
  transition: opacity 0.15s;
}

.popover-close:hover {
  opacity: 1;
}

.hex-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.native-picker {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.native-picker::-webkit-color-swatch-wrapper {
  padding: 1px;
}

.native-picker::-webkit-color-swatch {
  border: none;
  border-radius: 2px;
}

.hex-text {
  flex: 1;
  min-width: 0;
  padding: 3px 6px;
  border: 1px solid;
  border-radius: 3px;
  font-family: var(--font-krypton, monospace);
  font-size: 9px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.hex-text:focus {
  outline: none;
  border-color: rgba(100, 200, 255, 0.5);
}

.hex-clear {
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  opacity: 0.5;
  flex-shrink: 0;
}

.hex-clear:hover {
  opacity: 1;
}

.popover-enter-active,
.popover-leave-active {
  transition: all 0.15s ease;
}

.popover-enter-from,
.popover-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Swatch + slider rows */
.swatch-slider-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.swatch-slider {
  flex: 1;
  min-width: 0;
}

/* Sections */
.section {
  padding: 10px 0;
  border-bottom: 1px solid;
}

.section-header {
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 8px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.section-sublabel {
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 10px;
  margin-bottom: 6px;
  opacity: 0.7;
}

/* View presets */
.view-presets {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.view-btn {
  flex: 1;
  padding: 5px 8px;
  border: 1px solid;
  border-radius: 3px;
  font-size: 8px;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.15s;
}

.view-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.2);
}

/* Advanced hues */
.advanced-hues {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.advanced-hues summary {
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  user-select: none;
  padding: 4px 0;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.advanced-hues summary:hover {
  opacity: 1;
}

.advanced-hues[open] summary {
  opacity: 1;
  margin-bottom: 8px;
}

/* Export section */
.export-section {
  border-bottom: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 12px;
}

.export-row {
  display: flex;
  gap: 6px;
}

.flex-1 {
  flex: 1;
}

.export-btn {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid;
  border-radius: 6px;
  font-size: 9px;
  font-weight: bold;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.15);
}

.export-btn:active {
  transform: translateY(0);
}

.export-btn.secondary {
  border-width: 1px;
  font-weight: normal;
  padding: 8px 6px;
  font-size: 8px;
}

/* Extended colors */
.extended-colors summary {
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

.extended-colors summary:hover {
  background: rgba(255, 255, 255, 0.08);
}

.extended-colors[open] summary {
  margin-bottom: 8px;
}

.extended-hint {
  font-size: 7px;
  margin-bottom: 8px;
  opacity: 0.6;
}

.ext-group {
  margin-bottom: 8px;
}

.ext-group-label {
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 4px;
  opacity: 0.7;
}

.ext-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}

.ext-item {
  display: flex;
  align-items: center;
  gap: 2px;
}

.ext-color-label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 2px 4px;
  border-radius: 3px;
  transition: background 0.15s;
}

.ext-color-label:hover {
  background: rgba(255, 255, 255, 0.05);
}

.ext-color-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.ext-swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
  transition: all 0.2s;
}

.ext-clear {
  background: none;
  border: none;
  font-size: 10px;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  opacity: 0.4;
  transition: opacity 0.15s;
}

.ext-clear:hover {
  opacity: 1;
}

.reset-btn {
  margin-top: 4px;
  font-size: 7px;
  padding: 6px;
  opacity: 0.6;
}

.reset-btn:hover {
  opacity: 1;
}
</style>
