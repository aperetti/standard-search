<template>
  <div>
    <form class="form-horizontal well" method="POST" enctype="multipart/form-data" v-on:submit.prevent="onSubmit">
    <div class="page-header"><h2 class="text-left">{{$route.name === 'editStandard' ? 'Edit' :'Create'}} Standard</h2></div>

    <!-- Input Standard Code -->
    <div v-bind:class="['form-group', {'has-success': $vd.code.$valid, 'has-error': !$vd.code.$valid}]">
      <label for="inputStandard" class="col-sm-2 col-sm-offset-1 control-label">Standard Code</label>
      <div class="col-sm-3 col-xs-10 col-xs-offset-1">
          <input id='standard-code-input' type="text" class="form-control" v-model="code" @></input>
      </div>
    </div>
      
    <!-- Input Standard Description -->
    <div v-bind:class="['form-group', $vd.desc.$valid ? 'has-success' : 'has-error']">
      <label for="inputStandard" placeholder="One or Two Line Description" class="col-sm-2 col-sm-offset-1 control-label">Description</label>
      <div class="col-sm-6 col-xs-10 col-xs-offset-1">
        <textarea id='standard-description-input' rows="2" class="form-control" v-model="desc"></textarea>
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
          <label v-bind:class="['btn', fileUploaded ? 'btn-success' : 'btn-default', 'btn-file', 'pull-left']">
            <span class="glyphicon glyphicon-cloud-upload"></span> Upload PDF <input id="pdfFile" type="file" name="pdf" style="display: none;" v-on:change="getFile" >
          </label>
          <label class="btn btn-default btn-file pull-left" v-if="file">
            {{file}}
          </label>
        </div>
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
  import {addStandard, editStandard} from 'src/api/admin'
  import {validStandard, getStandardInfo} from 'src/api/standard'
  import {getMenu, createMenu, deleteMenu} from 'src/api/menu'
  import BaseModal from 'components/modals/BaseModal'
  import LoadingModal from 'components/modals/LoadingModal'
  import DropDownButton from 'components/widget/DropDownButton'

  function initialData () {
    return {
      references: [],
      searchReference: [],
      newReference: {name: '', valid: false},
      possibleReferences: [],
      loadingStandard: false,
      status: {open: false, value: 'ACTIVE'},
      changelog: '',
      deleteModal: null,
      searchModal: null,
      scrollDir: false,
      loadMenu: false,
      menuModal: false,
      newMenu: {name: null, description: null, parentId: null},
      menu: null,
      code: '',
      validCode: false,
      desc: '',
      file: '',
      fileConflictInfo: {},
      loading: false,
      editStandard: {}
    }
  }

  export default {
    mounted: function () {
      // Handles initial load of the site, check if it should be in create or edit mode
      // Then loads the data approriately
      if ('standardId' in this.$route.params) {
        this.loadingStandard = true
        getStandardInfo(this.$route.params.standardId)
        .then(res => {
          this.loadingStandard = false
          this.editStandard = res.data
          this.code = res.data.code
          this.desc = res.data.description
          this.status.value = res.data.status
          this.fetchMenu(res.data.menuId)
        }).catch(e => {
          this.$store.dispatch('createAlert', {message: e.res, type: 'danger'})
          this.loadingStandard = false
        })
      } else {
        this.fetchMenu(0) // Get base level Menu
      }
      // Watches the route and then initializes data if it goes to create from edit
      // Fixes issue with the route not completely reloading
      this.$watch('$route.name', () => {
        if (this.$route.name === 'createStandard') {
          Object.assign(this.$data, initialData())
        } else {
          this.loadingStandard = true
          getStandardInfo(this.$route.params.standardId)
          .then(res => {
            this.loadingStandard = false
            this.editStandard = res.data
            this.code = res.data.code
            this.fetchMenu(res.data.menuId)
          }).catch(e => {
            this.$store.dispatch('createAlert', {message: e.res, type: 'danger'})
            this.loadingStandard = false
          })
        }
      })
      // Watch for code to find a conflict with the name of the standard.
      this.$watch('code', () => {
        if (this.code.length > 0) {
          validStandard(this.code)
          .then((response) => {
            this.validCode = Boolean(!response.data)
          }).catch(e => {
            this.validCode = false
          })
        }
      })
    },
    components: {
      BaseModal,
      DropDownButton,
      LoadingModal
    },
    data: function () {
      return initialData()
    },
    methods: {
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
        var postHandler = (res) => {
          this.loading = false
          this.$router.push({name: 'editStandardKeywords', params: {standardId: res.data}})
          var msg = ('standardId' in this.$route.params) ? 'Standard Edited!' : 'Standard Created!'
          this.$store.dispatch('createAlert', {message: msg, type: 'success'})
        }
        var errorHandler = (e) => {
          this.loading = false
          var msg = `Error could not ${('standardId' in this.$route.params) ? 'edit' : 'create'}.`
          msg = `${msg} ${e.response.data}`
          this.$store.dispatch('createAlert', {message: msg, type: 'danger'})
        }
        formData.append('menu', this.menu.id)
        formData.append('code', this.code)
        formData.append('desc', this.desc)
        if (this.file.length > 0) {
          formData.append('pdf', document.getElementById('pdfFile').files[0])
        }
        formData.append('status', this.status.value)
        if (this.changelog.length > 0) formData.append('changelog', this.changelog)
        if ('standardId' in this.$route.params) {
          formData.append('id', this.editStandard.id)
          editStandard(formData).then(postHandler).catch(errorHandler)
        } else {
          addStandard(formData).then(postHandler).catch(errorHandler)
        }
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
.float {
    position: absolute;
    top: 100%;
    z-index: 500;
}
tr.strikeout td:before {
    content: " ";
    position: absolute;
    top: 50%;
    left: 0;
    border-bottom: 1px solid #111;
    width: 100%;
}
tr.strikeout td:last-child:before {
    border-bottom: 0px !important;
}
table {
    border-collapse: collapse;
}

td {
    position: relative;
    padding: 5px 10px;
}
</style>

