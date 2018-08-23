import Vue from "vue";
import * as Router from "vue-router";

import GamesPage from "@/components/GamesPage.vue";
import AddGamePage from "@/components/AddGamePage.vue";
import SettingsPage from "@/components/SettingsPage.vue";
import AboutPage from "@/components/AboutPage.vue";

Vue.use(Router);

let routes = <Router.RouteConfig[]>[
  { path: "", component: GamesPage },
  { path: "/games", name: "Games", component: GamesPage },
  { path: "/addgame", name: "AddGame", component: AddGamePage },
  { path: "/settings", name: "Settings", component: SettingsPage },
  { path: "/about", name: "About", component: AboutPage }
];

export default new Router({
  routes
});
