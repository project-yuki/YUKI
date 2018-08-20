import { ipcRenderer } from 'electron'
import ipcTypes from '../../../common/ipcTypes'
import Vue from 'vue'

const state = {
  hookInfos: [],
  texts: {},
  currentDisplayHookIndex: -1
}

const mutations = {
  ADD_HOOK (state, payload) {
    state.hookInfos.push(payload.hook)
    state.texts = Object.assign({}, state.texts, {
      [payload.hook.num]: []
    })
  },
  REMOVE_HOOK (state, payload) {
    state.hookInfos = state.hookInfos.filter((h) => h.num !== payload.hook.num)
    Vue.delete(state.texts, payload.hook.num)
  },
  SET_HOOK_TEXT (state, payload) {
    state.texts[payload.hookNum].push(payload.text)
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
  setHookText ({ dispatch, commit, state }, { hook, text }) {
    if (state.hookInfos.find(h => h.num === hook.num) === undefined) {
      return dispatch('addHook', hook).then(() => {
        commit('SET_HOOK_TEXT', { hookNum: hook.num, text })
      })
    } else {
      commit('SET_HOOK_TEXT', { hookNum: hook.num, text })
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
