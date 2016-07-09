<template>
  <div class='row'>
    <div class='col-xs-10'>
      <div style='margin-top:40px'>
        <div> The HTML contents are as follows:</div>
        <hr>
        <div >{{{text}}}</div>
      </div>
      </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        text: ''
      }
    }
  }
</script>