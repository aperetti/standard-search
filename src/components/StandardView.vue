<template>
  <div class="fluid-container" style="height: 100%">
  <div class='row' style="height: 95%; min-height: 95%;">
    <div class='col-xs-12 col-md-8 col-md-offset-2 col-xs-offset' style="height: 50px; z-index: 10 !important; position: relative;">
      <add-to-project></add-to-project>
    </div>
    <div class='col-xs-12 col-md-8 col-md-offset-2 col-xs-offset' style="height: calc( 100% - 100px );">
      <iframe v-show="!notFound" id='pdf' class='pdf-frame' :src="standardUrl" frameborder="0" wmode="transparent"></iframe>
      <img v-if="notFound" class="logo" class='photo' src="../assets/logo_s.png">
      <div v-if="notFound" class="page-header"><h2>404 - Not Found</h2></div>
    </div>
  </div>
</template>

<script>
  import {withToken, apiGetStandardPdf} from '../api/config'
  import StandardMenu from './StandardMenu'
  import AddToProject from './dumb/AddToProject'
  export default {
    computed: {
      standardUrl: function () {
        var standardUrl = withToken(apiGetStandardPdf(this.$route.query.standard))
        var iFrameUrl = `https://docs.google.com/gview?url=${standardUrl}&embedded=true`
        console.log(iFrameUrl)
        return iFrameUrl
      }
    },
    components: {
      StandardMenu,
      AddToProject
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
  .div-pdf {
    position: relative;

  }
</style>
