<template>
  <div>
    <form class="form-horizontal well" method="POST" enctype="multipart/form-data" v-on:submit.prevent="onSubmit">
    <div class="page-header"><h2 class="text-left">Create Standard</h2></div>

    <!-- Input Standard Code -->
    <div v-bind:class="['form-group', {'has-success': $vd.code.$valid, 'has-error': !$vd.code.$valid}]">
      <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label">Standard Code</label>
      <div class="col-sm-3 col-xs-10 col-xs-offset-1">
          <input type="text" class="form-control" v-model="code" @></input>
      </div>
    </div>
      
    <!-- Input Standard Description -->
    <div v-bind:class="['form-group', $vd.desc.$valid ? 'has-success' : 'has-error']">
      <label for="inputStandard" placeholder="One or Two Line Description" class="col-sm-2 col-sm-offset-1 control-label">Description</label>
      <div class="col-sm-6 col-xs-10 col-xs-offset-1">
        <textarea rows="2" class="form-control" v-model="desc"></textarea>
      </div>
    </div>

    <!-- Select Standard Menu -->
    <div class="form-group">
      <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label btn-label">Select Menu</label>
        <div class="col-sm-8 col-xs-10 col-xs-offset-1" >
          <transition :name="transition">
            <div class="input-group" v-if="!loadMenu">
              <div class="input-group-btn"> 
                <button v-for="menu in availableMenus" class='btn btn-primary btn-dismiss pull-left' @click.self.prevent="fetchMenu(menu.id)">
                  {{menu.name}}
                  <button @click.prevent='deleteModal = menu'type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true" class="dismiss">&times;</span>
                  </button>
                </button>
                <button @click.prevent="menuModal = true" class="btn btn-default pull-left"><span class="glyphicon glyphicon-plus"></span> Custom</button>
              </div>
            </div>
          </transition>
        </div>
    </div>
    
    <!-- Active Standard Menu -->
    <div class="form-group">
      <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label btn-label">Standard Menu</label>
      <div class="col-sm-8 col-xs-10 col-xs-offset-1">
        <div class="input-group-btn">
          <template v-if="menu && menu.ancestors">
            <button v-if=currentMenu @click.prevent="upMenu()" class="btn btn-secondary pull-left "><span class="glyphicon glyphicon-arrow-up"></span></button>
            <template v-for="(menu, index) in menu.ancestors">
              <button  @click.prevent="fetchMenu(menu.id, true)" class="btn btn-secondary pull-left">
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

    <!-- STATUS FORM GROUP -->
    <div class="form-group">
    <label for="status" class="col-sm-2 col-sm-offset-1 control-label">Set Status</label>
      <div class="col-sm-8 col-xs-10 col-xs-offset-1">
        <drop-down-button>
          <template slot="title">{{status.value}}</template>
          <template slot='dropdown'>
            <li><a href='#' @click="status.value = 'ACTIVE'">ACTIVE</a></li>
            <li><a href='#' @click="status.value = 'OBSOLETE'">OBSOLETE</a></li>
            <li><a href='#' @click="status.value = 'DELETED'">DELETED</a></li>
          </template>             
        </drop-down-button>
      </div>
    </div>

    <!-- CHANGE LOG FORM GROUP -->
    <div :class="['form-group', changelog.length > 0 ? 'has-success' : 'has-warning']">
      <label for="changelog" placeholder="One or Two Line Description of Changes" class="col-sm-2 col-sm-offset-1 control-label">Changelog</label>
      <div class="col-sm-6 col-xs-10 col-xs-offset-1">
        <textarea rows="2" class="form-control" v-model="changelog" style="margin-bottom:10px;"></textarea>
      </div>
    </div>
    
    <!-- Upload File -->
    <div class="form-group">
      <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label">File</label>
      <div class="col-sm-8 col-xs-10 col-xs-offset-1">
        <div class="input-group-btn">
          <label v-bind:class="['btn', fileUploaded ? 'btn-success' : 'btn-default', this.fileConflict ? 'btn-warning' : 'btn-default', 'btn-file', 'pull-left']">
            <span class="glyphicon glyphicon-cloud-upload"></span> Upload PDF <input id="pdfFile" type="file" name="pdf" style="display: none;" v-on:change="getFile" >
          </label>
          <label class="btn btn-default btn-file pull-left" v-if="file">
            {{file}}
          </label>
        </div>
      </div>
    </div>

    <!-- PDF References -->
    <div class="form-group form-inline">
      <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label">PDF References</label>
      <div class="row">
      <div class="col-sm-5 col-xs-10 col-xs-offset-1">       
        <div class="checkbox pull-left" v-for="(ref, index) in possibleReferences">
          {{ref.match}}<span v-if="index !== possibleReferences.length -1">,	&nbsp;</span>
        </div>  
      </div>
      </div>
    </div>

    <div class="form-group">
      <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label">References</label>
      <div class="col-sm-5 col-xs-10 col-xs-offset-1"> 
        <table class="table table-striped">
            <thead>
              <tr>
                <th>Standard</th>
                <th></th>
              </tr>
            </thead>
            <tbody>      
          <template v-for='(reference, index) in references'>
            <tr>
              <td class="pull-left">{{reference}}</td>
              <td><span @click="deleteReference(index)" class="glyphicon glyphicon-trash" /></td>
            </tr>
          </template>
          <tr>
            <td><input class="form-control" placeholder="Name" v-model='newReference.name'></input></td>
            <td><button :class="['btn','btn-default']" :disabled="!newReference.valid" @click.prevent='addReference'>Add <span class="glyphicon glyphicon-plus"/><br/></td>
          </tr>  
          </tbody>
        </table>
      </div>
    </div>

    <div class="form-group">
      <button class='btn btn-primary' v-if='loading'><img src='~src/assets/loading.svg'> Uploading </img></button>
      <input class="btn btn-primary" v-if='!loading' :disabled="!$vd.$valid" type="submit" value="Submit">
    </div>
    
    <div class="form-group" v-if="!loadingStandard">
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

    <div class="form-group" v-if="!loadingStandard">
      <div class="col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1">
        <div class="panel panel-warning" v-if="!$vd.changelog.required.valid">
          <div class="panel-heading">Warning</div>
          <div class="list-group">
            <li class="list-group-item" v-if="!$vd.changelog.required.valid">{{$vd.changelog.required.msg}}</li>
          </div>
        </div>
      </div>
    </div>


    <base-modal  :dim="deleteModal" v-on:close="cancelModals" v-on:submit="deleteMenu" id="delete">
      <template slot='title' v-if="deleteModal">Delete Menu: {{deleteModal.name}}</template>
      <template slot='body'>
        <p >
        You are about to delete the following: <br>
         <b v-if="deleteModal">[{{deleteModal.name}} - {{deleteModal.description}}]</b><br>
        Do you wish to continue?
        </p>
      </template>
      <template slot='button'>Delete</template>
    </base-modal>

    <base-modal :dim="menuModal" v-on:close="cancelModals" v-on:submit="createMenu" id="menu">
      <template slot='title'>Create Menu</template>
      <template slot='body'>
        <div class="form-group">
          <label for="inputStandard" class="col-sm-3 control-label">Menu Name</label>
          <div class="col-sm-8">
            <input class='form-control' type="text" v-model="newMenu.name"></input>
          </div>
        </div>
        <div class="form-group">
          <label for="inputStandard" class="col-sm-3 control-label">Description</label>
          <div class="col-sm-8">
            <input class='form-control' type="text" v-model="newMenu.description"></input>
          </div>
        </div>
      </template>
      <template slot="button">
        Create
      </template>
    </base-modal>

    <loading-modal :show="loadingStandard">Loading Standard Information</loading-modal>

  </div>
  
