<template>
        <drop-down v-show="history.length > 0">
          <template slot='title'>History</template>
          <template slot='dropdown'>
            <li v-for='standard in history'><a v-link="{ name: 'standard', params: { standardId: standard._id }}" >{{standard.code}}</a></li>
          </template>
        </drop-down>
</template>

<script>
import {getHistory} from '../../api/standard'
import bus from '../../bus'
import {togglers} from '../../plugins/mixins'
import DropDown from 'components/widget/DropDown'
export default {
  components: {
    DropDown
  },
  mixins: [togglers],
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