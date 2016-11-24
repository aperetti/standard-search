<template>
  <!-- MODAL -->
  <div class="col-xs-8 col-md-3">
    <transition name='roll-down'>
    <div v-show="show" class="modal" tabindex="-1" role="dialog" style='display:block; padding-top: 100px;'>
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <img src="~src/assets/ring-alt108.svg"></img>
          <h4><slot></slot></h4>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    </transition>
  </div>

</template>

<script>
  export default {
    props: ['show']
  }
</script>

<style scoped>
.roll-down-enter-active, .roll-down-leave-active {
  transition: all 0.5s ease
}
 .roll-down-leave-active {
  opacity: 0;
}
.roll-down-enter {
  opacity: 0;
}
</style>