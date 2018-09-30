import { Commit } from "vuex";
import TranslationManager from "../../../main/translate/translationManager";

const state: Yagt.ConfigState = {
  default: {},
  games: []
};

const mutations = {
  SET_CONFIG(state: Yagt.ConfigState, payload: { cfgs: any }) {
    state.default = payload.cfgs;
    TranslationManager.getInstance().initialize(payload.cfgs.onlineApis);
  }
};

const actions = {
  setConfig({ commit }: { commit: Commit }, cfgs: any) {
    commit("SET_CONFIG", { cfgs });
  }
};

export default {
  state,
  mutations,
  actions
};
