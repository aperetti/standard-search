<template>
<div class='jumbotron'>
  <img class="logo" src="../assets/logo_s.png">
  <form class='login'>
    <div class='form-group'>
      <label class='sr-only' for="loginUsername">User</label>
      <input id='loginUsername' class='form-control' v-model='username' type='text' placeholder='Username' />
    </div>
    <div class='form-group'>
      <label class='sr-only' for='loginPassword'>Password</label>
      <input id='loginPassword' class='form-control' @keyup.13='processLogin' v-model='password' type='password' placeholder='Password'/>
      <br />
      <button class='btn btn-primary btn-block' @click.prevent='processLogin' type='button'>{{loading ? 'Loading...' : 'Sign in'}}</button>
    </div>
    <div v-show='failed' transition="fafa" class='alert alert-danger'>
      {{message}}
    </div>
  </form>
</div>
</template>

<script>
  import {logout, login} from '../vuex/actions'
  import {getToken} from '../api/auth'
  
  export default {
    data () {
      return {
        username: '',
        password: '',
        failed: false,
        loading: false,
        message: 'Incorrect Username/Password. Please try again.'
      }
    },
    vuex: {
      actions: {
        login,
        logout
      }
    },
    methods: {
      processLogin: function () {
        var self = this
        this.loading = true
        getToken(this.username, this.password).then((response) => {
          self.login(response)
          self.password = ''
          self.loading = false
          self.$route.router.go('/')
        }, (response) => {
          self.password = ''
          self.failed = true
          self.loading = false
          self.message = response.data.message ? response.data.message : self.message
          window.setTimeout(() => {
            self.failed = false
          }, 3000)
        })
      },
      logout: function () {
        this.logout()
      }
    }
  }
</script>

<style scoped>
  .pdf-frame {
    width: 100%;
    height: 500px;
    z-index: -99;
  }
  .logo {
    width: 60%;
    max-width: 250px;
    max-height: 350px;
    margin-bottom: 25px;
  }
  .jumbotron {
    height: 100%;
    margin-bottom: 0;
    padding: 10px;
  }
  .fafa-transition {
    transition: all .3s ease;
  }
  .fafa-enter, .fafa-leave {
    opacity: 0;
  }
</style>
