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
          <td><input v-model='category.name'></input></td>
          <td><input v-model='category.description'></input></td>
          <td><input v-model='category.regex'></input></td>
          <td><button @click="confirmCategory(category)">Confirm</button></td>
        </tr>
        <tr v-else>
          <td>{{category.name}}</td>
          <td>{{category.description}}</td>
          <td>{{category.regex}}</td>
          <td><span @click="editCategory(category)" class="glyphicon glyphicon-edit" style="margin-right: 5px;" /><span @click="deleteCategory(index)" class="glyphicon glyphicon-trash" /></td>
        </tr>
      </template>
      <tr>
        <td><input placeholder="Name" v-model='newCategory.name'></input></td>
        <td><input placeholder="Description" v-model='newCategory.description'></input></td>
        <td><input placeholder="Regex" v-model='newCategory.regex'></input></td>
        <td><button @click='addCategory'>Add <span class="glyphicon glyphicon-plus"/><br/></td>
      </tr>  
      </tbody>
    </table>
  </div>
</template>

<script>
  import {getCategories, saveCategories} from 'src/api/admin'
  export default {
    data () {
      return {
        categories: [],
        newCategory: {
          name: '',
          description: '',
          regex: '',
          edit: false
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
        category.edit = true
      },
      deleteCategory (index) {
        this.categories.splice(index, 1)
      },
      addCategory () {
        this.categories.push(Object.assign({}, this.newCategory))
        this.newCategory.name = ''
        this.newCategory.description = ''
        this.newCategory.regex = ''
      },
      refreshCategories () {
        getCategories().then(res => {
          this.categories = res.data || []
        })
      },
      saveReferences () {
        saveCategories(this.categories)
        .then(res => {
          this.$store.dispatch('createAlert', {msg: res.data, type: 'success'})
        }).catch(e => {
          this.$store.dispatch('createAlert', {msg: e.data, type: 'danger'})
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
