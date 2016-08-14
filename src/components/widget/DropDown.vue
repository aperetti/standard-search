<template>
  <li tabindex="-1" @blur='toggleDown("open", 100, persistant, $event)'  v-bind:class="this.open ? 'dropdown open' : 'dropdown'">
    <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" @click="toggle('open')" aria-expanded="{{open}}">
      <slot name='title'>Title</slot>
      <span v-if='loading === false && (open === false || !persistant)' class="caret"></span>&nbsp;
      <span v-if='loading === false && (open === true && persistant)' class="glyphicon glyphicon-eye-close"></span>
      <img v-if='loading' src='../../assets/greyLoading18.svg'>
    </a>
      <ul class="dropdown-menu" style='padding-right:10px;'>
        <slot name='dropdown'><li><a>Dropdown</a></li></slot>
      </ul>
  </li>
</template>

<script>
import {togglers} from '../../plugins/mixins'
import bus from 'src/bus'
export default {
  ready () {
    bus.on('page-reset', (arg) => {
      this.toggleDown('open')
    })
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    persistant: {
      type: String,
      default: null
    }
  },
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