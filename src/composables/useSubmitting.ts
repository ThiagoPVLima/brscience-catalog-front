import { ref } from 'vue'

export function useSubmitting() {
  const submitting = ref(false)

  const guard = (fn: () => void) => {
    if (submitting.value) return
    submitting.value = true
    fn()
  }

  const reset = () => { submitting.value = false }

  return { submitting, guard, reset }
}
