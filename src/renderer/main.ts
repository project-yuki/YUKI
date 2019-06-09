import { ipcRenderer } from 'electron'
import IpcTypes from '../common/IpcTypes'

import 'muse-ui-message/dist/muse-ui-message.all.css'
import 'muse-ui-toast/dist/muse-ui-toast.all.css'
import 'muse-ui/dist/muse-ui.css'
import '../resources/material-icons/material-icons.css'

import axios from 'axios'
import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import MuseUI from 'muse-ui'
const MuseUIMessage = require('muse-ui-message/dist/muse-ui-message.js')
const MuseUIToast = require('muse-ui-toast/dist/muse-ui-toast.js')
Vue.use(MuseUI)
Vue.use(MuseUIMessage)
Vue.use(MuseUIToast)

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
    components: { App },
    router,
    store,
    i18n,
    template: '<App/>'
  }).$mount('#app')

  ipcRenderer.on(
    IpcTypes.HAS_CONFIG,
    (event: Electron.Event, name: string, cfgs: object) => {
      store.dispatch('Config/setConfig', { name, cfgs })
    }
  )
}
