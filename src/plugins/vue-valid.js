(function () {
  var vue // lazy bind

  var validator = {
    created: function () {
      if (!vue) {
        console.warn('[vue-data-validator] not installed!')
        return
      }
    },
    computed: {
      $vd: function () {
        let obj = this.$options.validator.call(this)
        if (!this.$options.validator) {
          return true
        }

        for (var type in obj) {
          if (type.indexOf('$') !== '0') {
            let o = obj[type]
            o.$valid = (function () {
              for (var key in o) {
                if (!o[key]) return false
                else if (typeof o[key] === 'object' && !o[key].valid) return false
              }
              return true
            })()
          }
        }

        obj.$percent = (function () {
          let count = 0
          for (var type in obj) {
            if (obj[type].$valid) ++count
          }
          return count / Object.keys(obj).length
        })()

        obj.$valid = (function () {
          for (var type in obj) {
            if (!obj[type].$valid && type.indexOf('$') !== 0) return false
          }
          return true
        })()

        let debug = false
        debug ? console.log(obj) : ''
        return obj
      }
    }
  }

  var api = {
    mixin: validator,
    install: function (Vue, options) {
      vue = Vue
      Vue.options = Vue.util.mergeOptions(Vue.options, validator)
    }
  }

  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = api
  } else if (typeof window !== 'undefined') {
    window.VueDataValidator = api
  }
})()

