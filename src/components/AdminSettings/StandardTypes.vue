<template>
  <div>
    <div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Regex</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>      
      <template v-for='(category, index) in categories'>
        <tr v-if="category.edit">
          <td><input class="form-control" v-model='category.name'></input></td>
          <td><input class="form-control" v-model='category.description'></input></td>
          <td><input class="form-control" v-model='category.regex'></input></td>
          <td><button class="btn btn-default" @click="confirmCategory(category)">Confirm</button></td>
        </tr>
        <tr v-else>
          <td>{{category.name}}</td>
          <td>{{category.description}}</td>
          <td>{{category.regex}}</td>
          <td><span @click="category.edit = true" class="glyphicon glyphicon-edit" style="margin-left: 5px; margin-right: 5px;" /><span @click="handleDelete(index)" class="glyphicon glyphicon-trash" /></td>
        </tr>
      </template>
      <tr>
        <td><input class="form-control" placeholder="Name" v-model='newCategory.name'></input></td>
        <td><input class="form-control" placeholder="Description" v-model='newCategory.description'></input></td>
        <td><input class="form-control" placeholder="Regex" v-model='newCategory.regex'></input></td>
        <td><button class="btn btn-default" @click='addCategory'>Add <span class="glyphicon glyphicon-plus"/><br/></td>
      </tr>  
      </tbody>
    </table>
    <div class="row">
      <div class="col-md-12">
        <button class="btn btn-default" @click="modals.save = true">Save Changes</button>
        <button class="btn btn-default" @click="refreshCategories">Reset</button>
      </div>
    </div>
    <div class="row" style="margin-top: 10px;">
      <div class="col-md-12">
        <div v-if="edited" class="alert alert-info" role="alert"><b>Heads Up!</b> Changes have not been saved!</div>
      </div>
    </div>
    <base-modal v-on:submit="deleteCategory" v-on:close="modals.delete = false" :dim="modals.delete">
      <template slot="title">Delete Category</template>
      <template slot="body">Are you sure you want to delete the following category?</template>
      <template slot="button">Delete</template>
    </base-modal>
    <base-modal v-on:submit="saveReferences" v-on:close="modals.save = false" :dim="modals.save">
      <template slot="title">Save Changes</template>
      <template slot="body">Are you sure you want to save the following changes?</template>
      <template slot="button">Save</template>
    </base-modal>
  </div>
</template>

<script>
  import {getCategories, saveCategories} from 'src/api/admin'
  import BaseModal from 'components/modals/BaseModal'
  export default {
    components: {
      BaseModal
    },
    data () {
      return {
        edited: false,
        unwatch: () => false,
        categories: [],
        newCategory: {
          name: '',
          description: '',
          regex: '',
          edit: false
        },
        deleteIndex: 0,
        modals: {
          delete: false,
          save: false
        }
      }
    },
    mounted () {
      this.refreshCategories()
    },
    methods: {
      confirmCategory (category) {
        category.edit = false
      },
      editCategory (category) {
        console.log('tes')
        category.edit = true
      },
      handleDelete (index) {
        this.deleteIndex = index
        this.modals.delete = true
      },
      deleteCategory () {
        this.categories.splice(this.deleteIndex, 1)
        this.modals.delete = false
      },
      addCategory () {
        this.categories.push(Object.assign({}, this.newCategory))
        this.newCategory.name = ''
        this.newCategory.description = ''
        this.newCategory.regex = ''
      },
      refreshCategories () {
        this.unwatch()
        this.edited = false
        getCategories().then(res => {
          var categories = res.data || []
          categories.map(cat => {
            cat.edit = false
            return cat
          })
          this.categories = categories
          this.unwatch = this.$watch('categories', () => {
            this.edited = true
          }, {deep: true})
        })
      },
      saveReferences () {
        saveCategories(this.categories)
        .then(res => {
          this.edited = false
          this.modals.save = false
          this.$store.dispatch('createAlert', {message: res.data, type: 'success'})
        }).catch(e => {
          console.log(e)
          this.modals.save = false
          this.$store.dispatch('createAlert', {message: e.data, type: 'danger'})
        })
      }
    }
  }

</script>

<style scoped>
  tr {
    text-align: left;
  }
</style>
