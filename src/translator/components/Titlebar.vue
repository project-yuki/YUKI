<template>
<div class="titlebar">
  <p class="text-h3 text-center title">YET ANOTHER GALGAME TRANSLATOR</p>
  <mu-button icon small class="manipulate-button" @click="closeWindow" color="#FFFFFF">
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

.manipulate-button {
  -webkit-app-region: no-drag;
  position: fixed;
  right: 0;
  top: 0;
}
</style>
