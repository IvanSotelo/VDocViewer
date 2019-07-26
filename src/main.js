import Vue from 'vue'
import App from './App.vue'
import { VDocViewer } from './index'

Vue.config.productionTip = false
Vue.use(VDocViewer)

new Vue({
  components: { VDocViewer },
  render: h => h(App)
}).$mount('#app')
