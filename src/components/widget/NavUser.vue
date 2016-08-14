<template>
  <drop-down>
    <template slot='title'>User</template>
    <template slot='dropdown'>
      <li><a v-link="{ name: 'projectsHome' }" class='cursor'><span class="glyphicon glyphicon-list-alt"></span> Projects</a></li>
    </template>
  </drop-down>
</template>

<script>
import DropDown from 'components/widget/DropDown'
export default {
  components: {
    DropDown
  }
}
</script>

<style scoped>
  li {
   outline: none !important;
  }
</style>