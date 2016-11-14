<template>
  <div :class="['alert', 'alert-'+type]">
     <a v-on:click='close' class="close" data-dismiss="alert" aria-label="close">&times;</a>
    <strong>{{strong}}</strong> {{message}}
  </div>
</template>

<script>
import * as t from 'src/vuex/mutation-types'
export default {
  props: ['message', 'type', 'id'],
  computed: {
    strong () {
      return this.type.charAt(0).toUpperCase() + this.type.slice(1) + '!'
    }
  },
  methods: {
    close () {
      console.log(t.CLOSE_ALERT)
      this.$store.dispatch('closeAlert', this.id)
    }
  }
}
</script>

<style scoped>

</style>