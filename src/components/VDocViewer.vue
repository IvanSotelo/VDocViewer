<template lang="html">
  <transition name="viewer-t">
    <div
      v-if="active || vmActive"
      ref="con"
      :class="[`vm-viewer`, !isPrompt?'':'']"
      class="vm-component con-vm-viewer">
      <div
        class="vm-viewer-dark"
        @click="close($event,true)"/>
      <div class="vm-viewer-controlls">
        <div class="info">
          <div class="aux">
            <div class="data">
              <div class="file-name">
                Texcaz.rar
              </div>
              <div class="file-data">
                PDF · 1.7 MB
              </div>
            </div>
          </div>
          <div class="options">
            <vm-button
              :icon="config.fullScreen ? 'collapse-outline' : 'expand-outline'"
              radius
              type="flat"
              class="vm-viewer-cancel vm-viewer-cancel--icon notranslate"
              @click="fullScreen">
            </vm-button>
            <vm-button
              icon="cloud-download-outline"
              radius
              type="flat"
              class="vm-viewer-cancel vm-viewer-cancel--icon notranslate"
              @click="download(urlFile || vmUrlFile)">
            </vm-button>
            <vm-button
              icon="close"
              radius
              type="flat"
              class="vm-viewer-cancel vm-viewer-cancel--icon notranslate"
              @click="cancelClose">
            </vm-button>
          </div>
        </div>
      </div>
      <div class="vm-viewer-image">
        <img
          v-show="imgVisible"
          :src="urlFile || vmUrlFile"
          :alt="fileName?fileName:vmFileName"
          :width="imgStyle.width"
          :height="imgStyle.height"
          :style="`margin-top: ${imgStyle.marginTop}px; margin-left: ${imgStyle.marginLeft}px`">
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'VmViewer',
  props: {
    vmColor: {
      default: 'primary',
      type: String
    },
    vmActive: {
      default: false,
      type: Boolean
    },
    vmFileName: {
      default: 'File Name',
      type: String
    },
    vmMimeType: {
      default: 'Image',
      type: String
    },
    vmSizeFile: {
      default: '0 KB',
      type: String
    },
    vmUrlFile: {
      default: '0 KB',
      type: String
    },
    vmIconPack: {
      default: 'eva',
      type: String
    },
    vmCloseIcon: {
      default: 'close',
      type: String
    },
    vmCloseColor: {
      default: 'gray',
      type: String
    },
    vmDownloadIcon: {
      default: 'cloud-download-outline',
      type: String
    },
    vmDownloadColor: {
      default: 'gray',
      type: String
    }
  },
  data: () => ({
    config: {
      imgMaxWidth: window.innerWidth,
      imgMaxHeight: window.innerHeight,
      fullScreen: false
    },
    imgStyle: {
      width: 'auto',
      height: 'auto',
      marginLeft: '0px',
      marginTop: '0px'
    },
    zoomPercent: '100%',
    imgVisible: false,
    zoomFactor: 1,
    isPrompt: true,
    active: false,
    fileName: null,
    mimeType: null,
    sizeFile: null,
    urlFile: null
  }),
  watch: {
    vmActive () {
      this.$nextTick(() => {
        if (this.vmActive) {
          this.insertBody()
        }
      })
    },
    active () {
      this.imgLoad(this.imgSize)
    }
  },
  created () {
    window.onresize = () => {
      const fullscreenEnabled = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
      if (!fullscreenEnabled) this.config.fullScreen = false
      this.config.imgMaxWidth = window.innerWidth
      this.config.imgMaxHeight = window.innerHeight
      this.imgSize()
    }
  },
  mounted () {
    if (this.active && this.isPrompt) {
      this.insertBody()
    }
    document.addEventListener('keyup', this.escape)
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.escape)
  },
  methods: {
    imgLoad (callback) {
      setTimeout(() => {
        const $img = document.querySelector('.vm-viewer-image > img')
        const timer = setInterval(() => {
          if ($img.complete) {
            callback()
            clearInterval(timer)
          }
        }, 100)
      })
    },
    imgSize () {
      const _img = document.querySelector('.vm-viewer-image > img')
      const aspectRatio = _img.naturalWidth / _img.naturalHeight

      let width = this.config.imgMaxWidth
      let height = this.config.imgMaxHeight

      if (this.config.imgMaxHeight * aspectRatio > this.config.imgMaxWidth) {
        height = this.config.imgMaxWidth / aspectRatio
      } else {
        width = this.config.imgMaxHeight * aspectRatio
      }

      width = Math.min(width * 0.99, _img.naturalWidth)
      height = Math.min(height * 0.99, _img.naturalHeight)

      width = width * this.zoomFactor
      height = height * this.zoomFactor

      let left = (this.config.imgMaxWidth - width) / 2
      let top = (this.config.imgMaxHeight - height) / 2
      if (parseInt(width) > this.config.imgMaxWidth) left = 0
      if (parseInt(height) > this.config.imgMaxHeight) top = 0

      this.imgStyle = {
        height,
        width,
        marginLeft: left,
        marginTop: top
      }
      this.imgVisible = true
    },
    acceptDialog () {
      if (!this.isPrompt) {
        this.accept && this.accept()
        this.active = false
        this.$emit('update:vmActive', false)
        this.$emit('vm-accept')
      } else {
        if (this.vmIsValid || this.vmIsValid === 'none') {
          this.accept && this.accept()
          this.active = false
          this.$emit('update:vmActive', false)
          this.$emit('vm-accept')
        } else {
          this.rebound()
        }
      }
    },
    rebound () {
      this.$refs.viewerx.classList.add('locked')
      setTimeout(() => {
        this.$refs.viewerx.classList.remove('locked')
      }, 200)
    },
    close (event, con) {
      if (con) {
        if (event.target.className.indexOf('vm-viewer-dark') !== -1 && this.type === 'alert') {
          this.active = false
          this.$emit('update:vmActive', false)
        } else if (event.target.className.indexOf('vm-viewer-dark') !== -1) {
          this.rebound()
        }
      } else {
        if (event ? event.target.className.indexOf('vm-viewer-cancel') !== -1 : event ? event.target.className.indexOf('vm-viewer-cancel--icon') !== -1 : false) {
          this.active = false
          this.$emit('update:vmActive', false)
        }
      }
      this.$emit('vm-close')
    },
    cancelClose () {
      this.active = false
      this.$emit('update:vmActive', false)
      this.$emit('vm-cancel')
      this.cancel && this.cancel()
    },
    download (url) {
      window.open(url)
    },
    fullScreen () {
      if (this.config.fullScreen) {
        if (document.exitFullscreen) document.exitFullscreen()
        else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen()
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
        else if (document.msExitFullscreen) document.msExitFullscreen()
        this.config.fullScreen = false
      } else {
        const requestFullScreen = document.documentElement.requestFullScreen ||
                document.documentElement.webkitRequestFullScreen ||
                document.documentElement.mozRequestFullScreen ||
                document.documentElement.msRequestFullscreen
        if (requestFullScreen) requestFullScreen.call(document.documentElement)
        this.config.fullScreen = true
      }
    },
    insertBody () {
      let elx = this.$refs.con
      document.body.insertBefore(elx, document.body.firstChild)
    },
    escape (e) {
      if (e.keyCode === 27) this.cancelClose()
    }
  }
}
</script>
