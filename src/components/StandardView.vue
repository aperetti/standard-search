<template>
  <div class='col-xs-10 col-sm-8 col-sm-offset-2 col-xs-offset-1' style='height: 100%'>
    <div> Hello</div>
    <iframe id='pdf-frame' class='pdf-frame' :src="currentStandard" v-if="standard != ''"  frameborder="0" wmode="transparent"></iframe>
  </div>

</template>

<script>
  export default {
    data () {
      return {
        url: 'http://45.56.92.153:8080/api/html?file='
      }
    },
    vuex: {
      getters: {
        standard: state => state.standard.standard
      }
    },
    computed: {
      currentStandard: function () {
        return this.url + this.standard + '&token=' + window.localStorage.getItem('token')
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
