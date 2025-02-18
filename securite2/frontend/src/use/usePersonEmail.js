import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const emailPerson = useLocalStorage('my-store', { 'authEmail': '' })