<template>
    <form style="padding-left:20px;" class="form-horizontal" action="{{submitUrl}}" method="POST" enctype="multipart/form-data" v-on:submit.prevent="onSubmit">
    <div class="page-header"><h2 class="text-left">Edit Standard</h2></div>
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
            <div v-if="addGroup">
              <div class="input-group-btn">
                <input type="text" @keydown.enter="pushGroup(this.newGroup) | key enter" v-if="addGroup" id="group-add" class="form-control" placeholder="Group" v-model="newGroup">
                <button @click.prevent="pushGroup(this.newGroup)" type="button" class="btn btn-default" aria-label="Add Customer Group"><span class="glyphicon glyphicon-plus"></span></button>
                <button type="button" class="btn btn-default" aria-label="Help" @click.prevent="toggleGroup()"><span class="glyphicon glyphicon-remove"></span></button>
              </div>
            </div>
            <div class="input-group-btn">           
              <button v-for="menu in menus" class='btn btn-primary pull-left' @click.prevent="pushGroup(menu)">{{menu}}</button>
              <button v-if="!addGroup" @click.prevent="customGroup()" class="btn btn-default pull-left"><span class="glyphicon glyphicon-plus"></span> Custom</button>
            </div>
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
        <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label">Change File</label>
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
        <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label">References</label>
        <div class="col-sm-8 col-xs-10 col-xs-offset-1">
          <div class="input-group-btn">
            <template v-for="(index, group) in references" track-by="$index">
              <button  @click.prevent="removeRef(index)" class="btn btn-default pull-left">
              <span  aria-hidden="true" class="glyphicon glyphicon glyphicon-remove-sign"></span>
              &nbsp;&nbsp; {{group}} &nbsp;
              </button>               
            </template>
          </div>
        </div>
      </div>

      <div class="form-group">
      <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label">Set Status</label>
        <div class="col-sm-8 col-xs-10 col-xs-offset-1">
          <dropdown class="pull-left">
            <button type="button" class="btn btn-default" data-toggle="dropdown">
              {{status}}
              <span class="caret"></span>
            </button>
            <ul slot="dropdown-menu" class="dropdown-menu">
              <li><h6 class='dropdown-header'>Select Status</h6></li>
              <li><a href='#' @click="setStatus('ACTIVE')">ACTIVE</a></li>
              <li><a href='#' @click="setStatus('INACTIVE')">INACTIVE</a></li>
              <li><a href='#' @click="setStatus('DELETED')">DELETED</a></li>             
            </ul>
          </dropdown>
        </div>
      </div>

      <div class="form-group">
        <input class="btn btn-primary" :disabled="!$vd.$valid" type="submit" value="Submit">
        <input class="btn btn-default" @click="loadDefaults" type="submit" value="Restore Defaults">
      </div>
      
      <div class="col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1">
        <div class="panel panel-danger" v-if="!$vd.$valid">
          <div class="panel-heading">Errors</div>
          <div class="list-group">
            <li class="list-group-item" v-if="!$vd.code.required.valid">{{$vd.code.required.msg}}</li>
            <li class="list-group-item" v-if="!$vd.code.conflict.valid && code.length !== 0">Standard Name Already Used</li>
            <li class="list-group-item" v-if="!$vd.desc.required.valid">Standard Description Required</li>
            <li class="list-group-item" v-if="!$vd.menu.required.valid">(1) Group Required</li>
            <li class="list-group-item" v-if="!$vd.menu.eachLength.valid(1)">Each Group Must Have a Name</li>
            <li class="list-group-item" v-if="!$vd.file.conflict.valid">PDF already exists under Standard: {{fileConflictInfo.code}}</li>
          </div>
        </div>
      </div>
</template>

<script>
  import {apiEditStandard, withToken} from '../api/config'
  import {tooltip, dropdown} from 'vue-strap'
  import {validStandard, getStandard} from '../api/standard'
  import {hydrateMenu, menuLoading, setCurrentMenu, updateStandard} from '../vuex/actions'
  import equals from 'array-equal'
  import naturalSort from 'javascript-natural-sort'
  export default {
    route: {
      data: function (transition) {
        var file = getStandard(transition.to.query.standard)
        return file.then((response) => {
          var standard = response.data
          console.log(standard)
          return {
            code: standard.code,
            desc: standard.desc,
            menu: standard.menu.slice(0),
            references: standard.references.slice(0),
            status: standard.status,
            standard: standard
          }
        })
      }
    },
    ready: function () {
      this.hydrateMenu()
      // Used to find a file conflict before uploading the file.
      // This will try to find the Mongo document. If found it will
      // return the document and the set fileConflict to true
      this.$watch('file', () => {
        var self = this
        console.log(this.fileName)
        getStandard(this.fileName + '.pdf').then((response) => {
          console.log(response)
          if (response.data) {
            self.fileConflict = true
            self.fileConflictInfo = response.data
          } else {
            self.fileConflict = false
            self.fileConflictInfo = {}
          }
        })
      })

      // Watch for code to find a conflict with the Name of the standard.
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
    components: {
      tooltip, dropdown
    },
    data: function () {
      return {
        edit: false,
        code: '',
        desc: '',
        file: '',
        menu: [],
        status: '',
        references: [],
        validCode: false,
        addGroup: false,
        newGroup: '',
        fileConflict: false,
        fileConflictInfo: {},
        standard: {}
      }
    },
    validator: function () {
      return {
        code: {
          $name: 'Code',
          required: {valid: this.code.length > 0, msg: 'Standard Code is required.'},
          conflict: {valid: this.validCode || this.code === this.standard.code, msg: 'Standard Code is already in use.'}
        },
        desc: {
          $name: 'Description',
          required: {valid: this.desc.length > 0, msg: 'Standard Description is required.'}
        },
        menu: {
          $name: 'Groups',
          required: {valid: this.menu.length > 0, msg: 'Standard must contain (1) Group.'},
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
            msg: 'One of the Standard Groups does not contain a name'
          }
        },
        file: {
          $name: 'File Upload',
          conflict: {valid: !this.fileConflict || this.file === this.standard.file, msg: 'File is already in use'},
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
      loadDefaults: function () {
        this.code = this.standard.code
        this.desc = this.standard.desc
        this.menu = this.standard.menu.slice(0)
        this.references = this.standard.references.slice(0)
        this.status = this.standard.status
      },
      setStatus: function (value) {
        this.status = value
      },
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
      removeRef: function (index) {
        this.references.splice(index, 1)
      },
      removeGroup: function (index) {
        this.menu.splice(index)
      },
      onSubmit: function (e) {
        var formData = new window.FormData()
        formData.append('path', this.menu.join('|'))
        formData.append('code', this.code)
        formData.append('desc', this.desc)
        if (document.getElementById('pdfFile').files[0]) {
          formData.append('pdf', document.getElementById('pdfFile').files[0])
        }
        formData.append('_id', this.standard._id)
        formData.append('status', this.status)
        formData.append('refs', this.references.join('|'))
        var xhr = new window.XMLHttpRequest()
        xhr.open('POST', withToken(apiEditStandard), true)
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
      fileName: function () {
        let array = this.file.split(/(\/|\\)/).slice(-1)[0].split('.')
        array.pop()
        console.log(array)
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

