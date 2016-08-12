<template>
  <!-- MODAL -->
  <div class="col-xs-12 col-md-4">
    <div class="modal fade in" tabindex="-1" role="dialog" v-if='confirm' style='display:block; margin-top: 100px;'>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" @click='confirm = false' data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Create Project</h4>
          </div>
          <div class="modal-body">
            <div class="input-group">
              <span class="input-group-addon" id="basic-addon1">Project</span>
              <input type="text" class="form-control" placeholder="Name of your project..." aria-describedby="basic-addon1" v-model="newProject">
            </div>
            <br>
            <div class="input-group">
              <span class="input-group-addon" id="basic-addon1">Description</span>
              <input type="text" class="form-control" placeholder="Short description..." aria-describedby="basic-addon1" v-model="projectDesc">
            </div>
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
  import {createProject} from '../../api/project'
  import bus from '../../bus'
  export default {
    data () {
      return {
        projects: [],
        newProject: '',
        projectDesc: '',
        confirm: false,
        optionOpen: false
      }
    },
    methods: {
      addProject () {
        createProject(this.newProject, this.projectDesc).then((result) => {
          this.newProject = ''
          this.projectDesc = ''
          this.refreshProjects()
          this.confirm = false
        }).catch((e) => {
          this.error = true
          bus.emit('error', 'Failed to create project. Please try again.')
        })
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