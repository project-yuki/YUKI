<template>
<div>
  <p class="text-h1 text-center">{{currentOriginText}}</p>
  <gt-text-display 
    v-for="(translation, key) in translationsForCurrentIndex.translations" 
    :key="key" 
    :name="key" 
    :translation="translation"></gt-text-display>
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

@Component({
  components: {
    GtTextDisplay
  }
})
export default class TranslatePage extends Vue {
  @namespace("View").State("isButtonsShown")
  isButtonsShown!: boolean;

  @namespace("Hooks").Getter("getLastTextById")
  getLastTextById!: (id: number) => string;

  @namespace("Hooks").State("currentDisplayHookIndex")
  currentIndex!: number;

  @namespace("Hooks").State("translationsForCurrentIndex")
  translationsForCurrentIndex!: Yagt.Translations;

  get currentOriginText() {
    return this.getLastTextById(this.currentIndex);
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
