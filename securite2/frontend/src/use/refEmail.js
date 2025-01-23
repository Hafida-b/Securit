//import {ref} from 'vue'
import { useLocalStorage, useStorage } from '@vueuse/core'

export const userEmail = useLocalStorage('auth-email', '')