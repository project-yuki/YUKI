<template>
<div id="app">
  <div id="top">
    <gt-titlebar></gt-titlebar>
  </div>
  <div id="content">
    <router-view></router-view>    
    <div id="buttons" v-if="isButtonsShown">
      <mu-button small flat :to="{name: 'translate'}" color="white" style="width: 32%">翻译</mu-button>
      <mu-button small flat :to="{name: 'hooks'}" color="white" style="width: 32%">文本钩子设置</mu-button>
      <mu-button small flat :to="{name: 'translate'}" color="white" style="width: 32%">翻译器设置</mu-button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { ipcRenderer, remote } from "electron";
import ipcTypes from "../common/ipcTypes";

import GtTitlebar from "@/components/Titlebar.vue";

@Component({
  components: {
    GtTitlebar
  }
})
export default class App extends Vue {
  isButtonsShown: boolean = true;

  @namespace("Hooks").Getter("getLastTextById")
  getLastTextById!: (id: number) => string;

  @namespace("Hooks").State("currentDisplayHookIndex")
  currentIndex!: number;

  get currentOriginText() {
    return this.getLastTextById(this.currentIndex);
  }

  mounted() {
    document.addEventListener("mouseenter", () => {
      this.isButtonsShown = true;
    });
    document.addEventListener("mouseleave", () => {
      if (this.currentOriginText !== "") {
        this.isButtonsShown = false;
      }
    });

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

  updateWindowHeight(offset: number) {
    let newHeight = document.body.offsetHeight + offset;
    let window = remote.getCurrentWindow();
    let width = window.getSize()[0];
    window.setSize(width, newHeight);
  }

  @Watch("currentIndex")
  onCurrentIndexChanged() {
    this.isButtonsShown = false;
    this.$router.push({ name: "translate" });
    ipcRenderer.send(ipcTypes.REQUEST_TRANSLATION, this.currentOriginText);
  }

  updated() {
    if (this.$router.currentRoute.name === "translate") {
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
}
</script>

<style>
* {
  margin: 0;
}

html::-webkit-scrollbar {
  display: none;
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
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 16px;
}

#app #content #buttons .mu-button {
  text-align: center;
}
</style>
