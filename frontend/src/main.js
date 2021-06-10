import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'

import VCalendar from 'v-calendar'
import VueToast from 'vue-toast-notification';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'vue-toast-notification/dist/theme-sugar.css';

// Color-Theme
import './color-theme.css'

Vue.use(BootstrapVue)

Vue.use(VCalendar, {
  componentPrefix: 'vc' // Use <vc-calendar /> instead of <v-calendar /> // ...other defaults
})

Vue.use(VueToast);

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
