import Vue from "vue";
import Router from "vue-router";

import GamesPage from "@/components/GamesPage.vue";
import AddGamePage from "@/components/AddGamePage.vue";
import SettingsPage from "@/components/SettingsPage.vue";
import LocaleChangerSettings from "@/components/LocaleChangerSettings.vue";
import LibrarySettings from "@/components/LibrarySettings.vue";
import TranslatorSettings from "@/components/TranslatorSettings.vue";
import AboutPage from "@/components/AboutPage.vue";

Vue.use(Router);

export default new Router({
  routes: [
    { path: "", redirect: "/games" },
    { path: "/games", component: GamesPage },
    { path: "/addgame", component: AddGamePage },
    {
      path: "/settings",
      component: SettingsPage,
      children: [
        {
          path: "localechanger",
          component: LocaleChangerSettings
        },
        {
          path: "library",
          component: LibrarySettings
        },
        {
          path: "translator",
          component: TranslatorSettings
        }
      ]
    },
    { path: "/about", component: AboutPage }
  ]
});
