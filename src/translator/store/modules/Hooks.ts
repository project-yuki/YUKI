import { ipcRenderer } from 'electron'
import { Commit, Dispatch } from 'vuex'
import IpcTypes from '../../../common/IpcTypes'
import MecabMiddleware from '../../../main/middlewares/MeCabMiddleware'

const MAX_STORE_COUNT = 16

const hooksState: yuki.TranslatorHookState = {
  isMecabEnable: false,
  hookInfos: [],
  texts: {},
  patterns: {},
  toDisplayHookCode: '',
  currentDisplayHookIndex: -1,
  translations: {}
}

const getters = {
  getTextsByHandle: (state: yuki.TranslatorHookState) =>
    (handle: number): {[id: number]: string} => {
      if (!state.texts[handle.toString()]) return {}

      return state.texts[handle.toString()]
    },
  getLastTextByHandle: (state: yuki.TranslatorHookState, _getter: any) =>
    (handle: number): string => {
      if (!state.texts[handle.toString()]) return ''
      return state.texts[handle.toString()][
        _getter.getLastIndexByHandle(handle)
      ]
    },
  getLastIndexByHandle: (state: yuki.TranslatorHookState) =>
    (handle: number): number => {
      if (!state.texts[handle.toString()]) return -1

      return state.texts[handle.toString()].length - 1
    },
  getTextByHandleAndId: (state: yuki.TranslatorHookState) => (
    handle: number, id: number
  ): string => {
    if (!state.texts[handle.toString()]) return ''
    if (!state.texts[handle.toString()][id]) return ''

    return state.texts[handle.toString()][id]
  },
  getPatternsByHandleAndId: (state: yuki.TranslatorHookState) => (
    handle: number, id: number
  ): yuki.MeCabPatterns => {
    if (!state.patterns[handle.toString()]) return []
    if (!state.patterns[handle.toString()][id]) return []

    return state.patterns[handle.toString()][id]
  },
  getTranslationsByHandleAndId: (state: yuki.TranslatorHookState) =>
    (handle: number, id: number): yuki.Translations['translations'] => {
      if (!state.translations[handle.toString()]) return {}
      if (!state.translations[handle.toString()][id]) return {}

      return state.translations[handle.toString()][id]
    }
}

const mutations = {
  ADD_HOOK (
    state: yuki.TranslatorHookState,
    payload: { hook: yuki.TextThread }
  ) {
    state.hookInfos.push(payload.hook)
    state.texts = {
      ...state.texts,
      [payload.hook.handle.toString()]: []
    }
    state.patterns = {
      ...state.patterns,
      [payload.hook.handle.toString()]: []
    }
    state.translations = {
      ...state.translations,
      [payload.hook.handle.toString()]: []
    }
  },
  SET_HOOK_TEXT (
    state: yuki.TranslatorHookState,
    payload: { hookNum: number; text: string }
  ) {
    const handleString = payload.hookNum.toString()
    state.texts[handleString].push(payload.text)

    const texts = state.texts[handleString]
    if (texts[texts.length - MAX_STORE_COUNT - 1]) {
      delete texts[texts.length - MAX_STORE_COUNT - 1]
      delete state.translations[handleString][texts.length - MAX_STORE_COUNT - 1]
    }
  },
  SET_HOOK_PATTERNS (
    state: yuki.TranslatorHookState,
    payload: { hookNum: number; patterns: yuki.MeCabPatterns }
  ) {
    const handleString = payload.hookNum.toString()
    state.patterns[handleString].push(payload.patterns)

    const patterns = state.patterns[handleString]
    if (patterns[patterns.length - MAX_STORE_COUNT - 1]) {
      delete patterns[patterns.length - MAX_STORE_COUNT - 1]
      delete state.texts[handleString][patterns.length - MAX_STORE_COUNT - 1]
      delete state.translations[handleString][patterns.length - MAX_STORE_COUNT - 1]
    }
  },
  CHOOSE_HOOK_AS_DISPLAY (
    state: yuki.TranslatorHookState,
    payload: { hookNum: number }
  ) {
    state.currentDisplayHookIndex = payload.hookNum
  },
  INIT_DISPLAY_HOOK (
    state: yuki.TranslatorHookState,
    payload: { code: string }
  ) {
    state.toDisplayHookCode = payload.code
  },
  MERGE_TRANSLATION (
    state: yuki.TranslatorHookState,
    payload: yuki.TranslationMessage
  ) {
    state.translations[state.currentDisplayHookIndex] = {
      ...state.translations[state.currentDisplayHookIndex],
      [payload.id.toString()]: {
        ...state.translations[state.currentDisplayHookIndex][
          payload.id.toString()
        ],
        ...payload.translation
      }
    }
  },
  INIT_TRANSLATION_PLACEHOLDERS (
    state: yuki.TranslatorHookState,
    payload: yuki.TranslationMessage
  ) {
    const lastIndex = Object.keys(state.translations[state.currentDisplayHookIndex]).length
    if (lastIndex <= 0) return

    state.translations[state.currentDisplayHookIndex] = {
      ...state.translations[state.currentDisplayHookIndex],
      [payload.id.toString()]: Object.keys(
        state.translations[state.currentDisplayHookIndex][
          (payload.id - 1).toString()
        ]
      ).reduce((p, c) => { p[c] = '...'; return p }, {})
    }
  },
  SET_MECAB_ENABLE (
    state: yuki.TranslatorHookState,
    payload: { enable: boolean }
  ) {
    state.isMecabEnable = payload.enable
  }
}

const actions = {
  addHook (
    { commit, state }: { commit: Commit; state: yuki.TranslatorHookState },
    hook: yuki.TextThread
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
    }: { dispatch: Dispatch; commit: Commit; state: yuki.TranslatorHookState },
    { hook, text }: { hook: yuki.TextThread; text: string }
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
        dispatch('View/clearDict', {}, { root: true })
        commit('INIT_TRANSLATION_PLACEHOLDERS', {
          id: state.texts[hook.handle.toString()].length - 1
        })
        if (state.isMecabEnable) {
          ipcRenderer.send(IpcTypes.REQUEST_TRANSLATION, {
            id: state.texts[hook.handle.toString()].length - 1, text: originalText
          })
        } else {
          ipcRenderer.send(IpcTypes.REQUEST_TRANSLATION, {
            id: state.texts[hook.handle.toString()].length - 1, text
          })
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
  mergeTranslation (
    { commit }: { commit: Commit },
    payload: yuki.TranslationMessage
  ) {
    commit('MERGE_TRANSLATION', payload)
  },
  chooseHookAsDisplay (
    { commit }:
    { commit: Commit },
    hookNum: number
  ) {
    commit('CHOOSE_HOOK_AS_DISPLAY', { hookNum })
  }
}

export default {
  state: hooksState,
  getters,
  mutations,
  actions
}
