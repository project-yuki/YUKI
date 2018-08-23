<template>
<mu-scale-transition>
  <mu-card>
    <mu-card-title :title="game.name" :sub-title="game.code"></mu-card-title>
    <mu-card-text>
      {{game.path}}
    </mu-card-text>
    <mu-card-actions>
      <mu-button color="primary" @click="handleRunGame">运行</mu-button>
      <mu-button color="error" @click="handleDeleteGame">删除</mu-button>
    </mu-card-actions>
    <mu-dialog title="Dialog" width="360" :open.sync="openConfirm">
      确认删除？
      <mu-button slot="actions" flat @click="handleCloseConfirm">否</mu-button>
      <mu-button slot="actions" flat color="primary" @click="handleDeleteGame">是</mu-button>
    </mu-dialog>
  </mu-card>
</mu-scale-transition>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { ipcRenderer } from "electron";
import ipcTypes from "../../common/ipcTypes";

@Component
export default class HookSettingsHookInfo extends Vue {
  @Prop() game!: Yagt.Game;

  openConfirm = false;

  handleOpenConfirm() {
    this.openConfirm = true;
  }
  handleCloseConfirm() {
    this.openConfirm = false;
  }
  handleRunGame() {
    ipcRenderer.send(ipcTypes.REQUEST_RUN_GAME, this.game);
  }
  handleDeleteGame() {}
}
</script>

<style scoped>
.hooker-textarea {
  padding: 8px;
}
</style>
