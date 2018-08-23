import logger from "../../../common/logger";
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
        logger.error(`invalid config name: ${payload.name}`);
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
  }
};

export default {
  state,
  mutations,
  actions
};
