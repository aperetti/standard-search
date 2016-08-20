<template>
  <!-- MODAL -->
  <div v-if='dim' class='modal-dim'></div>
  <div class="col-xs-12 col-md-4">
    <div class="modal fade in" tabindex="-1" role="dialog" style='display:block; padding-top: 100px;'>
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
            <button type="button" class="btn btn-primary" @click='submit' @keyup.enter='submit'><slot name='button'>Button</slot></button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
  </div>
</template>

<script>
  import {closeModals} from 'src/vuex/actions'
  export default {
    props: {
      dim: {
        type: 'Boolean',
        default: true
      }
    },
    vuex: {
      actions: {
        closeModals
      }
    },
    methods: {
      close () {
        this.closeModals()
      },
      submit () {
        this.$emit('submit')
        this.closeModals()
      }
    }
  }
</script>

<style scoped>
.modal-dim {
  height: 100%;
  width: 100%;
  top: 0%;
  right: 0%;
  position:fixed;
  z-index:1000;
  background-color:black;
  filter: alpha(opacity=50); /* internet explorer */
  -khtml-opacity: 0.50;      /* khtml, old safari */
    -moz-opacity: 0.50;      /* mozilla, netscape */
          opacity: 0.50;      /* fx, safari, opera */
}

</style>