<template>
  <!-- MODAL -->
  <div class="col-xs-12 col-md-4">
    <transition name='roll-down'>
    <div class="modal" tabindex="-1" role="dialog" style='display:block; padding-top: 100px;' v-if="dim">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class='close'  @click='close' data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title"><slot name='title'>Title</slot></h4>
          </div>
          <div class="modal-body">
            <slot name='body'>Body</slot>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default"  @click='close' data-dismiss="modal">Cancel</button>
            <button v-if="!hideSubmit" type="button" class="btn btn-primary" @click='submit'><slot name='button'>Button</slot></button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    </transition>
  </div>

</template>

<script>
  export default {
    props: ['dim', 'hideSubmit'],
    methods: {
      close () {
        this.$emit('close')
      },
      submit () {
        this.$emit('submit')
      }
    }
  }
</script>

<style scoped>
.roll-down-enter-active, .roll-down-leave-active {
  transition: all 0.2s ease
}
 .roll-down-leave-active {
  opacity: 0;
}
.roll-down-enter {
  opacity: 0;
}
</style>