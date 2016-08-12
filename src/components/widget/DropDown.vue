<template>
  <li tabindex="-1" @blur='toggleDown("open", 50)' @click="toggle('open')" v-bind:class="this.open ? 'dropdown open' : 'dropdown'">
    <slot></slot>
  </li>
</template>

<script>
import {togglers} from '../../plugins/mixins'
export default {
  name: 'drop-down',
  mixins: [togglers],
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