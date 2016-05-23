<template>
  <div class='row' style="height: 100%">
    <div class='col-xs-10 col-sm-8 col-sm-offset-2 col-xs-offset-1 wrap' style="height: 100%">
      <form action="{{submitUrl}}" method="POST" enctype="multipart/form-data">
        Select an image to upload:
        <input type="file" name="pdf"> 
        <input type="submit" value="Upload Image">
      </form>
    </div>
  </div>
</template>

<script>
  import {apiGetPdfText, withToken} from '../api/config'
  export default {
    computed: {
      submitUrl: function () {
        return withToken(apiGetPdfText)
      }
    }
  }
</script>

<style scoped>
  .pdf-frame {
    width: 100%;
    height: 100%;
  }

</style>
