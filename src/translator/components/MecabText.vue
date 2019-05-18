<template>
  <mu-flex direction="row" justify-content="center" wrap="wrap">
    <div v-for="(pattern, index) in patterns" :key="`mecab-text-${index}`" class="gutter">
      <mu-flex direction="column" align-items="center">
        <div
          :style="{color: abbrToColor(pattern.abbr), fontSize: `${originalTextSize*0.8}px`}"
        >{{pattern.kana ? pattern.kana : "&nbsp;"}}</div>
        <div
          :style="{color: abbrToColor(pattern.abbr), fontSize: `${originalTextSize}px`}"
        >{{pattern.word}}</div>
        <div
          :style="{color: abbrToColor(pattern.abbr), fontSize: `${originalTextSize*0.6}px`}"
        >{{pattern.abbr !== "undefined" ? pattern.abbr : "&nbsp;"}}</div>
      </mu-flex>
    </div>
  </mu-flex>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop
} from 'vue-property-decorator'
import {
  namespace
} from 'vuex-class'
import MecabMiddleware from '../../main/middlewares/MeCabMiddleware'

@Component
export default class MecabText extends Vue {
  @Prop()
  public patterns!: yuki.MeCabPatterns

  @namespace('Config').Getter('getOriginalText')
  public getOriginalText!: () => yuki.FontStyle
  get originalTextColor () {
    return this.getOriginalText().color
  }
  get originalTextSize () {
    return this.getOriginalText().fontSize
  }

  public abbrToColor (abbr: string): string {
    if (!MecabMiddleware.ABBR_TO_COLOR_MAP[abbr]) return 'white'
    else return MecabMiddleware.ABBR_TO_COLOR_MAP[abbr]
  }
}
</script>

<style scoped>
.gutter {
  margin: 4px;
}
</style>
