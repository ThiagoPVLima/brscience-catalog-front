import { ref } from 'vue'

export interface ConfirmDialog {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel?: () => void
}

const dialogData = ref<ConfirmDialog | null>(null)
const isDialogOpen = ref(false)

export function useConfirm() {
  const confirm = (options: Omit<ConfirmDialog, 'onConfirm'> & { onConfirm?: () => void }): Promise<boolean> => {
    return new Promise((resolve) => {
      dialogData.value = {
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        type: options.type || 'warning',
        onConfirm: () => {
          if (options.onConfirm) options.onConfirm()
          resolve(true)
          isDialogOpen.value = false
        },
        onCancel: () => {
          if (options.onCancel) options.onCancel()
          resolve(false)
          isDialogOpen.value = false
        }
      }
      isDialogOpen.value = true
    })
  }

  const close = () => {
    isDialogOpen.value = false
  }

  return {
    dialogData,
    isDialogOpen,
    confirm,
    close
  }
}
