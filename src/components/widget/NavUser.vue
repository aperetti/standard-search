<template>
        <li v-bind:class="this.open ? 'dropdown open' : 'dropdown'">
          <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" @click="toggle" aria-expanded="{{open}}">User<span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a v-link="{ name: 'userProjects' }" class='cursor'><span class="glyphicon glyphicon-list-alt"></span> Projects</a></li>
          </ul>
        </li>
</template>

<script>
import bus from '../../bus'

export default {
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
  },
  methods: {
    toggle () {
      var temp = !this.open
      bus.emit('page-reset', 'navbar-dropdown')
      this.open = temp
    }
  }
}
</script>

<style scoped>
  
</style>