import chroma from 'chroma-js'
import { useUrlSearchParams } from '@vueuse/core'

// Unified theme colors interface - used by ALL export utilities
export interface ThemeColors {
  bg: string
  fg: string
  base: string
  error: string
  warning: string
  hint: string
  comment: string
  keyword: string
  string: string
  number: string
  function: string
  constant: string
  type: string
  variable: string
  operator: string
  builtin: string
  parameter: string
  property: string
  namespace: string
  macro: string
  tag: string
  punctuation: string
  heading: string
  palette: Record<number, string>
  // MapLibre-specific colors
  mapWater: string
  mapPark: string
  mapRoadMotorway: string
  mapRoadTrunk: string
  mapRoadPrimary: string
  mapRoadSecondary: string
  mapBuilding: string
  mapPoi: string
}

// Theme options interface - font styles and other configurable settings
export interface ThemeOptions {
  boldKeywords: boolean
  italicComments: boolean
  boldFunctions: boolean
  italicStrings: boolean
  underlineErrors: boolean
}

interface ThemeState {
  themeName: string // Name of the active theme
  baseHue: number
  hueOffset: number
  saturation: number
  lightModeSaturation: number // Independent saturation control for light mode
  contrast: number
  monochromeMode: boolean
  monochromeIntensity: number
  monochromeLightness: number
  boldKeywords: boolean
  italicComments: boolean
  boldFunctions: boolean
  italicStrings: boolean
  underlineErrors: boolean
  mode: 'dark' | 'light'
  // Imported theme palette (when set, overrides generated colors)
  importedPalette?: ThemeColors | null
  // Colorblind simulation
  colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
  // Visual effects
  backgroundOpacity: number // 0-100 (for Ghostty, Neovim, etc)
  backgroundBlur: number // 0-100 (Ghostty only, macOS)
  windowBlend: number // 0-100 (Neovim winblend)
  popupBlend: number // 0-100 (Neovim pumblend)
  // Individual color offsets
  errorOffset: number
  warningOffset: number
  keywordOffset: number
  stringOffset: number
  numberOffset: number
  functionOffset: number
  constantOffset: number
  typeOffset: number
  variableOffset: number
  operatorOffset: number
  builtinOffset: number
  parameterOffset: number
  propertyOffset: number
  namespaceOffset: number
  macroOffset: number
  tagOffset: number
  punctuationOffset: number
  headingOffset: number
  commentOffset: number
  baseOffset: number
  hintOffset: number
  fgOffset: number
  bgOffset: number
  // Individual color lightness (0-100)
  errorLightness: number
  warningLightness: number
  keywordLightness: number
  stringLightness: number
  numberLightness: number
  functionLightness: number
  constantLightness: number
  typeLightness: number
  variableLightness: number
  operatorLightness: number
  builtinLightness: number
  parameterLightness: number
  propertyLightness: number
  namespaceLightness: number
  macroLightness: number
  tagLightness: number
  punctuationLightness: number
  headingLightness: number
  commentLightness: number
  baseLightness: number
  hintLightness: number
  fgLightness: number
  bgLightness: number
  // Link to global offset (when true, uses hueOffset * multiplier)
  errorLinked: boolean
  warningLinked: boolean
  keywordLinked: boolean
  stringLinked: boolean
  numberLinked: boolean
  functionLinked: boolean
  constantLinked: boolean
  typeLinked: boolean
  variableLinked: boolean
  operatorLinked: boolean
  builtinLinked: boolean
  parameterLinked: boolean
  propertyLinked: boolean
  namespaceLinked: boolean
  macroLinked: boolean
  tagLinked: boolean
  punctuationLinked: boolean
  headingLinked: boolean
  commentLinked: boolean
  baseLinked: boolean
  hintLinked: boolean
  fgLinked: boolean
  bgLinked: boolean
  // Multipliers for linked colors
  errorMultiplier: number
  warningMultiplier: number
  keywordMultiplier: number
  stringMultiplier: number
  numberMultiplier: number
  functionMultiplier: number
  constantMultiplier: number
  typeMultiplier: number
  variableMultiplier: number
  operatorMultiplier: number
  builtinMultiplier: number
  parameterMultiplier: number
  propertyMultiplier: number
  namespaceMultiplier: number
  macroMultiplier: number
  tagMultiplier: number
  punctuationMultiplier: number
  headingMultiplier: number
  commentMultiplier: number
  baseMultiplier: number
  hintMultiplier: number
  fgMultiplier: number
  bgMultiplier: number
  // MapLibre-specific colors
  mapWaterOffset: number
  mapParkOffset: number
  mapRoadMotorwayOffset: number
  mapRoadTrunkOffset: number
  mapRoadPrimaryOffset: number
  mapRoadSecondaryOffset: number
  mapBuildingOffset: number
  mapPoiOffset: number
  // Cartographic saturation controls
  mapWaterSaturation: number // 0-100
  mapParkSaturation: number // 0-100
  mapRoadSaturation: number // 0-100
  mapBuildingSaturation: number // 0-100
}

