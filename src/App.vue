<template>
  <div id="app">
    <form v-if='loggedIn'>
      <div class='form-group'>
      <div class='row header'>
        <button class='pull-right col-md-2 col-xs-2 btn btn-primary btn-default' @click.prevent='logout' type='button'>Logout</button>
      </div>
      </div>
    </form>

    <form class='login' v-else>
      <div class='form-group'>
        <label class='sr-only' for="loginUsername">User</label>
        <input id='loginUsername' class='form-control' v-model='username' type='text' placeholder='Username' />
      </div>
      <div class='form-group'>
        <label class='sr-only' for='loginPassword'>Password</label>
        <input id='loginPassword' class='form-control' @keyup.13='login' v-model='password' type='password' placeholder='Password'/>
        <br />
        <button class='btn btn-primary btn-block' @click.prevent='login' type='button'>Sign in</button>
      </div>
      <div v-bind:class="{ 'alert alert-danger' : failed}">
        {{failed ? 'Incorrect Username/Password. Please try again.' : ''}}
      </div>
    </form>

    <template v-if='loggedIn'>
     <router-view></router-view>
    </template>

    <template v-else>

    </template>
   </div>
</template>

<script>
  import Search from './components/Search'
  import store from './vuex/store'
  import {apiAuthUrl} from './api/config'
  export default {
    store,
    components: {
      Search
    },
    data () {
      return {
        username: '',
        password: '',
        logged: '',
        failed: false,
        loading: false
      }
    },
    methods: {
      login: function () {
        var loginUrl = apiAuthUrl
        var xmlHttp = new window.XMLHttpRequest()
        var data = 'name=' + this.username + '&password=' + this.password
        var self = this
        this.loading = true
        xmlHttp.onreadystatechange = function () {
          if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            let result = JSON.parse(xmlHttp.responseText)
            if (result.success) {
              window.localStorage.setItem('token', result.token)
              window.localStorage.setItem('expiration', result.expires)
              window.localStorage.setItem('user', self.username)
              self.logged = true
              self.password = ''
            } else {
              console.log('failed to log in')
              self.password = ''
              self.failed = true
            }
            self.loading = false
          }
        }
        xmlHttp.open('POST', loginUrl, true)
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xmlHttp.send(data)
      },
      logout: function () {
        window.localStorage.setItem('token', null)
        window.localStorage.setItem('expiration', null)
        window.localStorage.setItem('username', null)
        this.logged = false
      }
    },
    computed: {
      loggedIn: function () {
        this.logged
        if (window.localStorage.getItem('token') != null && new Date() < window.localStorage.getItem('expiration')) {
          return true
        } else {
          return false
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

body {
  align-items: top;
  height: 100%;
  width: 100%;
}
#app {
  margin-top: 10px;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
  height: 100%;
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
