<template>
        <li tabindex="-1" @blur='toggle("open", 100)' v-bind:class="this.open ? 'dropdown open' : 'dropdown'">
          <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" @click="toggle('open')" aria-expanded="{{open}}">Admin <span class="caret"></span></a>
          <ul class="dropdown-menu" >
            <li><a v-link="{ name: 'createStandard' }" class='cursor'><span class="glyphicon glyphicon-plus"></span> Add New Standard</a></li>
            <li v-if="$route.params.standardId"><a v-link="{ name: 'editStandard', params: { standardId: $route.params.standardId }}" class='cursor'><span class="glyphicon glyphicon-pencil"></span> Edit Standard</a></li>
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