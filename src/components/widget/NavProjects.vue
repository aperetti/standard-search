<template>
  <drop-down>
    <template slot='title'>Projects</template>
    <template slot='dropdown'>
    <li v-show='projects.length === 0' class="dropdown-header">No Projects</li>
      <li  v-show='projects.length === 0'>
        <a tabindex='-1' @click=''> Create One?</a>
      </li>
    </li>
    <router-link el="li" v-for='project in projects' :to="{name:'projects', params:{projectId: project.id}}">
      <a>{{project.name}}</a>
    </router-link>
    </template>
  </drop-down>
</template>

<script>
import {modals} from '../../plugins/mixins'
import DropDown from 'components/widget/DropDown'

export default {
  components: {
    DropDown
  },
  mixins: [modals],
  props: {
    projects: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      open: false
    }
  }
}
</script>

<style scoped>
  li {
   outline: none !important;
  }
</style>