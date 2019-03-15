import Vue from 'vue'
import Router from 'vue-router'

import HooksPage from '@/components/HooksPage.vue'
import SettingsPage from '@/components/SettingsPage.vue'
import TranslatePage from '@/components/TranslatePage.vue'

Vue.use(Router)

const routes = [
  { path: '', component: TranslatePage },
  { path: '/translate', component: TranslatePage },
  { path: '/hooks', component: HooksPage },
  { path: '/settings', component: SettingsPage }
]

export default new Router({
  routes
})
