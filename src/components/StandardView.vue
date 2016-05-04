<template>
  <div class='row'>
    <div class='col-xs-10 col-sm-8 col-sm-offset-2 col-xs-offset-1' style='height: 50%'>
      <div>{{$route.query.standard}}</div>
      <iframe id='pdf-frame' class='pdf-frame' :src="currentStandard" frameborder="0" wmode="transparent"></iframe>
    </div>
  </div>
</template>

<script>
  import {apiHtmlStandardUrl} from '../api/config'
  export default {
    computed: {
      currentStandard: function () {
        return apiHtmlStandardUrl(this.$route.query.standard)
      }
    }
  }
</script>

<style scoped>
  .pdf-frame {
    width: 100%;
    height: 500px;
    z-index: -99;
  }
</style>
