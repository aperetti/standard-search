import bus from '../bus'

export const toggle = {
  methods: {
    toggle (arg, time) {
      var temp = !this.$get(arg)
      bus.emit('page-reset', this.$options.name)
      setTimeout(() => {
        this.$set(arg, temp)
      }, time)
    }
  }
}
