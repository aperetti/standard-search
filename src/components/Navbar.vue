<template>
 <nav class="navbar-default navbar-fixed-top" role="navigation">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" @click="open = !open">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>
    <div class="{{ open ? 'navbar collapse-in' : 'navbar collapse'}}"> 
      <ul class="nav navbar-nav">
        <li><a @click.prevent='proccessLogout'>Logout</a></li>
      </ul>
      <form class="navbar-form">
        <div class="form-group" style="display:inline;">
          <div class="input-group" style="display:table;">
            <span class="input-group-addon" style="width:1%;"><span class="glyphicon glyphicon-search"></span></span>
            <search></search>
          </div>
        </div>
      </form>
      </form>
    </div>
  </nav>
</template>

<script>
  import {logout} from '../vuex/actions'
  import Search from './Search'
  export default {
    components: {
      Search
    },
    data () {
      return {open: false}
    },
    vuex: {
      actions: {
        logout
      }
    },
    methods: {
      proccessLogout: function () {
        this.logout()
        this.$route.router.go('/login')
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
</style>
