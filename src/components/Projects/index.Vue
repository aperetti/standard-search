<template>
  <div>  <!-- Standard subnav -->
    <nav class="navbar navbar-inverse" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <router-link class="navbar-brand" :to="{name: 'projectsHome'}">Projects</router-link>         
          <button type="button" class="navbar-toggle" @click="toggleOption">
            <span class="sr-only">Toggle navigation</span>
            <span class="caret caret-mod"></span>
          </button>
        </div>
        <div :class="['navbar-collapse', optionOpen ? 'collapse-in' : 'collapse']">
          <ul class="nav navbar-nav">
            <li><a class='cursor' @click="newProject.modal = true">Create Project</a></li>
            <nav-projects @click='refreshProjects' :projects='projects'></nav-projects>
          </ul>
        </div>
      </div>
    </nav>

    <div class='container'>
      <div class='row' >
        <h2 v-if='!$route.params.projectId'>Projects</h2>
        <ul class="list-group" v-if='!$route.params.projectId' >
          <li v-for='project in projects' class="list-group-item">
            <span class="pull-right glyphicon glyphicon-trash cursor" @click='delProject(project.id)'></span>
            <router-link :to="{name:'projects', params:{projectId: project.id}}">{{project.name}}<br /><small>{{project.description}}</small></router-link>
          </li>
        </ul>
        <!-- FOR WHEN PROJECT IS SELECTED --> 
      <div class='container'> 
        <div v-if='loadingProject === true'><img src='src/assets/greyLoading.svg'></img></div>
        <div class="panel panel-default" v-if='$route.params.projectId && loadingProject === false'>
          <div class="panel-heading">
            <button class="close" v-on:click="$router.push({name:'projectsHome'})"><small><span class="glyphicon glyphicon-circle-arrow-up"></span></small></button>
            <h3 class="panel-title">{{currentProject.name}}</h3><small>{{currentProject.description}}</small>                  
          </div>
          <div class="panel-body">
            <div class='row' >
              <h4 class='row'></h4>
              <hr style='margin-top: 0px;'>
              <div class='col-sm-6 col-md-3 col-xs-12' v-for='standard in currentProject.standards'>
                <button class='col btn btn-default' style='width: 100%;' @click='selectedStandard = standard.code'>
                  <a type="button" class='close' data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a><strong>{{standard.code}}</strong><br /><div class='desc small'>{{standard.description}}</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
    <pdf-viewer v-if='selectedStandard.length !== 0' :standard='selectedStandard' @close="selectedStandard= ''"></pdf-viewer>
    
    <base-modal :dim="newProject.modal" v-on:close="cancelModal" v-on:submit="createProject">
      <template slot='title'>Create Project</template>
    <template slot='body'>
      <div class="input-group">
        <span class="input-group-addon" id="basic-addon1">Project</span>
        <input type="text" class="form-control" placeholder="Name of your project..." aria-describedby="basic-addon1" v-model="newProject.name">
      </div>
      <br>
      <div class="input-group">
        <span class="input-group-addon" id="basic-addon1">Description</span>
        <input type="text" class="form-control" placeholder="Short description..." aria-describedby="basic-addon1" v-model="newProject.description">
      </div>
    </template>
    <template slot='button'>Add Project</template>
    </base-modal>
  </div>
  
</template>

<script>
  import {getProjects, getProject, deleteProject, createProject} from 'src/api/project'
  import NavProjects from './NavProjects'
  import bus from 'src/bus'
  import PdfViewer from 'components/widget/PdfViewer'
  import BaseModal from 'components/modals/BaseModal'

  export default {
    components: {
      BaseModal,
      NavProjects,
      PdfViewer
    },
    watch: {
      '$route': 'loadProject'
    },
    mounted () {
      this.loadProject()
      // For mobile menu prevent closing
      bus.on(bus.events.pageReset, (arg) => {
        if (arg !== 'drop-down') {
          this.optionOpen = false
        }
      })
      bus.on(bus.events.projectCreated, () => {
        this.refreshProjects()
      })
      getProjects().then((res) => {
        this.projects = res.data
      }).catch((e) => {
        this.$state.dispatch('createAlert', {messsage: 'Failed to get project results', type: 'danger'})
        this.projects = []
      })
    },
    data () {
      return {
        newProject: {
          modal: false,
          name: null,
          description: null
        },
        optionOpen: false,
        projects: [],
        currentProject: {},
        selectedStandard: '',
        loadingProject: false
      }
    },
    methods: {
      loadProject () {
        if (this.$route.params.projectId) {
          console.log('test')
          this.loadingProject = true
          getProject(this.$route.params.projectId).then((res) => {
            this.currentProject = res.data
            this.loadingProject = false
          })
        }
      },
      cancelModal () {
        for (var i in this.newProject) {
          this.newProject[i] = null
        }
      },
      createProject () {
        createProject(this.newProject.name, this.newProject.description).then((res) => {
          this.cancelModal()
          this.refreshProjects()
          this.$store.dispatch('createAlert', {message: res.data, type: 'success'})
        }).catch((er) => {
          this.$store.dispatch('createAlert', {message: er.data, type: 'danger'})
        })
      },
      delProject (projectId) {
        deleteProject(projectId).then((res) => {
          this.$store.dispatch('createAlert', res.data, 'success')
          this.refreshProjects()
        })
      },
      refreshProjects () {
        getProjects().then((response) => {
          this.projects = response.data
        })
      },
      toggleOption () {
        var temp = !this.optionOpen
        bus.emit('page-reset', 'standardView')
        this.optionOpen = temp
      }
    },
    computed: {
      pdfView () {
        if (!this.$refs.pdf) {
          return false
        } else {
          console.log(this.$refs.pdf)
          return this.$refs.pdf.close
        }
      }
    }
  }
</script>

<style scoped>
.container {
  margin-top: 25px;
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
.cursor {
    cursor: pointer;
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
.col li::not(:first-child):not(:last-child) {
  margin-right:7px;
  margin-left:7px;
}
.desc {
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;   
}
</style>