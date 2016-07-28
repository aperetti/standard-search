<template>
  <li tabindex="-1" @blur='toggle("open")' v-bind:class="this.open ? 'dropdown open' : 'dropdown'">
    <a  class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" @click="toggle('open')" aria-expanded="{{open}}">Projects<span class="caret"></span></a>
    <ul class="dropdown-menu">
      <li v-for='project in projects' v-link="{name:'projects', params:{projectId: project._id}}">
            <a>{{project.name}}
      </a></li>
    </ul>
  </li>
</template>

<script>
import bus from '../../bus'
import {toggle} from '../../plugins/mixins'
export default {
  mixins: [toggle],
  props: ['projects'],
  ready: function () {
    var self = this
    bus.on('page-reset', function () {
      self.open = false
    })
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