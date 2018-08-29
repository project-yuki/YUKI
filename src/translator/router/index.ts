import Vue from "vue";
import Router from "vue-router";

import BlankPage from "@/components/BlankPage.vue";
import HooksPage from "@/components/HooksPage.vue";

Vue.use(Router);

let routes = [
  { path: "/", name: "blank", component: BlankPage },
  { path: "/hooks", name: "hooks", component: HooksPage }
];

export default new Router({
  routes
});
