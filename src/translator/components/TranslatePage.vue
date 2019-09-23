<template>
  <div class="three-columns">
    <mu-button icon v-if="isPreviousTextValid" @click="goToPreviousText">
      <mu-icon class="navigation-button" color="white" value="keyboard_arrow_left"></mu-icon>
    </mu-button>
    <div class="navigation-button" v-else></div>

    <div style="flex: 1;">
      <mu-container v-if="isMecabEnable" class="text-center">
        <yk-mecab-text :patterns="currentPatterns"></yk-mecab-text>
      </mu-container>
      <mu-container
        v-else
        class="text-center"
        :style="{color: originalTextColor, fontSize: `${originalTextSize}px`}"
      >{{currentOriginText}}</mu-container>
      <yk-text-display
        v-for="(translation, key) in currentTranslations"
        :key="key"
        :name="key"
        :translation="translation"
      ></yk-text-display>
    </div>

    <div v-if="isNextTextValid" class="navigation-button">
      <mu-button icon @click="goToNextText">
        <mu-icon color="white" value="keyboard_arrow_right"></mu-icon>
      </mu-button>
      <mu-button icon @click="goToLatestText">
        <mu-icon color="white" value="redo"></mu-icon>
      </mu-button>
    </div>
    <div class="navigation-button" v-else></div>
  </div>
</template>

<script lang="ts">
import {
  remote
} from 'electron'
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  Prop,
  Watch
} from 'vue-property-decorator'
import {
  Route
} from 'vue-router'
import {
  namespace
} from 'vuex-class'

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
  @namespace('View').State('isButtonsShown')
  public isButtonsShown!: boolean

  @namespace('Hooks').Getter('getTextByHandleAndId')
  public getTextByHandleAndId!: (handle: number, id: number) => string
  @namespace('Hooks').Getter('getPatternsByHandleAndId')
  public getPatternsByHandleAndId!: (handle: number, id: number) => yuki.MeCabPatterns
  @namespace('Hooks').Getter('getTranslationsByHandleAndId')
  public getTranslationsByHandleAndId!:
    (handle: number, id: number) => yuki.Translations['translations']
  @namespace('Hooks').Getter('getLastIndexByHandle')
  public getLastIndexByHandle!: (handle: number) => number

  @namespace('Hooks').State('currentDisplayHookIndex')
  public currentIndex!: number

  @namespace('Config').Getter('getOriginalText')
  public getOriginalText!: () => yuki.FontStyle

  @namespace('Hooks').State('isMecabEnable')
  public isMecabEnable!: boolean

  public idOffset: number = 0

  get originalTextColor () {
    return this.getOriginalText().color
  }
  get originalTextSize () {
    return this.getOriginalText().fontSize
  }

  get currentOriginText () {
    return this.getTextByHandleAndId(
      this.currentIndex, this.getLastIndexByHandle(this.currentIndex) + this.idOffset
    )
  }
  get currentPatterns () {
    return this.getPatternsByHandleAndId(
      this.currentIndex, this.getLastIndexByHandle(this.currentIndex) + this.idOffset
    )
  }
  get currentTranslations () {
    return this.getTranslationsByHandleAndId(
      this.currentIndex, this.getLastIndexByHandle(this.currentIndex) + this.idOffset
    )
  }

  get isPreviousTextValid () {
    if (this.isMecabEnable) {
      return this.getPatternsByHandleAndId(
        this.currentIndex,
        this.getLastIndexByHandle(this.currentIndex) + this.idOffset - 1
      ).length !== 0
    } else {
      return this.getTextByHandleAndId(
        this.currentIndex,
        this.getLastIndexByHandle(this.currentIndex) + this.idOffset - 1
      ) !== ''
    }
  }
  get isNextTextValid () {
    if (this.isMecabEnable) {
      return this.getPatternsByHandleAndId(
        this.currentIndex,
        this.getLastIndexByHandle(this.currentIndex) + this.idOffset + 1
      ).length !== 0
    } else {
      return this.getTextByHandleAndId(
        this.currentIndex,
        this.getLastIndexByHandle(this.currentIndex) + this.idOffset + 1
      ) !== ''
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

  public beforeRouteEnter (to: Route, from: Route, next: () => void) {
    const newHeight = document.body.offsetHeight + 64
    const window = remote.getCurrentWindow()
    const width = window.getSize()[0]
    window.setSize(width, newHeight)
    next()
  }

  public updateWindowHeight (offset: number) {
    const newHeight = document.body.offsetHeight + offset
    const window = remote.getCurrentWindow()
    const width = window.getSize()[0]
    window.setSize(width, newHeight)
  }

  @Watch('isButtonShown')
  public onButtonShownChanged () {
    if (this.isButtonsShown) {
      this.updateWindowHeight(64)
    } else {
      this.updateWindowHeight(40)
    }
  }

  public updated () {
    if (this.isButtonsShown) {
      this.$nextTick(() => {
        this.updateWindowHeight(64)
      })
    } else {
      this.$nextTick(() => {
        this.updateWindowHeight(40)
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
