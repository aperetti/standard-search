<template>
  <div class='login-bg'>  </div>
  <div class='jumbotron'>
    <div style='overflow-y: scroll; height: 100%;'>
    <div class=' col-xs-12 col-md-4 col-md-offset-4' style='margin-top:50px;margin-bottom:50px;'>
      <div class='well'>
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
            <button class='btn btn-primary btn-block' @click.prevent='processLogin' type='button'>{{loading ? 'Loading' : 'Sign in'}}</button>
          </div>
          <div v-show='failed' transition="fafa" class='alert alert-danger'>
            {{message}}
          </div>
        </form>
      </div>
    </div>
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
    width: 80%;
    max-width: 250px;
    max-height: 350px;
    margin-bottom: 25px;
  }
  .jumbotron {
    display: table;
    background: #bdc3c7; /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #bdc3c7 , #2c3e50); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #bdc3c7 , #2c3e50); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    position: fixed;
    max-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;   
  }
  .fafa-transition {
    transition: all .3s ease;
  }
  .fafa-enter, .fafa-leave {
    opacity: 0;
  }
  .well {
    background-color: rgba(254,254,254,.65);
    overflow: auto;
  }
  .login-bg {
     background: #bdc3c7; /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #bdc3c7 , #2c3e50); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #bdc3c7 , #2c3e50); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    position: fixed;
    height: 100%;
    width: 100%;
  }
</style>
