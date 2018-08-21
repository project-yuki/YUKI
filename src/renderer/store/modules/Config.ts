import logger from '../../../common/logger'

const state = {
  default: {},
  games: {}
}

const mutations = {
  SET_CONFIG (state, payload) {
    switch (payload.name) {
      case 'default':
        state.default = {...state.default, ...payload.cfgs}
        break;
      case 'games':
        state.games = {...state.games, ...payload.cfgs}
        break;
      default:
        logger.error(`invalid config name: ${payload.name}`)
        break;
    }
  }
}

const actions = {
  setConfig ({ commit }, { name, cfgs }) {
    commit('SET_CONFIG', { name, cfgs })
  }
}

export default {
  state,
  mutations,
  actions
}
