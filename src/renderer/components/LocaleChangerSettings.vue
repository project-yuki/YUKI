<template>
<div>
  <mu-button color="primary" @click="saveSettings">保存</mu-button>
  <mu-button color="warning" @click="resetSettings">重置</mu-button>
  <p class="text-h1">区域转换器设置</p>
  <p class="text-h2">区域转换器选择</p>
  <mu-radio value="localeEmulator" v-model="selected" label="Locale Emulator"></mu-radio>
  <mu-radio value="ntleas" v-model="selected" label="Ntleas"></mu-radio>
  <p class="text-h2">Locale Emulator</p>
  <p class="text-h3">执行方式</p>
  <mu-text-field v-model="localeEmulatorInput" multi-line full-width :rows-max="10"></mu-text-field>
  <p>参数</p>
  <p>%GAME_EXEC% - 游戏所在路径</p>
  <mu-divider></mu-divider>
  <p class="text-h2">Ntleas</p>
  <p class="text-h3">执行方式</p>
  <mu-text-field v-model="ntleasInput" multi-line full-width :rows-max="10"></mu-text-field>
  <p>参数</p>
  <p>%GAME_EXEC% - 游戏所在路径</p>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { State, namespace } from "vuex-class";

import { ipcRenderer } from "electron";
import ipcTypes from "../../common/ipcTypes";

@Component
export default class localeChangerSettings extends Vue {
  selected = "";
  localeEmulatorInput = "";
  ntleasInput = "";

  @namespace("Config").State("default") defaultConfig!: ConfigState["default"];

  saveSettings() {
    let savingConfig = JSON.parse(JSON.stringify(this.defaultConfig));
    savingConfig.localeChanger.localeEmulator.exec = this.localeEmulatorInput;
    savingConfig.localeChanger.ntleas.exec = this.ntleasInput;
    for (let key in this.defaultConfig.localeChanger) {
      if (key === this.selected) {
        savingConfig.localeChanger[key].enabled = true;
      } else {
        savingConfig.localeChanger[key].enabled = false;
      }
    }
    ipcRenderer.send(ipcTypes.REQUEST_SAVE_CONFIG, "default", savingConfig);
  }
  resetSettings() {
    for (let key in this.defaultConfig.localeChanger) {
      if (this.defaultConfig.localeChanger[key].enabled === true) {
        this.selected = key;
      }
    }
    this.localeEmulatorInput = this.defaultConfig.localeChanger.localeEmulator.exec;
    this.ntleasInput = this.defaultConfig.localeChanger.ntleas.exec;
  }

  mounted() {
    this.resetSettings();
  }
}
</script>

<style scoped>
.mu-button {
  margin: 8px;
}

.mu-button:first-child {
  margin: 0;
}
</style>
