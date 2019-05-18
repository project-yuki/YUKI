import 'muse-ui/dist/muse-ui.css'
import '../resources/material-icons/material-icons.css'

import './class-component-hooks'

import axios from 'axios'
import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

import MuseUI from 'muse-ui'
Vue.use(MuseUI)

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'))
}
(Vue as any).http = Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

import { ipcRenderer, remote } from 'electron'
import IpcTypes from '../common/IpcTypes'

ipcRenderer.on(
  IpcTypes.HAS_HOOK_TEXT,
  (event: Electron.Event, hook: yuki.TextOutputObject) => {
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
  (event: Electron.Event, translation: yuki.Translations['translations']) => {
    store.dispatch('Hooks/mergeTranslation', translation)
  }
)
