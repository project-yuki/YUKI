<template>
  <div :style="{marginTop: `${translationTextStyle.margin}px`}">
    <div>
      <div
        class="name"
        :style="{
          fontSize: `${translationTextStyle.fontSize}px`, 
          width: '96px',
          float: 'left'
        }"
      >{{name}}</div>
      <div
        class="textBoder"
        :style="{
            color: translationTextStyle.color, 
            fontSize: `${translationTextStyle.fontSize}px`,
            marginLeft: '100px',
            textAlign: 'center'
          }"
      >{{translation}}</div>
    </div>
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
