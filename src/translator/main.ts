import { ipcRenderer, remote } from 'electron'
import IpcTypes from '../common/IpcTypes'

import './class-component-hooks'

import vuetify from '../common/vuetify'

import axios from 'axios'
import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

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
    locale
  })

  new Vue({
    vuetify,
    router,
    store,
    i18n,
    render: (h) => h(App)
  }).$mount('#app')

  ipcRenderer.on(
    IpcTypes.HAS_HOOK_TEXT,
    (event: Electron.Event, hook: yuki.TextOutputObject) => {
      if ((store.state as any).View.pauseNewText) return

      if (!remote.getCurrentWindow().isVisible()) {
        remote.getCurrentWindow().show()
      }
      const text = hook.text
      delete hook.text
      store.dispatch('Hooks/setHookTextOrPatterns', { hook, text })
    }
  )
  ipcRenderer.on(
    IpcTypes.HAS_CONFIG,
    (event: Electron.Event, name: string, cfgs: object) => {
      store.dispatch('Config/setConfig', { name, cfgs })
    }
  )
  ipcRenderer.on(
    IpcTypes.HAS_TRANSLATION,
    (event: Electron.Event, message: yuki.TranslationMessage) => {
      store.dispatch('Hooks/mergeTranslation', message)
    }
  )
  ipcRenderer.on(
    IpcTypes.HAS_DICT,
    (event: Electron.Event, message: yuki.DictResult) => {
      store.dispatch('View/setDict', message)
    }
  )
}
