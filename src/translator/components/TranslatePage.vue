<template>
  <div class="three-columns">
    <div v-if="isPreviousTextValid" class="navigation-button">
      <v-btn text icon large dark @click="goToPreviousText">
        <v-icon dark>mdi-chevron-left</v-icon>
      </v-btn>

      <v-btn text icon large dark @click="incTextSize">
        <v-icon dark>mdi-format-font-size-increase</v-icon>
      </v-btn>
      <v-btn text icon large dark @click="decTextSize">
        <v-icon dark>mdi-format-font-size-decrease</v-icon>
      </v-btn>
    </div>
    <div class="navigation-button" v-else></div>

    <v-container fluid style="flex: 1;">
      <div v-if="isMecabEnable" class="text-center">
        <yk-mecab-text :patterns="currentPatterns"></yk-mecab-text>
      </div>
      <div
        v-else
        class="text-center"
        :style="{color: originalTextColor, fontSize: `${originalTextSize}px`}"
      >{{currentOriginText}}</div>
      <yk-text-display
        v-for="(translation, key) in currentTranslations"
        :key="key"
        :name="key"
        :translation="translation"
      ></yk-text-display>
    </v-container>

    <div v-if="isNextTextValid" class="navigation-button">
      <v-btn text icon large dark @click="goToNextText">
        <v-icon dark>mdi-chevron-right</v-icon>
      </v-btn>
      <v-btn text icon large dark @click="goToLatestText">
        <v-icon dark>mdi-chevron-triple-right</v-icon>
      </v-btn>
    </div>
    <div class="navigation-button" v-else></div>
  </div>
</template>

<script lang="ts">
import { remote } from 'electron'
import * as _ from 'lodash'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { namespace } from 'vuex-class'
import { updateWindowHeight } from '../common/Window'

import YkHookSettings from '@/components/HookSettings.vue'
import YkMecabText from '@/components/MecabText.vue'
import YkTextDisplay from '@/components/TextDisplay.vue'

@Component({
  components: {
    YkTextDisplay,
    YkMecabText
  }
})
export default class TranslatePage extends Vue {
  @namespace('View').State('isButtonsShown') public isButtonsShown!: boolean

  @namespace('Hooks').Getter('getTextByHandleAndId')
  public getTextByHandleAndId!: (handle: number, id: number) => string
  @namespace('Hooks').Getter('getPatternsByHandleAndId')
  public getPatternsByHandleAndId!: (
    handle: number,
    id: number
  ) => yuki.MeCabPatterns
  @namespace('Hooks').Getter('getTranslationsByHandleAndId')
  public getTranslationsByHandleAndId!: (
    handle: number,
    id: number
  ) => yuki.Translations['translations']
  @namespace('Hooks').Getter('getLastIndexByHandle')
  public getLastIndexByHandle!: (handle: number) => number

  @namespace('Hooks').State('currentDisplayHookIndex')
  public currentIndex!: number

  @namespace('Config').Getter('getOriginalText')
  public getOriginalText!: () => yuki.FontStyle

  @namespace('Config').Getter('getTranslationText')
  public getTranslationText!: () => yuki.TranslationTextStyle

  @namespace('Hooks').State('isMecabEnable') public isMecabEnable!: boolean

  public idOffset: number = 0

  get originalTextColor () {
    return this.getOriginalText().color
  }
  get originalTextSize () {
    return this.getOriginalText().fontSize
  }
  set originalTextSize (size: number) {
    this.$store.commit('Config/SET_ORIGINAL_TEXT_SIZE', {
      size
    })
    this.$store.commit('Config/SAVE_GUI_CONFIG')
  }
  get translationTextSize () {
    return this.getTranslationText().fontSize
  }
  set translationTextSize (size: number) {
    this.$store.commit('Config/SET_TRANSLATION_TEXT_SIZE', {
      size
    })
    this.$store.commit('Config/SAVE_GUI_CONFIG')
  }

  get currentOriginText () {
    return this.getTextByHandleAndId(
      this.currentIndex,
      this.getLastIndexByHandle(this.currentIndex) + this.idOffset
    )
  }
  get currentPatterns () {
    return this.getPatternsByHandleAndId(
      this.currentIndex,
      this.getLastIndexByHandle(this.currentIndex) + this.idOffset
    )
  }
  get currentTranslations () {
    return this.getTranslationsByHandleAndId(
      this.currentIndex,
      this.getLastIndexByHandle(this.currentIndex) + this.idOffset
    )
  }

  get isPreviousTextValid () {
    if (this.isMecabEnable) {
      return (
        this.getPatternsByHandleAndId(
          this.currentIndex,
          this.getLastIndexByHandle(this.currentIndex) + this.idOffset - 1
        ).length !== 0
      )
    } else {
      return (
        this.getTextByHandleAndId(
          this.currentIndex,
          this.getLastIndexByHandle(this.currentIndex) + this.idOffset - 1
        ) !== ''
      )
    }
  }
  get isNextTextValid () {
    if (this.isMecabEnable) {
      return (
        this.getPatternsByHandleAndId(
          this.currentIndex,
          this.getLastIndexByHandle(this.currentIndex) + this.idOffset + 1
        ).length !== 0
      )
    } else {
      return (
        this.getTextByHandleAndId(
          this.currentIndex,
          this.getLastIndexByHandle(this.currentIndex) + this.idOffset + 1
        ) !== ''
      )
    }
  }
  public goToPreviousText () {
    this.idOffset--
  }
  public goToNextText () {
    this.idOffset++
  }
  public goToLatestText () {
    while (this.isNextTextValid) {
      this.idOffset++
    }
  }
  public incTextSize () {
    if (this.originalTextSize < 36) {
      this.originalTextSize = this.originalTextSize + 1
    }
    if (this.translationTextSize < 36) {
      this.translationTextSize = this.translationTextSize + 1
    }
  }
  public decTextSize () {
    if (this.originalTextSize > 1) {
      this.originalTextSize = this.originalTextSize - 1
    }
    if (this.translationTextSize > 1) {
      this.translationTextSize = this.translationTextSize - 1
    }
  }

  public beforeRouteEnter (to: Route, from: Route, next: () => void) {
    updateWindowHeight(this, true, 24)
    next()
  }

  @Watch('isButtonShown')
  public onButtonShownChanged () {
    if (this.isButtonsShown) {
      updateWindowHeight(this, true, 24)
    } else {
      updateWindowHeight(this, true, 0)
    }
  }

  public updated () {
    if (this.isButtonsShown) {
      this.$nextTick(() => {
        updateWindowHeight(this, true, 24)
      })
    } else {
      this.$nextTick(() => {
        updateWindowHeight(this, true, 0)
      })
    }
  }
}
</script>

<style scoped>
.three-columns {
  display: box;
  display: flex;
  justify-content: space-between;
}

.navigation-button {
  width: 48px;
}
</style>
