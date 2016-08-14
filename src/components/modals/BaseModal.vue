<template>
  <!-- MODAL -->
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
            <slot name='button'><button type="button" class="btn btn-primary" @click='close' @keyup.enter='close'>Button</button></slot>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
  </div>
</template>

<script>
  import {setCreateProject} from 'src/vuex/actions'
  export default {
    vuex: {
      actions: {
        setCreateProject
      }
    },
    methods: {
      close () {
        this.setCreateProject(false)
      }
    }
  }
</script>

<style scoped>
.affix {
  top: 50px;
  width:100%;
}
.navbar {
  border-radius: 0px;
}
.filler{
  min-height: 2000px;
}

.navbar-form {
   padding-left: 0;
}

.navbar-collapse{
   padding-left:0; 
}
.cursor {
    cursor: pointer;
  }
.navbar-toggle {
  margin-top: 12px;
  padding: 9px 12px;
}

.navbar-toggle:hover {
    background-color: #808080;
}
.caret-mod {
    display: block;
    width: 0;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-top: 8px dashed;
    border-top: 8px solid;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
}
</style>