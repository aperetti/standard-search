<template>
  <div id="app">
    <create-project class='modal-dimmer' v-if='modals.CreateProject.enabled'></create-project>
    <navbar v-if='logged'></navbar>
    <div class='container-fluid' style='position:absolute; height: 50px; width: 100%; background-color: #eee;' v-else></div>

    <!-- MODALS -->
    

    <div class='router'>
      <router-view></router-view>
    </div>  
  </div>
</template>

<script>
  import store from './vuex/store'
  import {logout, setToken} from './vuex/actions'
  import Navbar from './components/Navbar'
  // MODAL Components
  import CreateProject from 'components/modals/CreateProject'
  import {loggedIn} from './api/config'
  import bus from './bus'
  export default {
    store,
    components: {
      Navbar,
      CreateProject
    },
    ready: function () {
      var self = this
      bus.on('dim', function () {
        self.dim = true
      })
      bus.on('!dim', function () {
        self.dim = false
      })
      bus.on('page-reset', function () {
        self.dim = false
      })
      window.setInterval(function () {
        if (!loggedIn()) {
          self.$route.router.go('/login')
          self.logout()
        }
      }, 10000)
    },
    computed: {
      logged: function () {
        return (this.expiration > new Date().getTime())
      }
    },
    vuex: {
      getters: {
        expiration: state => state.standard.token.expiration,
        modals: state => state.modals
      },
      actions: {
        logout,
        setToken
      }
    },
    data () {
      return {
        dim: false
      }
    }
  }
</script>

<style>
 @import'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css';
 html {
  height: 100%;
}
.navbar {
  z-index: 99;
}
.modal-dimmer {
  z-index: 999;
}
.router {
  position: relative;
  width: 100%;
  top: 0;
  bottom: 0;
  z-index: 0;
}
body {
  align-items: top;
  height: 100%;
}
#app {
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
  height: 100%;;
}
.login {
  max-width: 400px;
  margin: auto;
}
.header {
  margin-left: 10px;
  margin-right: 10px;
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
