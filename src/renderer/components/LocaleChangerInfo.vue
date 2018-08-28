<template>
<div>
  <p class="text-h2">{{changer.name}}</p>
  <p class="text-h3">执行方式</p>
  <mu-text-field v-model="execInput" multi-line full-width :rows-max="10"></mu-text-field>
  <p>参数</p>
  <p>%GAME_PATH% - 游戏所在路径</p>
  <mu-divider></mu-divider>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { State, namespace } from "vuex-class";

import { ipcRenderer } from "electron";
import ipcTypes from "../../common/ipcTypes";

@Component
export default class localeChangerSettings extends Vue {
  execInput = "";

  @Prop() changer!: Yagt.Config.LocaleChangerItem;

  mounted() {
    this.execInput = this.changer.exec;
  }
}
</script>

<style scoped>
</style>
