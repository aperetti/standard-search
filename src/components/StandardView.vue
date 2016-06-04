<template>
  <div class='row' style="height: 100%">
    <div class='col-xs-12 col-md-8 col-md-offset-2 col-xs-offset wrap'>
      <ul class="nav nav-tabs">
        <li role="presentation" class="active"><a href="#">Messages</a></li>
        <li role="presentation" @click="zoom(true)"><a href="#">Zoom In</a></li>
        <li role="presentation" @click="zoom(false)"><a href="#">Zoom Out</a></li>
      </ul>
    </div>
    <div v-touch:swipe='test' class='col-xs-12 col-md-8 col-md-offset-2 col-xs-offset wrap' style="height: 100%">
      <iframe v-if="$route.query.standard !== undefined" id='pdf' class='pdf-frame' :src="currentStandard" frameborder="0" wmode="transparent"></iframe>
    </div>
  </div>
</template>

<script>
  import {apiGetStandardHtml} from '../api/config'
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
        pdfWidth: 685
      }
    },
    computed: {
      currentStandard: function () {
        return apiGetStandardHtml(this.$route.query.standard)
      }
    },
    methods: {
      test: function (event) {
        console.log(event)
      },
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

</style>
