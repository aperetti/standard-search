<template>
  
  <li role='presentation' v-bind:class="['dropdown', this.open ? 'open' : '']">
    <a class="dropdown-toggle" 
        data-toggle="dropdown"
        role="button" 
        @click="toggleState()" 
        @keyup.down="focusDropDown($event)"
        aria-haspopup="true"  
        :aria-expanded="open">
      <slot name='title'>Title</slot>
      <span v-if='loading === false && (open === false || !persistant)' class="caret"></span>&nbsp;
      <span v-if='loading === false && (open === true && persistant)' class="glyphicon glyphicon-eye-close"></span>
      <img v-if='loading' src='~assets/greyLoading14.svg'>
    </a>
    <ul class="dropdown-menu" v-if='open'>
      <slot name='dropdown'><li><a>Dropdown</a></li></slot>
    </ul>
  </li>
  </transition>
</template>

<script>
import {togglers} from 'src/plugins/mixins'
import bus from 'src/bus'

export default {
  mounted () {
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
    },
    type: {
      type: String,
      default: 'dropdown'
    }
  },
  methods: {
    focusDropDown (e) {
      this.open = true
    },
    toggleState ($event) {
      this.toggle('open', 0, this.persistant, $event)
      this.$emit('open', this.open)
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