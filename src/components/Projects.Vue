<template>
  <div>  <!-- Standard subnav -->
    <nav class="navbar navbar-inverse" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <router-link to="projectsHome">Projects</router-link>         
          <a class="navbar-brand">Projects</a>
          <button type="button" class="navbar-toggle" @click="toggleOption">
            <span class="sr-only">Toggle navigation</span>
            <span class="caret caret-mod"></span>
          </button>
        </div>
        <div :class="['navbar-collapse', optionOpen ? 'collapse-in' : 'collapse']">
          <ul class="nav navbar-nav">
            <li><a class='cursor'>Create Project</a></li>
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
        <div v-if='loadingProject === true'><img src='../assets/greyLoading.svg'></img></div>
        <div class="panel panel-default" v-if='$route.params.projectId && loadingProject === false'>
          <div class="panel-heading">
            <button class="close" v-on:submit="$route.router.push({name:'projectsHome'})"><small><span class="glyphicon glyphicon-circle-arrow-up"></span></small></button>
            <h3 class="panel-title">{{currentProject.name}}</h3><small>{{currentProject.description}}</small>                  
          </div>
          <div class="panel-body">
            <div class='row' v-for='category in uniqueMenus'>
              <h4 class='row'>{{category}}</h4>
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
  </div>
</template>

<script>
  import {getProjects, getProject, deleteProject} from 'src/api/project'
  import NavProjects from './widget/NavProjects'
  import bus from '../bus'
  import {modals} from 'src/plugins/mixins'
  import naturalSort from 'javascript-natural-sort'
  import PdfViewer from 'components/widget/PdfViewer'
  import BaseModal from 'components/modals/BaseModal'

  export default {
    mixins: [modals],
    components: {
      BaseModal,
      NavProjects,
      PdfViewer
    },
    route: {
      data ({next}) {
        if (this.$route.params.projectId) {
          this.loadingProject = true
          getProject(this.$route.params.projectId).then((res) => {
            this.currentProject = res.data
            this.loadingProject = false
            next()
          })
        } else {
          next()
        }
      }
    },
    mounted () {
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
        bus.emit('alert', 'danger', 'Failed to get project results', true)
        this.projects = []
      })
    },
    data () {
      return {
        optionOpen: false,
        projects: [],
        currentProject: {},
        selectedStandard: '',
        loadingProject: false
      }
    },
    methods: {
      createProject () {
        this.$store.dispatch('setCreateProject')
      },
      delProject (projectId) {
        deleteProject(projectId).then((res) => {
          bus.emit('alert', 'success', 'Project Succesfully Delete. Refreshing Projects!')
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
      },
      uniqueMenus () {
        var menus = []
        var standards = this.currentProject.standards
        for (var i in standards) {
          if (menus.indexOf(standards[i].menu.ancestors[1].name) === -1) {
            menus.push(standards[i].menu.ancestors[1].name)
          }
        }
        return menus
      },
      filterStandard (category) {
        return this.currentProject.standards.filter((standard) => {
          console.log(standard)
          return standard.menu.ancestors[1].name === category
        })
      },
      natural () {
        return naturalSort
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