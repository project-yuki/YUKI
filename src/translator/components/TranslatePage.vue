<template>
  <div>
    <mu-container v-if="isMecabEnable" class="text-center">
      <gt-mecab-text :patterns="currentPatterns"></gt-mecab-text>
    </mu-container>
    <mu-container
      v-else
      class="text-center"
      :style="{color: originalTextColor, fontSize: `${originalTextSize}px`}"
    >{{currentOriginText}}</mu-container>
    <gt-text-display
      v-for="(translation, key) in translationsForCurrentIndex.translations"
      :key="key"
      :name="key"
      :translation="translation"
    ></gt-text-display>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { remote } from "electron";
import { namespace } from "vuex-class";

import GtTextDisplay from "@/components/TextDisplay.vue";
import GtHookSettings from "@/components/HookSettings.vue";
import GtMecabText from "@/components/MecabText.vue";
import MecabMiddleware from "../../main/mecab";

@Component({
  components: {
    GtTextDisplay,
    GtMecabText
  }
})
export default class TranslatePage extends Vue {
  @namespace("View").State("isButtonsShown")
  isButtonsShown!: boolean;

  @namespace("Hooks").Getter("getLastTextById")
  getLastTextById!: (id: number) => string;
  @namespace("Hooks").Getter("getLastPatternsById")
  getLastPatternsById!: (id: number) => Yagt.MeCabPatterns;

  @namespace("Hooks").State("currentDisplayHookIndex")
  currentIndex!: number;

  @namespace("Hooks").State("translationsForCurrentIndex")
  translationsForCurrentIndex!: Yagt.Translations;

  @namespace("Config").Getter("getOriginalText")
  getOriginalText!: () => Yagt.FontStyle;

  @namespace("Hooks").State("isMecabEnable")
  isMecabEnable!: boolean;

  get originalTextColor() {
    return this.getOriginalText().color;
  }
  get originalTextSize() {
    return this.getOriginalText().fontSize;
  }

  get currentOriginText() {
    return this.getLastTextById(this.currentIndex);
  }
  get currentPatterns() {
    return this.getLastPatternsById(this.currentIndex);
  }

  beforeRouteEnter(to: Route, from: Route, next: Function) {
    let newHeight = document.body.offsetHeight + 64;
    let window = remote.getCurrentWindow();
    let width = window.getSize()[0];
    window.setSize(width, newHeight);
    next();
  }

  updateWindowHeight(offset: number) {
    let newHeight = document.body.offsetHeight + offset;
    let window = remote.getCurrentWindow();
    let width = window.getSize()[0];
    window.setSize(width, newHeight);
  }

  @Watch("isButtonShown")
  onButtonShownChanged() {
    if (this.isButtonsShown) {
      this.updateWindowHeight(64);
    } else {
      this.updateWindowHeight(40);
    }
  }

  updated() {
    if (this.isButtonsShown) {
      this.$nextTick(() => {
        this.updateWindowHeight(64);
      });
    } else {
      this.$nextTick(() => {
        this.updateWindowHeight(40);
      });
    }
  }
}
</script>

<style scoped>
</style>
