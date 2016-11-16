<template>
  
  <div v-bind:class="['dropdown text-left', this.open ? 'open' : '']">
    <button type="button" @click.prevent="toggleState" class="btn btn-default">
      <slot name='title'>Title</slot>
      <span class="sr-only">Toggle Dropdown</span>
      <span v-if='loading === false && (open === false || !persistant)' class="caret"></span>&nbsp;
      <span v-if='loading === false && (open === true && persistant)' class="glyphicon glyphicon-eye-close"></span>
      <img v-if='loading' src='../../assets/greyLoading14.svg'>
    </button>
    <ul class="dropdown-menu">
      <slot name='dropdown'><a>Dropdown</a></slot>
    </ul>
  </div>
</template>

<script>
import {togglers} from '../../plugins/mixins'
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