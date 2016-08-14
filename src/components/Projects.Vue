<template>
    <!-- Standard subnav -->
  <nav class="navbar navbar-inverse affix" role="navigation">
  <div class="container-fluid">
    <div class="navbar-header">         
      <a class="navbar-brand">Projects</a>
      <button type="button" class="navbar-toggle" @click="toggleOption">
        <span class="sr-only">Toggle navigation</span>
        <span class="caret caret-mod"></span>
      </button>
    </div>
    <div class="{{ optionOpen ? 'navbar-collapse collapse-in' : 'navbar-collapse collapse'}}">
      <ul class="nav navbar-nav">
        <li><a @click='openCreateProject' class='cursor'>Create Project</a></li>
        <nav-projects @click='refreshProjects' :projects='projects'></nav-projects>
      </ul>
    </div>
  </nav>

  <div class='container'>
    <div class='row'>
      <h2>Projects</h2>
    </div>  
  </div>
</template>

<script>
  import {getProjects} from 'src/api/project'
  import {setCreateProject} from 'src/vuex/actions'
  import NavProjects from './widget/NavProjects'
  import bus from '../bus'
  import {modals} from 'src/plugins/mixins'
  export default {
    mixins: [modals],
    components: {
      NavProjects
    },
    vuex: {
      actions: {
        setCreateProject
      }
    },
    ready () {
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
        projects: []
      }
    },
    methods: {
      createProject () {
        this.setCreateProject(true)
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
    }
  }
</script>

<style scoped>
.container {
  margin-top: 50px;
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
</style>