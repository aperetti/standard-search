<template>
  <div class="container alert-container">  
    <transition-group name="slide-fade">
      <div class="row" v-for="(alert, index) in alerts" v-bind:key="alert">
          <div clas="col-sm-8 col-md-4 col-md-offset-6" >
            <alert :message="alert.message" :type="alert.type" :id="alert.id" />
          </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import Alert from './Alert'
export default {
  components: {
    Alert
  },
  computed: {
    alerts () {
      return this.$store.state.alerts
    }
  }
}
</script>

<style scoped>

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-active {
  transform: translateX(20px);
  opacity: 0;
}
.alert-container {
  position: absolute;
  float: bottom; 
  bottom: 75px;
  z-index: 10;
  left: 50px;
  right: 50px;
}
</style>