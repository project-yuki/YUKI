<template>
  <div class="titlebar">
    <p class="text-h3 text-center title">YET ANOTHER GALGAME TRANSLATOR</p>
    <mu-button
      v-if="isAlwaysOnTop"
      icon
      small
      class="manipulate-button-top"
      @click="toggleAlwaysOnTop"
      color="#FFFFFF"
    >
      <mu-icon value="lock"></mu-icon>
    </mu-button>
    <mu-button
      v-else
      icon
      small
      class="manipulate-button-top"
      @click="toggleAlwaysOnTop"
      color="#FFFFFF"
    >
      <mu-icon value="lock_open"></mu-icon>
    </mu-button>
    <mu-button icon small class="manipulate-button-close" @click="closeWindow" color="#FFFFFF">
      <mu-icon value="close"></mu-icon>
    </mu-button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { remote } from "electron";

@Component
export default class Titlebar extends Vue {
  closeWindow() {
    remote.getCurrentWindow().hide();
  }

  isAlwaysOnTop = remote.getCurrentWindow().isAlwaysOnTop();

  toggleAlwaysOnTop() {
    remote
      .getCurrentWindow()
      .setAlwaysOnTop(!remote.getCurrentWindow().isAlwaysOnTop());
    this.isAlwaysOnTop = !this.isAlwaysOnTop;
  }
}
</script>

<style scoped>
.titlebar {
  width: 100%;
  -webkit-app-region: drag;
  background-color: rgba(13, 71, 161, 0.8);
  text-align: center;
  height: 32px;
}

.title {
  width: 100%;
  height: 100%;
  float: left;
}

.manipulate-button-top {
  -webkit-app-region: no-drag;
  position: fixed;
  right: 32px;
  top: 0;
}

.manipulate-button-close {
  -webkit-app-region: no-drag;
  position: fixed;
  right: 0;
  top: 0;
}
</style>
