<template>
  <drop-down id='user-dropdown'>
    <template slot='title'>User</template>
    <template slot='dropdown'>
      <li><router-link :to="{ name: 'projectsHome' }" class='cursor'><span class="glyphicon glyphicon-list-alt"></span> Projects</router-link></li>
      <li><a @click.prevent='proccessLogout' class='cursor'>Logout</a></li>
    </template>
  </drop-down>
</template>

<script>
import DropDown from 'components/widget/DropDown'
export default {
  components: {
    DropDown
  },
  methods: {
    proccessLogout: function () {
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
  li {
   outline: none !important;
  }
</style>