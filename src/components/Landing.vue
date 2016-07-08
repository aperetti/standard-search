<template>
  <div class='row'>
    <div class='col-xs-10'>
      <vue-html-editor name='html-editor' :model.sync='text'></vue-html-editor>
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
    },
    components: {
      'vue-html-editor': require('vue-html-editor')
    }
  }
</script>