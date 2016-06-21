<template>
  <div @click='toggleMenu' v-if='menuOpen' class="dim"></div>
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
  import bus from '../bus'

  export default {
    ready: function () {
      let getAdmin = isAdmin()
      var self = this
      bus.on('page-reset', function () {
        self.menuOpen = false
        self.open = false
      })
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
        menuOpen: false,
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
        this.menuOpen = !this.menuOpen
      }
    },
    events: {
      'link-clicked': function () {
        this.menuOpen = false
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
  .dim {
    height:100%;
    width:100%;
    position:fixed;
    left:0;
    top:0;
    z-index:1 !important;
    background-color:black;
    filter: alpha(opacity=75); /* internet explorer */
    -khtml-opacity: 0.75;      /* khtml, old safari */
      -moz-opacity: 0.75;      /* mozilla, netscape */
           opacity: 0.75;      /* fx, safari, opera */
  }
</style>
