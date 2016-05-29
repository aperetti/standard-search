<template>
    <form class="form-horizontal" action="{{submitUrl}}" method="POST" enctype="multipart/form-data" v-on:submit.prevent="onSubmit">
      <div class="form-group">
        <label for="inputStandard" class="col-sm-2 control-label">Standard Code</label>
        <div class="col-sm-2">
          <input type="text" class="form-control" placeholder="Standard Code" v-model="code"></input>
        </div>
      </div>
      <div class="form-group">
        <label for="inputStandard" class="col-sm-2 control-label">Description</label>
        <div class="col-sm-6">
          <textarea rows="2" class="form-control" v-model="desc"></textarea>
        </div>
      </div>
      <div class="form-group" v-show="menu.length">
        <label for="inputStandard" class="col-sm-2 control-label">Groups</label>
        <div v-for="group in menu" track-by="$index">
          <div class="col-sm-2">
            <span class="pull-left">
            <button @click.prevent="removeGroup($index)" class="btn btn-primary btn-sm"><span aria-hidden="true" class="glyphicon glyphicon-remove-sign"></span>&nbsp;&nbsp; {{group}}</button>        
            </span>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="inputStandard" class="col-sm-2 control-label">Add Group</label>
        <div class="col-sm-3">
          <div class="input-group" >
            <input type="text" @keydown.enter="pushGroup(this.newGroup) | key enter" v-if="addGroup" id="group-add" class="form-control" placeholder="Group" v-model="newGroup">
            <div class="input-group-btn" v-if="addGroup">
              <button @click.prevent="pushGroup(this.newGroup)" type="button" class="btn btn-default" aria-label="Add Customer Group"><span class="glyphicon glyphicon-plus"></span></button>
              <button type="button" class="btn btn-default" aria-label="Help"><span class="glyphicon glyphicon-remove"></span></button>
            </div> 
            <button v-if="!addGroup" @click.prevent="customGroup()" class="btn btn-default btn-file pull-left"><span class="glyphicon glyphicon-plus"></span> Custom Group</button>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="btn btn-default btn-file">
          Upload PDF<input id="pdfFile" type="file" name="pdf" style="display: none;" v-model="file">
        </label>
        <input class="btn btn-primary" type="submit" value="Submit">
      </div>
      <div class="col-sm-6 col-sm-offset-3">
        <div class="panel panel-danger" v-if="!$val.valid">
          <div class="panel-heading">Errors</div>
          <ul class="list-group">
            <li class="list-group-item" v-if="!$val.code.required">Standard Code Required</li>
            <li class="list-group-item" v-if="!$val.desc.required">Standard Description Required</li>
            <li class="list-group-item" v-if="!$val.menu.required">(1) Group Required</li>
            <li class="list-group-item" v-if="!$val.menu.eachLength(1)">Each Group Must Have a Name</li>
            <li class="list-group-item" v-if="!$val.file.required">File Upload Required</li>
          </ul>
        </div>
      </div>
    </form>
</template>

<script>
  import {apiAddStandard, withToken} from '../api/config'
  export default {
    ready: function () {
    },
    data: function () {
      return {
        code: '',
        desc: '',
        file: '',
        addGroup: false,
        newGroup: '',
        menu: []
      }
    },
    methods: {
      toggleGroup: function () {
        this.addGroup = !this.addGroup
      },
      pushGroup: function (a) {
        this.newGroup = ''
        this.addGroup = !this.addGroup
        this.menu.push(a)
      },
      customGroup: function () {
        this.toggleGroup()
        this.$nextTick(function () {
          document.getElementById('group-add').focus()
        })
      },
      removeGroup: function (index) {
        this.menu.splice(index)
      },
      onSubmit: function (e) {
        var formData = new window.FormData()
        formData.append('path', this.menu.join('|'))
        formData.append('code', this.code)
        formData.append('desc', this.desc)
        formData.append('pdf', document.getElementById('pdfFile').files[0])
        var xhr = new window.XMLHttpRequest()
        xhr.open('POST', this.submitUrl, true)
        xhr.onload = function () {
          if (xhr.status === 200) {
            console.log('Uploaded')
            console.log(xhr.response)
          } else {
            console.log(xhr.response)
            console.log('Failed to Upload!')
          }
        }
        xhr.send(formData)
        console.log('Submit Pushed')
      }
    },
    computed: {
      submitUrl: function () {
        return withToken(apiAddStandard)
      },
      $val: function () {
        let $ = {}
        $.code = {required: this.code.length > 0}
        $.desc = {required: this.desc.length > 0}
        $.menu = {
          required: this.menu.length > 0,
          eachLength: (min) => {
            for (var el in this.menu) {
              if (this.menu[el].length < min) {
                return false
              } else {
                return true
              }
            }
          }
        }
        $.file = {required: this.file.length > 0, type: (extension) => {
          if (this.file.indexof(extension)) {
            return true
          } else {
            return true
          }
        }}
        $.valid = (function () {
          for (var type in $) {
            for (var key in $[type]) {
              if (!$[type][key]) return false
            }
          }
          return true
        })()
        return $
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

