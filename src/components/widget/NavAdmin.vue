<template>
  <drop-down>
    <template slot='title'>Admin</template>
    <template slot='dropdown'>
      <li><a v-link="{ name: 'createStandard' }" class='cursor'><span class="glyphicon glyphicon-plus"></span> Add New Standard</a></li>
      <li v-if="$route.params.standardId"><a v-link="{ name: 'editStandard', params: { standardId: $route.params.standardId }}" class='cursor'><span class="glyphicon glyphicon-pencil"></span> Edit Standard</a></li>
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