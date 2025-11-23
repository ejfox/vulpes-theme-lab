// Composable for managing highlighted color state across components
export const useHighlightedColor = () => {
  const highlightedColor = useState<string | null>('highlightedColor', () => null)

  const setHighlightedColor = (colorName: string | null) => {
    highlightedColor.value = colorName
  }

  const clearHighlightedColor = () => {
    highlightedColor.value = null
  }

  return {
    highlightedColor,
    setHighlightedColor,
    clearHighlightedColor,
  }
}
