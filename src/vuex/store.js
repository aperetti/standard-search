import Vue from 'vue'
import Vuex from 'vuex'
import standard from './modules/standard'
import modals from './modules/modals'
import alerts from './modules/alerts'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    standard,
    modals,
    alerts
  },
  strict: debug
})
