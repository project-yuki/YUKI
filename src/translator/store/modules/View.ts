import { Commit } from 'vuex'

const viewState: yuki.TranslatorViewState = {
  isButtonsShown: true,
  pauseNewText: false
}

const mutations = {
  SET_BUTTONS_SHOWN (
    state: yuki.TranslatorViewState,
    payload: { value: boolean }
  ) {
    state.isButtonsShown = payload.value
  },
  SET_PAUSE_NEW_TEXT (
    state: yuki.TranslatorViewState,
    payload: { value: boolean }
  ) {
    state.pauseNewText = payload.value
  }
}

const actions = {
  setButtonsShown ({ commit }: { commit: Commit }, value: boolean) {
    commit('SET_BUTTONS_SHOWN', { value })
  },
  setPauseNewText ({ commit }: { commit: Commit }, value: boolean) {
    commit('SET_PAUSE_NEW_TEXT', { value })
  }
}

export default {
  state: viewState,
  mutations,
  actions
}
