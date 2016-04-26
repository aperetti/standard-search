import Vue from 'vue'
import Vuex from 'vuex'
import standard from './modules/standard'

Vue.use(Vuex)
Vue.config.debug = true

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    standard
  },
  strict: debug
})
