<template>
  <v-app>
    <yk-app-sidebar></yk-app-sidebar>
    <router-view class="full-height" style="margin-left: 230px;"></router-view>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import YkAppSidebar from '@/components/AppSidebar.vue'

import { ipcRenderer } from 'electron'
import IpcTypes from '../common/IpcTypes'

@Component({
  components: {
    YkAppSidebar
  }
})
export default class App extends Vue {
  public mounted () {
    ipcRenderer.send(IpcTypes.REQUEST_CONFIG, 'default')
    ipcRenderer.send(IpcTypes.REQUEST_CONFIG, 'games')
    ipcRenderer.send(IpcTypes.REQUEST_CONFIG, 'librariesBaseStorePath')
    ipcRenderer.send(IpcTypes.MAIN_PAGE_LOAD_FINISHED)
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
  padding-top: 16px;
  font-size: 2em;
}

.text-h2 {
  padding-top: 16px;
  font-size: 1.5em;
}

.text-h3 {
  padding-top: 16px;
  font-size: 1.2em;
}

.no-margin {
  width: 100%;
  margin: 0;
}

.full-height {
  min-height: 100%;
}

.full {
  min-width: 100%;
  min-height: 100%;
}

.all-center {
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.vertical-center {
  margin: auto;
}
</style>
