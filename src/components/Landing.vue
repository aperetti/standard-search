<template>
  <div class='container view'>
  <markdown :admin='admin'></markdown>
  </div>
</template>

<script>
  import markdown from './widget/markdown'
  import {isAdmin} from '../api/auth'
  export default {
    ready () {
      isAdmin().then((res) => {
        this.admin = true
      })
    },
    data () {
      return {
        admin: false
      }
    },
    components: {
      markdown
    }
  }
</script>

<style scoped>
.view {
  margin-top: 10px;
}
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