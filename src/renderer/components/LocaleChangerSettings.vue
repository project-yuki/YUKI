<template>
<div>
  <mu-button color="primary" @click="saveSettings">保存</mu-button>
  <mu-button color="warning" @click="resetSettings">重置</mu-button>
  <p class="text-h1">区域转换器设置</p>
  <p class="text-h2">区域转换器选择</p>
  <mu-radio 
    v-for="(value, key) in defaultConfig.localeChangers"
    :key="'choose-'+key"
    :value="key" 
    v-model="selected" 
    :label="value.name" />
  
  <gt-locale-changer-info 
    v-for="(value, key) in defaultConfig.localeChangers"
    :key="key"
    :changer="value"
    ref="changerInfos"
  />
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { State, namespace } from "vuex-class";

import GtLocaleChangerInfo from "@/components/LocaleChangerInfo.vue";

import { ipcRenderer } from "electron";
import ipcTypes from "../../common/ipcTypes";

@Component({
  components: {
    GtLocaleChangerInfo
  }
})
export default class localeChangerSettings extends Vue {
  selected = "";

  @namespace("Config").State("default")
  defaultConfig!: Yagt.ConfigState["default"];

  saveSettings() {
    let savingConfig = JSON.parse(JSON.stringify(this.defaultConfig));
    for (let key in this.defaultConfig.localeChangers) {
      if (key === this.selected) {
        savingConfig.localeChangers[key].enable = true;
      } else {
        savingConfig.localeChangers[key].enable = false;
      }
      for (let index in this.$refs.changerInfos) {
        if (
          this.$refs.changerInfos[index].changer.name ===
          this.defaultConfig.localeChangers[key].name
        ) {
          savingConfig.localeChangers[key].exec = this.$refs.changerInfos[
            index
          ].execInput;
        }
      }
    }
    ipcRenderer.send(ipcTypes.REQUEST_SAVE_CONFIG, "default", savingConfig);
  }
  resetSettings() {
    let hasSelected = false;
    for (let key in this.defaultConfig.localeChangers) {
      if (this.defaultConfig.localeChangers[key].enable === true) {
        this.selected = key;
        hasSelected = true;
      }
      for (let index in this.$refs.changerInfos) {
        if (
          this.$refs.changerInfos[index].changer.name ===
          this.defaultConfig.localeChangers[key].name
        ) {
          this.$refs.changerInfos[
            index
          ].execInput = this.defaultConfig.localeChangers[key].exec;
        }
      }
    }
    if (!hasSelected) {
      this.selected = "";
    }
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
