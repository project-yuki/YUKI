import { Commit } from "vuex";

const state: Yagt.TranslatorViewState = {
  isButtonsShown: true
};

const mutations = {
  SET_BUTTONS_SHOWN(
    state: Yagt.TranslatorViewState,
    payload: { value: boolean }
  ) {
    state.isButtonsShown = payload.value;
  }
};

const actions = {
  setButtonsShown({ commit }: { commit: Commit }, value: boolean) {
    commit("SET_BUTTONS_SHOWN", { value });
  }
};

export default {
  state,
  mutations,
  actions
};
