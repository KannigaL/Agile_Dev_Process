import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Shifts from './views/Shifts.vue'
import DailyView from './views/DailyView.vue'
import SickView from './views/SickView.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/shifts',
      name: 'shifts',
      component: Shifts
    },
    {
      path: '/sick',
      name: 'Mark Sick',
      component: SickView
    },
    {
      path: '/day/:date',
      name: 'daily-view',
      component: DailyView
    }
  ]
})
