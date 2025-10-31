import type { ThemeColors, ThemeOptions } from '~/composables/useTheme'

export function serializeNeovimTheme(
  theme: ThemeColors,
  name = 'theme_lab',
  isDark = true,
  options?: ThemeOptions,
  visualEffects?: { windowBlend?: number; popupBlend?: number }
): string {
  const boldKeywords = options?.boldKeywords ?? true
  const italicComments = options?.italicComments ?? true
  const boldFunctions = options?.boldFunctions ?? false
  const italicStrings = options?.italicStrings ?? false
  const underlineErrors = options?.underlineErrors ?? true
  const safeName = name.replace(/-/g, '_')

  const lines = [
    `-- ${name} colorscheme for Neovim`,
    `-- Generated with theme-lab`,
    '',
    `vim.cmd('hi clear')`,
    `if vim.fn.exists('syntax_on') then`,
    `  vim.cmd('syntax reset')`,
    `end`,
    '',
    `vim.o.termguicolors = true`,
    `vim.g.colors_name = '${safeName}'`,
    `vim.o.background = '${isDark ? 'dark' : 'light'}'`,
    '',
  ]

  // Add visual effects if provided
  if (visualEffects) {
    if (visualEffects.windowBlend !== undefined && visualEffects.windowBlend > 0) {
      lines.push(`-- Window transparency`)
      lines.push(`vim.o.winblend = ${visualEffects.windowBlend}`)
    }
    if (visualEffects.popupBlend !== undefined && visualEffects.popupBlend > 0) {
      lines.push(`-- Popup menu transparency`)
      lines.push(`vim.o.pumblend = ${visualEffects.popupBlend}`)
    }
    if ((visualEffects.windowBlend !== undefined && visualEffects.windowBlend > 0) ||
        (visualEffects.popupBlend !== undefined && visualEffects.popupBlend > 0)) {
      lines.push('')
    }
  }

  lines.push(
    `-- Helper function`,
    `local function hi(group, opts)`,
    `  vim.api.nvim_set_hl(0, group, opts)`,
    `end`,
    '',
    `-- Editor colors`,
    `hi('Normal', { fg = '${theme.fg}', bg = '${theme.bg}' })`,
    `hi('Comment', { fg = '${theme.comment}'${italicComments ? ', italic = true' : ''} })`,
    `hi('LineNr', { fg = '${theme.palette[8]}' })`,
    `hi('CursorLine', { bg = '${theme.palette[0]}' })`,
    `hi('CursorLineNr', { fg = '${theme.keyword}', bold = true })`,
    `hi('Visual', { bg = '${theme.palette[8]}' })`,
    `hi('Search', { bg = '${theme.warning}', fg = '${theme.bg}' })`,
    `hi('IncSearch', { bg = '${theme.keyword}', fg = '${theme.bg}', bold = true })`,
    '',
    `-- Syntax highlighting`,
    `hi('Keyword', { fg = '${theme.keyword}'${boldKeywords ? ', bold = true' : ''} })`,
    `hi('String', { fg = '${theme.string}'${italicStrings ? ', italic = true' : ''} })`,
    `hi('Number', { fg = '${theme.number}' })`,
    `hi('Boolean', { fg = '${theme.number}' })`,
    `hi('Function', { fg = '${theme.function}'${boldFunctions ? ', bold = true' : ''} })`,
    `hi('Constant', { fg = '${theme.constant}' })`,
    `hi('Type', { fg = '${theme.type}' })`,
    `hi('Identifier', { fg = '${theme.variable}' })`,
    `hi('Operator', { fg = '${theme.operator}' })`,
    `hi('Statement', { fg = '${theme.keyword}' })`,
    `hi('Conditional', { fg = '${theme.keyword}' })`,
    `hi('Repeat', { fg = '${theme.keyword}' })`,
    `hi('Label', { fg = '${theme.keyword}' })`,
    `hi('Special', { fg = '${theme.constant}' })`,
    `hi('PreProc', { fg = '${theme.type}' })`,
    '',
    `-- LSP/Diagnostics`,
    `hi('DiagnosticError', { fg = '${theme.error}'${underlineErrors ? ', underline = true' : ''} })`,
    `hi('DiagnosticWarn', { fg = '${theme.warning}'${underlineErrors ? ', underline = true' : ''} })`,
    `hi('DiagnosticInfo', { fg = '${theme.hint}' })`,
    `hi('DiagnosticHint', { fg = '${theme.hint}' })`,
    '',
    `-- TreeSitter`,
    `hi('@keyword', { fg = '${theme.keyword}'${boldKeywords ? ', bold = true' : ''} })`,
    `hi('@string', { fg = '${theme.string}'${italicStrings ? ', italic = true' : ''} })`,
    `hi('@number', { fg = '${theme.number}' })`,
    `hi('@function', { fg = '${theme.function}'${boldFunctions ? ', bold = true' : ''} })`,
    `hi('@constant', { fg = '${theme.constant}' })`,
    `hi('@type', { fg = '${theme.type}' })`,
    `hi('@variable', { fg = '${theme.variable}' })`,
    `hi('@operator', { fg = '${theme.operator}' })`,
    `hi('@comment', { fg = '${theme.comment}'${italicComments ? ', italic = true' : ''} })`,
    '',
    `-- Git signs`,
    `hi('GitSignsAdd', { fg = '${theme.palette[2]}' })`,
    `hi('GitSignsChange', { fg = '${theme.palette[3]}' })`,
    `hi('GitSignsDelete', { fg = '${theme.error}' })`,
  )

  return lines.join('\n') + '\n'
}
