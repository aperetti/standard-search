<template>
  <div> Standard Menu + {{menus.length}}</div>
  <template v-for='item in menu'>
    {{item.join('|')}}
  </template>
</template>

<script>
  export default {
    vuex: {
      getters: {
        menus: state => state.standard.menus
      }
    }
  }
</script>

