<template>
  <div class="small-margin fixed-scroll">
    <mu-row gutter>
      <mu-col span="3">
        <div class="text-h3 text-center">原始文本</div>
      </mu-col>
      <mu-col span="8">
        <mu-form :model="{}">
          <mu-form-item label="大小" :style="{color: 'white'}">
            <mu-slider class="margin-top" :step="1" v-model="originalTextSize"></mu-slider>
          </mu-form-item>
        </mu-form>
      </mu-col>
    </mu-row>
    <mu-row gutter>
      <mu-col span="3">
        <div class="text-h3 text-center">翻译文本</div>
      </mu-col>
      <mu-col span="4">
        <mu-form :model="{}">
          <mu-form-item label="大小" :style="{color: 'white'}">
            <mu-slider class="margin-top" :step="1" v-model="translationTextSize"></mu-slider>
          </mu-form-item>
        </mu-form>
      </mu-col>
      <mu-col span="4">
        <mu-form :model="{}">
          <mu-form-item label="间距" :style="{color: 'white'}">
            <mu-slider class="margin-top" :step="1" v-model="translationTextMargin"></mu-slider>
          </mu-form-item>
        </mu-form>
      </mu-col>
    </mu-row>
    <mu-row gutter>
      <mu-col span="3">
        <div class="text-h3 text-center">背景色</div>
      </mu-col>
      <mu-col span="9">
        <chrome-picker v-model="backgroundColor"></chrome-picker>
      </mu-col>
    </mu-row>
  </div>
</template>

<script lang="ts">
import {
  remote
} from 'electron'
import Vue from 'vue'
import {
  Component,
  Watch
} from 'vue-property-decorator'
import {
  Route
} from 'vue-router'
import {
  namespace,
  State
} from 'vuex-class'

import {
  Chrome
} from 'vue-color'

@Component({
  components: {
    ChromePicker: Chrome as any
  }
})
export default class HookSettings extends Vue {
  @namespace('Config').Getter('getOriginalText')
  public getOriginalText!: () => yuki.FontStyle
  @namespace('Config').Getter('getTranslationText')
  public getTranslationText!: () => yuki.TranslationTextStyle
  @namespace('Config').Getter('getBackgroundColor')
  public getBackgroundColor!: () => string

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
  get translationTextMargin () {
    return this.getTranslationText().margin
  }
  set translationTextMargin (margin: number) {
    this.$store.commit('Config/SET_TRANSLATION_TEXT_MARGIN', {
      margin
    })
    this.$store.commit('Config/SAVE_GUI_CONFIG')
  }
  get backgroundColor (): string {
    return this.getBackgroundColor()
  }
  set backgroundColor (color: string) {
    this.$store.commit('Config/SET_BACKGROUND_COLOR', {
      color
    })
    this.$store.commit('Config/SAVE_GUI_CONFIG')
  }

  public beforeRouteEnter (to: Route, from: Route, next: () => void) {
    const newHeight = Math.trunc(
      remote.screen.getPrimaryDisplay().size.height * 0.6
    )
    const window = remote.getCurrentWindow()
    const width = window.getSize()[0]
    window.setSize(width, newHeight)
    next()
  }
}
</script>

<style scoped>
.padding-top {
  padding-top: 18px;
}

.margin-top {
  margin-top: 18px;
}

.text-center {
  text-align: center;
  vertical-align: middle;
}
</style>
