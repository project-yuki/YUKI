<template>
  <div id="app">
    <gt-app-sidebar></gt-app-sidebar>
    <router-view class="full-height" style="margin-left: 240px;"></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import GtAppSidebar from "@/components/AppSidebar.vue";

import { ipcRenderer } from "electron";
import ipcTypes from "../common/ipcTypes";

@Component({
  components: {
    GtAppSidebar
  }
})
export default class App extends Vue {
  mounted() {
    ipcRenderer.send(ipcTypes.REQUEST_CONFIG, "default");
    ipcRenderer.send(ipcTypes.REQUEST_CONFIG, "games");
    ipcRenderer.send(ipcTypes.MAIN_PAGE_LOAD_FINISHED);
  }
}
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
}

.text-h1 {
  font-size: 2em;
}

.text-h2 {
  font-size: 1.5em;
}

.text-h3 {
  font-size: 1.2em;
}

.no-margin {
  width: 100%;
  margin: 0;
}

.full-height {
  height: 100%;
}

.full {
  width: 100%;
  height: 100%;
}

.all-center {
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>
