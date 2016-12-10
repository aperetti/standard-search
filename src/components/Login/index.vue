<template>
  <div class="login-bg container-fluid">
    <div class='row'>
    <div class='col-xs-12' style='padding-left: 0px; padding-right: 0px;'>
      <div style="background-color: #000; opacity: .4; padding:5px;"><b style="font-size: 16px; color: #fff;">-Standards</b></div>
    </div>
    </div>
    <div class='row'>
      <div class='col-xs-12 col-sm-4 col-sm-offset-4' style='padding:20px;'>
        <div class='well'>
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
            <transition name="roll-down">
              <div v-show='failed' class='alert alert-danger'>
                {{message}}
              </div>
            </transition>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getToken} from 'src/api/auth'
  
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
          this.$router.push({name: 'landing'})
          this.password = ''
          this.loading = false
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
.roll-down-enter-active, .roll-down-leave-active {
  transition: all 0.2s ease
}
 .roll-down-leave-active {
  opacity: 0;
  transform: translateY(-30px) scaleY(0);
}
.roll-down-enter {
  transform: translateY(-30px) scaleY(0);

}
.well {
  background-color: rgba(254,254,254,.65);
  max-height: 175px;
}
.login-bg {
  position: relative;
  min-height: 100%;
  -webkit-transform: translate3d(0,0,0);
  background: #bdc3c7; /* fallback for old browsers */
  background: -webkit-linear-gradient(to left, #bdc3c7 , #2c3e50); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to left, #bdc3c7 , #2c3e50); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
