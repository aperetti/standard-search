<template>
    <div class="col-xs-12 col-md-4">
      <div v-if="open" class='btn-group-vertical' style='width: 100%;'>
        <button type="button"@click='toggleMenu' class="btn btn-large btn-block btn-primary"><span class="glyphicon glyphicon-chevron-down pull-right"></span>Close</button>
        <button v-for='project in projects' @click='toggle(project._id, $index)' class='btn btn-large btn-block btn-default'>
          <span v-if='!project.hasStandard' class="glyphicon glyphicon-plus pull-right"></span>
          <span v-if='project.hasStandard' class="glyphicon glyphicon-ok pull-right"></span>
          {{project.name}}
        </button>
        <button class="btn btn-large btn-block btn-default">
          <div class="form-group" style="display:inline;">
            <div class="input-group" style="display:table;">
              <span class="input-group-addon" style="width:1%;"><span class="glyphicon glyphicon-plus"></span></span>
              <input placeholder="Add New Group..." class='form-control'></input>
            </div>
          </div>
        </button>
      </div>
      <div v-if="!open" class='btn-group-vertical' style='width: 100%;'>
        <button type="button" class="btn btn-large btn-block btn-default" @click='toggleMenu' ><span class="glyphicon glyphicon-chevron-up pull-right"></span>Add to Project</button>
      </div>
  </div>    
</template>

<script>
  import {getProjects, toggleStandard} from '../../api/project'
  import bus from '../../bus'
  export default {
    props: ['standard'],
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
        toggleStandard(project, this.standard).then((response) => {
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
            project.hasStandard = !(project.standards.indexOf(this.standard) === -1)
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
  .cursor {
    cursor: pointer;
  }

</style>
