<template>
      <li v-bind:class="this.open ? 'dropdown open' : 'dropdown'">
        <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" @click="toggleMenu" aria-expanded="{{open}}">Add to Project<span class="caret"></span></a>
        <ul class="dropdown-menu">
          <li v-for='project in projects' @click='toggle(project._id, $index)'>
            <a>{{project.name}}
             <span v-if='!project.hasStandard && !project.loading' class="glyphicon glyphicon-plus pull-right"></span>
          <img src='../../assets/greyLoading18.svg' class='pull-right' v-if='project.loading'>
          <span v-if='project.hasStandard && !project.loading' class="glyphicon glyphicon-ok pull-right"></span>
            </a></li>
        </ul>
      </li>

      <!-- MODAL -->
      <div class="col-xs-12 col-md-4">
      <div class="modal fade in" tabindex="-1" role="dialog" v-if='confirm' style='display:block; margin-top: 50px;'>
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" @click='confirm = false' data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title">Create Project: {{newProject}}?</h4>
            </div>
            <div class="modal-body">
              <p>You are about to create a new project would you like to procede?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default"  @click='confirm = false' data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click='addProject()' @keyup.enter='addProject()'>Add Project</button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
      </div><!-- /.modal -->

  </div>    
</template>

<script>
  import {getProjects, toggleStandard} from '../../api/project'
  import bus from '../../bus'
  import {alert} from 'vue-strap'
  export default {
    props: ['standard'],
    route: {
      canReuse: false
    },
    ready () {
      bus.on('page-reset', (arg) => {
        if (arg === 'addToProject') this.refreshProjects()
        this.open = false
        this.confirm = false
      })
      this.open = false
    },
    methods: {
      toggleMenu () {
        var temp = !this.open
        bus.emit('page-reset', 'addToProject')
        this.open = temp
      },
      toggle: function (project, i) {
        this.projects[i].loading = true
        toggleStandard(project, this.standard).then((response) => {
          this.projects[i].loading = false
          this.projects[i].hasStandard = !this.projects[i].hasStandard
        })
      },
      refreshProjects () {
        getProjects().then((response) => {
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
        projects: [],
        newProject: '',
        confirm: false,
        error: false
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

</style>
