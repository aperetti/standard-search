import bus from 'src/bus'
import * as types from 'src/vuex/mutation-types'

export const togglers = {
  methods: {
    toggle (arg, time, pId, evt) {
      var event = this.$event || evt
      var next = !this[arg]

      // Check if clicked element causing the blur, contains a specific ID string (pId)
      // if it does then don't toggle the menu
      if (event && pId) {
        if (event.relatedTarget && event.relatedTarget.id.indexOf(pId) !== -1) {
          return
        }
      }

      var blur = (event) => {
        var el = event.srcElement
        while (el.parentNode) {
          el = el.parentNode
          if (el.className && el.className.indexOf('dropdown open') !== -1) {
            return
          }
        }
        this[arg] = false
        window.document.removeEventListener('click', blur)
      }

      bus.emit('page-reset', this.$options.name, !next)

      setTimeout(() => {
        this[arg] = next
        if (next) {
          window.document.addEventListener('click', blur)
        }
      }, time + 50)
    },
    toggleDown (arg, time, pId, evt) {
      var event = this.$event || evt
      // Check if clicked element causing the blur, contains a specific ID string (pId)
      // if it does then don't toggle the menu
      if (event && pId) {
        if (event.relatedTarget && event.relatedTarget.id.indexOf(pId) !== -1) {
          return
        }
      }

      setTimeout(() => {
        this[arg] = false
      }, time + 50)
    }
  }
}

export const modals = {
  vuex: {
    actions: {
      openCreateProject: ({dispatch}) => dispatch(types.SET_CREATEPROJECT, true),
      closeCreateProject: ({dispatch}) => dispatch(types.SET_CREATEPROJECT, false)
    }
  }
}

