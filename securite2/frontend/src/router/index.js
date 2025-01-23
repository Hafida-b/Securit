import { createRouter, createWebHistory } from 'vue-router'

import SucessAccount from '/src/views/SucessAccount.vue';
import Login from '/src/views/Login.vue';
import VerifyCode from '/src/views/VerifyCode.vue';
import Visits from '/src/views/Visits.vue';
import Signup from '/src/views/Signup.vue';



const routes = [
   {
      path: '/',
      redirect: '/login',
   },
   {
      path: '/login',
      component: Login,
   },
   {
      path: '/verify_code',
      component: VerifyCode,
   },
   {
      path: '/visits',
      component: Visits,
   },
   {
      path: '/signup',
      component: Signup,
   },
   {
      path: '/success_account',
      component: SucessAccount,
   },
];

const router = createRouter({
   history: createWebHistory('/'),
   routes
})

export default router