import Vue from 'vue'
import App from './App.vue'
import VDocViewer from './index'
import Vuemerang from 'vuemerang'

import 'vuemerang/dist/vuemerang.css'
Vue.config.productionTip = false
Vue.use(VDocViewer)
Vue.use(Vuemerang)

new Vue({
  render: h => h(App)
}).$mount('#app')
