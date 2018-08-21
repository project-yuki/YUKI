import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

import GamesPage from '@/components/GamesPage.vue'
import FavoritePage from '@/components/FavoritePage.vue'
import SettingsPage from '@/components/SettingsPage.vue'
import AboutPage from '@/components/AboutPage.vue'

Vue.use(Router)

let routes = <RouteConfig[]>[
  { path: '', component: GamesPage },
  { path: '/games', name: 'Games', component: GamesPage },
  { path: '/favorite', name: 'Favorite', component: FavoritePage },
  { path: '/settings', name: 'Settings', component: SettingsPage },
  { path: '/about', name: 'About', component: AboutPage }
]

export default new Router({
  routes
})
