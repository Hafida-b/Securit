//imort {ref} from 'vue'
import {useLocalStorage } from '@vueuse/core'

//export const authEmail= ref{}
export const authmail = useLocalStorage('auth-email','')