<template>
  <base-modal :callback='addProject' ref:basemodal @submit='addProject'>
    <template slot='title'>Create Project</template>
    <template slot='body'>
      <div class="input-group">
        <span class="input-group-addon" id="basic-addon1">Project</span>
        <input type="text" class="form-control" placeholder="Name of your project..." aria-describedby="basic-addon1" v-model="newProject">
      </div>
      <br>
      <div class="input-group">
        <span class="input-group-addon" id="basic-addon1">Description</span>
        <input type="text" class="form-control" placeholder="Short description..." aria-describedby="basic-addon1" v-model="projectDesc">
      </div>
    </template>
    <template slot='button'>Add Project</template>
  </base-modal>
</template>

<script>
  import {createProject} from 'src/api/project'
  import BaseModal from 'components/modals/BaseModal'
  import bus from 'src/bus'

  export default {
    components: {
      BaseModal
    },
    data () {
      return {
        newProject: '',
        projectDesc: ''
      }
    },
    methods: {
      addProject () {
        createProject(this.newProject, this.projectDesc).then((result) => {
          this.newProject = ''
          this.projectDesc = ''
          bus.emit('project-created')
        }).catch((er) => {
          bus.emit('alert', 'danger', 'Could not create Proect')
        })
      }
    }
  }
</script>

<style scoped>
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