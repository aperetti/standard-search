<template>
    <form class="form-horizontal" action="{{submitUrl}}" method="POST" enctype="multipart/form-data">
      <div class="form-group">
        <label for="inputStandard" class="col-sm-2 control-label">Standards</label>
        <div class="col-sm-2">
          <input type="text" class="form-control" placeholder="Standard Code"></input>
        </div>
      </div>
      <div class="form-group">
        <label for="inputStandard" class="col-sm-2 control-label">Description</label>
        <div class="col-sm-6">
          <textarea rows="2" class="form-control"></textarea>
        </div>
      </div>
      <div class="form-group" v-if="menu.length">
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
          Upload PDF<input type="file" name="pdf" style="display: none;">
        </label>

        <input class="btn btn-primary" type="submit" value="Submit">
      </div>
    </form>
</template>

<script>
  import {apiGetPdfText, withToken} from '../api/config'
  
  export default {
    ready: function () {
    },
    data: function () {
      return {
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
      }
    },
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

