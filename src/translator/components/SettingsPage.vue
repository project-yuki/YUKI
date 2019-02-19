<template>
  <mu-container>
    <p class="text-h2 padding-top">原始文本大小</p>
    <mu-slider class="margin-top" :step="1" v-model="originalTextSize"></mu-slider>
    <p class="text-h2 padding-top">翻译文本大小</p>
    <mu-slider class="margin-top" :step="1" v-model="translationTextSize"></mu-slider>
  </mu-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import { Route } from "vue-router";
import { remote } from "electron";

import { ipcRenderer } from "electron";

@Component
export default class HookSettings extends Vue {
  @namespace("Config").Getter("getOriginalText")
  getOriginalText!: () => Yagt.FontStyle;
  @namespace("Config").Getter("getTranslationText")
  getTranslationText!: () => Yagt.FontStyle;

  get originalTextSize() {
    return this.getOriginalText().fontSize;
  }
  set originalTextSize(size: number) {
    this.$store.commit("Config/SET_ORIGINAL_TEXT_SIZE", { size });
    this.$store.commit("Config/SAVE_GUI_CONFIG");
  }
  get translationTextSize() {
    return this.getTranslationText().fontSize;
  }
  set translationTextSize(size: number) {
    this.$store.commit("Config/SET_TRANSLATION_TEXT_SIZE", { size });
    this.$store.commit("Config/SAVE_GUI_CONFIG");
  }

  beforeRouteEnter(to: Route, from: Route, next: Function) {
    let newHeight = Math.trunc(
      remote.screen.getPrimaryDisplay().size.height * 0.6
    );
    let window = remote.getCurrentWindow();
    let width = window.getSize()[0];
    window.setSize(width, newHeight);
    next();
  }
}
</script>

<style scoped>
.padding-top {
  padding-top: 24px;
}

.margin-top {
  margin-top: 24px;
}
</style>
