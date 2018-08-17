import Vue from 'vue'
import Router from 'vue-router'

import HookSettingsPage from '@/components/HookSettingsPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'hook-settings-page',
      component: HookSettingsPage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
