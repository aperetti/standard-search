<template>
  <base-modal :dim="dim" v-on:close="cancelModal" v-on:submit="createProject">
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
</template>

<script>
  import BaseModal from 'components/modals/BaseModal'
  import {createProject} from 'src/api/project'

  export default {
    props: ['dim', 'hideSubmit'],
    components: {
      BaseModal
    },
    data () {
      return {
        newProject: {
          modal: false,
          name: null,
          description: null
        }
      }
    },
    methods: {
      cancelModal () {
        this.$emit('close')
        for (var i in this.newProject) {
          this.newProject[i] = null
        }
      },
      createProject () {
        createProject(this.newProject.name, this.newProject.description).then((res) => {
          this.cancelModal()
          this.$emit('submit')
          this.$store.dispatch('createAlert', {message: res.data, type: 'success'})
        }).catch((er) => {
          this.$store.dispatch('createAlert', {message: er.data, type: 'danger'})
        })
      }
    }
  }
</script>