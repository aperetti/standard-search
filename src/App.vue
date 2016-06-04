<template>
  <div id="app">
    <navbar class='navbar' v-if='logged'></navbar>
    <div class='navbar-fixed-top' style='position:absolute; height: 75px; width: 100%; background-color: #eee;'  v-else></div>
    <div class='router'>
      <router-view></router-view>
    </div>  
  </div>
</template>

<script>
  import store from './vuex/store'
  import logout from './vuex/actions'
  import Navbar from './components/Navbar'
  import {loggedIn} from './api/config'
  export default {
    store,
    components: {
      Navbar
    },
    ready: function () {
      var self = this
      window.setInterval(function () {
        if (!loggedIn()) {
          self.logout()
        }
      }, 1000)
    },
    vuex: {
      actions: {
        logout
      },
      getters: {
        token: state => state.standard.token.token
      }
    },
    computed: {
      logged: function () {
        if (this.token) {
          return true
        }
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
  z-index: 9999;
}
.router {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 0;
}
body {
  align-items: top;
  height: 100%;
  width: 100%;
}
#app {
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
  height: 100%;
  padding-top: 75px;
  padding-bottom: 50px;
}
.login {
  max-width: 400px;
  margin: auto;
}
.header {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
