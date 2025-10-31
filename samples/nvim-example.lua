-- Example Neovim colorscheme export from vulpes-theme-lab
-- Install to: ~/.config/nvim/lua/colors/theme-lab-custom.lua
--
-- This demonstrates the structure of exported Neovim themes.
-- Colors are mapped to LSP diagnostics, syntax highlighting, and UI elements.

return {
  {
    "catppuccin/nvim",  -- or create as custom plugin
    name = "theme-lab-custom",
    lazy = false,
    priority = 1000,
    config = function()
      require("catppuccin").setup({
        flavour = "mocha",  -- dark variant
        transparent_background = false,
        custom_highlights = function(colors)
          return {
            -- UI Elements
            Normal = { fg = "#f8f8f2", bg = "#282a36" },
            NormalFloat = { bg = "#1e1f29" },
            FloatBorder = { fg = "#6272a4", bg = "#1e1f29" },
            SignColumn = { bg = "#282a36" },
            LineNr = { fg = "#6272a4", bg = "#282a36" },
            CursorLine = { bg = "#44475a" },
            CursorLineNr = { fg = "#f1fa8c", bg = "#44475a" },

            -- Syntax Highlighting
            Comment = { fg = "#6272a4", italic = true },
            String = { fg = "#f1fa8c" },
            Number = { fg = "#bd93f9" },
            Boolean = { fg = "#ff79c6" },
            Keyword = { fg = "#ff79c6", bold = true },
            Function = { fg = "#50fa7b" },
            Variable = { fg = "#f8f8f2" },
            Constant = { fg = "#8be9fd" },
            Type = { fg = "#8be9fd" },

            -- LSP Diagnostics
            DiagnosticError = { fg = "#ff5555" },
            DiagnosticWarn = { fg = "#f1fa8c" },
            DiagnosticInfo = { fg = "#8be9fd" },
            DiagnosticHint = { fg = "#50fa7b" },

            DiagnosticSignError = { fg = "#ff5555" },
            DiagnosticSignWarn = { fg = "#f1fa8c" },
            DiagnosticSignInfo = { fg = "#8be9fd" },
            DiagnosticSignHint = { fg = "#50fa7b" },

            DiagnosticUnderlineError = { undercurl = true, sp = "#ff5555" },
            DiagnosticUnderlineWarn = { undercurl = true, sp = "#f1fa8c" },
            DiagnosticUnderlineInfo = { undercurl = true, sp = "#8be9fd" },
            DiagnosticUnderlineHint = { undercurl = true, sp = "#50fa7b" },

            -- Completion Menu
            Pmenu = { fg = "#f8f8f2", bg = "#44475a" },
            PmenuSel = { fg = "#282a36", bg = "#50fa7b" },
            PmenuSbar = { bg = "#44475a" },
            PmenuThumb = { bg = "#6272a4" },

            -- Search & Selection
            Search = { fg = "#282a36", bg = "#f1fa8c" },
            IncSearch = { fg = "#282a36", bg = "#ff79c6" },
            Visual = { bg = "#44475a" },

            -- Diff Colors
            DiffAdd = { fg = "#50fa7b", bg = "#354620" },
            DiffDelete = { fg = "#ff5555", bg = "#563030" },
            DiffChange = { fg = "#8be9fd", bg = "#2a4452" },
            DiffText = { fg = "#f1fa8c", bg = "#4a4620" },

            -- Git Signs
            GitSignsAdd = { fg = "#50fa7b" },
            GitSignsDelete = { fg = "#ff5555" },
            GitSignsChange = { fg = "#8be9fd" },

            -- Telescope (Finder)
            TelescopeNormal = { fg = "#f8f8f2", bg = "#282a36" },
            TelescopeSelection = { fg = "#282a36", bg = "#50fa7b" },
            TelescopeSelectionCaret = { fg = "#ff79c6" },
            TelescopeMultiSelection = { fg = "#ff79c6" },
            TelescopeBorder = { fg = "#6272a4" },
            TelescopeTitle = { fg = "#ff79c6", bold = true },
            TelescopePromptPrefix = { fg = "#50fa7b" },

            -- Neotree (File Explorer)
            NeoTreeNormal = { fg = "#f8f8f2", bg = "#282a36" },
            NeoTreeNormalNC = { fg = "#f8f8f2", bg = "#282a36" },
            NeoTreeEndOfBuffer = { fg = "#282a36", bg = "#282a36" },
            NeoTreeRootName = { fg = "#ff79c6", bold = true },
            NeoTreeDirectoryName = { fg = "#8be9fd" },
            NeoTreeDirectoryIcon = { fg = "#8be9fd" },
            NeoTreeFileNameOpened = { fg = "#50fa7b" },

            -- Statusline / Tabline
            StatusLine = { fg = "#f8f8f2", bg = "#44475a" },
            StatusLineNC = { fg = "#6272a4", bg = "#282a36" },
            TabLine = { fg = "#6272a4", bg = "#282a36" },
            TabLineFill = { bg = "#282a36" },
            TabLineSel = { fg = "#f1fa8c", bg = "#44475a" },
          }
        end,
        integrations = {
          cmp = true,
          gitsigns = true,
          telescope = true,
          treesitter = true,
          notify = true,
          mini = true,
        },
      })
    end,
  },
}
