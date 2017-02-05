<template>
  <drop-down>
    <template slot='title'>References</template>
    <template slot='dropdown'>
      <li v-for="reference in sortedRefs"><router-link :to="{ name: 'standard', params: { standardId: reference.id }, replace: false}" >{{reference.code}}</a></li>
   </template>
  </drop-down>
</template>

<script>
  import DropDown from 'components/widget/DropDown'
  import naturalSort from 'javascript-natural-sort'
  export default {
    props: ['references'],
    components: {
      DropDown
    },
    computed: {
      sortedRefs: function () {
        if (this.references && this.references.length > 0) {
          return this.references.sort((el1, el2) => naturalSort(el1.code, el2.code))
        }
      }
    }
  }

</script>

<style scoped>
  li a {
   outline: none !important;
  }

</style>
