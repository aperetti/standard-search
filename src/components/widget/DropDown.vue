<template>
  <li role='presentation' v-bind:class="this.open ? 'dropdown open' : 'dropdown'">
    <a class="dropdown-toggle" 
        href='#'
        data-toggle="dropdown"
        role="button" 
        @click="toggle('open',0,persistant,$event)" 
        @keyup.down="focusDropDown($event)"
        aria-haspopup="true"  
        aria-expanded="{{open}}">
      <slot name='title'>Title</slot>
      <span v-if='loading === false && (open === false || !persistant)' class="caret"></span>&nbsp;
      <span v-if='loading === false && (open === true && persistant)' class="glyphicon glyphicon-eye-close"></span>
      <img v-if='loading' src='../../assets/greyLoading18.svg'>
    </a>
      <ul class="dropdown-menu" >
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
  methods: {
    focusDropDown (e) {
      this.open = true
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
   outline-color: gray;
   outline-width: 1px;
  }
</style>