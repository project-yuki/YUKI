<template>
<div id="app">
  <gt-app-sidebar></gt-app-sidebar>
  <router-view style="margin-left: 240px;"></router-view>
</div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import GtAppSidebar from '@/components/AppSidebar'

import { ipcRenderer } from 'electron'
import ipcTypes from '../common/ipcTypes'

@Component({
  components: {
    GtAppSidebar
  }
})
export default class App extends Vue {
  mounted() {
    ipcRenderer.send(ipcTypes.REQUEST_CONFIG, 'default')
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
</style>
