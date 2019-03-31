const debug = require('debug')('yagt:config')
import { Commit } from 'vuex'

const configState: any = {
  default: {},
  games: [],
  librariesBaseStorePath: ''
}

const mutations = {
  SET_CONFIG (state: Yagt.ConfigState, payload: { name: string; cfgs: any }) {
    switch (payload.name) {
      case 'default':
        state.default = payload.cfgs
        break
      case 'games':
        state.games = payload.cfgs
        break
      case 'librariesBaseStorePath':
        state.librariesBaseStorePath = payload.cfgs
        break
      default:
        debug('invalid config name: %s', payload.name)
        break
    }
  }
}

const actions = {
  setConfig (
    { commit }: { commit: Commit },
    { name, cfgs }: { name: string; cfgs: any }
  ) {
    debug('[%s] get from main process -> %O', name, cfgs)
    commit('SET_CONFIG', { name, cfgs })
    if (name === 'games') {
      if (cfgs.length === 0) {
        commit('Gui/SET_NO_GAME', { value: true }, { root: true })
      } else {
        commit('Gui/SET_NO_GAME', { value: false }, { root: true })
      }
    }
  }
}

export default {
  state: configState,
  mutations,
  actions
}
