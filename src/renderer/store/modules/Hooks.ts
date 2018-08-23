import { ipcRenderer } from "electron";
import ipcTypes from "../../../common/ipcTypes";
import Vue from "vue";
import { Commit, Dispatch } from "vuex";

const state: HooksState = {
  hookInfos: [],
  texts: {},
  currentDisplayHookIndex: -1
};

const getters = {
  getTextById: (state: HooksState) => (id: number) => {
    return state.texts[id.toString()];
  }
};

const mutations = {
  ADD_HOOK(state: HooksState, payload: { hook: TextThread }) {
    state.hookInfos.push(payload.hook);
    state.texts = { ...state.texts, [payload.hook.num.toString()]: [] };
  },
  REMOVE_HOOK(state: HooksState, payload: { hook: TextThread }) {
    state.hookInfos = state.hookInfos.filter(h => h.num !== payload.hook.num);
    Vue.delete(state.texts, payload.hook.num.toString());
  },
  SET_HOOK_TEXT(state: HooksState, payload: { hookNum: number; text: string }) {
    state.texts[payload.hookNum.toString()].push(payload.text);
  },
  CHOOSE_HOOK_AS_DISPLAY(state: HooksState, payload: { hookNum: number }) {
    state.currentDisplayHookIndex = payload.hookNum;
  }
};

const actions = {
  addHook({ commit }: { commit: Commit }, hook: TextThread) {
    commit("ADD_HOOK", { hook });
  },
  removeHook({ commit }: { commit: Commit }, hook: TextThread) {
    commit("REMOVE_HOOK", { hook });
  },
  setHookText(
    {
      dispatch,
      commit,
      state
    }: { dispatch: Dispatch; commit: Commit; state: HooksState },
    { hook, text }: { hook: TextThread; text: string }
  ) {
    if (state.hookInfos.find(h => h.num === hook.num) === undefined) {
      dispatch("addHook", hook).then(() => {
        commit("SET_HOOK_TEXT", { hookNum: hook.num, text });
      });
    } else {
      commit("SET_HOOK_TEXT", { hookNum: hook.num, text });
    }
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
