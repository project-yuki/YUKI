const debug = require("debug")("yagt:rendererWindow");
import { Commit } from "vuex";

const state: Yagt.ConfigState = {
  default: {},
  games: []
};

const mutations = {
  SET_CONFIG(state: Yagt.ConfigState, payload: { name: string; cfgs: any }) {
    switch (payload.name) {
      case "default":
        state.default = payload.cfgs;
        break;
      case "games":
        state.games = payload.cfgs;
        break;
      default:
        debug("invalid config name: %s", payload.name);
        break;
    }
  }
};

const actions = {
  setConfig(
    { commit }: { commit: Commit },
    { name, cfgs }: { name: string; cfgs: any }
  ) {
    commit("SET_CONFIG", { name, cfgs });
    if (name === "games" && cfgs.length === 0) {
      commit("Gui/SET_NO_GAME", { value: true }, { root: true });
    } else {
      commit("Gui/SET_NO_GAME", { value: false }, { root: true });
    }
  }
};

export default {
  state,
  mutations,
  actions
};
