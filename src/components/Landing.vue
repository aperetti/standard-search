<template>
  <markdown></markdown>
</template>

<script>
  import markdown from './widget/markdown'
  export default {
    components: {
      markdown
    }
  }
</script>

<style scoped>

textarea {
    border: none;
    border-right: 1px solid #ccc;
    resize: none;
    outline: none;
    background-color: #f6f6f6;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
    padding: 20px;
}
.form-control {
  height: 100%;
}
code {
    color: #f66;
}
  </style>