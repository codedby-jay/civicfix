export type ToastTone = 'default' | 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  tone: ToastTone
}
