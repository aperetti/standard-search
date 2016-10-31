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
        if (!this.$options.validator) {
          return true
        }
        let validation = this.$options.validator.call(this)
        // Will check each validation group and make sure all of the $valid rules
        // are upheld. If the validation group starts with '$' they will be ignored
        // $valid wil be a reflect of the validation group (i.e. if any are false $valid == false).
        // If the warning flag is set on one of the validation items, then that rule will not cause $valid to fail.
        for (var group in validation) {
          if (group.indexOf('$') !== '0') {
            let vgroup = validation[group]
            vgroup.$valid = (function () {
              for (var key in vgroup) {
                if (!vgroup[key]) return false
                else if (typeof vgroup[key] === 'object' && !vgroup[key].valid && !vgroup[key].warning) return false
              }
              return true
            })()
          }
        }

        validation.$percent = (function () {
          let count = 0
          for (var type in validation) {
            if (validation[type].$valid) ++count
          }
          return count / Object.keys(validation).length
        })()

        validation.$valid = (function () {
          for (var type in validation) {
            if (!validation[type].$valid && type.indexOf('$') !== 0) return false
          }
          return true
        })()

        let debug = false
        debug ? console.log(validation) : ''
        return validation
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

