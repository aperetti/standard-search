<template>
  <drop-down id='admin-dropdown'>
    <template slot='title'>Admin</template>
    <template slot='dropdown'>
      <li id='create-standard-button'><router-link :to="{ name: 'createStandard' }" class='cursor'><span class="glyphicon glyphicon-plus"></span>Add New Standard</router-link></li>
      <li id='edit-standard-button' v-if="$route.name === 'standard'"><router-link :to="{ name: 'editStandard', params: { standardId: $route.params.standardId }}" class='cursor'><span class="glyphicon glyphicon-pencil"></span> Edit Standard</router-link></li>
      <li id='admin-settings-button'><router-link :to="{ name: 'adminSettings' }" class='cursor'><span class="glyphicon glyphicon-wrench"></span>Settings</router-link></li>
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
  .glyphicon {
    padding-right: 8px;
  }
  li {
   outline: none !important;
  }
</style>