import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'


import 'muse-ui/dist/muse-ui.css';
import 'muse-ui-message/dist/muse-ui-message.css'
import './resources/material-icons/material-icons.css'

import MuseUI from 'muse-ui'
Vue.use(MuseUI)


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

import { ipcRenderer } from 'electron'
import types from '../common/ipcTypes'

ipcRenderer.on(types.HAS_INSERTED_HOOK, (event, hook) => {
  store.dispatch('addHook', hook)
})
ipcRenderer.on(types.HAS_REMOVED_HOOK, (event, hook) => {
  store.dispatch('removeHook', hook)
})
ipcRenderer.on(types.HAS_HOOK_TEXT, (event, hook, text) => {
  store.dispatch('setHookText', { hook, text })
})
