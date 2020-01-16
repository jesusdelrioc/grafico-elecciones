// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueTabs from 'vue-nav-tabs'
import 'vue-nav-tabs/themes/vue-tabs.css'
import * as axios from 'axios'
import * as d3 from 'd3'

Vue.use(VueTabs)
// eslint-disable-next-line no-unused-vars
Vue.prototype.$http = axios
// eslint-disable-next-line no-unused-vars
Vue.prototype.$d3 = d3

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
