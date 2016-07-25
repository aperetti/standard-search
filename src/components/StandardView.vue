<template>
  <!-- Standard subnav -->
  <nav class="navbar navbar-inverse affix" role="navigation">
  <div class="container-fluid">
    <div class="navbar-header">         
      <a class="navbar-brand">Standard</a>
      <button type="button" class="navbar-toggle" @click="toggleOption">
        <span class="sr-only">Toggle navigation</span>
        <span class="caret caret-mod"></span>
      </button>
    </div>
    <div class="{{ optionOpen ? 'navbar-collapse collapse-in' : 'navbar-collapse collapse'}}">
      <ul class="nav navbar-nav">
        <li><a class='cursor'>Logout</a></li>
        <add-to-project :standard="routerStandard"></add-to-project>
      </ul>
    </div>
</nav>
  <div class='row' style="position: fixed; height: 95%; min-height: 95%; width: 100%;">
    <div class='col-xs-12 col-md-8 col-md-offset-2 col-xs-offset' style="height: 50px; z-index: 10 !important; position: relative;">
      <add-to-project :standard="routerStandard"></add-to-project>
    </div>
    <div class='col-xs-12 col-md-8 col-md-offset-2 col-xs-offset' style="height: calc( 100% - 100px );">
      <iframe v-show="!notFound" id='pdf' class='pdf-frame' :src="standardUrl" frameborder="0" wmode="transparent"></iframe>
      <img v-if="notFound" class="logo" class='photo' src="../assets/logo_s.png">
      <div v-if="notFound" class="page-header"><h2>404 - Not Found</h2></div>
    </div>
</template>

<script>
  import {withToken, apiGetStandardPdf} from '../api/config'
  import {addHistory} from '../api/standard'
  import StandardMenu from './StandardMenu'
  import AddToProject from './widget/AddToProject'
  export default {
    route: {
      data: function (transition) {
        addHistory(transition.to.params.standardId).then((res) => {
          console.log('Placeholder: ', res)
        }).catch(e => console.log('Add History Error!', e))
      }
    },
    computed: {
      standardUrl: function () {
        var standardUrl = withToken(apiGetStandardPdf(this.$route.params.standardId))
        var iFrameUrl = `https://docs.google.com/gview?url=${standardUrl}&embedded=true`
        return iFrameUrl
      },
      routerStandard: function () {
        return this.$route.params.standardId
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
  .divide-nav{
  height: 50px;
  background-color: #428bca;
}

.divide-text{
    color:#fff;
    line-height: 20px;
    font-size:20px;
    padding: 15px 0;
}

.affix {
  top: 50px;
  width:100%;
}
.navbar {
  border-radius: 0px;
}
.filler{
  min-height: 2000px;
}

.navbar-form {
   padding-left: 0;
}

.navbar-collapse{
   padding-left:0; 
}

.navbar-toggle {
  margin-top: 12px;
  padding: 9px 12px;
}

.navbar-toggle:hover {
    background-color: #808080;
}
.caret-mod {
    display: block;
    width: 0;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-top: 8px dashed;
    border-top: 8px solid;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
}

</style>
