import { Commit } from "vuex";
const debug = require("debug")("yagt:translatorWindow");
import { ipcRenderer } from "electron";
import ipcTypes from "../../../common/ipcTypes";

const state: Yagt.TranslatorConfigState = {
  default: {},
  game: {
    name: "",
    code: "",
    path: "",
    localeChanger: ""
  },
  gui: {
    originalText: {
      fontSize: 0,
      color: ""
    },
    translationText: {
      fontSize: 0,
      color: ""
    }
  }
};

const mutations = {
  SET_CONFIG(
    state: Yagt.TranslatorConfigState,
    payload: { name: string; cfgs: any }
  ) {
    switch (payload.name) {
      case "default":
        state.default = payload.cfgs;
        break;
      case "game":
        state.game = payload.cfgs;
        break;
      case "gui":
        state.gui = payload.cfgs.translatorWindow;
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
    if (name === "game") {
      commit("Hooks/INIT_DISPLAY_HOOK", { code: cfgs.code }, { root: true });
      ipcRenderer.send(ipcTypes.REQUEST_INSERT_HOOK, cfgs.code);
    }
  }
};

export default {
  state,
  mutations,
  actions
};
