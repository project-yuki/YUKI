import { Commit } from 'vuex'

const viewState: yuki.TranslatorViewState = {
  isButtonsShown: true,
  isWindowTooHigh: false,
  pauseNewText: false,
  dict: {},
  isGetDictResult: false
}

const mutations = {
  SET_BUTTONS_SHOWN (
    state: yuki.TranslatorViewState,
    payload: { value: boolean }
  ) {
    state.isButtonsShown = payload.value
  },
  SET_WINDOW_TOO_HIGH (
    state: yuki.TranslatorViewState,
    payload: { value: boolean }
  ) {
    state.isWindowTooHigh = payload.value
  },
  SET_PAUSE_NEW_TEXT (
    state: yuki.TranslatorViewState,
    payload: { value: boolean }
  ) {
    state.pauseNewText = payload.value
  },
  SET_DICT (
    state: yuki.TranslatorViewState,
    payload: { value: yuki.DictResult }
  ) {
    state.dict = payload.value
    state.isGetDictResult = true
  },
  CLEAR_DICT (
    state: yuki.TranslatorViewState
  ) {
    state.isGetDictResult = false
  }
}

const actions = {
  setButtonsShown ({ commit }: { commit: Commit }, value: boolean) {
    commit('SET_BUTTONS_SHOWN', { value })
  },
  setWindowTooHigh ({ commit }: { commit: Commit }, value: boolean) {
    commit('SET_WINDOW_TOO_HIGH', { value })
  },
  setPauseNewText ({ commit }: { commit: Commit }, value: boolean) {
    commit('SET_PAUSE_NEW_TEXT', { value })
  },
  setDict ({ commit }: { commit: Commit }, value: yuki.DictResult) {
    commit('SET_DICT', { value })
  },
  clearDict ({ commit }: { commit: Commit }) {
    commit('CLEAR_DICT')
  }
}

export default {
  state: viewState,
  mutations,
  actions
}
