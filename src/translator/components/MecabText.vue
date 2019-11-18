<template>
<div>
  <v-row justify="center" align="center">
    <div v-for="(pattern, index) in patterns" :key="`mecab-text-${index}`" class="gutter">
      <div @click="findDict(pattern, $event)">
        <div :style="{color: abbrToColor(pattern.abbr), fontSize: `${originalTextSize*0.8}px`}">{{pattern.kana ? pattern.kana : "&nbsp;"}}</div>
        <div :style="{color: abbrToColor(pattern.abbr), fontSize: `${originalTextSize}px`}">{{pattern.word}}</div>
        <div :style="{color: abbrToColor(pattern.abbr), fontSize: `${originalTextSize*0.6}px`}">{{pattern.abbr !== "undefined" ? pattern.abbr : "&nbsp;"}}</div>
      </div>
    </div>
  </v-row>
  <div v-if="isGetDictResult" class="dict" :style="{top: `${dictDivY}px`, height: `${dictDivHeight}px`}">
    <div class="titlebar">
      <p class="text-h2">{{dict.word}}</p>
      <v-btn
      text
      icon
      small
      class="manipulate-button-close"
      @click="closeDictWindow"
      color="#FFFFFF"
      >
        <v-icon dark>mdi-close</v-icon>
      </v-btn>
    </div>
    <p class="text-p">{{dict.content}}</p>
  </div>
</div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron'
import Vue from 'vue'
import {
  Component,
  Prop
} from 'vue-property-decorator'
import {
  namespace
} from 'vuex-class'
import IpcTypes from '../../common/IpcTypes'
import MecabMiddleware from '../../main/middlewares/MeCabMiddleware'

@Component
export default class MecabText extends Vue {
  get originalTextColor () {
    return this.getOriginalText().color
  }
  get originalTextSize () {
    return this.getOriginalText().fontSize
  }
  @Prop()
  public patterns!: yuki.MeCabPatterns

  public dictDivY: number = 0
  public dictDivHeight: number = 0

  @namespace('View').State('isGetDictResult')
  public isGetDictResult!: boolean
  @namespace('View').State('dict')
  public dict!: yuki.DictResult

  @namespace('Config').Getter('getOriginalText')
  public getOriginalText!: () => yuki.FontStyle

  public abbrToColor (abbr: string): string {
    if (!MecabMiddleware.ABBR_TO_COLOR_MAP[abbr]) return 'white'
    else return MecabMiddleware.ABBR_TO_COLOR_MAP[abbr]
  }

  public findDict (pattern: yuki.MeCabPattern, event: MouseEvent) {
    this.dictDivY = event.clientY + 16
    this.dictDivHeight = document.body.clientHeight - this.dictDivY - 8
    this.closeDictWindow()
    ipcRenderer.send(IpcTypes.REQUEST_DICT, { dict: 'lingoes', word: pattern.word })
  }

  public closeDictWindow () {
    this.$store.dispatch('View/clearDict')
  }
}
</script>

<style scoped>
.gutter {
  margin: 4px;
}

.dict {
  position: fixed;
  width: 80%;
  left: 10%;
  background-color: rgb(13, 71, 161);
  overflow-x: hidden;
  overflow-y: scroll;
  text-align: left;
  padding: 16px;
}

.titlebar {
  width: 100%;
  height: 48px;
}

.manipulate-button-close {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
