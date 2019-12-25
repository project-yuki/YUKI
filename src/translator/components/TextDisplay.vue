<template>
  <div :style="{marginTop: `${translationTextStyle.margin}px`}">
    <v-row no-gutters>
      <v-col cols="2" align="center">
        <div class="name" :style="{fontSize: `${translationTextStyle.fontSize}px`}">{{name}}</div>
      </v-col>
      <v-col cols="10">
        <div
          class="textBoder"
          :style="{
            color: translationTextStyle.color, 
            fontSize: `${translationTextStyle.fontSize}px`
          }"
        >{{translation}}</div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

@Component
export default class TextDisplay extends Vue {
  @Prop(String) public name!: string
  @Prop(String) public translation!: string

  @namespace('Config').State('gui')
  public guiConfig!: yuki.Config.Gui['translatorWindow']

  get translationTextStyle () {
    return this.guiConfig.translationText
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

.textBoder {
  text-shadow: 0 0 0.2em rgb(0, 46, 251);
}
</style>
