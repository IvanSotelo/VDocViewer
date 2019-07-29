import VDocViewer from './components/VDocViewer'
import utils from './utils'

let instance

export default {
  install (Vue) {
    // Vue.component('v-doc-viewer', VDocViewer)

    Vue.prototype.$viewer = {}

    // console.log(Vue)
    const ViewerConstructor = Vue.extend(VDocViewer)
    Vue.prototype.$viewer.show = function (parameters) {
      instance = new ViewerConstructor({
        data: parameters
      })

      instance.$data.isPrompt = false

      instance.vm = instance.$mount()

      parameters.download && instance.vm.$on('download', parameters.download)
      parameters.cancel && instance.vm.$on('cancel', parameters.cancel)
      utils.insertBody(instance.vm.$el)

      Vue.nextTick(() => {
        instance.active = true
      })
    }
  }
}

// export { VDocViewer }
