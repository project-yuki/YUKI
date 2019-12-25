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
    "restoreNewText": "恢复新文本获取",
    "showRomaji": "显示罗马音",
    "autoHideTitlebar": "自动隐藏标题栏"
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
    "restoreNewText": "Restore New Text Coming",
    "showRomaji": "Show Romaji",
    "autoHideTitlebar": "Automatically Hide Titlebar"
  }
}
</i18n>

<template>
  <div :class="classObject">
    <v-row>
      <v-col cols="3">
        <div class="text-h3 text-center">{{$t('window')}}</div>
      </v-col>
      <v-col cols="4" style="display: flex">
        <v-switch v-model="autoHideTitlebar" style="margin-top: 0"></v-switch>
        <p style="color: white" class="text-center">{{$t('autoHideTitlebar')}}</p>
      </v-col>
    </v-row>

    <v-row class="margin-top">
      <v-col cols="3">
        <div class="text-h3 text-center">{{$t('originalText')}}</div>
      </v-col>
      <v-col cols="8">
        <p style="color: white">{{$t('size')}}</p>
        <v-slider
          class="margin-top"
          thumb-label="always"
          ticks
          min="1"
          max="36"
          v-model="originalTextSize"
        ></v-slider>
      </v-col>
    </v-row>

    <v-row class="margin-top">
      <v-col cols="3">
        <div class="text-h3 text-center">{{$t('translatedText')}}</div>
      </v-col>
      <v-col cols="4">
        <p style="color: white">{{$t('size')}}</p>
        <v-slider
          class="margin-top"
          thumb-label="always"
          ticks
          min="1"
          max="36"
          v-model="translationTextSize"
        ></v-slider>
      </v-col>
      <v-col cols="4">
        <p style="color: white">{{$t('margin')}}</p>
        <v-slider
          class="margin-top"
          thumb-label="always"
          ticks
          min="1"
          max="36"
          v-model="translationTextMargin"
        ></v-slider>
      </v-col>
    </v-row>

    <v-row class="margin-top">
      <v-col cols="3">
        <div class="text-h3 text-center">MeCab</div>
      </v-col>
      <v-col cols="4" style="display: flex">
        <v-switch v-model="showRomaji" style="margin-top: 0"></v-switch>
        <p style="color: white" class="text-center">{{$t('showRomaji')}}</p>
      </v-col>
    </v-row>

    <v-row class="margin-top">
      <v-col cols="3">
        <div class="text-h3 text-center">{{$t('backgroundColor')}}</div>
      </v-col>
      <v-col cols="9">
        <chrome-picker v-model="backgroundColor"></chrome-picker>
      </v-col>
    </v-row>

    <v-row class="margin-top">
      <v-col cols="3">
        <div class="text-h3 text-center">{{$t('help')}}</div>
      </v-col>
      <v-col cols="8">
        <div class="helpers">
          <div v-for="item in helperItems" :key="`helper-item-${item.text}`">
            <v-btn text icon dark large>
              <v-icon dark>{{item.icon}}</v-icon>
            </v-btn>
            <p style="color: white" class="text-helper">{{$t(item.text)}}</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row class="margin-top">
      <v-col cols="12" align="center">
        <v-btn color="primary" @click="toggleDevTools">{{$t('toggleDevTools')}}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { remote } from 'electron'
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { namespace, State } from 'vuex-class'

import { Chrome } from 'vue-color'

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
  get showRomaji () {
    return this.getMecab().showRomaji
  }
  set showRomaji (value: boolean) {
    this.$store.commit('Config/SET_MECAB_SHOW_ROMAJI', {
      value
    })
    this.$store.commit('Config/SAVE_GUI_CONFIG')
  }
  get autoHideTitlebar () {
    return this.getAutoHideTitlebar()
  }
  set autoHideTitlebar (value: boolean) {
    this.$store.commit('Config/SET_AUTO_HIDE_TITLEBAR', {
      value
    })
    this.$store.commit('Config/SAVE_GUI_CONFIG')
  }
  @namespace('Config').Getter('getOriginalText')
  public getOriginalText!: () => yuki.FontStyle
  @namespace('Config').Getter('getTranslationText')
  public getTranslationText!: () => yuki.TranslationTextStyle
  @namespace('Config').Getter('getBackgroundColor')
  public getBackgroundColor!: () => string
  @namespace('Config').Getter('getMecab')
  public getMecab!: () => yuki.Config.Gui['translatorWindow']['mecab']
  @namespace('Config').Getter('getAutoHideTitlebar')
  public getAutoHideTitlebar!: () => boolean

  @namespace('View').State('isWindowTooHigh') public isWindowTooHigh!: boolean

  public helperItems: Array<{
    text: string;
    icon: string;
  }> = [
    {
      text: 'previousText',
      icon: 'mdi-chevron-left'
    },
    {
      text: 'nextText',
      icon: 'mdi-chevron-right'
    },
    {
      text: 'returnToLatestText',
      icon: 'mdi-chevron-triple-right'
    },
    {
      text: 'alwaysOnTop',
      icon: 'mdi-lock'
    },
    {
      text: 'notAlwaysOnTop',
      icon: 'mdi-lock-open-outline'
    },
    {
      text: 'hide',
      icon: 'mdi-close'
    },
    {
      text: 'pauseNewText',
      icon: 'mdi-pause'
    },
    {
      text: 'restoreNewText',
      icon: 'mdi-play'
    }
  ]

  get classObject () {
    return {
      'small-margin': true,
      'fixed-scroll': !this.isWindowTooHigh,
      'fixed-scroll-margin-top': this.isWindowTooHigh
    }
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

  public toggleDevTools () {
    remote.getCurrentWebContents().toggleDevTools()
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
