<template lang="pug">
  #app
    v-doc-viewer
</template>

<script>
import { VDocViewer } from './index'
export default {
  name: 'app',
  components: {
    VDocViewer
  }
}
</script>
<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
</style>
