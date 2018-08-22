import { ipcRenderer } from 'electron'
import ipcTypes from '../../../common/ipcTypes'
import Vue from 'vue'
import { TextThread } from '../../../common/hooker'

export interface Texts {
  [num: number]: string[]
}

interface HooksState {
  hookInfos: TextThread[]
  texts: Texts
  currentDisplayHookIndex: number
}

interface HooksMutations {
  ADD_HOOK: (state: HooksState, payload: { hook: TextThread }) => void
  REMOVE_HOOK: (state: HooksState, payload: { hook: TextThread }) => void
  SET_HOOK_TEXT: (state: HooksState, payload: { hookNum: number, text: string }) => void
  CHOOSE_HOOK_AS_DISPLAY: (state: HooksState, payload: { hookNum: number }) => void
}

const state: HooksState = {
  hookInfos: [],
  texts: {},
  currentDisplayHookIndex: -1
}

const mutations: HooksMutations = {
  ADD_HOOK (state, payload) {
    state.hookInfos.push(payload.hook)
    state.texts = {...state.texts, [payload.hook.num]: []}
  },
  REMOVE_HOOK (state, payload) {
    state.hookInfos = state.hookInfos.filter((h) => h.num !== payload.hook.num)
    Vue.delete((<any>state.texts), payload.hook.num)
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
  setHookText ({ dispatch, commit, state }, { hook, text }: { hook : TextThread, text: string}) {
    if (state.hookInfos.find(h => h.num === hook.num) === undefined) {
      dispatch('addHook', hook).then(() => {
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
