<template>
        <li tabindex="-1" @blur='toggle("open", 100)' v-bind:class="this.open ? 'dropdown open' : 'dropdown'" v-show="history.length > 0" >
          <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" @click="toggle('open')" aria-expanded="{{open}}">History <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li v-for='standard in history'><a v-link="{ name: 'standard', params: { standardId: standard._id }}" >{{standard.code}}</a></li>
          </ul>
        </li>
</template>

<script>
import {getHistory} from '../../api/standard'
import bus from '../../bus'
import {toggle} from '../../plugins/mixins'
export default {
  mixins: [toggle],
  ready: function () {
    var self = this
    let history = getHistory()
    history.then((response) => {
      self.history = response.data.history
    }, (response) => {
      self.history = []
    })
    bus.on('page-reset', function (arg) {
      if (arg === 'beforeRoute') {
        let history = getHistory()
        history.then((response) => {
          self.history = response.data.history
        }, (response) => {
          self.history = []
        })
      }
    })
  },
  data () {
    return {
      history: [],
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