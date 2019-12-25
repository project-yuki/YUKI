<template>
  <div class="app-header">
    <v-app-bar color="primary" dark>
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon class="manipulate-button" @click="minimizeWindow">
        <v-icon>mdi-window-minimize</v-icon>
      </v-btn>
      <v-btn icon class="manipulate-button" @click="closeWindow">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop
} from 'vue-property-decorator'

import {
  ipcRenderer,
  remote
} from 'electron'
import IpcTypes from '../../common/IpcTypes'

@Component
export default class PageContent extends Vue {
  @Prop(String) public title!: string

  public minimizeWindow () {
    remote.getCurrentWindow().hide()
  }
  public closeWindow () {
    ipcRenderer.send(IpcTypes.APP_EXIT)
  }
}
</script>

<style scoped>
.app-header {
  top: 0;
  left: 230px;
  right: 0;
  position: fixed;
  z-index: 5;
  -webkit-app-region: drag;
}

.manipulate-button {
  -webkit-app-region: no-drag;
}
</style>
