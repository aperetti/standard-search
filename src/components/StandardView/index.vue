<template>
  <div>
    <!-- Standard subnav -->
    <nav class="navbar navbar-inverse" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">         
        <a class="navbar-brand" style="cursor: default;">{{standard && standard.code}}</a>
        <button type="button" class="navbar-toggle" @click="toggleOption">
          <span class="sr-only">Toggle navigation</span>
          <span class="caret caret-mod"></span>
        </button>
      </div>
      <div :class="['navbar-collapse', optionOpen ? 'collapse-in' : 'collapse']">
        <ul class="nav navbar-nav">
          <li><a href='#' @click="standardLink"><span class="glyphicon glyphicon-open" /> Open</a></li>
          <nav-add-to-project :standard="routerStandard" v-on:create-project='createProject = true'></nav-add-to-project>
          <nav-references v-if="standard && standard.keywords && standard.keywords.length > 0" :references="standard.keywords"></nav-references>
          <li><a href='#' @click="showRevision = true"><span class="glyphicon glyphicon-list" /> Revisions</a></li>
        </ul>
      </div>
    </nav>
  <!-- Standard PDF Viewer -->
    <div class='row' style="position: fixed; height: 95%; min-height: 95%; width: 100%; ">
      <div class='col-xs-12 col-lg-8 col-lg-offset-2 col-xs-offset' style="height: calc( 100% - 100px );">
        <object type="text/html" id='pdf' class='pdf-frame' :data="standardUrl" frameborder="0" wmode="transparent"></object>
      </div>
    </div>
  <!-- Versions Modal -->
    <base-modal :dim="showRevision" :hideSubmit="true" v-on:close="showRevision = false" v-on:submit="showRevision = false">
      <template slot='title'>Standard Revision</template>
    <template slot='body'>
      <div class="list-group">
        <a v-if="!loadingRevisions" class="list-group-item" v-for="version in revisions">
          <h4 class="list-group-item-heading pull-left"style="margin-right: 10px; margin-bottom: 0px;">{{ version.createdAt | date }}</h4>
          <p class="list-group-item-text text-left" style="margin-top: 2px;" v-if="version.note" > {{ version.note }}</p>
          <p class="list-group-item-text text-left" style="margin-top: 2px;" v-else> File Changed </p>
        </a>
        <img v-if="loadingRevisions" src="~src/assets/ring-alt108.svg">
      </div>
    </template>
    <template slot='button' v-if="false">Add Project</template>
    </base-modal>
        <!-- Create Project -->
    <create-project :dim='createProject' v-on:close='createProject = false'></create-project>

  </div>
</template>

<!-- Changes -->
  

<script>
  import BaseModal from 'components/modals/BaseModal'
  import {withToken, apiGetStandardPdf} from 'src/api/config'
  import {addHistory, getStandardRevisions, viewPdfStandard, getStandardInfo} from 'src/api/standard'
  import NavAddToProject from './NavAddToProject'
  import NavReferences from './NavReferences'
  import bus from 'src/bus'
  import CreateProject from 'components/modals/CreateProject'

  export default {
    created () {
      this.initialize()
      this.$watch('$route.params.standardId', () => {
        this.initialize()
      })
    },
    computed: {
      standardUrl: function () {
        var standardId = this.$route.params.standardId
        var standardUrl = withToken(apiGetStandardPdf(standardId))
        var iFrameUrl = `https://docs.google.com/gview?url=${standardUrl}&embedded=true`
        return iFrameUrl
      },
      routerStandard: function () {
        return this.$route.params.standardId
      },
      space: function (note) {
        return note.length > 0 ? note : ' '
      }
    },
    methods: {
      initialize () {
        this.getStandardInfo()
        .then(this.addHistory)
        .then(this.getStandardRevisions)
        .catch(e => {
          console.log('Could not load standard')
          this.$store.dispatch('createAlert', {message: 'Could not load. Standard most likely no longer exists. Redirecting...', type: 'info', delay: 7000})
        })
      },
      toggleOption () {
        var temp = !this.optionOpen
        bus.emit('page-reset', 'standardView')
        this.optionOpen = temp
      },
      addHistory () {
        addHistory(this.$route.params.standardId)
        .then((res) => {})
        .catch(e => this.$store.dispatch('createAlert', {message: 'Could not add standard to history.', type: 'warning'}))
      },
      getStandardInfo () {
        this.loadingRevisions = true
        return getStandardInfo(this.$route.params.standardId)
        .then((res) => {
          if (!res.data) {
            this.$router.push({name: 'landing'})
            throw new Error('Could not load standard')
          }
          this.loadingRevisions = false
          this.standard = res.data
        })
      },
      getStandardRevisions () {
        this.loadingRevisions = true
        getStandardRevisions(this.$route.params.standardId)
        .then((res) => {
          this.loadingRevisions = false
          this.revisions = res.data
        }).catch(e => this.$store.dispatch('createAlert', {message: 'Could not load standard revisions. Standard may no longer exist.', type: 'warning'}))
      },
      standardLink: function () {
        viewPdfStandard(this.$route.params.standardId)
        .then(res => {
          window.location.href = apiGetStandardPdf(this.$route.params.standardId) + '?nonce=' + res.data
        }).catch(e => {
          this.$store.dispatch('createAlert', {message: 'Failed to retrieve PDF!', type: 'danger'})
        })
      }
    },
    data () {
      return {
        optionOpen: false,
        standard: {},
        revisions: [],
        showRevision: false,
        loadingRevisions: false,
        createProject: false
      }
    },
    components: {
      NavAddToProject,
      NavReferences,
      BaseModal,
      CreateProject
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
.navbar-brand:hover {
  color: #9d9d9d;
}
.navbar-form {
   padding-left: 0;
}
.navbar-toggle:focus {
  background-color: transparent;
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
