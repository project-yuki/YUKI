<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "originalText": "原始文本",
    "translatedText": "翻译文本",
    "size": "大小",
    "margin": "间距",
    "backgroundColor": "背景色",
    "help": "帮助",
    "previousText": "上一文本",
    "nextText": "下一文本",
    "returnToLatestText": "回到最近文本",
    "alwaysOnTop": "窗口置顶",
    "notAlwaysOnTop": "窗口非置顶",
    "hide": "窗口隐藏（当有新文本时恢复）",
    "pauseNewText": "暂停新文本获取",
    "restoreNewText": "恢复新文本获取"
  },
  "en": {
    "originalText": "Original Text",
    "translatedText": "Translated Text",
    "size": "Size",
    "margin": "Margin",
    "backgroundColor": "Background Color",
    "help": "Help",
    "previousText": "Previous Text",
    "nextText": "Next Text",
    "returnToLatestText": "Return to Latest Text",
    "alwaysOnTop": "Always On Top",
    "notAlwaysOnTop": "Not Always On Top",
    "hide": "Hide Window (Restore When New Text Comes)",
    "pauseNewText": "Pause New Text Coming",
    "restoreNewText": "Restore New Text Coming"
  }
}
</i18n>

<template>
  <div class="small-margin fixed-scroll">
    <mu-row gutter>
      <mu-col span="3">
        <div class="text-h3 text-center">{{$t('originalText')}}</div>
      </mu-col>
      <mu-col span="8">
        <mu-form :model="{}">
          <mu-form-item :label="$t('size')" :style="{color: 'white'}">
            <mu-slider class="margin-top" :step="1" v-model="originalTextSize"></mu-slider>
          </mu-form-item>
        </mu-form>
      </mu-col>
    </mu-row>
    <mu-row gutter class="margin-top">
      <mu-col span="3">
        <div class="text-h3 text-center">{{$t('translatedText')}}</div>
      </mu-col>
      <mu-col span="4">
        <mu-form :model="{}">
          <mu-form-item :label="$t('size')" :style="{color: 'white'}">
            <mu-slider class="margin-top" :step="1" v-model="translationTextSize"></mu-slider>
          </mu-form-item>
        </mu-form>
      </mu-col>
      <mu-col span="4">
        <mu-form :model="{}">
          <mu-form-item :label="$t('margin')" :style="{color: 'white'}">
            <mu-slider class="margin-top" :step="1" v-model="translationTextMargin"></mu-slider>
          </mu-form-item>
        </mu-form>
      </mu-col>
    </mu-row>
    <mu-row gutter class="margin-top">
      <mu-col span="3">
        <div class="text-h3 text-center">{{$t('backgroundColor')}}</div>
      </mu-col>
      <mu-col span="9">
        <chrome-picker v-model="backgroundColor"></chrome-picker>
      </mu-col>
    </mu-row>
    <mu-row gutter class="margin-top">
      <mu-col span="3">
        <div class="text-h3 text-center">{{$t('help')}}</div>
      </mu-col>
      <mu-col span="8">
        <div class="helpers">
          <div v-for="item in helperItems">
            <mu-button icon>
              <mu-icon color="white" :value="item.icon"></mu-icon>
            </mu-button>
            <p class="text-helper text-p">{{$t(item.text)}}</p>
          </div>
        </div>
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
  @namespace('Config').Getter('getOriginalText')
  public getOriginalText!: () => yuki.FontStyle
  @namespace('Config').Getter('getTranslationText')
  public getTranslationText!: () => yuki.TranslationTextStyle
  @namespace('Config').Getter('getBackgroundColor')
  public getBackgroundColor!: () => string

  public helperItems: Array<{text: string, icon: string}> = [
    { text: 'previousText', icon: 'keyboard_arrow_left' },
    { text: 'nextText', icon: 'keyboard_arrow_right' },
    { text: 'returnToLatestText', icon: 'redo' },
    { text: 'alwaysOnTop', icon: 'lock' },
    { text: 'notAlwaysOnTop', icon: 'lock_open' },
    { text: 'hide', icon: 'close' },
    { text: 'pauseNewText', icon: 'pause' },
    { text: 'restoreNewText', icon: 'play_arrow' }
  ]

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

.helpers {
  display: box;
  display: flex;
  flex-wrap: wrap;
}

.text-center,
.text-helper {
  vertical-align: middle;
}

.text-helper {
  height: 48px;
  line-height: 48px;
  padding-right: 16px;
  float: right;
}
</style>
