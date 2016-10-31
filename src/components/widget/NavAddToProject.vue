<template>
    <drop-down :loading='loading' persistant='projects'>
      <template slot='title'>Add To Project</template>
      <template slot='dropdown'>
        <li v-show='projects.length === 0' class="dropdown-header">No Projects</li>
        <li  v-show='projects.length === 0'>
          <a tabindex='-1' @click='openCreateProject()' id='projects-{{$index}}'> Create One?</a>
        </li>
        <li v-show='projects.length !== 0' class="dropdown-header">Click a Project to add or remove this Standard</li>
        <li v-for='project in projects'  @click='toggleProject(project._id, $index)'>
          <a tabindex='-1' class='cursor' id='projects-{{$index}}' style='display:inline-block; width:100%; padding-right:0px;'>{{project.name}}
            <span class='pull-right'>
              <span v-if='!project.hasStandard && !project.loading' class="glyphicon glyphicon-plus" ></span>      
              <span v-if='project.hasStandard && !project.loading' class="glyphicon glyphicon-ok" ></span>
            </span>
          </a>
        </li>
      </template>
    </drop-down>
</template>

<script>
  import {getProjects, toggleStandard} from '../../api/project'
  import bus from '../../bus'
  import {modals} from 'src/plugins/mixins'
  import DropDown from 'components/widget/DropDown'

  export default {
    mixins: [modals],
    props: ['standard'],
    route: {
      canReuse: false
    },
    ready () {
      bus.on('page-reset', (trail, prev) => {
        if (!prev) {
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
        getProjects(this.$route.params.standardId).then((response) => {
          this.loading = false
          var temp = response.data
          temp.forEach((project, i, arr) => {
            project.loading = false
            // project.hasStandard = !(project.standards.indexOf(this.standard) === -1)
          })
          this.projects = temp
        })
      },
      openCreateProject () {
        this.setCreateProject(true)
      }
    },
    computed: {
    },
    data () {
      return {
        projects: [],
        loading: false
      }
    },
    components: {
      DropDown
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
  .glyphicon {
    padding-right: 20px;
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
