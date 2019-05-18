<template>
  <div>
    <mu-container v-if="isMecabEnable" class="text-center">
      <yk-mecab-text :patterns="currentPatterns"></yk-mecab-text>
    </mu-container>
    <mu-container
      v-else
      class="text-center"
      :style="{color: originalTextColor, fontSize: `${originalTextSize}px`}"
    >{{currentOriginText}}</mu-container>
    <yk-text-display
      v-for="(translation, key) in translationsForCurrentIndex.translations"
      :key="key"
      :name="key"
      :translation="translation"
    ></yk-text-display>
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

  @namespace('Hooks').Getter('getLastTextById')
  public getLastTextById!: (id: number) => string
  @namespace('Hooks').Getter('getLastPatternsById')
  public getLastPatternsById!: (id: number) => yuki.MeCabPatterns

  @namespace('Hooks').State('currentDisplayHookIndex')
  public currentIndex!: number

  @namespace('Hooks').State('translationsForCurrentIndex')
  public translationsForCurrentIndex!: yuki.Translations

  @namespace('Config').Getter('getOriginalText')
  public getOriginalText!: () => yuki.FontStyle

  @namespace('Hooks').State('isMecabEnable')
  public isMecabEnable!: boolean

  get originalTextColor () {
    return this.getOriginalText().color
  }
  get originalTextSize () {
    return this.getOriginalText().fontSize
  }

  get currentOriginText () {
    return this.getLastTextById(this.currentIndex)
  }
  get currentPatterns () {
    return this.getLastPatternsById(this.currentIndex)
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
</style>
