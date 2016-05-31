<template>
    <form class="form-horizontal" action="{{submitUrl}}" method="POST" enctype="multipart/form-data" v-on:submit.prevent="onSubmit">
     
      <div class="form-group {{$vd.code.$valid ? 'has-success' : 'has-error'}}">
        <label for="inputStandard" class="col-sm-2 control-label">Standard Code</label>
        <div class="col-sm-2">
          <input type="text" class="form-control" placeholder="Standard Code" v-model="code" @></input>
        </div>
      </div>
      
      <div class="form-group {{$vd.desc.$valid ? 'has-success' : 'has-error'}}">
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
        <div class="col-sm-8">
          <div class="input-group" >
            <input type="text" @keydown.enter="pushGroup(this.newGroup) | key enter" v-if="addGroup" id="group-add" class="form-control" placeholder="Group" v-model="newGroup">
            <div class="input-group-btn">
            <span v-if="addGroup">
              <button @click.prevent="pushGroup(this.newGroup)" type="button" class="btn btn-default" aria-label="Add Customer Group"><span class="glyphicon glyphicon-plus"></span></button>
              <button type="button" class="btn btn-default" aria-label="Help" @click.prevent="toggleGroup()"><span class="glyphicon glyphicon-remove"></span></button>
            </span>
              <button v-if="!addGroup" @click.prevent="customGroup()" class="btn btn-default btn-file pull-left"><span class="glyphicon glyphicon-plus"></span> Custom Group</button>
              <span v-for="menu in menus">
                <button class='btn btn-primary btn-inline' @click.prevent="pushGroup(menu)">{{menu}}</button>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <label class="btn btn-default btn-file">
          Upload PDF<input id="pdfFile" type="file" name="pdf" style="display: none;" v-model="file">
        </label>
        <input class="btn btn-primary" :disabled="!$vd.$valid" type="submit" value="Submit">
      </div>
      
      <div class="col-sm-6 col-sm-offset-3">
        <div class="panel panel-danger" v-if="!$vd.$valid">
          <div class="panel-heading">Errors</div>
          <ul vif="$" class="list-group">
            <li class="list-group-item" v-if="!$vd.code.required">Standard Code Required</li>
            <li class="list-group-item" v-if="!$vd.code.valid">Standard Name Already Used</li>
            <li class="list-group-item" v-if="!$vd.desc.required">Standard Description Required</li>
            <li class="list-group-item" v-if="!$vd.menu.required">(1) Group Required</li>
            <li class="list-group-item" v-if="!$vd.menu.eachLength(1)">Each Group Must Have a Name</li>
            <li class="list-group-item" v-if="!$vd.file.required">PDF Upload Required</li>
          </ul>
        </div>
      </div>
    </form>
</template>

<script>
  import {apiAddStandard, withToken} from '../api/config'
  import {validStandard} from '../api/standard'
  import {hydrateMenu, menuLoading, setCurrentMenu, updateStandard} from '../vuex/actions'
  import equals from 'array-equal'
  import naturalSort from 'javascript-natural-sort'
  export default {
    ready: function () {
      this.hydrateMenu()
      this.$watch('code', () => {
        var self = this
        validStandard(this.code).then((response) => {
          if (!response.data.length) {
            self.validCode = true
            return
          } else {
            self.validCode = false
            return
          }
        }, (response) => {
          self.validCode = false
          return
        })
      })
    },
    data: function () {
      return {
        code: '',
        validCode: false,
        desc: '',
        file: '',
        addGroup: false,
        newGroup: '',
        menu: []
      }
    },
    validator: function () {
      return {
        code: {required: this.code.length > 0, valid: this.validCode || this.val},
        desc: {required: this.desc.length > 0},
        menu: {
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
        },
        file: {required: this.file.length > 0, type: (extension) => {
          if (this.file.indexof(extension)) {
            return true
          } else {
            return true
          }
        }}
      }
    },
    methods: {
      toggleGroup: function () {
        this.addGroup = !this.addGroup
      },
      pushGroup: function (a) {
        this.newGroup = ''
        this.addGroup = false
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
        xhr.open('POST', withToken(apiAddStandard), true)
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
      menus: function () {
        let allMenus = this.allMenus
        let path = this.menu
        let menus = []
        allMenus.forEach((menu) => {
          if (menus.indexOf(menu[path.length]) === -1) {
            if ((equals(path, menu.slice(0, path.length)) || path.length === 0) && menu.length !== path.length) {
              menus.push(menu[path.length])
            }
          }
        })
        return menus.sort(naturalSort)
      }
    },
    vuex: {
      actions: {
        hydrateMenu,
        menuLoading,
        setCurrentMenu,
        updateStandard
      },
      getters: {
        allMenus: state => state.standard.menus
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

