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
            <button v-if="!addGroup" v-for="menu in menus" class='btn btn-primary pull-left' @click.prevent="pushGroup(menu)">{{menu}}</button>
            <button v-if="!addGroup" @click.prevent="customGroup()" class="btn btn-default pull-left"><span class="glyphicon glyphicon-plus"></span> Custom</button>
            </div>
          </div>
        </div>
      </div>
    
      <div class="form-group">
        <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label">Menu Path</label>
        <div class="col-sm-8 col-xs-10 col-xs-offset-1">
          <div class="input-group-btn">
            <template v-for="(index, group) in menu" track-by="$index">
              <button  @click.prevent="removeGroup(index)" class="btn btn-primary pull-left">
              <span  aria-hidden="true" class="glyphicon glyphicon glyphicon-remove-sign"></span>
              &nbsp;&nbsp; {{group}} &nbsp;
              </button>   
              <button v-if="!(menu.length - 1 == index)" @click.prevent="removeGroup(index+1)" class="btn btn-primary pull-left">
              <span  aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>
              </button>                         
            </template>
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
              <li class="list-group-item" v-if="!$vd.menu.required.valid">(1) Group Required</li>
              <li class="list-group-item" v-if="!$vd.menu.eachLength.valid(1)">Each Group Must Have a Name</li>
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
  import {getMenu} from 'src/api/menu'
  import equals from 'array-equal'
  import naturalSort from 'javascript-natural-sort'
  export default {
    ready: function () {
      let menu = getMenu()
      menu.then((response) => {
        this.allMenus = response.data
      }, (response) => {
        this.allMenus = []
      })
      // Watch for code to find a conflict with the Name of the standard.
      this.$watch('code', () => {
        var self = this
        validStandard(encodeURIComponent(this.code)).then((response) => {
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
    components: {
      tooltip
    },
    data: function () {
      return {
        edit: false,
        code: '',
        validCode: false,
        desc: '',
        file: '',
        addGroup: false,
        newGroup: '',
        menu: [],
        fileConflictInfo: {},
        loading: false,
        allMenus: []
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
        menu: {
          $name: 'Groups',
          required: {valid: this.menu.length > 0, msg: 'Standard must contain (1) Menu Item.'},
          eachLength: {
            valid: (min) => {
              for (var el in this.menu) {
                if (this.menu[el].length < min) {
                  return false
                } else {
                  return true
                }
              }
            },
            msg: 'One of the Standard Menu does not contain a name'
          }
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
        this.loading = true
        var self = this
        formData.append('path', this.menu.join('|'))
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

