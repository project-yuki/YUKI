<template>
<div id="app">
  <div id="top">
    <gt-titlebar></gt-titlebar>
  </div>
  <div id="content">
    <p class="text-h1 text-center">{{currentOriginText}}</p>
    <gt-text-display 
      v-for="(translation, key) in translationsForCurrentIndex.translations"
      :key="key"
      :name="key"
      :translation="translation"></gt-text-display>
    <div id="buttons">
      <mu-button small flat :to="{name: 'blank'}" color="white" style="width: 32%">返回</mu-button>
      <mu-button small flat :to="{name: 'hooks'}" color="white" style="width: 32%">文本钩子设置</mu-button>
      <mu-button small flat :to="{name: 'blank'}" color="white" style="width: 32%">翻译器设置</mu-button>
    </div>
    <router-view></router-view>
  </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { ipcRenderer, remote } from "electron";
import ipcTypes from "../common/ipcTypes";

import GtTextDisplay from "@/components/TextDisplay.vue";
import GtTitlebar from "@/components/Titlebar.vue";

@Component({
  components: {
    GtTextDisplay,
    GtTitlebar
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
    ipcRenderer.send(ipcTypes.REQUEST_CONFIG, "game");
    let callback = (event: Electron.Event, name: string, cfg: any) => {
      if (name !== "game") ipcRenderer.once(ipcTypes.HAS_CONFIG, callback);
      else if (cfg.code === "") {
        this.$router.push("hooks");
      }
    };
    ipcRenderer.once(ipcTypes.HAS_CONFIG, callback);
  }

  updateWindowHeight() {
    let newHeight = document.body.offsetHeight + 32;
    let window = remote.getCurrentWindow();
    let width = window.getSize()[0];
    window.setSize(width, newHeight);
  }

  @Watch("currentIndex")
  onCurrentIndexChanged() {
    this.$router.push({ name: "blank" });
    ipcRenderer.send(ipcTypes.REQUEST_TRANSLATION, this.currentOriginText);
  }

  updated() {
    if (this.$router.currentRoute.name === "blank") {
      this.$nextTick(() => {
        this.updateWindowHeight();
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
body,
#app {
  min-width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
  background: none;
}

body {
  background-color: rgba(33, 150, 243, 0.6);
  -webkit-user-select: none;
}

.text-h1,
.text-h2,
.text-h3 {
  color: white;
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

.text-center {
  text-align: center;
  padding-top: 4px;
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

#app #top {
  position: fixed;
  width: 100%;
  z-index: 999;
  top: 0;
}

#app #content {
  margin-top: 32px;
}

#app #content #buttons {
  margin-top: 16px;
}

#app #content #buttons .mu-button {
  text-align: center;
}
</style>
