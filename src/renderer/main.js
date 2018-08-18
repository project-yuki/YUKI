import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'


import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
Vue.use(MuseUI)
import './resources/material-icons/material-icons.css'

import Message from 'muse-ui-message';
Vue.use(Message);
import 'muse-ui-message/dist/muse-ui-message.css';


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
 
ipcRenderer.on('add-hook', (event, hook) => {
  store.dispatch('addHook', hook)
})
ipcRenderer.on('get-hook-text', (event, hook, text) => {
  store.dispatch('getHookText', { hook, text })
})