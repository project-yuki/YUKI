<template>
  <div id="app">
    <div id="top">
      <yk-titlebar></yk-titlebar>
    </div>
    <div id="content">
      <router-view></router-view>
      <div id="buttons" v-if="isButtonsShown">
        <mu-button small flat to="/translate" color="white" style="width: 32%">翻译</mu-button>
        <mu-button small flat to="/hooks" color="white" style="width: 32%">文本钩子设置</mu-button>
        <mu-button small flat to="/settings" color="white" style="width: 32%">翻译器设置</mu-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Watch
} from 'vue-property-decorator'
import {
  namespace
} from 'vuex-class'

import {
  ipcRenderer,
  remote
} from 'electron'
import IpcTypes from '../common/IpcTypes'

import YkTitlebar from '@/components/Titlebar.vue'

@Component({
  components: {
    YkTitlebar
  }
})
export default class App extends Vue {
  @(namespace('View').State('isButtonsShown'))
  public isButtonsShown!: boolean

  @(namespace('Hooks').Getter('getLastTextById'))
  public getLastTextById!: (id: number) => string

  @(namespace('Hooks').State('currentDisplayHookIndex'))
  public currentIndex!: number

  @(namespace('Config').Getter('getBackgroundColor'))
  public getBackgroundColor!: () => string
  get backgroundColor () {
    return this.getBackgroundColor()
  }
  @Watch('backgroundColor')
  public onBackgroundColorChange () {
    document.body.style.backgroundColor = this.backgroundColor
  }

  get currentOriginText () {
    return this.getLastTextById(this.currentIndex)
  }

  public mounted () {
    this.$router.push('/translate')
    document.addEventListener('mouseenter', () => {
      this.$store.dispatch('View/setButtonsShown', true)
    })
    document.addEventListener('mouseleave', () => {
      if (this.currentOriginText !== '') {
        this.$store.dispatch('View/setButtonsShown', false)
      }
    })

    ipcRenderer.send(IpcTypes.REQUEST_CONFIG, 'default')
    ipcRenderer.send(IpcTypes.REQUEST_CONFIG, 'game')
    ipcRenderer.send(IpcTypes.REQUEST_CONFIG, 'gui')
    const callback = (event: Electron.Event, name: string, cfg: any) => {
      if (name !== 'game') ipcRenderer.once(IpcTypes.HAS_CONFIG, callback)
      else if (cfg.code === '') {
        this.$router.push('/hooks')
      }
    }
    ipcRenderer.once(IpcTypes.HAS_CONFIG, callback)
  }

  public updateWindowHeight (offset: number) {
    const newHeight = document.body.offsetHeight + offset
    const window = remote.getCurrentWindow()
    const width = window.getSize()[0]
    window.setSize(width, newHeight)
  }

  @Watch('currentIndex')
  public onCurrentIndexChanged () {
    this.$store.dispatch('View/setButtonsShown', false)
    this.$router.push('/translate')
    ipcRenderer.send(IpcTypes.REQUEST_TRANSLATION, this.currentOriginText)
  }

  public updated () {
    if (this.$router.currentRoute.path === '/translate') {
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
}
</script>

<style>
* {
  margin: 0;
}

html::-webkit-scrollbar {
  display: none;
}

html,
body,
#app {
  min-width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
  background: none;
}

body {
  -webkit-user-select: none;
}

.text-h1,
.text-h2,
.text-h3 {
  color: white;
}

.text-h1 {
  font-size: 32px;
}

.text-h2 {
  font-size: 24px;
}

.text-h3 {
  font-size: 18px;
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

#app #content {
  margin-top: 32px;
}

#app #content #buttons {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 16px;
}

#app #content #buttons .mu-button {
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
</style>
