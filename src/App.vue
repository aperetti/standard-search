<template>
  <div id="app">
    <form v-if='loggedIn && !expired'>
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

    <template v-if='loggedIn && !expired'>
      <router-view></router-view>
    </template>

    <template v-else>

    </template>
   </div>
</template>

<script>
  import Search from './components/Search'
  import store from './vuex/store'
  // import {apiAuthUrl} from './api/config'
  import {getToken} from './api/auth'
  import {setToken} from './vuex/actions'
  export default {
    store,
    components: {
      Search
    },
    data () {
      return {
        username: '',
        password: '',
        logged: false,
        failed: false,
        loading: false
      }
    },
    vuex: {
      actions: {
        setToken
      },
      getters: {
        expired: state => {
          let exp = state.standard.token.expiration
          if (exp > new Date()) {
            return false
          } else {
            return true
          }
        }
      }
    },
    methods: {
      login: function () {
        var self = this
        this.loading = true
        getToken(this.username, this.password).then((response) => {
          window.localStorage.setItem('token', response.data.token)
          window.localStorage.setItem('expiration', response.data.expires)
          window.localStorage.setItem('user', self.username)
          self.setToken({token: response.data.token, expiration: response.data.expires})
          self.logged = true
          self.password = ''
          self.loading = false
        }, (response) => {
          self.password = ''
          self.failed = true
          self.loading = false
        })
      },
      logout: function () {
        window.localStorage.setItem('token', null)
        window.localStorage.setItem('expiration', null)
        window.localStorage.setItem('username', null)
        this.setToken({token: '', expiration: 0})
        this.logged = false
      }
    },
    computed: {
      loggedIn: {
        cache: true,
        get: function () {
          this.logged
          if (window.localStorage.getItem('token') != null && new Date() < window.localStorage.getItem('expiration')) {
            this.setToken({token: window.localStorage.getItem('token'), expiration: window.localStorage.getItem('expiration')})
            return true
          } else {
            return false
          }
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
