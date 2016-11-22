<template>
  <div class="login-bg">
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
            <transition name="fafa">
              <div v-show='failed' class='alert alert-danger'>
                {{message}}
              </div>
            </transition>
          </form>
        </div>
      </div>
  </div>
</template>

<script>
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
    methods: {
      processLogin: function () {
        this.loading = true
        getToken(this.username, this.password).then((response) => {
          this.$store.dispatch('login', response)
          this.password = ''
          this.loading = false
          this.$router.push({name: 'landing'})
        }, (response) => {
          this.password = ''
          this.failed = true
          this.loading = false
          this.message = response.data.message ? response.data.message : this.message
          window.setTimeout(() => {
            this.failed = false
          }, 3000)
        })
      },
      logout: function () {
        this.$store.dispatch('logout')
      }
    }
  }
</script>

<style scoped>
  .logo {
    width: 80%;
    max-width: 250px;
    max-height: 350px;
    margin-bottom: 25px;
  }

  .fafa-enter-active {
    transition: all .3s ease;
    opacity: 1;
  }
  .fafa-leave-active {
    transition: all .3s ease;
    opacity: 0;
  }
  .well {
    background-color: rgba(254,254,254,.65);
  }
  .login-bg {
    position: absolute;
    -webkit-transform: translate3d(0,0,0);
    width: 100%;
    height: 100%;
    background: #bdc3c7; /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #bdc3c7 , #2c3e50); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #bdc3c7 , #2c3e50); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
</style>
