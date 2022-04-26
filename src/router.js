import { createRouter, createWebHistory } from 'vue-router'

import Authorization from './components/Authorization.vue'
import Midnight from './View/Midnight.vue'

const routes = [
  {
    path: '/',
    component: Authorization
  },
  {
    path: '/midnight',
    name: 'Midnight',
    component: Midnight,
    props: (route) => {
      return { routeParams: route.query }
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router