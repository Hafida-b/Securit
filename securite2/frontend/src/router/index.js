import { createRouter, createWebHistory } from 'vue-router';

import Login from '/src/views/Login.vue'
import Register from '/src/views/Register.vue'
import Verify_code from '../views/Verify_code.vue';
import Visit from '../views/Visit.vue';
import New_visit from '../views/New_visit.vue';



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
    path: '/register',
    component: Register,
   },

   {
    path: '/verify_code',
    component: Verify_code,
   },

   {
    path: '/visit',
    component: Visit,
   },

   {
    path: '/new_visit',
    component: New_visit,
     },

 
]

const router = createRouter({
   history: createWebHistory('/'),
   routes
})

export default router
