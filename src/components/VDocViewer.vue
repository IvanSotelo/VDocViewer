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
                {{ fileName }}
              </div>
              <div class="file-data">
                {{ extension }} · {{ sizeFile }}
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
      <div class="vm-viewer-uknow" v-if="fileType === 'UKNOW'">
        <div>
          <brokeIcon/>
          <p>We can't preview this file type.</p>
          <p>Try downloading the file to view it.</p>
        </div>
      </div>
      <div class="vm-viewer-image" v-if="fileType === 'IMG'">
        <img
          v-show="imgVisible"
          :src="urlFile || vmUrlFile"
          :alt="fileName?fileName:vmFileName"
          :width="imgStyle.width"
          :height="imgStyle.height"
          :style="`margin-top: ${imgStyle.marginTop}px; margin-left: ${imgStyle.marginLeft}px`">
      </div>
      <PDFViewer
        v-if="fileType === 'PDF'"
        v-bind="{url: urlFile}"
        @document-errored="onDocumentErrored"
        >
        <PDFUploader
          v-if="enableUploader"
          :documentError="documentError"
          @updated="urlUpdated"
          slot="header"
          class="header-item"
          />
      </PDFViewer>
    </div>
  </transition>
</template>

<script>
import mime from 'mime-types'
import brokeIcon from '../assets/descarga.svg'
import PDFUploader from '@/components/PDFUploader.vue'
import PDFViewer from '@/components/PDFViewer.vue'

// import remote from 'remote-file-size'
export default {
  name: 'VmViewer',
  components: {
    brokeIcon,
    PDFUploader,
    PDFViewer
  },
  props: {
    vmColor: {
      default: 'primary',
      type: String
    },
    vmActive: {
      default: false,
      type: Boolean
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
    documentError: undefined,
    enableUploader: process.env.VUE_APP_UPLOAD_ENABLED === 'true',
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
      this.fileType === 'IMG' && this.imgLoad(this.imgSize)
      this.mifunc()
    }
  },
  created () {
    window.onresize = () => {
      const fullscreenEnabled = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
      if (!fullscreenEnabled) this.config.fullScreen = false
      this.config.imgMaxWidth = window.innerWidth
      this.config.imgMaxHeight = window.innerHeight
      this.fileType === 'IMG' && this.imgSize()
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
  computed: {
    mimeType () {
      return mime.lookup(this.urlFile || this.vmUrlFile)
    },
    extension () {
      return mime.extension(this.mimeType).toUpperCase()
    },
    fileName () {
      return this.urlFile.substring(this.urlFile.lastIndexOf('/') + 1)
    },
    fileType () {
      if (this.extension === 'PNG' || this.extension === 'JPEG' || this.extension === 'JPG' || this.extension === 'GIF') {
        return 'IMG'
      } else if (this.extension === 'PDF') {
        return 'PDF'
      } else {
        return 'UKNOW'
      }
    }
  },
  methods: {
    urlUpdated (url) {
      this.documentError = undefined
      this.urlFile = url
    },
    onDocumentErrored (e) {
      this.documentError = e.text
    },
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
    },
    mifunc () {
      let t = this
      fetch(this.urlFile || this.vmUrlFile)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
          if (blob.size < 1000) {
            t.sizeFile = `${blob.size.toFixed(1)} B`
          } else if (blob.size >= 1000 && blob.size <= 1000000) {
            t.sizeFile = `${(blob.size / 1000).toFixed(1)} KB`
          } else {
            t.sizeFile = `${(blob.size / 1000000).toFixed(1)} MB`
          }
        })
    }
  }
}
</script>

<style lang="stylus">
//animations
.viewer-t-enter, .viewer-t-leave-to /* .viewer-t-leave-active below version 2.1.8 */ {
  opacity: 0 !important;
}

 //box viewer
.viewer-t-enter .vm-viewer/* .fade-leave-active below version 2.1.8 */ {
  transform: scale(.9) !important;

 }
.viewer-t-leave-to .vm-viewer/* .fade-leave-active below version 2.1.8 */ {
  transform: scale(.9) !important;
  // animation: rebound .3s;
}

 .con-vm-viewer
  transition: all .2s;
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: auto;
  left: 100px;
  top: 100px;
  left: 0px;
  top: 0px;
  z-index: 11000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  .vm-viewer-dark
    width: 100%;
    background:rgb(27, 38, 56);
    position: fixed;
    left: 0px;
    top: 0px;
    height: 100%;
    z-index: 10;
    transition: all .250s ease;
  .vm-viewer-controlls
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 98px;
    opacity: 0.85;
    background-image: linear-gradient(rgb(14, 22, 36), rgba(14, 22, 36, 0));
    color: rgb(184, 199, 224);
    font-weight: 500;
    box-sizing: border-box;
    z-index: 521;
    padding: 24px;
    .info
      display: flex;
      .aux
        font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;
        color: rgb(159, 176, 204);
        flex: 1 1 0%;
        overflow: hidden;
        .data
          pointer-events: none;
          overflow: hidden;
          .file-name
            max-width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          .file-data
            max-width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        .options
          text-align: right;
          margin-right: 40px;
          min-width: 200px;
  .vm-viewer-image
    width: 100vw;
    height: 100vh;
    vertical-align: middle;
    white-space: nowrap;
    overflow: auto;
    z-index: 10
  .vm-viewer-uknow
    margin: 0;
    padding: 0;
    z-index: 10
    div
      text-align: center;
      color: rgb(184, 199, 224);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      svg
        margin-bottom: 10px;
</style>
