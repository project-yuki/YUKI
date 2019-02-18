<template>
  <mu-container class="margin-top">
    <mu-row>
      <mu-col span="2">
        <div class="name" :style="{fontSize: `${translationTextStyle.fontSize}px`}">{{name}}</div>
      </mu-col>
      <mu-col span="10">
        <div
          :style="{
            color: translationTextStyle.color, 
            fontSize: `${translationTextStyle.fontSize}px`
          }"
        >{{translation}}</div>
      </mu-col>
    </mu-row>
  </mu-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

@Component
export default class TextDisplay extends Vue {
  @Prop(String)
  name!: string;
  @Prop(String)
  translation!: string;

  @namespace("Config").State("gui")
  guiConfig!: any;

  get translationTextStyle() {
    return this.guiConfig.translationText;
  }
}
</script>

<style scoped>
.name {
  color: #ffeb3b;
}

.margin-top {
  margin-top: 24px;
}
</style>
