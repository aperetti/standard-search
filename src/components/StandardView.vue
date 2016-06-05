<template>
  <div class='row' style="height: 100%">
    <div class='col-xs-12 col-md-8 col-md-offset-2 col-xs-offset wrap'>
      <ul class="nav nav-tabs">
        <li role="presentation" class="active"><a href="#">Messages</a></li>
        <li role="presentation" @click="zoom(true)"><a href="#">Zoom In</a></li>
        <li role="presentation" @click="zoom(false)"><a href="#">Zoom Out</a></li>
      </ul>
    </div>
    <div class='col-xs-12 col-md-8 col-md-offset-2 col-xs-offset wrap' style="height: 100%">
      <iframe v-if="!notFound" id='pdf' class='pdf-frame' :src="currentStandard" frameborder="0" wmode="transparent"></iframe>
      <img v-if="notFound" class="logo" class='photo' src="../assets/logo_s.png">
      <div v-if="notFound" class="page-header"><h2>404 - Not Found</h2></div>
    </div>
  </div>
</template>

<script>
  import {getHtmlStandard} from '../api/standard'
  import StandardMenu from './StandardMenu'
  export default {
    ready: function () {
      this.minZoomRate()
      window.addEventListener('resize', this.minZoomRate)
      this.$watch('zoomRate', () => {
        window.document.getElementById('pdf').contentWindow.document.body.style = `zoom:${this.zoomRate * 100}%;`
      })
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.handleResize)
    },
    data: function () {
      return {
        zoomRate: 1,
        minZoom: 1,
        pdfWidth: 685,
        notFound: false
      }
    },
    computed: {
      currentStandard: function () {
        let self = this
        let standard = this.$route.query.standard
        if (standard) {
          getHtmlStandard(standard).then((response) => {
            window.document.getElementById('pdf').contentWindow.document.open()
            window.document.getElementById('pdf').contentWindow.document.write('data:text/html, ' + response.data)
            window.document.getElementById('pdf').contentWindow.document.close()
            return true
          }, (response) => {
            self.notFound = true
            return false
          })
        }
        return false
      }
    },
    methods: {
      minZoomRate: function () {
        let zoomRatio = window.innerWidth / this.pdfWidth
        this.minZoom = zoomRatio > 1 ? 1 : zoomRatio
        this.zoomRate = this.minZoom
      },
      zoom: function (zoomOut) {
        if (zoomOut) {
          this.zoomRate = this.zoomRate * 1.5
        } else {
          if (this.zoomRate < this.minZoom * 2) {
            this.zoomRate = this.minZoom
          } else {
            this.zoomRate = this.zoomRate / 2
          }
        }
      }
    },
    components: {
      StandardMenu
    }
  }
</script>

<style scoped>
  .pdf-frame {
    width: 100%;
    height: 100%;
  }
  .row {
    margin-left: 0px;
    margin-right: 0px;
  }
  .logo {
    max-width: 100% 
  }

</style>
