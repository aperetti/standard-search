<template>
        <drop-down v-show="history.length > 0">
          <template slot='title'>History</template>
          <template slot='dropdown'>
            <li id='drop {{standard.code}}' v-for='standard in history'><a v-link="{ name: 'standard', params: { standardId: standard.code }}" >{{standard.code}}</a></li>
          </template>
        </drop-down>
</template>

<script>
import {getHistory} from '../../api/standard'
import bus from '../../bus'
import DropDown from 'components/widget/DropDown'
export default {
  components: {
    DropDown
  },
  ready: function () {
    getHistory().then((response) => {
      console.log(response)
      this.history = response.data
    }).catch((e) => {
      this.history = []
    })
    bus.on('page-reset', function (arg) {
      if (arg === 'beforeRoute') {
        getHistory().then((response) => {
          this.history = response.data.history
        }).catch((e) => {
          this.history = []
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

</style>