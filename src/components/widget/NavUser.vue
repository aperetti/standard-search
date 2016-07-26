<template>
        <li tabindex="-1" @blur='toggle("open", 100)' v-bind:class="this.open ? 'dropdown open' : 'dropdown'">
          <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" @click="toggle('open')" aria-expanded="{{open}}">User<span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a v-link="{ name: 'userProjects' }" class='cursor'><span class="glyphicon glyphicon-list-alt"></span> Projects</a></li>
          </ul>
        </li>
</template>

<script>
import {toggle} from '../../plugins/mixins'
export default {
  mixins: [toggle],
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