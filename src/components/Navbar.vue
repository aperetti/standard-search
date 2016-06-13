<template>
  <nav class="navbar-default navbar-fixed-top" role="navigation">
    <div class="navbar-header">
      <a class="navbar-brand" @click='toggleMenu'><span class="glyphicon glyphicon-th"></span></a>
      <button type="button" class="navbar-toggle" @click="open = !open">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>
    <div class="{{ open ? 'navbar-collapse collapse-in' : 'navbar-collapse collapse'}}">
      <ul class="nav navbar-nav">
        <li><a @click.prevent='proccessLogout'>Logout</a></li>
      </ul>
      <ul v-if="admin" class="nav navbar-nav">
        <li><a @click.prevent="createStandard()"><span class="glyphicon glyphicon-plus"></span></span> Add New Standard</a></li>
      </ul>
      <form class="navbar-form">
        <div class="form-group" style="display:inline;">
          <div class="input-group" style="display:table;">
            <span class="input-group-addon" style="width:1%;"><span class="glyphicon glyphicon-search"></span></span>
            <search></search>
          </div>
        </div>
      </form> 
    </div>
    <standard-menu :enable='menuOpen' class="col-xs-12"></standard-menu>
  </nav>

</template>

<script>
  import {logout} from '../vuex/actions'
  import {isAdmin} from '../api/auth'
  import Search from './Search'
  import StandardMenu from './StandardMenu'
  export default {
    ready: function () {
      let getAdmin = isAdmin()
      var self = this
      getAdmin.then(function (res) {
        if (res.status === 200) {
          self.admin = true
        }
      })
    },
    components: {
      Search,
      StandardMenu
    },
    data () {
      return {
        menuOpen: true,
        open: false,
        admin: false
      }
    },
    vuex: {
      actions: {
        logout
      }
    },
    methods: {
      proccessLogout: function () {
        this.logout()
        this.$route.router.go('/login')
      },
      createStandard: function () {
        this.$route.router.go('/admin/standard/create')
        this.open = false
      },
      toggleMenu: function () {
        console.log(this.menuOpen)
        this.menuOpen = !this.menuOpen
      }
    }
  }
</script>

<style scoped>
  .float {
    position: absolute;
    top: 60px;
    width: 100%;
    z-index: 1000;
  }
</style>
