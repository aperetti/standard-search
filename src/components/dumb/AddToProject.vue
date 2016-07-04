<template>
    <div class="col-xs-3">
      <div v-if="open" class='list-group'>
        <a @click='toggleMenu' class='list-group-item'><span class="glyphicon glyphicon-chevron-down pull-right"></span>Close</a>
        <a v-for='project in projects' @click='toggle(project._id, $index)' class='list-group-item text-left'>
          <span v-if='!project.hasStandard' class="glyphicon glyphicon-plus pull-right"></span>
          <span v-if='project.hasStandard' class="glyphicon glyphicon-ok pull-right"></span>
          {{project.name}}
        </a>
        <div class="form-group" style="display:inline;">
          <div class="input-group" style="display:table;">
            <span class="input-group-addon" style="width:1%;"><span class="glyphicon glyphicon-plus"></span></span>
            <input placeholder="Add New Group..." class='form-control'></input>
          </div>
        </div>
      </div>
      <div v-if="!open" class='list-group'>
        <a v-if='!open' @click='toggleMenu' type="button" class='list-group-item'><span class="glyphicon glyphicon-chevron-up pull-right"></span> Projects </a>
      </div>
       
  </div>    
</template>

<script>
  import {getProjects, toggleStandard} from '../../api/project'
  import bus from '../../bus'
  export default {
    route: {
      canReuse: false
    },
    ready () {
      bus.on('page-reset', () => this.refreshProjects())
      this.refreshProjects()
      this.open = false
    },
    methods: {
      toggleMenu () {
        this.open = !this.open
      },
      toggle: function (project, i) {
        console.log(project, i)
        this.projects[i].loading = true
        toggleStandard(project, this.$route.query.standard).then((response) => {
          this.projects[i].loading = true
          this.projects[i].hasStandard = !this.projects[i].hasStandard
        })
      },
      refreshProjects () {
        getProjects().then((response) => {
          console.log(response)
          var temp = response.data
          temp.forEach((project, i, arr) => {
            project.loading = false
            project.hasStandard = !(project.standards.indexOf(this.$route.query.standard) === -1)
          })
          this.projects = temp
        })
      }
    },
    computed: {
    },
    data () {
      return {
        open: false,
        projects: []
      }
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

</style>
