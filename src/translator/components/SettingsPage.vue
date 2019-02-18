<template>
  <mu-container>
    <p class="text-h2 padding-top">原始文本大小</p>
    <mu-slider
      class="margin-top"
      :step="1"
      :value="originalTextSize"
      @change="onOriginalTextSizeChange"
    ></mu-slider>
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

  tempTranslationTextSize = 0;

  get originalTextSize() {
    return this.getOriginalText().fontSize;
  }

  onOriginalTextSizeChange(size: number) {
    this.$store.commit("Config/SET_ORIGINAL_TEXT_SIZE", { size });
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
