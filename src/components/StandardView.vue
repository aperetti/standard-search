<template>
  <div class='row' style="height: 100%">
    <div class='col-xs-10'><standard-menu></standard-menu></div>
    <div class='col-xs-10 col-sm-8 col-sm-offset-2 col-xs-offset-1 wrap' style="height: 100%">
      <iframe v-if="$route.query.standard !== undefined" id='pdf-frame' class='pdf-frame' :src="currentStandard" frameborder="0" wmode="transparent"></iframe>
    </div>
  </div>
</template>

<script>
  import {apiGetStandardHtml} from '../api/config'
  import StandardMenu from './StandardMenu'
  export default {
    computed: {
      currentStandard: function () {
        return apiGetStandardHtml(this.$route.query.standard)
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
