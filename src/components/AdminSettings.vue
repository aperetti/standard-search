<template>
  <div class='container'>
  <div class="page-header"><h2 class="text-left">Admin Settings</h2></div>
    <ul class="nav nav-tabs nav-justified">
      <template v-for='group in groups'>
        <li  class='{{$index === tab ? "active" : ""}}'><a href='#' @click='tab = $index'>{{group}}</a></li>
      </template>
    </ul>
  </div>
  <!-- Standards Tab -->
  <div class='container' style='margin-top: 25px;' v-if='tab === 0'>
    <references></references>
  </div>
</template>

<script>
  import References from 'components/widget/References'
  export default {
    components: {
      References
    },
    data () {
      return {
        groups: ['Standards', 'Frontpage'],
        tab: 0,
        regexes: []
      }
    }
  }
</script>

<style scoped>
  .form-group {
    margin-right: 0px;
    margin-left: 0px;
  }
  .form-horizontal {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .well {
   background-color: rgba(248, 248, 248, 0.32);
   margin: 5px;
}
</style>

