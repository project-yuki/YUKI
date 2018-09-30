<template>
<div id="app">
  <p class="text-h1">{{currentOriginText}}</p>
  <gt-text-display 
    v-for="(translation, key) in translationsForCurrentIndex.translations"
    :key="key"
    :name="key"
    :translation="translation"></gt-text-display>
  <router-link :to="{name: 'blank'}">返回</router-link>
  <router-link :to="{name: 'hooks'}">文本钩子设置</router-link>
  <router-view></router-view>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { ipcRenderer, remote } from "electron";
import ipcTypes from "../common/ipcTypes";

import GtTextDisplay from "@/components/TextDisplay.vue";

@Component({
  components: {
    GtTextDisplay
  }
})
export default class App extends Vue {
  @namespace("Hooks").Getter("getTextById")
  getTextById!: (id: number) => string[];

  @namespace("Hooks").State("currentDisplayHookIndex")
  currentIndex!: number;

  @namespace("Hooks").State("translationsForCurrentIndex")
  translationsForCurrentIndex!: Yagt.Translations;

  get currentOriginText() {
    let texts = this.getTextById(this.currentIndex);
    if (texts) {
      return texts[texts.length - 1];
    }
    return "";
  }

  mounted() {
    ipcRenderer.send(ipcTypes.REQUEST_CONFIG, "default");
  }

  updated() {
    if (this.$router.currentRoute.name === "blank") {
      this.$nextTick(() => {
        let newHeight = document.body.offsetHeight + 60;
        let window = remote.getCurrentWindow();
        let width = window.getSize()[0];
        window.setSize(width, newHeight);
      });
    }
  }
}
</script>

<style>
* {
  margin: 0;
}

html,
#app {
  min-width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
}

.text-h1 {
  font-size: 2em;
}

.text-h2 {
  font-size: 1.5em;
}

.text-h3 {
  font-size: 1.2em;
}

.no-margin {
  width: 100%;
  margin: 0;
}

.full-height {
  height: 100%;
}

.full {
  width: 100%;
  height: 100%;
}

.div {
  margin: 0;
}
</style>
