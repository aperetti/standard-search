<template>
  <nav class=" navbar navbar-default" role="navigation">
    <div class="navbar-header">         
      <a class="navbar-brand cursor" @click='toggleMenu'><span class="glyphicon glyphicon-th"></span></a>
      <button type="button" class="navbar-toggle" @click="toggleOption">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>
    <div class="{{ optionOpen ? 'navbar-collapse collapse-in' : 'navbar-collapse collapse'}}">
      <ul class="nav navbar-nav">
        <li><a @click.prevent='proccessLogout' class='cursor'>Logout</a></li>
        <nav-history></nav-history>
        <nav-user></nav-user>
      </ul>
      <ul v-if="admin" class="nav navbar-nav">
        <nav-admin></nav-admin>
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
  </nav>
  <standard-menu :enable='menuOpen' class="col-xs-12 col-md-6 float"></standard-menu> 
  <div class="dim" @click="close" v-if="menuOpen || optionOpen"></div>
</template>

<script>
  import {logout} from '../vuex/actions'
  import {isAdmin} from '../api/auth'
  import Search from './Search'
  import StandardMenu from './StandardMenu'
  import NavHistory from './widget/NavHistory'
  import NavAdmin from './widget/NavAdmin'
  import NavUser from './widget/NavUser'
  import bus from '../bus'
  import {togglers} from '../plugins/mixins'

  export default {
    mixins: [togglers],
    ready: function () {
      let getAdmin = isAdmin()
      var self = this
      bus.on('page-reset', function (arg) {
        if (['navbar-dropdown', 'nav-history', 'nav-user', 'nav-admin'].indexOf(arg) === -1) self.optionOpen = false
        self.menuOpen = false
      })
      getAdmin.then(function (res) {
        if (res.status === 200) {
          self.admin = true
        }
      }).catch(function (e) {
        self.admin = false
      })
    },
    components: {
      Search,
      StandardMenu,
      NavHistory,
      NavAdmin,
      NavUser
    },
    data () {
      return {
        menuOpen: false,
        mobileNav: false,
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
      toggleOption: function () {
        let tempStatus = !this.optionOpen
        bus.emit('page-reset')
        this.optionOpen = tempStatus
      },
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
      },
      toggleMenu: function () {
        let tempStatus = !this.menuOpen
        bus.emit('page-reset')
        this.menuOpen = tempStatus
      }
    }
  }
</script>

<style scoped>
  .navbar {
    border-radius: 0 !important;
  }
  .float {
    position: absolute;
    top: 50px;
    z-index: 1000;
    border-radius: 0;
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
