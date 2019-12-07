import { ipcRenderer } from 'electron'
import IpcTypes from '../common/IpcTypes'

import vuetify from '../common/vuetify'

import axios from 'axios'
import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import 'xterm/css/xterm.css'

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'))
}
(Vue as any).http = Vue.prototype.$http = axios
Vue.config.productionTip = false

let locale = 'zh'
const callback = (event: Electron.Event, name: string, cfg: any) => {
  locale = cfg.language
  next()
}
ipcRenderer.once(IpcTypes.HAS_CONFIG, callback)
ipcRenderer.send(IpcTypes.REQUEST_CONFIG, 'default')

function next () {
  const i18n = new VueI18n({
    locale,
    messages: {
      zh: { gameAborted: '游戏运行失败，请参考调试信息' },
      en: { gameAborted: 'Game aborted. Please refer to debug messages' }
    }
  })

  const vue = new Vue({
    vuetify,
    router,
    store,
    i18n,
    render: (h) => h(App)
  }).$mount('#app')

  ipcRenderer.on(
    IpcTypes.HAS_CONFIG,
    (event: Electron.Event, name: string, cfgs: object) => {
      store.dispatch('Config/setConfig', { name, cfgs })
    }
  )
  ipcRenderer.on(
    IpcTypes.HAS_NEW_DEBUG_MESSAGE,
    (event: Electron.Event, message: string) => {
      store.commit('Gui/NEW_DEBUG_MESSAGE', { value: message })
    }
  )
  ipcRenderer.on(
    IpcTypes.GAME_ABORTED,
    () => {
      vue.$dialog.notify.error(vue.$i18n.t('gameAborted').toString())
      store.commit('Gui/SET_GAME_STARTING_ENDED', { value: true })
    }
  )
  ipcRenderer.on(
    IpcTypes.HAS_RUNNING_GAME,
    () => {
      store.commit('Gui/SET_GAME_STARTING_ENDED', { value: true })
    }
  )
  ipcRenderer.on(
    IpcTypes.HAS_PROCESSES,
    (event: Electron.Event, processes: yuki.Processes) => {
      store.commit('Gui/SET_PROCESSES', { value: processes })
    }
  )
}
