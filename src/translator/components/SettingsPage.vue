<template>
  <div class="small-margin fixed-scroll">
    <p class="text-h2">原始文本大小</p>
    <mu-slider class="margin-top" :step="1" v-model="originalTextSize"></mu-slider>
    <p class="text-h2 padding-top">翻译文本大小</p>
    <mu-slider class="margin-top" :step="1" v-model="translationTextSize"></mu-slider>
    <p class="text-h2 padding-top">背景色</p>
    <sketch-picker v-model="backgroundColor"></sketch-picker>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import { Route } from "vue-router";
import { remote } from "electron";

import { ipcRenderer } from "electron";

import { Sketch } from "vue-color";

@Component({
  components: {
    SketchPicker: <any>Sketch
  }
})
export default class HookSettings extends Vue {
  @namespace("Config").Getter("getOriginalText")
  getOriginalText!: () => Yagt.FontStyle;
  @namespace("Config").Getter("getTranslationText")
  getTranslationText!: () => Yagt.FontStyle;
  @namespace("Config").Getter("getBackgroundColor")
  getBackgroundColor!: () => string;

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
  get backgroundColor(): string {
    return this.getBackgroundColor();
  }
  set backgroundColor(color: string) {
    this.$store.commit("Config/SET_BACKGROUND_COLOR", { color });
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
  padding-top: 18px;
}

.margin-top {
  margin-top: 18px;
}
</style>
