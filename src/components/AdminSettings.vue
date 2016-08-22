<template>
  <div>
  <div class="page-header"><h2 class="text-left">Admin Settings</h2></div>
  <tabs>
    <tab header="one">
      Test
    </tab>
    <tab header="two" disabled>
      ...
    </tab>
    <tab-group header="group1">
      <tab header="three">
        ...
      </tab>
      <tab header="four" disabled>
        ...
      </tab>
    </tab-group>
    <tab-group header="group2">
      <tab header="five">
        ...
      </tab>
    </tab-group>
  </tabs>
  </div>
</template>

<script>
  import VueStrap from 'vue-strap'

  export default {
    components: {
      tabs: VueStrap.Tabset,
      tabGroup: VueStrap.TabGroup,
      tab: VueStrap.Tab,
      select: VueStrap.Select
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

