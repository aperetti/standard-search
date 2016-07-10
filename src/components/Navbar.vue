<template>
  <nav class=" navbar navbar-default" role="navigation">
    <div class="navbar-header">         
      <a class="navbar-brand cursor" @click='toggleMenu'><span class="glyphicon glyphicon-th"></span></a>
      <button type="button" class="navbar-toggle" @click="optionOpen = !optionOpen">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>
    <div class="{{ optionOpen ? 'navbar-collapse collapse-in' : 'navbar-collapse collapse'}}">
      <ul class="nav navbar-nav">
        <li><a @click.prevent='proccessLogout' class='cursor'>Logout</a></li>
      </ul>
      <ul v-if="admin" class="nav navbar-nav">
        <li><a @click.prevent="createStandard()" class='cursor'><span class="glyphicon glyphicon-plus"></span> Add New Standard</a></li>
        <li v-if="$route.params.standardId"><a v-link="{ name: 'editStandard', params: { standardId: $route.params.standardId }}" class='cursor'><span class="glyphicon glyphicon-pencil"></span> Edit Standard</a></li>
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
    <standard-menu :enable='menuOpen' class="col-xs-12 menu"></standard-menu> 
  </nav>
  <div class="dim" @click="close" v-if="menuOpen || optionOpen"></div>
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
        self.optionOpen = false
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
        optionOpen: false,
        admin: false
      }
    },
    vuex: {
      actions: {
        logout
      }
    },
    computed: {
      editStandard () {
        var standardId = this.$route.params.standardId
        return `{name: "editStandard", params:{standardId: "${standardId}"}}`
      }
    },
    methods: {
      close: function () {
        this.optionOpen = false
        this.menuOpen = false
      },
      proccessLogout: function () {
        this.logout()
        this.$route.router.go('/login')
      },
      createStandard: function () {
        this.$route.router.go('/admin/standard/create')
        this.optionOpen = false
      },
      toggleMenu: function () {
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
  .cursor {
    cursor: pointer;
  }
</style>
