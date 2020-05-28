import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import cookie from '../utils/cookie'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      if(!cookie.getCookie('token')){
        router.push({path:'/login'})
      }
      next()
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
