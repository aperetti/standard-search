<template>
  <li tabindex="-1" @blur='toggleDown("open")' v-bind:class="this.open ? 'dropdown open' : 'dropdown'">
    <a  class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" @click="toggle('open')" aria-expanded="{{open}}">Projects<span class="caret"></span></a>
    <ul class="dropdown-menu">
      <li v-for='project in projects' v-link="{name:'projects', params:{projectId: project._id}}">
            <a>{{project.name}}
      </a></li>
    </ul>
  </li>
</template>

<script>
import {togglers} from '../../plugins/mixins'
export default {
  mixins: [togglers],
  props: ['projects'],
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