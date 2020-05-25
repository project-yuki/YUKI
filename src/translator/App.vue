<i18n src="../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "translate": "翻译",
    "textHookSettings": "文本钩子设置"
  },
  "en": {
    "translate": "Translate",
    "textHookSettings": "Text Hook Settings"
  }
}
</i18n>

<template>
  <v-app id="app">
    <div id="top" v-if="showTitlebar">
      <yk-titlebar></yk-titlebar>
    </div>
    <div id="content" :style="{marginTop: showTitlebar ? '32px' : '0'}">
      <div id="buttons-top" class="buttons" v-if="isButtonsShown && isWindowTooHigh">
        <v-btn small text dark to="/translate" style="width: 32%">{{$t('translate')}}</v-btn>
        <v-btn small text dark to="/hooks" style="width: 32%">{{$t('textHookSettings')}}</v-btn>
        <v-btn
          small
          text
          dark
          to="/settings"
          color="white"
          style="width: 32%"
        >{{$t('translatorSettings')}}</v-btn>
      </div>
      <router-view></router-view>
      <div id="buttons-bottom" class="buttons" v-if="isButtonsShown && (!isWindowTooHigh)">
        <v-btn small text dark to="/translate" style="width: 32%">{{$t('translate')}}</v-btn>
        <v-btn small text dark to="/hooks" style="width: 32%">{{$t('textHookSettings')}}</v-btn>
        <v-btn
          small
          text
          dark
          to="/settings"
          color="white"
          style="width: 32%"
        >{{$t('translatorSettings')}}</v-btn>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { ipcRenderer, remote } from 'electron'
import IpcTypes from '../common/IpcTypes'

import YkTitlebar from '@/components/Titlebar.vue'
import { updateWindowHeight } from './common/Window'

@Component({
  components: {
    YkTitlebar
  }
})
export default class App extends Vue {
  get backgroundColor () {
    return this.getBackgroundColor()
  }

  get showTitlebar () {
    return !this.getAutoHideTitlebar() || this.isButtonsShown
  }

  get currentId () {
    return this.getLastIndexByHandle(this.currentIndex)
  }
  get currentOriginText () {
    return this.getTextByHandleAndId(this.currentIndex, this.currentId)
  }
  @namespace('View').State('isButtonsShown') public isButtonsShown!: boolean
  @namespace('View').State('isWindowTooHigh') public isWindowTooHigh!: boolean
  @namespace('Config').Getter('getAutoHideTitlebar')
  public getAutoHideTitlebar!: () => boolean

  @namespace('Hooks').Getter('getTextByHandleAndId')
  public getTextByHandleAndId!: (handle: number, id: number) => string
  @namespace('Hooks').Getter('getLastIndexByHandle')
  public getLastIndexByHandle!: (handle: number) => number

  @namespace('Hooks').State('currentDisplayHookIndex')
  public currentIndex!: number

  @namespace('Config').Getter('getBackgroundColor')
  public getBackgroundColor!: () => string

  @namespace('View').State('isGetDictResult') public isGetDictResult!: boolean
  @Watch('backgroundColor')
  public onBackgroundColorChange () {
    document.body.style.backgroundColor = this.backgroundColor
  }

  public mounted () {
    let receivedCount = 0
    const callback = (event: Electron.Event, name: string, cfg: any) => {
      receivedCount++
      if (receivedCount < 3) ipcRenderer.once(IpcTypes.HAS_CONFIG, callback)

      if (name === 'game' && cfg.code === '') {
        this.$router.push('/hooks')
      }
    }
    ipcRenderer.once(IpcTypes.HAS_CONFIG, callback)

    ipcRenderer.send(IpcTypes.REQUEST_CONFIG, 'default')
    ipcRenderer.send(IpcTypes.REQUEST_CONFIG, 'game')
    ipcRenderer.send(IpcTypes.REQUEST_CONFIG, 'gui')

    this.$router.push('/translate')
    document.addEventListener('mouseenter', () => {
      this.$store.dispatch('View/setButtonsShown', true)
    })
    document.addEventListener('mouseleave', () => {
      if (this.$route.path === '/translate' && this.currentOriginText !== '') {
        this.$store.dispatch('View/setButtonsShown', false)
      }
    })
  }

  @Watch('currentIndex')
  public onCurrentIndexChanged () {
    this.$store.dispatch('View/setButtonsShown', false)
    this.$router.push('/translate')
    ipcRenderer.send(IpcTypes.REQUEST_TRANSLATION, {
      id: this.currentId,
      text: this.currentOriginText
    })
  }

  public updated () {
    if (this.$route.path === '/translate' && !this.isGetDictResult) {
      if (this.isButtonsShown && !this.isWindowTooHigh) {
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
}
</script>

<style>
* {
  margin: 0;
  border: 0;
  padding: 0;
}

#app .v-application--wrap {
  min-height: 0;
  height: inherit;
}

html::-webkit-scrollbar {
  display: none;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  background: none;
  display: block;
}

body {
  -webkit-user-select: none;
}

.text-h1,
.text-h2,
.text-h3,
.text-p {
  color: white;
}

.text-h1 {
  font-size: 32px;
}

.text-h2 {
  font-size: 24px;
}

.text-h3 {
  font-size: 16px;
}

.text-p {
  font-size: 14px;
}

.text-center {
  text-align: center;
  padding-top: 4px;
}

.no-margin {
  width: 100%;
  margin: 0;
}

.small-margin {
  margin: 16px;
}

.full-height {
  height: 100%;
}

.full {
  width: 100%;
  height: 100%;
}

.div {
  margin: 0;
}

#app #top {
  position: fixed;
  width: 100%;
  z-index: 999;
  top: 0;
}

#app #content #buttons-top {
  width: 100%;
  margin-left: 16px;
}

#app #content #buttons-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 16px;
}

#app #content .buttons .v-btn {
  text-align: center;
}

.fixed-scroll {
  margin: 0 auto;
  padding: 16px;
  position: fixed;
  top: 32px;
  width: 100%;
  height: 88%;
  overflow-x: hidden;
  overflow-y: scroll;
}

.fixed-scroll-margin-top {
  margin: 0 auto;
  padding: 16px;
  position: fixed;
  top: 64px;
  width: 100%;
  height: 88%;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
