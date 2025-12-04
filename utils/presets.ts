/**
 * Vulpes Monthly Theme Line
 * A year-long journey through color space
 * Each month has its own carefully calibrated hue, creating a complete spectrum
 */

export interface ThemePreset {
  name: string
  id: string
  month: number
  description: string
  baseHue: number
  baseSaturation: number
  baseLightness: number
  isDark: boolean
  // Color offsets (inherited from vulpes-reddishnovember)
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
}

/**
 * The complete Vulpes theme line - 12 months of chromatic evolution
 * Following ROYGBIV with November Reddish (330°) as the anchor
 * December = 0°, progressing +30° per month through the color wheel
 */
export const VULPES_MONTHLY_PRESETS: ThemePreset[] = [
  // JANUARY - Orangish (30°) - new year warmth
  {
    name: 'vulpes-orangish-january',
    id: 'vulpes-orangish-january',
    month: 1,
    description: 'Orange warmth - new year energy in the terminal',
    baseHue: 30,
    baseSaturation: 86,
    baseLightness: 60,
    isDark: true,
    errorOffset: 180,
    warningOffset: 30,
    keywordOffset: 15,
    stringOffset: -30,
    numberOffset: 20,
    functionOffset: -15,
    constantOffset: 25,
    typeOffset: 10,
    variableOffset: -10,
    operatorOffset: 5,
    builtinOffset: -20,
    parameterOffset: -5,
    propertyOffset: 12,
    namespaceOffset: -8,
    macroOffset: 18,
    tagOffset: -12,
    punctuationOffset: 8,
    headingOffset: 22,
  },

  // FEBRUARY - Yellowish (60°) - winter's end glow
  {
    name: 'vulpes-yellowish-february',
    id: 'vulpes-yellowish-february',
    month: 2,
    description: 'Yellow-orange glow - winter fading into spring',
    baseHue: 60,
    baseSaturation: 84,
    baseLightness: 62,
    isDark: true,
    errorOffset: 180,
    warningOffset: 30,
    keywordOffset: 15,
    stringOffset: -30,
    numberOffset: 20,
    functionOffset: -15,
    constantOffset: 25,
    typeOffset: 10,
    variableOffset: -10,
    operatorOffset: 5,
    builtinOffset: -20,
    parameterOffset: -5,
    propertyOffset: 12,
    namespaceOffset: -8,
    macroOffset: 18,
    tagOffset: -12,
    punctuationOffset: 8,
    headingOffset: 22,
  },

  // MARCH - Yellowish (90°) - spring awakening
  {
    name: 'vulpes-yellowish-march',
    id: 'vulpes-yellowish-march',
    month: 3,
    description: 'Yellow-green spring - new growth in the codebase',
    baseHue: 90,
    baseSaturation: 82,
    baseLightness: 58,
    isDark: true,
    errorOffset: 180,
    warningOffset: 30,
    keywordOffset: 15,
    stringOffset: -30,
    numberOffset: 20,
    functionOffset: -15,
    constantOffset: 25,
    typeOffset: 10,
    variableOffset: -10,
    operatorOffset: 5,
    builtinOffset: -20,
    parameterOffset: -5,
    propertyOffset: 12,
    namespaceOffset: -8,
    macroOffset: 18,
    tagOffset: -12,
    punctuationOffset: 8,
    headingOffset: 22,
  },

  // APRIL - Greenish (120°) - spring bloom
  {
    name: 'vulpes-greenish-april',
    id: 'vulpes-greenish-april',
    month: 4,
    description: 'Pure green - code in full bloom',
    baseHue: 120,
    baseSaturation: 80,
    baseLightness: 55,
    isDark: true,
    errorOffset: 180,
    warningOffset: 30,
    keywordOffset: 15,
    stringOffset: -30,
    numberOffset: 20,
    functionOffset: -15,
    constantOffset: 25,
    typeOffset: 10,
    variableOffset: -10,
    operatorOffset: 5,
    builtinOffset: -20,
    parameterOffset: -5,
    propertyOffset: 12,
    namespaceOffset: -8,
    macroOffset: 18,
    tagOffset: -12,
    punctuationOffset: 8,
    headingOffset: 22,
  },

  // MAY - Greenish (150°) - late spring
  {
    name: 'vulpes-greenish-may',
    id: 'vulpes-greenish-may',
    month: 5,
    description: 'Green-cyan - late spring freshness',
    baseHue: 150,
    baseSaturation: 78,
    baseLightness: 56,
    isDark: true,
    errorOffset: 180,
    warningOffset: 30,
    keywordOffset: 15,
    stringOffset: -30,
    numberOffset: 20,
    functionOffset: -15,
    constantOffset: 25,
    typeOffset: 10,
    variableOffset: -10,
    operatorOffset: 5,
    builtinOffset: -20,
    parameterOffset: -5,
    propertyOffset: 12,
    namespaceOffset: -8,
    macroOffset: 18,
    tagOffset: -12,
    punctuationOffset: 8,
    headingOffset: 22,
  },

  // JUNE - Cyanish (180°) - summer sky
  {
    name: 'vulpes-cyanish-june',
    id: 'vulpes-cyanish-june',
    month: 6,
    description: 'Pure cyan - summer sky syntax',
    baseHue: 180,
    baseSaturation: 80,
    baseLightness: 56,
    isDark: true,
    errorOffset: 180,
    warningOffset: 30,
    keywordOffset: 15,
    stringOffset: -30,
    numberOffset: 20,
    functionOffset: -15,
    constantOffset: 25,
    typeOffset: 10,
    variableOffset: -10,
    operatorOffset: 5,
    builtinOffset: -20,
    parameterOffset: -5,
    propertyOffset: 12,
    namespaceOffset: -8,
    macroOffset: 18,
    tagOffset: -12,
    punctuationOffset: 8,
    headingOffset: 22,
  },

  // JULY - Bluish (210°) - midsummer
  {
    name: 'vulpes-bluish-july',
    id: 'vulpes-bluish-july',
    month: 7,
    description: 'Cyan-blue - midsummer compilation',
    baseHue: 210,
    baseSaturation: 82,
    baseLightness: 57,
    isDark: true,
    errorOffset: 180,
    warningOffset: 30,
    keywordOffset: 15,
    stringOffset: -30,
    numberOffset: 20,
    functionOffset: -15,
    constantOffset: 25,
    typeOffset: 10,
    variableOffset: -10,
    operatorOffset: 5,
    builtinOffset: -20,
    parameterOffset: -5,
    propertyOffset: 12,
    namespaceOffset: -8,
    macroOffset: 18,
    tagOffset: -12,
    punctuationOffset: 8,
    headingOffset: 22,
  },

  // AUGUST - Bluish (240°) - late summer
  {
    name: 'vulpes-bluish-august',
    id: 'vulpes-bluish-august',
    month: 8,
    description: 'Deep blue - late summer debugging',
    baseHue: 240,
    baseSaturation: 85,
    baseLightness: 55,
    isDark: true,
    errorOffset: 180,
    warningOffset: 30,
    keywordOffset: 15,
    stringOffset: -30,
    numberOffset: 20,
    functionOffset: -15,
    constantOffset: 25,
    typeOffset: 10,
    variableOffset: -10,
    operatorOffset: 5,
    builtinOffset: -20,
    parameterOffset: -5,
    propertyOffset: 12,
    namespaceOffset: -8,
    macroOffset: 18,
    tagOffset: -12,
    punctuationOffset: 8,
    headingOffset: 22,
  },

  // SEPTEMBER - Purplish (270°) - autumn shift
  {
    name: 'vulpes-purplish-september',
    id: 'vulpes-purplish-september',
    month: 9,
    description: 'Blue-violet - autumn transition begins',
    baseHue: 270,
    baseSaturation: 80,
    baseLightness: 58,
    isDark: true,
    errorOffset: 180,
    warningOffset: 30,
    keywordOffset: 15,
    stringOffset: -30,
    numberOffset: 20,
    functionOffset: -15,
    constantOffset: 25,
    typeOffset: 10,
    variableOffset: -10,
    operatorOffset: 5,
    builtinOffset: -20,
    parameterOffset: -5,
    propertyOffset: 12,
    namespaceOffset: -8,
    macroOffset: 18,
    tagOffset: -12,
    punctuationOffset: 8,
    headingOffset: 22,
  },

  // OCTOBER - Magentaish (300°) - fall depth
  {
    name: 'vulpes-magentaish-october',
    id: 'vulpes-magentaish-october',
    month: 10,
    description: 'Violet depth - spooky season syntax',
    baseHue: 300,
    baseSaturation: 82,
    baseLightness: 56,
    isDark: true,
    errorOffset: 180,
    warningOffset: 30,
    keywordOffset: 15,
    stringOffset: -30,
    numberOffset: 20,
    functionOffset: -15,
    constantOffset: 25,
    typeOffset: 10,
    variableOffset: -10,
    operatorOffset: 5,
    builtinOffset: -20,
    parameterOffset: -5,
    propertyOffset: 12,
    namespaceOffset: -8,
    macroOffset: 18,
    tagOffset: -12,
    punctuationOffset: 8,
    headingOffset: 22,
  },

  // NOVEMBER - Reddish pink (330°) - THE ORIGINAL! 🦊
  {
    name: 'vulpes-reddishnovember',
    id: 'vulpes-reddishnovember',
    month: 11,
    description: 'Reddish November - the OG cyberpunk neon theme',
    baseHue: 330,
    baseSaturation: 85,
    baseLightness: 55,
    isDark: true,
    errorOffset: 180,
    warningOffset: 30,
    keywordOffset: 15,
    stringOffset: -30,
    numberOffset: 20,
    functionOffset: -15,
    constantOffset: 25,
    typeOffset: 10,
    variableOffset: -10,
    operatorOffset: 5,
    builtinOffset: -20,
    parameterOffset: -5,
    propertyOffset: 12,
    namespaceOffset: -8,
    macroOffset: 18,
    tagOffset: -12,
    punctuationOffset: 8,
    headingOffset: 22,
  },

  // DECEMBER - Reddish (0°) - winter solstice, year reset
  {
    name: 'vulpes-reddish-december',
    id: 'vulpes-reddish-december',
    month: 12,
    description: 'Pure red - winter solstice, year-end reset',
    baseHue: 0,
    baseSaturation: 85,
    baseLightness: 55,
    isDark: true,
    errorOffset: 180,
    warningOffset: 30,
    keywordOffset: 15,
    stringOffset: -30,
    numberOffset: 20,
    functionOffset: -15,
    constantOffset: 25,
    typeOffset: 10,
    variableOffset: -10,
    operatorOffset: 5,
    builtinOffset: -20,
    parameterOffset: -5,
    propertyOffset: 12,
    namespaceOffset: -8,
    macroOffset: 18,
    tagOffset: -12,
    punctuationOffset: 8,
    headingOffset: 22,
  },
]

/**
 * Get preset by month number (1-12)
 */
export function getPresetByMonth(month: number): ThemePreset | undefined {
  return VULPES_MONTHLY_PRESETS.find((p) => p.month === month)
}

/**
 * Get current month's preset
 */
export function getCurrentMonthPreset(): ThemePreset {
  const currentMonth = new Date().getMonth() + 1 // JS months are 0-indexed
  return getPresetByMonth(currentMonth) || VULPES_MONTHLY_PRESETS[10] // Default to November
}

/**
 * Get preset by ID
 */
export function getPresetById(id: string): ThemePreset | undefined {
  return VULPES_MONTHLY_PRESETS.find((p) => p.id === id)
}
