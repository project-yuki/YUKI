<template>
<mu-appbar class="app-header" color="primary">
  {{title}}

  <mu-button icon slot="right" class="manipulate-button" @click="minimizeWindow">
    <mu-icon value="remove"></mu-icon>
  </mu-button>
  <mu-button icon slot="right" class="manipulate-button" @click="closeWindow">
    <mu-icon value="close"></mu-icon>
  </mu-button>
</mu-appbar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { ipcRenderer, remote } from "electron";
import ipcTypes from "../../common/ipcTypes";

@Component
export default class PageContent extends Vue {
  @Prop(String) title!: string;

  minimizeWindow() {
    remote.getCurrentWindow().hide();
  }
  closeWindow() {
    ipcRenderer.send(ipcTypes.APP_EXIT);
  }
}
</script>

<style scoped>
.app-header {
  top: 0;
  left: 240px;
  right: 0;
  position: fixed;
  -webkit-app-region: drag;
}

.manipulate-button {
  -webkit-app-region: no-drag;
}
</style>
