<template lang="pug">
  #app
    vm-button(@click="openViewer()" color="primary" type="flat") Open Viewer
</template>

<script>
export default {
  name: 'app',
  methods: {
    openViewer () {
      this.$viewer.show({
        urlFile: 'https://ivansotelo.github.io/VDocViewer/compressed.tracemonkey-pldi-09.pdf'
      })
    }
  }
}
</script>
<style lang="scss">
@import './assets/eva/scss/eva-icons';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
