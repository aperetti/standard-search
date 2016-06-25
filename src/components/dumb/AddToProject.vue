<template>
    <div class="col-xs-4">
      <div class='list-group'>
        <div class='list-group-item'>Test</div>
        <div class='list-group-item'>Test</div>
        <div class='list-group-item'>Test</div>
         <div class="form-group" style="display:inline;">
          <div class="input-group" style="display:table;">
            <span class="input-group-addon" style="width:1%;"><span class="glyphicon glyphicon-plus"></span></span>
            <input placeholder="Add New Group..." class='form-control'></input>
          </div>
        </div>
      </div> 
  </div>    
</template>

<script>
  export default {
    computed: {
      standardUrl: function () {
        console.log('Test')
        return 'Test'
      }
    },
    data () {
      return {
        selected: null,
        options: [1, 2, 3]
      }
    }
  }
</script>

<style scoped>
  .pdf-frame {
    width: 100%;
    height: 100%;
  }
  .row {
    margin-left: 0px;
    margin-right: 0px;
  }
  .logo {
    max-width: 100% 
  }
  .list-group {
    z-index: 1000 !important;
  }

</style>