const defaultState: ThemeState = {
  themeName: 'vulpes',
  baseHue: 309,
  hueOffset: 1,
  saturation: 100,
  lightModeSaturation: 100, // Default to same as dark mode
  contrast: 86,
  monochromeMode: true,
  monochromeIntensity: 100,
  monochromeLightness: 0,
  boldKeywords: false,
  italicComments: true,
  boldFunctions: false,
  italicStrings: true,
  underlineErrors: true,
  mode: 'dark' as 'dark' | 'light',
  importedPalette: null,
  // Colorblind simulation
  colorblindMode: 'none' as 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia',
  // Visual effects defaults
  backgroundOpacity: 100, // Fully opaque by default
  backgroundBlur: 0, // No blur by default
  windowBlend: 0, // No transparency by default
  popupBlend: 10, // Slight transparency for popups
  // Default offsets - now additive to global (0 = use pure multiplier)
  errorOffset: 0,
  warningOffset: 0,
  keywordOffset: 0,
  stringOffset: 0,
  numberOffset: 0,
  functionOffset: 0,
  constantOffset: 0,
  typeOffset: 0,
  variableOffset: 0,
  operatorOffset: 0,
  builtinOffset: 0,
  parameterOffset: 0,
  propertyOffset: 0,
  namespaceOffset: 0,
  macroOffset: 0,
  tagOffset: 0,
  punctuationOffset: 0,
  headingOffset: 0,
  commentOffset: 0,
  baseOffset: 0,
  hintOffset: 0,
  fgOffset: 0,
  bgOffset: 0,
  // Default lightness values (50 = use auto-calculated)
  errorLightness: 50,
  warningLightness: 50,
  keywordLightness: 50,
  stringLightness: 50,
  numberLightness: 50,
  functionLightness: 50,
  constantLightness: 50,
  typeLightness: 50,
  variableLightness: 50,
  operatorLightness: 50,
  builtinLightness: 50,
  parameterLightness: 50,
  propertyLightness: 50,
  namespaceLightness: 50,
  macroLightness: 50,
  tagLightness: 50,
  punctuationLightness: 50,
  headingLightness: 50,
  commentLightness: 50,
  baseLightness: 50,
  hintLightness: 50,
  fgLightness: 50,
  bgLightness: 50,
  // Default linked state (all linked by default)
  errorLinked: true,
  warningLinked: true,
  keywordLinked: true,
  stringLinked: true,
  numberLinked: true,
  functionLinked: true,
  constantLinked: true,
  typeLinked: true,
  variableLinked: true,
  operatorLinked: true,
  builtinLinked: true,
  parameterLinked: true,
  propertyLinked: true,
  namespaceLinked: true,
  macroLinked: true,
  tagLinked: true,
  punctuationLinked: true,
  headingLinked: true,
  commentLinked: false,
  baseLinked: true,
  hintLinked: true,
  fgLinked: false,
  bgLinked: false,
  // Default multipliers - semantically driven for maximum code legibility
  // High prominence (structural understanding)
  keywordMultiplier: 3, // Control flow - most important
  functionMultiplier: -3, // Function calls - very visible
  builtinMultiplier: 2.5, // Built-in functions/types - distinct from user code
  typeMultiplier: -2.5, // Type information - structural

  // Medium prominence (common elements)
  stringMultiplier: 4, // String literals - stand out
  numberMultiplier: -4, // Numeric literals - distinct
  constantMultiplier: 3.5, // Constants - important values
  macroMultiplier: -2, // Macros/decorators - special behavior
  tagMultiplier: 2, // HTML/JSX tags - structural
  headingMultiplier: 3.5, // Markdown headings - hierarchy
  namespaceMultiplier: 1.5, // Modules/packages - context

  // Lower prominence (reduce visual noise)
  variableMultiplier: -1, // Variables - too common to be loud
  propertyMultiplier: -1.5, // Properties - too common
  parameterMultiplier: -0.5, // Parameters - subtle
  operatorMultiplier: 0.5, // Operators - very subtle
  punctuationMultiplier: 0.25, // Punctuation - barely tinted

  // Diagnostics
  errorMultiplier: 5, // Errors - maximum visibility
  warningMultiplier: -5, // Warnings - high visibility

  // Comments (typically low saturation/desaturated)
  commentMultiplier: 0, // Comments - neutral (often desaturated)

  // Base colors
  baseMultiplier: 0, // Base - primary UI color
  hintMultiplier: 0, // Hint - subtle UI elements
  fgMultiplier: 0, // Foreground - main text color
  bgMultiplier: 0, // Background - canvas color
  // MapLibre-specific color offsets (relative to baseHue)
  mapWaterOffset: 180, // Water bodies - cyan/blue
  mapParkOffset: 120, // Parks/green spaces - green
  mapRoadMotorwayOffset: 30, // Major highways - orange/yellow
  mapRoadTrunkOffset: 20, // Trunk roads - yellow
  mapRoadPrimaryOffset: 10, // Primary roads - warm
  mapRoadSecondaryOffset: 0, // Secondary roads - neutral
  mapBuildingOffset: -30, // Buildings - purple/blue
  mapPoiOffset: 0, // Points of interest - base color
  // Cartographic saturation controls (0-100)
  mapWaterSaturation: 15, // How blue the water is
  mapParkSaturation: 50, // How green the parks are
  mapRoadSaturation: 60, // How colorful the roads are
  mapBuildingSaturation: 30, // How colorful the buildings are
}

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

  // Watch state and sync to URL
  if (import.meta.client) {
    watch(
      state,
      (newState) => {
        params.n = newState.themeName
        params.h = String(newState.baseHue)
        params.o = String(newState.hueOffset)
        params.s = String(newState.saturation)
        params.ls = String(newState.lightModeSaturation)
        params.c = String(newState.contrast)
        params.m = newState.monochromeMode ? '1' : '0'
        params.mi = String(newState.monochromeIntensity)
        params.ml = String(newState.monochromeLightness)
        params.b = newState.boldKeywords ? '1' : '0'
        params.i = newState.italicComments ? '1' : '0'
        params.bf = newState.boldFunctions ? '1' : '0'
        params.is = newState.italicStrings ? '1' : '0'
        params.ue = newState.underlineErrors ? '1' : '0'
        params.mode = newState.mode
        params.cbm = newState.colorblindMode
        params.bgop = String(newState.backgroundOpacity)
        params.bgbl = String(newState.backgroundBlur)
        params.wbl = String(newState.windowBlend)
        params.pbl = String(newState.popupBlend)
        params.eo = String(newState.errorOffset)
        params.wo = String(newState.warningOffset)
        params.ko = String(newState.keywordOffset)
        params.so = String(newState.stringOffset)
        params.no = String(newState.numberOffset)
        params.fo = String(newState.functionOffset)
        params.el = String(newState.errorLightness)
        params.wl = String(newState.warningLightness)
        params.kl = String(newState.keywordLightness)
        params.sl = String(newState.stringLightness)
        params.nl = String(newState.numberLightness)
        params.fl = String(newState.functionLightness)
        params.co = String(newState.constantOffset)
        params.to = String(newState.typeOffset)
        params.vo = String(newState.variableOffset)
        params.oo = String(newState.operatorOffset)
        params.cl = String(newState.constantLightness)
        params.tl = String(newState.typeLightness)
        params.vl = String(newState.variableLightness)
        params.ol = String(newState.operatorLightness)
        params.elink = newState.errorLinked ? '1' : '0'
        params.wlink = newState.warningLinked ? '1' : '0'
        params.klink = newState.keywordLinked ? '1' : '0'
        params.slink = newState.stringLinked ? '1' : '0'
        params.nlink = newState.numberLinked ? '1' : '0'
        params.flink = newState.functionLinked ? '1' : '0'
        params.clink = newState.constantLinked ? '1' : '0'
        params.tlink = newState.typeLinked ? '1' : '0'
        params.vlink = newState.variableLinked ? '1' : '0'
        params.olink = newState.operatorLinked ? '1' : '0'
        params.em = String(newState.errorMultiplier)
        params.wm = String(newState.warningMultiplier)
        params.km = String(newState.keywordMultiplier)
        params.sm = String(newState.stringMultiplier)
        params.nm = String(newState.numberMultiplier)
        params.fm = String(newState.functionMultiplier)
        params.cm = String(newState.constantMultiplier)
        params.tm = String(newState.typeMultiplier)
        params.vm = String(newState.variableMultiplier)
        params.om = String(newState.operatorMultiplier)
        // New granular colors
        params.bio = String(newState.builtinOffset)
        params.pao = String(newState.parameterOffset)
        params.pro = String(newState.propertyOffset)
        params.nso = String(newState.namespaceOffset)
        params.mao = String(newState.macroOffset)
        params.tao = String(newState.tagOffset)
        params.puo = String(newState.punctuationOffset)
        params.heo = String(newState.headingOffset)
        params.cmo = String(newState.commentOffset)
        params.bao = String(newState.baseOffset)
        params.hio = String(newState.hintOffset)
        params.fgo = String(newState.fgOffset)
        params.bgo = String(newState.bgOffset)
        params.bil = String(newState.builtinLightness)
        params.pal = String(newState.parameterLightness)
        params.prl = String(newState.propertyLightness)
        params.nsl = String(newState.namespaceLightness)
        params.mal = String(newState.macroLightness)
        params.tal = String(newState.tagLightness)
        params.pul = String(newState.punctuationLightness)
        params.hel = String(newState.headingLightness)
        params.cml = String(newState.commentLightness)
        params.bal = String(newState.baseLightness)
        params.hil = String(newState.hintLightness)
        params.fgl = String(newState.fgLightness)
        params.bgl = String(newState.bgLightness)
        params.bilink = newState.builtinLinked ? '1' : '0'
        params.palink = newState.parameterLinked ? '1' : '0'
        params.prlink = newState.propertyLinked ? '1' : '0'
        params.nslink = newState.namespaceLinked ? '1' : '0'
        params.malink = newState.macroLinked ? '1' : '0'
        params.talink = newState.tagLinked ? '1' : '0'
        params.pulink = newState.punctuationLinked ? '1' : '0'
        params.helink = newState.headingLinked ? '1' : '0'
        params.cmlink = newState.commentLinked ? '1' : '0'
        params.balink = newState.baseLinked ? '1' : '0'
        params.hilink = newState.hintLinked ? '1' : '0'
        params.fglink = newState.fgLinked ? '1' : '0'
        params.bglink = newState.bgLinked ? '1' : '0'
        params.bim = String(newState.builtinMultiplier)
        params.pam = String(newState.parameterMultiplier)
        params.prm = String(newState.propertyMultiplier)
        params.nsm = String(newState.namespaceMultiplier)
        params.mam = String(newState.macroMultiplier)
        params.tam = String(newState.tagMultiplier)
        params.pum = String(newState.punctuationMultiplier)
        params.hem = String(newState.headingMultiplier)
        params.cmm = String(newState.commentMultiplier)
        params.bam = String(newState.baseMultiplier)
        params.him = String(newState.hintMultiplier)
        params.fgm = String(newState.fgMultiplier)
        params.bgm = String(newState.bgMultiplier)
        // MapLibre-specific colors
        params.mwo = String(newState.mapWaterOffset)
        params.mpo = String(newState.mapParkOffset)
        params.mrmo = String(newState.mapRoadMotorwayOffset)
        params.mrto = String(newState.mapRoadTrunkOffset)
        params.mrpro = String(newState.mapRoadPrimaryOffset)
        params.mrso = String(newState.mapRoadSecondaryOffset)
        params.mbo = String(newState.mapBuildingOffset)
        params.mpoi = String(newState.mapPoiOffset)
        params.mws = String(newState.mapWaterSaturation)
        params.mps = String(newState.mapParkSaturation)
        params.mrs = String(newState.mapRoadSaturation)
        params.mbs = String(newState.mapBuildingSaturation)
      },
      { deep: true }
    )
  }

  // Generate colors for a specific mode with auto-contrast
  const generateThemeVariant = (mode: 'dark' | 'light') => {
    const isDark = mode === 'dark'
    const contrastFactor = state.value.contrast / 100
    // Use mode-specific saturation
    const sat = (isDark ? state.value.saturation : state.value.lightModeSaturation) / 100

    // Monochrome intensity for foreground
    const monoIntensity = state.value.monochromeIntensity / 100

    // Helper to generate color at hue offset with mode-appropriate lightness
    // Uses perceptual lightness adjustments for better consistency
    const colorAt = (hueOffset: number, darkBase: number, lightBase: number) => {
      const hue = (state.value.baseHue + hueOffset + 360) % 360

      // Adjust lightness based on contrast setting
      // Dark mode: 50-75% range (visible but not too bright)
      // Light mode: 30-50% range (visible but not too dark)
      const darkL = darkBase + (contrastFactor - 0.5) * 15
      const lightL = lightBase - (contrastFactor - 0.5) * 12

      const l = isDark ? darkL : lightL
      return chroma.hsl(hue, sat, l / 100).hex()
    }

    // Helper to map lightness slider (0-100) to actual lightness values
    // 50 = default (use calculated value), <50 = darker, >50 = lighter
    const applyLightnessAdjust = (baseDark: number, baseLight: number, adjust: number) => {
      const offset = (adjust - 50) * 0.3 // ±15 range from center
      return {
        dark: baseDark + offset,
        light: baseLight + offset,
      }
    }

    // Base lightness values [dark, light] for each color type
    // Dark mode: high lightness (55-65%) for bright colors on dark bg
    // Light mode: LOW lightness (25-35%) for dark colors on white bg (AAA contrast)
    const LIGHTNESS_BASES: Record<string, [number, number]> = {
      error: [55, 28], warning: [55, 30], keyword: [60, 25], string: [60, 32],
      number: [65, 35], function: [55, 28], constant: [58, 30], type: [62, 27],
      variable: [57, 33], operator: [60, 30], builtin: [58, 29], parameter: [56, 32],
      property: [57, 31], namespace: [61, 28], macro: [59, 29], tag: [60, 26],
      punctuation: [55, 35], heading: [62, 25], comment: [45, 50], base: [50, 30],
      hint: [70, 45], fg: [88, 15], bg: [5, 97],  // fg: bright on dark, dark on light; bg: dark on dark, light on light
    }

    const L: Record<string, { dark: number; light: number }> = {}
    for (const [name, [dark, light]] of Object.entries(LIGHTNESS_BASES)) {
      const adjust = (state.value as Record<string, any>)[`${name}Lightness`] as number
      L[name] = applyLightnessAdjust(dark, light, adjust)
    }

    // Helper to get actual offset (linked = hueOffset * multiplier + individual offset, unlinked = fixed offset)
    const getOffset = (colorName: string): number => {
      const linked = state.value[`${colorName}Linked` as keyof ThemeState] as boolean
      const individualOffset = state.value[`${colorName}Offset` as keyof ThemeState] as number
      if (linked) {
        const multiplier = state.value[`${colorName}Multiplier` as keyof ThemeState] as number
        return state.value.hueOffset * multiplier + individualOffset
      }
      return individualOffset
    }

    // Generate bg and fg with special handling for monochrome mode
    const bgHue = (state.value.baseHue + getOffset('bg') + 360) % 360
    const fgHue = (state.value.baseHue + getOffset('fg') + 360) % 360
    const bgL = isDark ? L.bg.dark : L.bg.light
    const fgL = isDark ? L.fg.dark : L.fg.light

    // Light mode gets a subtle hue tint for easier on eyes, dark mode stays pure dark
    const bgSat = isDark ? 0 : sat * 0.08
    const bg = chroma.hsl(bgHue, bgSat, bgL / 100).hex()
    const fg = state.value.monochromeMode
      ? chroma.hsl(fgHue, sat * monoIntensity, fgL / 100).hex()
      : chroma.hsl(fgHue, 0, fgL / 100).hex()

    // Cartographic wisdom: semantic hues for map features
    // Water is blue, parks are green - absolute hues, not theme-relative
    const CARTOGRAPHIC_HUES = {
      water: 200, // Blue
      park: 120, // Green
      motorway: 20, // Orange
      trunk: 40, // Yellow
      primary: 50, // Warm yellow
      secondary: 60, // Yellow-green
      building: 280, // Purple
      poi: 0, // Red
    }

    // Lightness values for map features based on theme mode
    const getMapLightness = (feature: keyof typeof CARTOGRAPHIC_HUES) => {
      const lightness = {
        dark: {
          water: 15,
          park: 45,
          motorway: 60,
          trunk: 58,
          primary: 55,
          secondary: 52,
          building: 35,
          poi: 58,
        },
        light: {
          water: 85,
          park: 40,
          motorway: 42,
          trunk: 43,
          primary: 44,
          secondary: 46,
          building: 50,
          poi: 42,
        },
      }
      const base = isDark ? lightness.dark[feature] : lightness.light[feature]
      // Apply contrast adjustments
      return base + (contrastFactor - 0.5) * (isDark ? 15 : -12)
    }

    // Saturation values for map features (user-adjustable)
    const getMapSaturation = (feature: keyof typeof CARTOGRAPHIC_HUES) => {
      const baseSaturation = {
        water: state.value.mapWaterSaturation / 100,
        park: state.value.mapParkSaturation / 100,
        motorway: state.value.mapRoadSaturation / 100,
        trunk: state.value.mapRoadSaturation / 100,
        primary: state.value.mapRoadSaturation / 100,
        secondary: (state.value.mapRoadSaturation / 100) * 0.7, // Roads use shared saturation
        building: state.value.mapBuildingSaturation / 100,
        poi: state.value.mapRoadSaturation / 100, // POIs use road saturation
      }
      return baseSaturation[feature]
    }

    const mapColorAt = (feature: keyof typeof CARTOGRAPHIC_HUES) => {
      const hue = CARTOGRAPHIC_HUES[feature]
      const lightness = getMapLightness(feature) / 100
      const saturation = getMapSaturation(feature)
      return chroma.hsl(hue, saturation, lightness).hex()
    }

    // Generate semantic colors using offset and lightness values
    const semanticColor = (name: string) => colorAt(getOffset(name), L[name].dark, L[name].light)

    return {
      bg,
      fg,
      base: semanticColor('base'),
      error: semanticColor('error'),
      warning: semanticColor('warning'),
      hint: semanticColor('hint'),
      comment: semanticColor('comment'),
      keyword: semanticColor('keyword'),
      string: semanticColor('string'),
      number: semanticColor('number'),
      function: semanticColor('function'),
      constant: semanticColor('constant'),
      type: semanticColor('type'),
      variable: semanticColor('variable'),
      operator: semanticColor('operator'),
      builtin: semanticColor('builtin'),
      parameter: semanticColor('parameter'),
      property: semanticColor('property'),
      namespace: semanticColor('namespace'),
      macro: semanticColor('macro'),
      tag: semanticColor('tag'),
      punctuation: semanticColor('punctuation'),
      heading: semanticColor('heading'),
      palette: {
        0: chroma.hsl(0, 0, isDark ? 0.1 : 0.9).hex(),
        1: colorAt(state.value.hueOffset, 50, 35),
        2: colorAt(state.value.hueOffset * 2, 50, 38),
        3: colorAt(-state.value.hueOffset, 60, 45),
        4: colorAt(-state.value.hueOffset * 2, 55, 40),
        5: colorAt(-state.value.hueOffset * 3, 58, 42),
        6: colorAt(state.value.hueOffset * 3, 55, 40),
        7: chroma.hsl(0, 0, isDark ? 0.7 : 0.3).hex(),
        8: chroma.hsl(0, 0, isDark ? 0.35 : 0.65).hex(),
        9: colorAt(state.value.hueOffset, 65, 42),
        10: colorAt(state.value.hueOffset * 2, 65, 45),
        11: colorAt(-state.value.hueOffset, 75, 50),
        12: colorAt(-state.value.hueOffset * 2, 70, 48),
        13: colorAt(-state.value.hueOffset * 3, 72, 48),
        14: colorAt(state.value.hueOffset * 3, 70, 45),
        15: chroma.hsl(0, 0, isDark ? 0.95 : 0.1).hex(),
      },
      // MapLibre-specific colors using cartographic wisdom
      // Absolute semantic hues: water is blue, parks are green
      mapWater: mapColorAt('water'),
      mapPark: mapColorAt('park'),
      mapRoadMotorway: mapColorAt('motorway'),
      mapRoadTrunk: mapColorAt('trunk'),
      mapRoadPrimary: mapColorAt('primary'),
      mapRoadSecondary: mapColorAt('secondary'),
      mapBuilding: mapColorAt('building'),
      mapPoi: mapColorAt('poi'),
    }
  }

  // Apply colorblind simulation to a color
  const simulateColorblind = (hexColor: string, mode: ThemeState['colorblindMode']): string => {
    if (mode === 'none') return hexColor

    const color = chroma(hexColor)
    const [h, s, l] = color.hsl()

    if (mode === 'achromatopsia') {
      // Pure grayscale - keep only luminance
      return chroma.hsl(0, 0, l).hex()
    }

    if (mode === 'protanopia') {
      // No red perception - shift reds toward yellows/browns
      let newHue = h
      if (h >= 0 && h < 60) newHue = h + 30 // red→orange
      if (h >= 300) newHue = 60 // magenta→yellow
      return chroma.hsl(newHue, s * 0.6, l).hex()
    }

    if (mode === 'deuteranopia') {
      // No green perception - similar to protanopia
      let newHue = h
      if (h >= 60 && h < 180) newHue = 50 // green→yellow/brown
      return chroma.hsl(newHue, s * 0.5, l).hex()
    }

    if (mode === 'tritanopia') {
      // No blue perception - blues→greens, purples→reds
      let newHue = h
      if (h >= 180 && h < 300) newHue = h - 60 // blue→cyan/green
      return chroma.hsl(newHue, s * 0.7, l).hex()
    }

    return hexColor
  }

  // Apply colorblind simulation to all colors in a theme
  const applyColorblindSim = (theme: ThemeColors): ThemeColors => {
    if (state.value.colorblindMode === 'none') return theme

    const simulated: any = {}
    for (const [key, value] of Object.entries(theme)) {
      if (key === 'palette') {
        simulated.palette = {}
        for (const [idx, color] of Object.entries(value as Record<number, string>)) {
          simulated.palette[idx] = simulateColorblind(color, state.value.colorblindMode)
        }
      } else {
        simulated[key] = simulateColorblind(value as string, state.value.colorblindMode)
      }
    }
    return simulated as ThemeColors
  }

  // Current mode colors with colorblind simulation
  // If imported palette exists, use it directly instead of generating
  const colors = computed(() => {
    if (state.value.importedPalette) {
      return applyColorblindSim(state.value.importedPalette)
    }
    return applyColorblindSim(generateThemeVariant(state.value.mode))
  })

  // Both variants with colorblind simulation
  const darkColors = computed(() => applyColorblindSim(generateThemeVariant('dark')))
  const lightColors = computed(() => applyColorblindSim(generateThemeVariant('light')))

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
