<template>
  <div>
    <!-- Standard subnav -->
    <nav class="navbar navbar-inverse" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">         
        <a class="navbar-brand">Standard</a>
        <button type="button" class="navbar-toggle" @click="toggleOption">
          <span class="sr-only">Toggle navigation</span>
          <span class="caret caret-mod"></span>
        </button>
      </div>
      <div class="['navbar-collapse', optionOpen ? 'collapse-in' : 'collapse']">
        <ul class="nav navbar-nav">
          <nav-add-to-project :standard="routerStandard"></nav-add-to-project>
        </ul>
        <ul class="nav navbar-nav">
          <li><a href='#' @click="showRevision = true"><span class="glyphicon glyphicon-list" /> Revisions</a></li>
        </ul>
      </div>
    </nav>
  <!-- Standard PDF Viewer -->
    <div class='row' style="position: fixed; height: 95%; min-height: 95%; width: 100%; ">
      <div class='col-xs-12 col-md-8 col-md-offset-2 col-xs-offset' style="height: calc( 100% - 100px );">
        <iframe id='pdf' class='pdf-frame' :src="standardUrl" frameborder="0" wmode="transparent"></iframe>
      </div>
    </div>
  <!-- Versions Modal -->
    <base-modal :dim="showRevision" :hideSubmit="true" v-on:close="showRevision = false" v-on:submit="showRevision = false">
      <template slot='title'>Standard Revision</template>
    <template slot='body'>
      <div class="list-group">
        <a class="list-group-item" v-for="version in revisions">
          <h4 class="list-group-item-heading pull-left"style="margin-right: 10px; margin-bottom: 0px;">{{ version.createdAt | date }}</h4>
          <p class="list-group-item-text text-left" style="margin-top: 2px;" >{{version.note}}</p>
        </a>
      </div>
    </template>
    <template slot='button' v-if="false">Add Project</template>
    </base-modal>
  </div>
</template>

<!-- Changes -->
  

<script>
  import BaseModal from 'components/modals/BaseModal'
  import {withToken, apiGetStandardPdf} from '../api/config'
  import {addHistory, getStandardRevisions} from '../api/standard'
  import StandardMenu from './StandardMenu'
  import NavAddToProject from './widget/NavAddToProject'
  import bus from '../bus'

  export default {
    created () {
      addHistory(this.$route.params.standardId).then((res) => {
      }).catch(e => this.$store.dispatch('createAlert', {message: e.data, type: 'warning'}))

      getStandardRevisions(this.$route.params.standardId).then((res) => {
        this.revisions = res.data
      }).catch(e => this.$store.dispatch('createAlert', {message: e.data, type: 'warning'}))
    },
    computed: {
      standardUrl: function () {
        var standardId = this.$route.params.standardId
        var standardUrl = withToken(apiGetStandardPdf(standardId))
        console.log(standardUrl)
        var iFrameUrl = `https://docs.google.com/gview?url=${standardUrl}&embedded=true`
        return iFrameUrl
      },
      routerStandard: function () {
        return this.$route.params.standardId
      }
    },
    methods: {
      toggleOption () {
        var temp = !this.optionOpen
        bus.emit('page-reset', 'standardView')
        this.optionOpen = temp
      }
    },
    data () {
      return {
        optionOpen: false,
        standard: {},
        revisions: [],
        showRevision: false
      }
    },
    components: {
      StandardMenu,
      NavAddToProject,
      BaseModal
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
