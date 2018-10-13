import Vue from "vue";
import Router from "vue-router";

import TranslatePage from "@/components/TranslatePage.vue";
import HooksPage from "@/components/HooksPage.vue";

Vue.use(Router);

let routes = [
  { path: "", component: TranslatePage },
  { path: "/translate", name: "translate", component: TranslatePage },
  { path: "/hooks", name: "hooks", component: HooksPage }
];

export default new Router({
  routes
});
