import Vue from 'vue'
import * as Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex as any)

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
