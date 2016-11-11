<template>
    <form class="form-horizontal well" action="{{submitUrl}}" method="POST" enctype="multipart/form-data" v-on:submit.prevent="onSubmit">
    <div class="page-header"><h2 class="text-left">Create Standard</h2></div>
      <div class="form-group {{$vd.code.$valid ? 'has-success' : 'has-error'}}">
        <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label">Standard Code</label>
        <div class="col-sm-3 col-xs-10 col-xs-offset-1">
            <input type="text" class="form-control" v-model="code" @></input>
        </div>
      </div>
      
      <div class="form-group {{$vd.desc.$valid ? 'has-success' : 'has-error'}}">
        <label for="inputStandard" placeholder="One or Two Line Description" class="col-sm-2 col-sm-offset-1 control-label">Description</label>
        <div class="col-sm-6 col-xs-10 col-xs-offset-1">
          <textarea rows="2" class="form-control" v-model="desc"></textarea>
        </div>
      </div>
      
      <div class="form-group">
        <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label">Add Menu Item</label>
        <div class="col-sm-8 col-xs-10 col-xs-offset-1">
          <div class="input-group" >
            <div class="input-group-btn"> 
              <div v-if="addGroup">
              <div class="input-group-btn">
                <input type="text" @keydown.enter="pushGroup(this.newGroup) | key enter" v-if="addGroup" id="group-add" class="form-control" placeholder="Group" v-model="newGroup">
                <button @click.prevent="pushGroup(this.newGroup)" type="button" class="btn btn-default" aria-label="Add Customer Group"><span class="glyphicon glyphicon-plus"></span></button>
                <button type="button" class="btn btn-default" aria-label="Help" @click.prevent="toggleGroup()"><span class="glyphicon glyphicon-remove"></span></button>
              </div>
            </div>          
            <button v-if="!addGroup" v-for="menu in availableMenus" class='btn btn-primary pull-left' @click.prevent="fetchMenu(menu.id)">{{menu.name}}</button>
            <button v-if="!addGroup" @click.prevent="menuModal = true" class="btn btn-default pull-left"><span class="glyphicon glyphicon-plus"></span> Custom</button>
            </div>
          </div>
        </div>
      </div>

      <base-modal v-if="menuModal" v-on:close="cancelModal" v-on:submit="createMenu">
        <template slot='title'>Create Menu</template>
          <template slot='body'>
            <div class="form-group">
              <label for="inputStandard" class="col-sm-3 control-label">Menu Name</label>
                <div class="col-sm-8">
                  <input class='form-control' type="text" v-model="newMenu.name"></input>
                </div>
              </label>
            </div>
            <div class="form-group">
              <label for="inputStandard" class="col-sm-3 control-label">Description</label>
                <div class="col-sm-8">
                  <input class='form-control' type="text" v-model="newMenu.description"></input>
                </div>
              </label>
            </div>
          </template>
        </base-modal>
              
      <div class="form-group">
        <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label">Menu Path</label>
        <div class="col-sm-8 col-xs-10 col-xs-offset-1">
          <div class="input-group-btn">
            <template v-if="menu && menu.ancestors">
              <button v-if=currentMenu @click.prevent="upMenu()" class="btn btn-secondary pull-left"><span class="glyphicon glyphicon-arrow-up"></span></button>
              <template v-for="(index, menu) in menu.ancestors" track-by="$index">
                <button  @click.prevent="fetchMenu(menu.id)" class="btn btn-secondary pull-left">
                &nbsp;&nbsp; {{menu.name}} &nbsp;
                </button>   
              </template>
            </template>
              <button v-if=currentMenu  @click.prevent="fetchMenu(menu.id)" class="btn btn-success pull-left">
              &nbsp;&nbsp; {{menu.name}} &nbsp;
              </button>   
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label">File</label>
        <div class="col-sm-8 col-xs-10 col-xs-offset-1">
          <div class="input-group-btn">
            <label class="btn {{this.file && !this.fileConflict? 'btn-success' : 'btn-default'}} {{this.fileConflict ? 'btn-warning' : 'btn-default'}} btn-file pull-left">
              <span class="glyphicon glyphicon-cloud-upload"></span> Upload PDF <input id="pdfFile" type="file" name="pdf" style="display: none;" v-model="file">
            </label>
            <label class="btn btn-default btn-file pull-left" v-if="file">
              {{fileName}}
            </label>
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <button class='btn btn-primary' v-if='loading'><img src='../assets/loading.svg'> Uploading </img></button>
        <input class="btn btn-primary" v-if='!loading' :disabled="!$vd.$valid" type="submit" value="Submit">
      </div>
      
      <div class="form-group">
        <div class="col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1">
          <div class="panel panel-danger" v-if="!$vd.$valid">
            <div class="panel-heading">Errors</div>
            <div class="list-group">
              <li class="list-group-item" v-if="!$vd.code.required.valid">Standard Code Required</li>
              <li class="list-group-item" v-if="!$vd.code.conflict.valid && code.length !== 0">Standard Name Already Used</li>
              <li class="list-group-item" v-if="!$vd.desc.required.valid">Standard Description Required</li>
              <li class="list-group-item" v-if="!$vd.file.required.valid">PDF Upload Required</li>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
  import {apiAddStandard, withToken} from '../api/config'
  import {tooltip} from 'vue-strap'
  import {validStandard} from '../api/standard'
  import {getMenu, createMenu} from 'src/api/menu'
  import BaseModal from './modals/BaseModal'
  export default {
    ready: function () {
      this.fetchMenu(0)
      // Watch for code to find a conflict with the name of the standard.
      this.$watch('code', () => {
        var self = this
        validStandard(encodeURIComponent(this.code))
          .then((response) => {
            self.validCode = Boolean(response.data)
          }).catch(e => {
            self.validCode = false
          })
      })
    },
    components: {
      tooltip,
      BaseModal
    },
    data: function () {
      return {
        menuModal: false,
        newMenu: {
          name: null,
          description: null
        },
        menu: null,
        code: '',
        validCode: false,
        desc: '',
        file: '',
        fileConflictInfo: {},
        loading: false
      }
    },
    methods: {
      closeModal: function () {
        this.menuModal = false
        this.newMenu.name = null
        this.newMenu.description = null
      },
      upMenu: function () {
        if (this.menu.parent) {
          this.fetchMenu(this.menu.parent.id)
        } else {
          this.fetchMenu()
        }
      },
      createMenu: function () {
        var newMenu = this.newMenu
        newMenu.parentId = this.currentMenu
        createMenu(this.newMenu).then(res => {
          this.menu = res.data
        })
      },
      fetchMenu: function (menuId) {
        getMenu(menuId).then(res => {
          console.log(res)
          this.menu = res.data
        }).catch(e => {
          console.log(e)
          this.menu = null
        })
      },
      onSubmit: function (e) {
        var formData = new window.FormData()
        this.loading = true
        var self = this
        formData.append('menu', this.menu)
        formData.append('code', this.code)
        formData.append('desc', this.desc)
        formData.append('pdf', document.getElementById('pdfFile').files[0])
        var xhr = new window.XMLHttpRequest()
        xhr.open('POST', withToken(apiAddStandard), true)
        xhr.onload = function () {
          self.loading = false
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.response)
            console.log(response)
            self.$route.router.go({name: 'editStandard', params: {standardId: response.data._id}})
          } else {
            // TODO: HANDLE FAILED STANDARD CREATION
          }
        }
        xhr.send(formData)
        // TODO: CREATE CONFIRMATION THAT BUTTON HAS BEEN SUBMITTED?
      }
    },
    computed: {
      fileName: function () {
        let array = this.file.split(/(\/|\\)/).slice(-1)[0].split('.')
        array.pop()
        return array[0].toLowerCase()
      },
      currentMenu: function () {
        return Array.isArray(this.menu) ? null : this.menu
      },
      availableMenus: function () {
        var menus = []
        var curMenu = this.menu
        if (!curMenu) {
          return menus
        } else if (Array.isArray(curMenu)) {
          curMenu.map(el => menus.push(el))
        } else {
          if (Array.isArray(curMenu.children) && curMenu.children.length !== 0) {
            curMenu.children.map(el => menus.push(el))
          }
        }
        return menus
      }
    },
    validator: function () {
      return {
        code: {
          $name: 'Code',
          required: {valid: this.code.length > 0, msg: 'Standard Code is required.'},
          conflict: {valid: this.validCode || this.val, msg: 'Standard Code is already in use.'}
        },
        desc: {
          $name: 'Description',
          required: {valid: this.desc.length > 0, msg: 'Standard Description is required.'}
        },
        file: {
          $name: 'File Upload',
          required: {valid: this.file.length > 0, msg: 'PDF Upload is Required'},
          type: {
            valid: (extension) => {
              if (this.file.indexof(extension)) {
                return true
              } else {
                return true
              }
            },
            msg: '*.pdf extension is required!'
          }
        }
      }
    }
  }
</script>

<style scoped>
  .form-group {
    margin-right: 0px;
    margin-left: 0px;
  }
  .form-horizontal {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .well {
   background-color: rgba(248, 248, 248, 0.32);
   margin: 5px;
}
</style>

