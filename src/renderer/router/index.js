import Vue from 'vue'
import Router from 'vue-router'

import GamesPage from '@/components/GamesPage'
import FavoritePage from '@/components/FavoritePage'
import SettingsPage from '@/components/SettingsPage'
import AboutPage from '@/components/AboutPage'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '', component: GamesPage },
    { path: '/games', name: 'Games', component: GamesPage },
    { path: '/favorite', name: 'Favorite', component: FavoritePage },
    { path: '/settings', name: 'Settings', component: SettingsPage },
    { path: '/about', name: 'About', component: AboutPage }
  ]
})
