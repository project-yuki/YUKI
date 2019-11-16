import Vue from 'vue'
import Router from 'vue-router'

import AboutPage from '@/components/AboutPage.vue'
import AddGamePage from '@/components/AddGamePage.vue'
import DebugMessagesPage from '@/components/DebugMessagesPage.vue'
import GamesPage from '@/components/GamesPage.vue'
import LibrarySettings from '@/components/LibrarySettings.vue'
import LocaleChangerSettings from '@/components/LocaleChangerSettings.vue'
import SettingsPage from '@/components/SettingsPage.vue'
import TranslatorSettings from '@/components/TranslatorSettings.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '', redirect: '/games' },
    { path: '/games', component: GamesPage },
    { path: '/addgame', component: AddGamePage },
    {
      path: '/settings',
      component: SettingsPage,
      children: [
        {
          path: 'localechanger',
          component: LocaleChangerSettings
        },
        {
          path: 'library',
          component: LibrarySettings
        },
        {
          path: 'translator',
          component: TranslatorSettings
        }
      ]
    },
    { path: '/debugMessages', component: DebugMessagesPage },
    { path: '/about', component: AboutPage }
  ]
})
