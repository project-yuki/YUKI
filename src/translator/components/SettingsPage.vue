<template>
  <div class="small-margin fixed-scroll">
    <mu-row gutter>
      <mu-col span="3">
        <div class="text-h3 text-center">原始文本</div>
      </mu-col>
      <mu-col span="8">
        <mu-form :model="{}">
          <mu-form-item label="大小" :style="{color: 'white'}">
            <mu-slider class="margin-top" :step="1" v-model="originalTextSize"></mu-slider>
          </mu-form-item>
        </mu-form>
      </mu-col>
    </mu-row>
    <mu-row gutter>
      <mu-col span="3">
        <div class="text-h3 text-center">翻译文本</div>
      </mu-col>
      <mu-col span="4">
        <mu-form :model="{}">
          <mu-form-item label="大小" :style="{color: 'white'}">
            <mu-slider class="margin-top" :step="1" v-model="translationTextSize"></mu-slider>
          </mu-form-item>
        </mu-form>
      </mu-col>
      <mu-col span="4">
        <mu-form :model="{}">
          <mu-form-item label="间距" :style="{color: 'white'}">
            <mu-slider class="margin-top" :step="1" v-model="translationTextMargin"></mu-slider>
          </mu-form-item>
        </mu-form>
      </mu-col>
    </mu-row>
    <mu-row gutter>
      <mu-col span="3">
        <div class="text-h3 text-center">背景色</div>
      </mu-col>
      <mu-col span="9">
        <chrome-picker v-model="backgroundColor"></chrome-picker>
      </mu-col>
    </mu-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import { Route } from "vue-router";
import { remote } from "electron";

import { ipcRenderer } from "electron";

import { Chrome } from "vue-color";

@Component({
  components: {
    ChromePicker: <any>Chrome
  }
})
export default class HookSettings extends Vue {
  @namespace("Config").Getter("getOriginalText")
  getOriginalText!: () => Yagt.FontStyle;
  @namespace("Config").Getter("getTranslationText")
  getTranslationText!: () => Yagt.TranslationTextStyle;
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
  get translationTextMargin() {
    return this.getTranslationText().margin;
  }
  set translationTextMargin(margin: number) {
    this.$store.commit("Config/SET_TRANSLATION_TEXT_MARGIN", { margin });
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

.text-center {
  text-align: center;
  vertical-align: middle;
}
</style>
