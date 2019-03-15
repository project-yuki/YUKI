<template>
  <div>
    <gt-page-header title="添加游戏"/>
    <gt-page-content>
      <mu-container>
        <mu-stepper :active-step="activeStep" orientation="vertical">
          <mu-step>
            <mu-step-label>选择游戏路径</mu-step-label>
            <mu-step-content>
              <mu-container style="padding-top: 16px">
                <mu-button color="secondary" @click="handleRequestGamePath">选择游戏路径</mu-button>
                <br>
                <br>
                <p>游戏名称</p>
                <mu-text-field full-width v-model="game.name" icon="videogame_asset"></mu-text-field>
                <p>游戏路径</p>
                <mu-text-field
                  full-width
                  v-model="game.path"
                  disabled
                  multi-line
                  :rows-max="3"
                  icon="folder"
                ></mu-text-field>
                <br>
                <mu-button
                  class="demo-step-button"
                  color="primary"
                  @click="handleNext"
                  :disabled="isPathNull"
                >下一步</mu-button>
              </mu-container>
            </mu-step-content>
          </mu-step>
          <mu-step>
            <mu-step-label>输入特殊码</mu-step-label>
            <mu-step-content>
              <mu-container>
                <p>请输入特殊码（如果无需则为空）</p>
                <mu-text-field full-width v-model="game.code" label="特殊码" label-float icon="code"></mu-text-field>
                <br>
                <mu-button flat class="demo-step-button" @click="handlePrev">上一步</mu-button>
                <mu-button class="demo-step-button" color="primary" @click="handleNext">完成</mu-button>
              </mu-container>
            </mu-step-content>
          </mu-step>
        </mu-stepper>
      </mu-container>
    </gt-page-content>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron'
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { namespace, State } from 'vuex-class'
import IpcTypes from '../../common/IpcTypes'

import GtOneColumn from '@/components/OneColumn.vue'
import GtPageContent from '@/components/PageContent.vue'
import GtPageHeader from '@/components/PageHeader.vue'

@Component({
  components: {
    GtPageHeader,
    GtPageContent,
    GtOneColumn
  }
})
export default class FavoritePage extends Vue {
  public activeStep: number = -1
  public game: Yagt.Game = {
    name: '',
    path: '',
    code: '',
    localeChanger: ''
  }

  @(namespace('Config').State('default'))
  public defaultConfig!: Yagt.ConfigState['default']

  get showStepOne () {
    return this.activeStep === 0
  }
  get showStepTwo () {
    return this.activeStep === 1
  }
  get finished () {
    return this.activeStep > 1
  }
  get isPathNull () {
    return this.game.path === ''
  }

  public handleNext () {
    this.activeStep++
    if (this.finished) {
      ipcRenderer.once(IpcTypes.HAS_ADDED_GAME, () => {
        this.$alert('添加成功！', { type: 'success' }).then(() => {
          this.handleRedirect()
        })
      })
      const localeChangers = this.defaultConfig.localeChangers
      for (const key in localeChangers) {
        if (localeChangers[key].enable === true) {
          this.game.localeChanger = key
          break
        }
      }
      ipcRenderer.send(IpcTypes.REQUEST_ADD_GAME, this.game)
    }
  }
  public handlePrev () {
    this.activeStep--
  }
  public handleRequestGamePath () {
    ipcRenderer.once(
      IpcTypes.HAS_NEW_GAME_PATH,
      (event: Electron.Event, gamePath: string) => {
        this.game.path = gamePath
        if (this.game.name === '') {
          this.game.name = gamePath.substring(
            gamePath.lastIndexOf('\\') + 1,
            gamePath.lastIndexOf('.exe')
          )
        }
      }
    )
    ipcRenderer.send(IpcTypes.REQUEST_NEW_GAME_PATH)
  }
  public handleRedirect () {
    this.$router.push('/games')
  }

  public mounted () {
    this.activeStep = 0
  }
}
</script>

<style scoped>
</style>
