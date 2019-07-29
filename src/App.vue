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
        urlFile: 'https://cdn.dribbble.com/users/228320/screenshots/6696074/attachments/1430562/new_campaign_-_step_1-1.png'
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
