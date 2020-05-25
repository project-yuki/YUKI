<template>
  <div>
    <v-row justify="center" align="center">
      <div v-for="(pattern, index) in patterns" :key="`mecab-text-${index}`" class="gutter">
        <div @click="findDict(pattern, $event)">
          <div
            :style="{color: abbrToColor(pattern.abbr), fontSize: `${originalTextSize*0.8}px`}"
          >{{getFirstLine(pattern) ? getFirstLine(pattern) : "&nbsp;"}}</div>
          <div
            :style="{color: abbrToColor(pattern.abbr), fontSize: `${originalTextSize}px`}"
          >{{pattern.word}}</div>
          <div
            :style="{color: abbrToColor(pattern.abbr), fontSize: `${originalTextSize*0.6}px`}"
          >{{pattern.abbr !== "undefined" && pattern.abbr !== 'w' ? pattern.abbr : "&nbsp;"}}</div>
        </div>
      </div>
    </v-row>
    <div
      v-if="isGetDictResult"
      class="dict"
      :style="{top: `${dictDivY}px`, height: `${dictDivHeight}px`}"
    >
      <div class="titlebar">
        <p class="text-h2">{{dict.word}}</p>
        <p
          class="text-p"
          style="margin-left: 12px"
          v-if="dict.content && dict.content.kana"
        >{{dict.content.kana.join(',')}}</p>
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
      <div v-if="dict.content && dict.content.definitions">
        <div v-for="(definition, index) in dict.content.definitions" :key="`definition-${index}`">
          <v-divider dark></v-divider>

          <p class="text-p" style="color: #ff9e80">{{definition.partOfSpeech}}</p>
          <template v-if="definition.explanations">
            <div
              v-for="(explanation, eIndex) in definition.explanations"
              :key="`dict-${index}-${eIndex}`"
            >
              <p
                class="text-h3"
                style="color: #ffeb3b"
                v-if="explanation.content"
              >{{explanation.content}}</p>
              <p
                class="text-p"
                v-if="explanation.example.sentence"
              >{{explanation.example.sentence}} -> {{explanation.example.content}}</p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer, remote } from 'electron'
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import IpcTypes from '../../common/IpcTypes'
import MecabMiddleware from '../../main/middlewares/MeCabMiddleware'
import { updateWindowHeight } from '../common/Window'

@Component
export default class MecabText extends Vue {
  get originalTextColor () {
    return this.getOriginalText().color
  }
  get originalTextSize () {
    return this.getOriginalText().fontSize
  }

  get showRomaji () {
    if (this.guiConfig.mecab) return this.guiConfig.mecab.showRomaji
    else return false
  }
  @Prop() public patterns!: yuki.MeCabPatterns

  @namespace('Config').State('gui')
  public guiConfig!: yuki.Config.Gui['translatorWindow']

  public kanaToRomaji: (kana: string) => string = MecabMiddleware.kanaToRomaji

  public dictDivY: number = 0
  public dictDivHeight: number = 0

  @namespace('View').State('isGetDictResult') public isGetDictResult!: boolean
  @namespace('View').State('dict') public dict!: yuki.DictResult

  @namespace('Config').Getter('getOriginalText')
  public getOriginalText!: () => yuki.FontStyle

  public getFirstLine (pattern: yuki.MeCabPattern) {
    try {
      if (this.showRomaji) {
        if (pattern.kana) return this.kanaToRomaji(pattern.kana)
        else return this.kanaToRomaji(pattern.word)
      } else {
        if (pattern.kana) return pattern.kana
        else return null
      }
    } catch (e) {
      return null
    }
  }

  public abbrToColor (abbr: string): string {
    if (!MecabMiddleware.ABBR_TO_COLOR_MAP[abbr]) return 'white'
    else return MecabMiddleware.ABBR_TO_COLOR_MAP[abbr]
  }

  public findDict (pattern: yuki.MeCabPattern, event: MouseEvent) {
    this.dictDivY = event.clientY + 16
    this.closeDictWindow()
    ipcRenderer.send(IpcTypes.REQUEST_DICT, {
      dict: 'lingoes',
      word: pattern.word
    })
  }

  public closeDictWindow () {
    this.$store.dispatch('View/clearDict')
  }

  @Watch('isGetDictResult', {
    immediate: true,
    deep: true
  })
  public checkGetDictResult (newValue: boolean) {
    if (newValue === true) {
      this.$nextTick(() => {
        const newHeight = updateWindowHeight(
          this,
          false,
          Math.trunc(remote.screen.getPrimaryDisplay().size.height * 0.6)
        )
        this.dictDivHeight = newHeight - this.dictDivY - 32
      })
    } else {
      this.$nextTick(() => {
        updateWindowHeight(this, true, 24)
      })
    }
  }
}
</script>

<style scoped>
.gutter {
  margin: 4px;
}

.dict {
  position: fixed;
  width: 50%;
  left: 25%;
  background-color: rgb(13, 71, 161);
  overflow-x: hidden;
  overflow-y: scroll;
  text-align: left;
  padding: 16px;
}

.titlebar {
  width: 100%;
  height: 48px;
  display: flex;
}

.manipulate-button-close {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
