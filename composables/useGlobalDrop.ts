export function useGlobalDrop(onDrop: (file: File) => void) {
  const isGlobalDragging = ref(false)

  const handleGlobalDragEnter = (e: DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer?.types.includes('Files')) {
      isGlobalDragging.value = true
    }
  }

  const handleGlobalDragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  const handleGlobalDragLeave = (e: DragEvent) => {
    // Only hide if we're leaving the window entirely
    if (e.target === document.body || e.target === document.documentElement) {
      isGlobalDragging.value = false
    }
  }

  const handleGlobalDrop = (e: DragEvent) => {
    e.preventDefault()
    isGlobalDragging.value = false

    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      onDrop(files[0])
    }
  }

  onMounted(() => {
    document.addEventListener('dragenter', handleGlobalDragEnter)
    document.addEventListener('dragover', handleGlobalDragOver)
    document.addEventListener('dragleave', handleGlobalDragLeave)
    document.addEventListener('drop', handleGlobalDrop)
  })

  onUnmounted(() => {
    document.removeEventListener('dragenter', handleGlobalDragEnter)
    document.removeEventListener('dragover', handleGlobalDragOver)
    document.removeEventListener('dragleave', handleGlobalDragLeave)
    document.removeEventListener('drop', handleGlobalDrop)
  })

  return {
    isGlobalDragging,
  }
}
