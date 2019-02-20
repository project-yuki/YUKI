<template>
  <mu-flex direction="row" justify-content="center" wrap="wrap">
    <div v-for="(pattern, index) in patterns" :key="`mecab-text-${index}`" class="gutter">
      <mu-flex direction="column" align-items="center">
        <div
          :style="{color: originalTextColor, fontSize: `${originalTextSize*0.8}px`}"
        >{{pattern.kana ? pattern.kana : "&nbsp;"}}</div>
        <div :style="{color: originalTextColor, fontSize: `${originalTextSize}px`}">{{pattern.word}}</div>
        <div
          :style="{color: originalTextColor, fontSize: `${originalTextSize*0.6}px`}"
        >{{pattern.abbr}}</div>
      </mu-flex>
    </div>
  </mu-flex>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

@Component
export default class MecabText extends Vue {
  @Prop()
  patterns!: Yagt.MeCabPatterns;

  @namespace("Config").Getter("getOriginalText")
  getOriginalText!: () => Yagt.FontStyle;
  get originalTextColor() {
    return this.getOriginalText().color;
  }
  get originalTextSize() {
    return this.getOriginalText().fontSize;
  }
}
</script>

<style scoped>
.gutter {
  margin: 4px;
}
</style>
