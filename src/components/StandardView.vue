<template>
  <div class='row' style="height: 100%">
    <div class='col-xs-10'><standard-menu></standard-menu></div>
    <div class='col-xs-10 col-xs-offset-1'>
      <div class='input-group-btn'>
        <button class='btn btn-primary' @click='zoom(true)'>Zoom</button><button class='btn btn-primary' @click='zoom(false)'>Zoom Out</button>
      </div>
    </div>
    <div class='col-xs-12 col-sm-8 col-sm-offset-2 col-xs-offset wrap' style="height: 100%">
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
        pdfWidth: 700
      }
    },
    computed: {
      currentStandard: function () {
        return apiGetStandardHtml(this.$route.query.standard)
      }
    },
    methods: {
      minZoomRate: function () {
        console.log('ZOOOOM')
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
