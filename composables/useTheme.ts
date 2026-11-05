import { useUrlSearchParams } from '@vueuse/core'
import {
  generateThemeVariant as pureGenerateThemeVariant,
  applyColorblindSim as pureApplyColorblindSim,
  DEFAULT_THEME_STATE,
} from '~/utils/generateTheme'
import type { ThemeColors as PureThemeColors, ThemeState as PureThemeState } from '~/utils/generateTheme'

// Re-exported so existing `import type { ThemeColors } from '~/composables/useTheme'`
// call sites keep working. The single source of truth for this type (and the
// color-generation math below) now lives in utils/generateTheme.ts, which is
// framework-free and shared with scripts/export-all.ts + tests.
export type ThemeColors = PureThemeColors

// Theme options interface - font styles and other configurable settings
export interface ThemeOptions {
  boldKeywords: boolean
  italicComments: boolean
  boldFunctions: boolean
  italicStrings: boolean
  underlineErrors: boolean
}

type ThemeState = PureThemeState

const defaultState: ThemeState = DEFAULT_THEME_STATE

export const useTheme = () => {
  // Sync with URL params
  const params = useUrlSearchParams('history')

  // Initialize state from URL or defaults
  const state = useState<ThemeState>('theme', () => ({
    themeName: String(params.n || defaultState.themeName),
    baseHue: Number(params.h) || defaultState.baseHue,
    hueOffset: Number(params.o) || defaultState.hueOffset,
    saturation: Number(params.s) || defaultState.saturation,
    lightModeSaturation: Number(params.ls) || defaultState.lightModeSaturation,
    contrast: Number(params.c) || defaultState.contrast,
    monochromeMode: params.m === '1' || defaultState.monochromeMode,
    monochromeIntensity: Number(params.mi) || defaultState.monochromeIntensity,
    monochromeLightness: Number(params.ml) || defaultState.monochromeLightness,
    boldKeywords: params.b === '1' || defaultState.boldKeywords,
    italicComments: params.i !== '0',
    boldFunctions: params.bf === '1' || defaultState.boldFunctions,
    italicStrings: params.is === '1' || defaultState.italicStrings,
    underlineErrors: params.ue !== '0',
    mode: (params.mode as 'dark' | 'light') || defaultState.mode,
    colorblindMode: (params.cbm as ThemeState['colorblindMode']) || defaultState.colorblindMode,
    backgroundOpacity: Number(params.bgop) || defaultState.backgroundOpacity,
    backgroundBlur: Number(params.bgbl) || defaultState.backgroundBlur,
    windowBlend: Number(params.wbl) || defaultState.windowBlend,
    popupBlend: Number(params.pbl) || defaultState.popupBlend,
    errorOffset: Number(params.eo) || defaultState.errorOffset,
    warningOffset: Number(params.wo) || defaultState.warningOffset,
    keywordOffset: Number(params.ko) || defaultState.keywordOffset,
    stringOffset: Number(params.so) || defaultState.stringOffset,
    numberOffset: Number(params.no) || defaultState.numberOffset,
    functionOffset: Number(params.fo) || defaultState.functionOffset,
    errorLightness: Number(params.el) || defaultState.errorLightness,
    warningLightness: Number(params.wl) || defaultState.warningLightness,
    keywordLightness: Number(params.kl) || defaultState.keywordLightness,
    stringLightness: Number(params.sl) || defaultState.stringLightness,
    numberLightness: Number(params.nl) || defaultState.numberLightness,
    functionLightness: Number(params.fl) || defaultState.functionLightness,
    constantOffset: Number(params.co) || defaultState.constantOffset,
    typeOffset: Number(params.to) || defaultState.typeOffset,
    variableOffset: Number(params.vo) || defaultState.variableOffset,
    operatorOffset: Number(params.oo) || defaultState.operatorOffset,
    constantLightness: Number(params.cl) || defaultState.constantLightness,
    typeLightness: Number(params.tl) || defaultState.typeLightness,
    variableLightness: Number(params.vl) || defaultState.variableLightness,
    operatorLightness: Number(params.ol) || defaultState.operatorLightness,
    errorLinked: params.elink !== '0',
    warningLinked: params.wlink !== '0',
    keywordLinked: params.klink !== '0',
    stringLinked: params.slink !== '0',
    numberLinked: params.nlink !== '0',
    functionLinked: params.flink !== '0',
    constantLinked: params.clink !== '0',
    typeLinked: params.tlink !== '0',
    variableLinked: params.vlink !== '0',
    operatorLinked: params.olink !== '0',
    errorMultiplier: Number(params.em) || defaultState.errorMultiplier,
    warningMultiplier: Number(params.wm) || defaultState.warningMultiplier,
    keywordMultiplier: Number(params.km) || defaultState.keywordMultiplier,
    stringMultiplier: Number(params.sm) || defaultState.stringMultiplier,
    numberMultiplier: Number(params.nm) || defaultState.numberMultiplier,
    functionMultiplier: Number(params.fm) || defaultState.functionMultiplier,
    constantMultiplier: Number(params.cm) || defaultState.constantMultiplier,
    typeMultiplier: Number(params.tm) || defaultState.typeMultiplier,
    variableMultiplier: Number(params.vm) || defaultState.variableMultiplier,
    operatorMultiplier: Number(params.om) || defaultState.operatorMultiplier,
    // New granular colors
    builtinOffset: Number(params.bio) || defaultState.builtinOffset,
    parameterOffset: Number(params.pao) || defaultState.parameterOffset,
    propertyOffset: Number(params.pro) || defaultState.propertyOffset,
    namespaceOffset: Number(params.nso) || defaultState.namespaceOffset,
    macroOffset: Number(params.mao) || defaultState.macroOffset,
    tagOffset: Number(params.tao) || defaultState.tagOffset,
    punctuationOffset: Number(params.puo) || defaultState.punctuationOffset,
    headingOffset: Number(params.heo) || defaultState.headingOffset,
    commentOffset: Number(params.cmo) || defaultState.commentOffset,
    baseOffset: Number(params.bao) || defaultState.baseOffset,
    hintOffset: Number(params.hio) || defaultState.hintOffset,
    fgOffset: Number(params.fgo) || defaultState.fgOffset,
    bgOffset: Number(params.bgo) || defaultState.bgOffset,
    builtinLightness: Number(params.bil) || defaultState.builtinLightness,
    parameterLightness: Number(params.pal) || defaultState.parameterLightness,
    propertyLightness: Number(params.prl) || defaultState.propertyLightness,
    namespaceLightness: Number(params.nsl) || defaultState.namespaceLightness,
    macroLightness: Number(params.mal) || defaultState.macroLightness,
    tagLightness: Number(params.tal) || defaultState.tagLightness,
    punctuationLightness: Number(params.pul) || defaultState.punctuationLightness,
    headingLightness: Number(params.hel) || defaultState.headingLightness,
    commentLightness: Number(params.cml) || defaultState.commentLightness,
    baseLightness: Number(params.bal) || defaultState.baseLightness,
    hintLightness: Number(params.hil) || defaultState.hintLightness,
    fgLightness: Number(params.fgl) || defaultState.fgLightness,
    bgLightness: Number(params.bgl) || defaultState.bgLightness,
    builtinLinked: params.bilink !== '0',
    parameterLinked: params.palink !== '0',
    propertyLinked: params.prlink !== '0',
    namespaceLinked: params.nslink !== '0',
    macroLinked: params.malink !== '0',
    tagLinked: params.talink !== '0',
    punctuationLinked: params.pulink !== '0',
    headingLinked: params.helink !== '0',
    commentLinked: params.cmlink !== '0',
    baseLinked: params.balink !== '0',
    hintLinked: params.hilink !== '0',
    fgLinked: params.fglink !== '0',
    bgLinked: params.bglink !== '0',
    builtinMultiplier: Number(params.bim) || defaultState.builtinMultiplier,
    parameterMultiplier: Number(params.pam) || defaultState.parameterMultiplier,
    propertyMultiplier: Number(params.prm) || defaultState.propertyMultiplier,
    namespaceMultiplier: Number(params.nsm) || defaultState.namespaceMultiplier,
    macroMultiplier: Number(params.mam) || defaultState.macroMultiplier,
    tagMultiplier: Number(params.tam) || defaultState.tagMultiplier,
    punctuationMultiplier: Number(params.pum) || defaultState.punctuationMultiplier,
    headingMultiplier: Number(params.hem) || defaultState.headingMultiplier,
    commentMultiplier: Number(params.cmm) || defaultState.commentMultiplier,
    baseMultiplier: Number(params.bam) || defaultState.baseMultiplier,
    hintMultiplier: Number(params.him) || defaultState.hintMultiplier,
    fgMultiplier: Number(params.fgm) || defaultState.fgMultiplier,
    bgMultiplier: Number(params.bgm) || defaultState.bgMultiplier,
    // MapLibre-specific colors
    mapWaterOffset: Number(params.mwo) || defaultState.mapWaterOffset,
    mapParkOffset: Number(params.mpo) || defaultState.mapParkOffset,
    mapRoadMotorwayOffset: Number(params.mrmo) || defaultState.mapRoadMotorwayOffset,
    mapRoadTrunkOffset: Number(params.mrto) || defaultState.mapRoadTrunkOffset,
    mapRoadPrimaryOffset: Number(params.mrpro) || defaultState.mapRoadPrimaryOffset,
    mapRoadSecondaryOffset: Number(params.mrso) || defaultState.mapRoadSecondaryOffset,
    mapBuildingOffset: Number(params.mbo) || defaultState.mapBuildingOffset,
    mapPoiOffset: Number(params.mpoi) || defaultState.mapPoiOffset,
    mapWaterSaturation: Number(params.mws) || defaultState.mapWaterSaturation,
    mapParkSaturation: Number(params.mps) || defaultState.mapParkSaturation,
    mapRoadSaturation: Number(params.mrs) || defaultState.mapRoadSaturation,
    mapBuildingSaturation: Number(params.mbs) || defaultState.mapBuildingSaturation,
  }))

  // Generate colors for a specific mode with auto-contrast.
  // The actual math lives in utils/generateTheme.ts (framework-free, shared
  // with scripts/export-all.ts and the test suite) -- this is a thin wrapper
  // that supplies the current reactive state.
  const generateThemeVariant = (mode: 'dark' | 'light') => pureGenerateThemeVariant(state.value, mode)

  // Apply colorblind simulation to all colors in a theme (delegates to the
  // pure implementation, passing the current colorblind mode from state).
  const applyColorblindSim = (theme: ThemeColors): ThemeColors =>
    pureApplyColorblindSim(theme, state.value.colorblindMode)

  // Current mode colors with colorblind simulation
  // If imported palette exists, use it directly instead of generating
  // Both variants with colorblind simulation
  const darkColors = computed(() => applyColorblindSim(generateThemeVariant('dark')))
  const lightColors = computed(() => applyColorblindSim(generateThemeVariant('light')))

  const colors = computed(() => {
    if (state.value.importedPalette) {
      return applyColorblindSim(state.value.importedPalette)
    }
    // Reuse the already-computed variant instead of generating a third palette
    return state.value.mode === 'dark' ? darkColors.value : lightColors.value
  })

  const ghosttyTheme = computed(() => ({
    background: colors.value.bg,
    foreground: colors.value.fg,
    'cursor-color': colors.value.base,
    'selection-background': colors.value.warning,
    'selection-foreground': colors.value.bg,
    palette: colors.value.palette,
  }))

  const ghosttyThemeDark = computed(() => ({
    background: darkColors.value.bg,
    foreground: darkColors.value.fg,
    'cursor-color': darkColors.value.base,
    'selection-background': darkColors.value.warning,
    'selection-foreground': darkColors.value.bg,
    palette: darkColors.value.palette,
  }))

  const ghosttyThemeLight = computed(() => ({
    background: lightColors.value.bg,
    foreground: lightColors.value.fg,
    'cursor-color': lightColors.value.base,
    'selection-background': lightColors.value.warning,
    'selection-foreground': lightColors.value.bg,
    palette: lightColors.value.palette,
  }))

  // Theme options (font styles, etc)
  const options = computed(
    (): ThemeOptions => ({
      boldKeywords: state.value.boldKeywords,
      italicComments: state.value.italicComments,
      boldFunctions: state.value.boldFunctions,
      italicStrings: state.value.italicStrings,
      underlineErrors: state.value.underlineErrors,
    })
  )

  return {
    state,
    colors,
    darkColors,
    lightColors,
    ghosttyTheme,
    ghosttyThemeDark,
    ghosttyThemeLight,
    options,
  }
}
