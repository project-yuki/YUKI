import { Commit } from 'vuex'
const debug = require('debug')('yuki:translatorWindow')
import { ipcRenderer, remote } from 'electron'
import IpcTypes from '../../../common/IpcTypes'

let isSavingConfig = false

const configState: any = {
  default: {},
  game: {
    name: '',
    code: '',
    path: '',
    localeChanger: ''
  },
  gui: {
    originalText: {
      fontSize: 0,
      color: ''
    },
    translationText: {
      fontSize: 0,
      color: '',
      margin: 0
    },
    background: '',
    autoHideTitlebar: false,
    mecab: {
      showRomaji: false
    }
  }
}

const getters = {
  getOriginalText: (state: yuki.TranslatorConfigState) => () => {
    return state.gui.originalText
  },
  getTranslationText: (state: yuki.TranslatorConfigState) => () => {
    return state.gui.translationText
  },
  getBackgroundColor: (state: yuki.TranslatorConfigState) => () => {
    return state.gui.background
  },
  getAutoHideTitlebar: (state: yuki.TranslatorConfigState) => () => {
    return state.gui.autoHideTitlebar
  },
  getMecab: (state: yuki.TranslatorConfigState) => () => {
    return state.gui.mecab
  }
}

const mutations = {
  SET_CONFIG (
    state: yuki.TranslatorConfigState,
    payload: { name: string; cfgs: any }
  ) {
    switch (payload.name) {
      case 'default':
        state.default = payload.cfgs
        break
      case 'game':
        state.game = payload.cfgs
        break
      case 'gui':
        state.gui = payload.cfgs.translatorWindow
        break
      default:
        debug('invalid config name: %s', payload.name)
        break
    }
  },
  SET_ORIGINAL_TEXT_SIZE (
    state: yuki.TranslatorConfigState,
    payload: { size: number }
  ) {
    state.gui.originalText = {
      ...state.gui.originalText,
      fontSize: payload.size
    }
  },
  SET_TRANSLATION_TEXT_SIZE (
    state: yuki.TranslatorConfigState,
    payload: { size: number }
  ) {
    state.gui.translationText = {
      ...state.gui.translationText,
      fontSize: payload.size
    }
  },
  SET_TRANSLATION_TEXT_MARGIN (
    state: yuki.TranslatorConfigState,
    payload: { margin: number }
  ) {
    state.gui.translationText = {
      ...state.gui.translationText,
      margin: payload.margin
    }
  },
  SET_BACKGROUND_COLOR (
    state: yuki.TranslatorConfigState,
    payload: { color: { hex8: string } }
  ) {
    state.gui.background = payload.color.hex8
  },
  SET_MECAB_SHOW_ROMAJI (
    state: yuki.TranslatorConfigState,
    payload: { value: boolean }
  ) {
    state.gui.mecab.showRomaji = payload.value
  },
  SET_AUTO_HIDE_TITLEBAR (
    state: yuki.TranslatorConfigState,
    payload: { value: boolean }
  ) {
    state.gui.autoHideTitlebar = payload.value
  },
  SAVE_GUI_CONFIG (state: yuki.TranslatorConfigState) {
    if (!isSavingConfig) {
      setTimeout(() => {
        ipcRenderer.send(IpcTypes.REQUEST_SAVE_TRANSLATOR_GUI, {
          ...state.gui,
          bounds: remote.getCurrentWindow().getBounds(),
          alwaysOnTop: remote.getCurrentWindow().isAlwaysOnTop()
        })
        isSavingConfig = false
      }, 1000)
      isSavingConfig = true
    }
  }
}

const actions = {
  setConfig (
    { commit }: { commit: Commit },
    { name, cfgs }: { name: string; cfgs: any }
  ) {
    commit('SET_CONFIG', { name, cfgs })
    if (name === 'game') {
      commit('Hooks/INIT_DISPLAY_HOOK', { code: cfgs.code }, { root: true })
      ipcRenderer.send(IpcTypes.REQUEST_INSERT_HOOK, cfgs.code)
    }
  }
}

export default {
  state: configState,
  getters,
  mutations,
  actions
}
