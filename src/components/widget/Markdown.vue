<template>
  <div class='container'>
    <div class='row'>
      <div class='col-xs-8'>
        <div v-if='input !== original' class="alert alert-info" role="alert"><b>Heads up!</b> Changes have not been saved</div>
    <div class='row'>
       <template v-if='admin'>
          <div class='close' v-if='!edit' @click='edit = true'><small><span class='glyphicon glyphicon-edit'></span></small></div>
          <div class='close' v-else @click='saveSetting'><small><span class='glyphicon glyphicon-floppy-saved'></span></small></div>
        </template>
      <div id="editor" class='col-xs-12 col-md-6' v-if='edit'>
        <textarea v-model="input" class="form-control" rows="25"></textarea>
      </div>
      <div :class="['col-xs-12', edit ? 'col-md-6' : 'col-md-12']">
        <div v-html="htmlInput"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import marked from 'marked'
  import {getSetting} from 'api/standard'
  import {saveSetting} from 'api/admin'
  export default {
    props: {
      admin: {
        default: false,
        type: Boolean
      }
    },
    mounted: function () {
      this.getSetting()
    },
    data () {
      return {
        input: '',
        original: '',
        edit: false
      }
    },
    methods: {
      getSetting () {
        getSetting('motd')
        .then((res) => {
          this.input = ('id' in res.data && res.data.value) || ''
          this.original = this.input
        })
        .catch((e) => {
          this.$store.dispatch('createAlert', {message: 'Could not retrieve MOTD', type: 'danger'})
        })
      },
      saveSetting () {
        saveSetting('motd', this.input)
          .then((res) => this.$store.dispatch('createAlert', {message: res.data, type: 'success'}))
          .then(() => this.getSetting())
          .catch((e) => this.$store.dispatch('createAlert', {message: 'Could not save MOTD', type: 'danger'}))
        this.edit = false
      }
    },
    computed: {
      htmlInput () {
        return marked(this.input)
      }
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
.code {
    color: #f66;
}
.row {
  width: 100%;
}
  </style>