<template>
<div id="app">
  <p class="text-h1">{{currentOriginText}}</p> 
  <router-link :to="{name: 'blank'}">返回</router-link>
  <router-link :to="{name: 'hooks'}">文本钩子设置</router-link>
  <router-view></router-view>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

@Component
export default class App extends Vue {
  @namespace("Hooks").Getter("getTextById")
  getTextById!: (id: number) => string[];

  @namespace("Hooks").State("currentDisplayHookIndex") currentIndex!: number;

  get currentOriginText() {
    let texts = this.getTextById(this.currentIndex);
    if (texts) {
      return texts[texts.length - 1];
    }
    return "";
  }
}
</script>

<style>
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
