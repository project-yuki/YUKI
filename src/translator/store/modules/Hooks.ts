import { ipcRenderer } from 'electron'
import { Commit, Dispatch } from 'vuex'
import IpcTypes from '../../../common/IpcTypes'
import MecabMiddleware from '../../../main/middlewares/MeCabMiddleware'

const MAX_STORE_COUNT = 16

const hooksState: Yagt.TranslatorHookState = {
  isMecabEnable: false,
  hookInfos: [],
  texts: {},
  patterns: {},
  toDisplayHookCode: '',
  currentDisplayHookIndex: -1,
  translationsForCurrentIndex: {
    original: '',
    translations: {}
  }
}

const getters = {
  getTextById: (state: Yagt.TranslatorHookState) => (id: number): string[] => {
    return state.texts[id.toString()]
  },
  getLastTextById: (state: Yagt.TranslatorHookState) => (
    id: number
  ): string => {
    if (!state.texts[id.toString()]) return ''

    return state.texts[id.toString()][state.texts[id.toString()].length - 1]
  },
  getLastPatternsById: (state: Yagt.TranslatorHookState) => (
    id: number
  ): Yagt.MeCabPatterns => {
    if (!state.patterns[id.toString()]) return []

    return state.patterns[id.toString()][
      state.patterns[id.toString()].length - 1
    ]
  }
}

const mutations = {
  ADD_HOOK (
    state: Yagt.TranslatorHookState,
    payload: { hook: Yagt.TextThread }
  ) {
    state.hookInfos.push(payload.hook)
    state.texts = { ...state.texts, [payload.hook.handle.toString()]: [] }
    state.patterns = {
      ...state.patterns,
      [payload.hook.handle.toString()]: []
    }
  },
  SET_HOOK_TEXT (
    state: Yagt.TranslatorHookState,
    payload: { hookNum: number; text: string }
  ) {
    const texts = state.texts[payload.hookNum.toString()]
    texts.push(payload.text)
    if (state.texts[payload.hookNum.toString()].length > MAX_STORE_COUNT) {
      state.texts[payload.hookNum.toString()].shift()
    }
  },
  SET_HOOK_PATTERNS (
    state: Yagt.TranslatorHookState,
    payload: { hookNum: number; patterns: Yagt.MeCabPatterns }
  ) {
    const patterns = state.patterns[payload.hookNum.toString()]
    patterns.push(payload.patterns)
    if (state.patterns[payload.hookNum.toString()].length > MAX_STORE_COUNT) {
      state.patterns[payload.hookNum.toString()].shift()
    }
  },
  CHOOSE_HOOK_AS_DISPLAY (
    state: Yagt.TranslatorHookState,
    payload: { hookNum: number }
  ) {
    state.currentDisplayHookIndex = payload.hookNum
  },
  INIT_DISPLAY_HOOK (
    state: Yagt.TranslatorHookState,
    payload: { code: string }
  ) {
    state.toDisplayHookCode = payload.code
  },
  SET_TRANSLATION (
    state: Yagt.TranslatorHookState,
    payload: { translations: Yagt.Translations }
  ) {
    state.translationsForCurrentIndex = payload.translations
  },
  MERGE_TRANSLATION (
    state: Yagt.TranslatorHookState,
    payload: { translation: Yagt.Translations['translations'] }
  ) {
    for (const key in payload.translation) {
      state.translationsForCurrentIndex.translations = {
        ...state.translationsForCurrentIndex.translations,
        [key]: payload.translation[key]
      }
    }
  },
  CLEAR_TRANSLATION (state: Yagt.TranslatorHookState) {
    const translations = state.translationsForCurrentIndex.translations
    for (const key in translations) {
      translations[key] = '...'
    }
  },
  SET_MECAB_ENABLE (
    state: Yagt.TranslatorHookState,
    payload: { enable: boolean }
  ) {
    state.isMecabEnable = payload.enable
  }
}

const actions = {
  addHook (
    { commit, state }: { commit: Commit; state: Yagt.TranslatorHookState },
    hook: Yagt.TextThread
  ) {
    commit('ADD_HOOK', { hook })
    if (hook.code.toLowerCase() === state.toDisplayHookCode.toLowerCase()) {
      commit('CHOOSE_HOOK_AS_DISPLAY', { hookNum: hook.handle })
      commit('INIT_DISPLAY_HOOK', { code: '' })
    }
  },
  setHookTextOrPatterns (
    {
      dispatch,
      commit,
      state
    }: { dispatch: Dispatch; commit: Commit; state: Yagt.TranslatorHookState },
    { hook, text }: { hook: Yagt.TextThread; text: string }
  ) {
    const commonActions = () => {
      if (!state.isMecabEnable && MecabMiddleware.isMeCabString(text)) {
        commit('SET_MECAB_ENABLE', { enable: true })
      }

      let originalText
      if (state.isMecabEnable) {
        const patterns = MecabMiddleware.stringToObject(text)
        commit('SET_HOOK_PATTERNS', {
          hookNum: hook.handle,
          patterns
        })
        originalText = MecabMiddleware.objectToOriginalText(patterns)
        commit('SET_HOOK_TEXT', { hookNum: hook.handle, text: originalText })
      } else {
        commit('SET_HOOK_TEXT', { hookNum: hook.handle, text })
      }
      if (state.currentDisplayHookIndex === hook.handle) {
        commit('CLEAR_TRANSLATION')
        if (state.isMecabEnable) {
          ipcRenderer.send(IpcTypes.REQUEST_TRANSLATION, originalText)
        } else {
          ipcRenderer.send(IpcTypes.REQUEST_TRANSLATION, text)
        }
      }
    }
    if (state.hookInfos.find((h) => h.handle === hook.handle) === undefined) {
      dispatch('addHook', hook).then(() => {
        commonActions()
      })
    } else {
      commonActions()
    }
  },
  setTranslation (
    { commit }: { commit: Commit },
    translations: Yagt.Translations
  ) {
    commit('SET_TRANSLATION', { translations })
  },
  mergeTranslation (
    { commit }: { commit: Commit },
    translation: Yagt.Translations['translations']
  ) {
    commit('MERGE_TRANSLATION', { translation })
  },
  chooseHookAsDisplay ({ commit }: { commit: Commit }, hookNum: number) {
    commit('CHOOSE_HOOK_AS_DISPLAY', { hookNum })
  }
}

export default {
  state: hooksState,
  getters,
  mutations,
  actions
}