</template>

<script>
  import {apiAddStandard, apiEditStandard, withToken} from 'src/api/config'
  import {apiProcessPdf} from 'src/api/admin'
  import {tooltip} from 'vue-strap'
  import {validStandard, getStandardInfo} from 'src/api/standard'
  import {getMenu, createMenu, deleteMenu} from 'src/api/menu'
  import BaseModal from 'components/modals/BaseModal'
  import LoadingModal from 'components/modals/LoadingModal'
  import DropDownButton from 'components/widget/dropdownbutton'
  export default {
    mounted: function () {
      if ('standardId' in this.$route.params) {
        this.loadingStandard = true
        getStandardInfo(this.$route.params.standardId)
        .then(res => {
          this.loadingStandard = false
          this.editStandard = res.data
          this.code = res.data.code
          this.desc = res.data.description
          this.fetchMenu(res.data.menu_id)
        }).catch(e => {
          this.$store.dispatch('createAlert', {message: e.res, type: 'danger'})
          this.loadingStandard = false
        })
      } else {
        this.fetchMenu(0) // Get base level Menu
      }

      // Watch for file and process when uploaded.
      this.$watch('file', () => {
        if (this.file.length > 0) {
          var formData = new window.FormData()
          formData.append('pdf', document.getElementById('pdfFile').files[0])
          this.$http.post(apiProcessPdf, formData)
          .then(res => {
            var refs = res.data.map(ref => {
              ref.add = false
              return ref
            })
            this.possibleReferences = refs
          })
        }
      })
      // Watch for code to find a conflict with the name of the standard.
      this.$watch('code', () => {
        var self = this
        if (this.code.length > 0) {
          validStandard(encodeURIComponent(this.code))
          .then((response) => {
            self.validCode = Boolean(!response.data)
          }).catch(e => {
            self.validCode = false
          })
        }
      })
      this.$watch('newReference.name', () => {
        validStandard(encodeURIComponent(this.newReference.name))
          .then((response) => {
            this.newReference.valid = Boolean(response.data)
          }).catch(e => {
            this.newReference.valid = false
          })
      })
    },
    components: {
      tooltip,
      BaseModal,
      DropDownButton,
      LoadingModal
    },
    data: function () {
      return {
        references: [],
        newReference: {
          name: '',
          valid: false
        },
        possibleReferences: [],
        loadingStandard: false,
        status: {
          open: false,
          value: 'ACTIVE'
        },
        changelog: '',
        deleteModal: null,
        scrollDir: false,
        loadMenu: false,
        menuModal: false,
        newMenu: {
          name: null,
          description: null,
          parentId: null
        },
        menu: null,
        code: '',
        validCode: false,
        desc: '',
        file: '',
        fileConflictInfo: {},
        loading: false,
        editStandard: {}
      }
    },
    methods: {
      addReference () {
        this.references.push(this.newReference.name)
        this.newReference.name = ''
      },
      deleteReference: function (index) {
        this.references.splice(index, 1)
      },
      getFile: function (event) {
        this.file = document.getElementById('pdfFile').files[0].name
      },
      deleteMenu: function () {
        deleteMenu(this.deleteModal.id)
          .then(() => this.fetchMenu(this.menu.id, 'none'))
          .then(() => {
            this.deleteModal = null
            this.$store.dispatch('createAlert', {message: 'Menu succesfully deleted!', type: 'success', delay: 3000})
          }).catch((e) => {
            this.$store.dispatch('createAlert', {message: e.data, type: 'warning', delay: 5000})
            this.cancelModals()
          })
      },
      cancelModals: function () {
        this.deleteModal = null
        this.menuModal = false
        this.newMenu.name = null
        this.newMenu.description = null
        this.newMenu.parentId = null
      },
      upMenu: function () {
        if (this.menu.parent) {
          this.fetchMenu(this.menu.parent.id, true)
        } else {
          this.fetchMenu(null, true)
        }
      },
      createMenu: function () {
        this.newMenu.parentId = this.currentMenu && this.currentMenu.id
        createMenu(this.newMenu).then(res => {
          this.cancelModals()
          return this.fetchMenu(this.currentMenu && this.currentMenu.id, 'none')
        }).catch(e => {
          this.cancelModals()
        })
      },
      fetchMenu: function (menuId, down) {
        var delay = 200
        if (down === 'none') {
          this.scrollDir = down
          delay = 0
        } else {
          this.scrollDir = Boolean(down)
        }
        this.$nextTick(() => {
          this.loadMenu = true
          setTimeout(() => {
            getMenu(menuId).then(res => {
              this.loadMenu = false
              this.menu = res.data
            }).catch(e => {
              console.log(e)
              this.loadMenu = false
              this.menu = null
            })
          }, delay)
        })
      },
      setStatus: function (value) {
        this.status = value
      },
      onSubmit: function (e) {
        var formData = new window.FormData()
        this.loading = true
        formData.append('menu', this.menu.id)
        formData.append('code', this.code)
        formData.append('desc', this.desc)
        formData.append('references', JSON.stringify(this.references))
        if (this.file.length > 0) {
          formData.append('pdf', document.getElementById('pdfFile').files[0])
        }
        formData.append('status', this.status.value)
        if (this.changelog.length > 0) formData.append('changelog', this.changelog)
        var xhr = new window.XMLHttpRequest()
        if ('standardId' in this.$route.params) {
          formData.append('id', this.editStandard.id)
          xhr.open('POST', withToken(apiEditStandard), true)
        } else {
          xhr.open('POST', withToken(apiAddStandard), true)
        }
        xhr.onload = () => {
          this.loading = false
          var msg
          if (xhr.status === 200) {
            this.$router.push({name: 'standard', params: {standardId: this.editStandard.id}})
            msg = ('standardId' in this.$route.params) ? 'Standard Edited!' : 'Standard Created!'
            this.$store.dispatch('createAlert', {message: msg, type: 'success'})
          } else {
            msg = ('standardId' in this.$route.params) ? 'Failed editing Standard' : 'Failed creating Standard'
            this.$store.dispatch('createAlert', {message: msg, type: 'danger'})
          }
        }
        xhr.send(formData)
      }
    },
    computed: {
      transition: function () {
        if (this.scrollDir === 'none') return ''
        return this.scrollDir ? 'roll-down' : 'roll-up'
      },
      fileUploaded: function () {
        return this.file && !this.fileConflict
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
          conflict: {valid: this.validCode || this.val || this.code === this.editStandard.code, msg: 'Standard Code is already in use.'}
        },
        desc: {
          $name: 'Description',
          required: {valid: this.desc.length > 0, msg: 'Standard Description is required.'}
        },
        file: {
          $name: 'File Upload',
          required: {valid: this.file.length > 0 || this.$route.params.standardId, msg: 'PDF Upload is Required'},
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
        },
        changelog: {
          $name: 'Changelog',
          required: {valid: this.changelog.length > 0, msg: 'Changelog is recommended for most changes. If no changelog is provide, a new revision will not be created. The latest revision will be update with the changes.', warning: true}
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
.roll-up-enter-active, .roll-up-leave-active {
  transition: all 0.2s ease
}
 .roll-up-leave-active {
  transform: translateY(-20px);
  opacity: 0;
}
.roll-up-enter {
  transform: translateY(20px);
  opacity: 0;
}
.roll-down-enter-active, .roll-down-leave-active {
  transition: all 0.2s ease
}
 .roll-down-leave-active {
  transform: translateY(20px);
  opacity: 0;
}
.roll-down-enter {
  transform: translateY(-20px);
  opacity: 0;
}
.btn-label{
  padding-bottom: 7px;
  padding-top: 7px;
}
.btn-dismiss {
  padding-right: 20px;
}
.dismiss {
  position: absolute;
  color: #ddd;
  right: 0px;
  top: -4px;
  padding-right: 2px;
  outline:none !important;
}
span:hover, span:focus, span:active, .dismiss:focus, btn-dismiss:focus{
  color: #888;
  outline: none !important;
}
button.btn.btn-primary.btn-dismiss.pull-left {
    outline: none !important;
}
</style>

