import Vue from "vue";
import { Commit, Dispatch } from "vuex";
import { ipcRenderer } from "electron";
import ipcTypes from "../../../common/ipcTypes";

const state: Yagt.TranslatorHookState = {
  hookInfos: [],
  texts: {},
  currentDisplayHookIndex: -1,
  translationsForCurrentIndex: {
    original: "",
    translations: {}
  }
};

const getters = {
  getTextById: (state: Yagt.TranslatorHookState) => (id: number) => {
    return state.texts[id.toString()];
  }
};

const mutations = {
  ADD_HOOK(
    state: Yagt.TranslatorHookState,
    payload: { hook: Yagt.TextThread }
  ) {
    state.hookInfos.push(payload.hook);
    state.texts = { ...state.texts, [payload.hook.num.toString()]: [] };
  },
  REMOVE_HOOK(
    state: Yagt.TranslatorHookState,
    payload: { hook: Yagt.RemovedTextThread }
  ) {
    state.hookInfos = state.hookInfos.filter(h => h.num !== payload.hook.num);
    Vue.delete(state.texts, payload.hook.num.toString());
  },
  SET_HOOK_TEXT(
    state: Yagt.TranslatorHookState,
    payload: { hookNum: number; text: string }
  ) {
    state.texts[payload.hookNum.toString()].push(payload.text);
  },
  CHOOSE_HOOK_AS_DISPLAY(
    state: Yagt.TranslatorHookState,
    payload: { hookNum: number }
  ) {
    state.currentDisplayHookIndex = payload.hookNum;
  },
  SET_TRANSLATION(
    state: Yagt.TranslatorHookState,
    payload: { translations: Yagt.Translations }
  ) {
    state.translationsForCurrentIndex = payload.translations;
  },
  MERGE_TRANSLATION(
    state: Yagt.TranslatorHookState,
    payload: { translation: Yagt.Translations["translations"] }
  ) {
    for (let key in payload.translation) {
      state.translationsForCurrentIndex.translations = {
        ...state.translationsForCurrentIndex.translations,
        ...{ [key]: payload.translation[key] }
      };
    }
  },
  CLEAR_TRANSLATION(state: Yagt.TranslatorHookState) {
    let translations = state.translationsForCurrentIndex.translations;
    for (let key in translations) {
      translations[key] = "...";
    }
  }
};

const actions = {
  addHook({ commit }: { commit: Commit }, hook: Yagt.TextThread) {
    commit("ADD_HOOK", { hook });
  },
  removeHook({ commit }: { commit: Commit }, hook: Yagt.RemovedTextThread) {
    commit("REMOVE_HOOK", { hook });
  },
  setHookText(
    {
      dispatch,
      commit,
      state
    }: { dispatch: Dispatch; commit: Commit; state: Yagt.HooksState },
    { hook, text }: { hook: Yagt.TextThread; text: string }
  ) {
    let commonActions = () => {
      commit("SET_HOOK_TEXT", { hookNum: hook.num, text });
      if (state.currentDisplayHookIndex === hook.num) {
        commit("CLEAR_TRANSLATION");
        ipcRenderer.send(ipcTypes.REQUEST_TRANSLATION, text);
      }
    };
    if (state.hookInfos.find(h => h.num === hook.num) === undefined) {
      dispatch("addHook", hook).then(() => {
        commonActions();
      });
    } else {
      commonActions();
    }
  },
  setTranslation(
    { commit }: { commit: Commit },
    translations: Yagt.Translations
  ) {
    commit("SET_TRANSLATION", { translations });
  },
  mergeTranslation(
    { commit }: { commit: Commit },
    translation: Yagt.Translations["translations"]
  ) {
    commit("MERGE_TRANSLATION", { translation });
  },
  chooseHookAsDisplay({ commit }: { commit: Commit }, hookNum: number) {
    commit("CHOOSE_HOOK_AS_DISPLAY", { hookNum });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
