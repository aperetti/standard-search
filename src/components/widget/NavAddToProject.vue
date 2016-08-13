<template>
      <li v-bind:class="this.open ? 'dropdown open' : 'dropdown'" >
        <a tabindex='-1' class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" @blur="toggleDown('open', 50, 'projects')"  @click="toggle('open')" aria-expanded="{{open}}">
          Add to Project
          <span v-if='loading === false' class="caret"></span>
          <span v-if='loading === true'></span>
          <img v-if='loading' src='../../assets/greyLoading18.svg'>
        </a>
        <ul class="dropdown-menu" v-show='!loading'>
          <li v-show='projects.length === 0' class="dropdown-header">No Projects</li>
          <li  v-show='projects.length === 0'>
            <a tabindex='-1' @click='close' id='projects-{{$index}}' @blur="toggleDown('open', 100, 'proj', $event)"> Create One?</a>
          </li>
          <li v-for='project in projects'>
            <a tabindex='-1'  @click='toggleProject(project._id, $index)' id='projects-{{$index}}' @blur="toggleDown('open', 100, 'proj', $event)">{{project.name}}
             <span v-if='!project.hasStandard && !project.loading' class="glyphicon glyphicon-plus pull-right"></span>      
          <span v-if='project.hasStandard && !project.loading' class="glyphicon glyphicon-ok pull-right"></span>
            </a>
          </li>
        </ul>
      </li>
  </div>    
</template>

<script>
  import {getProjects, toggleStandard} from '../../api/project'
  import bus from '../../bus'
  import {alert} from 'vue-strap'
  import {togglers} from '../../plugins/mixins'
  import {setCreateProject} from 'src/vuex/actions'

  export default {
    vuex: {
      actions: {
        setCreateProject
      }
    },
    mixins: [togglers],
    props: ['standard'],
    route: {
      canReuse: false
    },
    ready () {
      bus.on('page-reset', (arg) => {
        if (arg === this.$options.name && !this.open) {
          this.refreshProjects()
        }
      })
      this.open = false
    },
    methods: {
      toggleProject: function (project, i) {
        this.projects[i].loading = true
        toggleStandard(project, this.standard).then((response) => {
          this.projects[i].loading = false
          this.projects[i].hasStandard = !this.projects[i].hasStandard
        })
      },
      refreshProjects () {
        this.loading = true
        getProjects().then((response) => {
          this.loading = false
          var temp = response.data
          temp.forEach((project, i, arr) => {
            project.loading = false
            project.hasStandard = !(project.standards.indexOf(this.standard) === -1)
          })
          this.projects = temp
        })
      },
      close () {
        this.setCreateProject(true)
      }
    },
    computed: {
    },
    data () {
      return {
        open: false,
        projects: [],
        error: false,
        loading: false
      }
    },
    components: {
      alert
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
  .logo {
    max-width: 100% 
  }
  .list-group {
    z-index: 1000 !important;
  }
  .cursor {
    cursor: pointer;
  }
  li a {
   outline: none !important;
  }

</style>
