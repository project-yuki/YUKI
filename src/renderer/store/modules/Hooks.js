import { ipcRenderer } from 'electron'
import ipcTypes from '../../../common/ipcTypes'
import Vue from 'vue'

const state = {
  hooks: [],
  currentDisplayHookIndex: -1
}

const mutations = {
  ADD_HOOK (state, payload) {
    //console.log(`ADD_HOOK: ${JSON.stringify(payload.hook)}`)
    state.hooks.push(payload.hook)
    Vue.set(
      state.hooks, 
      state.hooks.findIndex(hook => hook.num === payload.hook.num),
      Object.assign({}, payload.hook, {text: ''})
    )
  },
  REMOVE_HOOK (state, payload) {
    ipcRenderer.send(ipcTypes.REMOVE_HOOK, payload.hook)
    state.hooks = state.hooks.filter((h) => h.num !== payload.hook.num)
  },
  GET_HOOK_TEXT (state, payload) {
    //console.log(`GET_HOOK_TEXT: ${payload.hookNum}: ${payload.text}`)
    let index = state.hooks.findIndex(hook => hook.num === payload.hookNum)
    Vue.set(
      state.hooks,
      index,
      Object.assign({}, state.hooks[index], {
        text: `${state.hooks[index].text}${payload.text}`
      })
    )
  },
  CHOOSE_HOOK_AS_DISPLAY (state, payload) {
    state.currentDisplayHookIndex = payload.hookNum
  }
}

const actions = {
  addHook ({ commit }, hook) {
    commit('ADD_HOOK', { hook })
  },
  removeHook ({ commit }, hook) {
    commit('REMOVE_HOOK', { hook })
  },
  getHookText ({ dispatch, commit, state }, { hook, text }) {
    if (state.hooks.find(h => h.num === hook.num) === undefined) {
      return dispatch('addHook', hook).then(() => {
        commit('GET_HOOK_TEXT', { hookNum: hook.num, text })
      })
    } else {
      commit('GET_HOOK_TEXT', { hookNum: hook.num, text })
    }
  },
  chooseHookAsDisplay ({ commit }, hookNum) {
    commit('CHOOSE_HOOK_AS_DISPLAY', { hookNum })
  }
}

export default {
  state,
  mutations,
  actions
}
