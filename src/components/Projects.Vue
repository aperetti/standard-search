<template>
  <div class='row'>
    <h2>Hello Projects</h2>
  </div>  
</template>

<script>
  import {getProjects} from '../api/config'
  import bus from '../bus'
  export default {
    ready () {
      getProjects.then((res) => {
        this.projects = res.data
      }).catch((e) => {
        bus.emit('error', 'Failed to get project results')
        this.projects = []
      })
    },
    data () {
      return {
        projects: []
      }
    }
  }
</script>

<style scoped>

</style>