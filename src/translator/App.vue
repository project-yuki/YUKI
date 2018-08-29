<template>
<div id="app">
  <p>I'm a translator~!</p>
  <router-link :to="{name: 'blank'}">Nothing</router-link>
  <router-link :to="{name: 'hooks'}">Hook Settings</router-link>
  <router-view></router-view>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import { ipcRenderer } from "electron";
import ipcTypes from "../common/ipcTypes";

@Component
export default class App extends Vue {
  mounted() {}
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
</style>
