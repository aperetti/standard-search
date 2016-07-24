<template>
        <li v-bind:class="this.open ? 'dropdown open' : 'dropdown'" v-if="history.length > 0" >
          <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" @click="toggle" aria-expanded="{{open}}">History <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li v-for='standard in history'><a v-link="{ name: 'standard', params: { standardId: standard._id }}" >{{standard.code}}</a></li>
          </ul>
        </li>
</template>

<script>
import {getHistory} from '../../api/standard'
import bus from '../../bus'

export default {
  ready: function () {
    var self = this
    let history = getHistory()
    history.then((response) => {
      self.history = response.data.history
    }, (response) => {
      self.history = []
    })
    bus.on('page-reset', function () {
      self.open = false
      let history = getHistory()
      history.then((response) => {
        self.history = response.data.history
      }, (response) => {
        self.history = []
      })
    })
  },
  data () {
    return {
      history: [],
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