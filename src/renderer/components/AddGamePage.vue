<template>
<div>
  <gt-page-header title="添加游戏" />
  <gt-page-content>
    <mu-row class="full-height">
      <mu-col span="2"></mu-col>
      <mu-col span="8" class="full-height">
        <mu-stepper :active-step="activeStep">
          <mu-step>
            <mu-step-label>
              选择游戏路径
            </mu-step-label>
          </mu-step>
          <mu-step>
            <mu-step-label>
              输入特殊码
            </mu-step-label>
          </mu-step>
        </mu-stepper>
        <div style="position: relative; height: 72%">
          <mu-scale-transition>
            <mu-card class="full" style="position: absolute; padding: 24px;" v-show="showStepOne">
              <mu-button color="secondary" @click="handleRequestGamePath">选择游戏路径</mu-button>
              <br/>
              <br/>
              <p>游戏名称</p>
              <mu-text-field full-width v-model="gameName" icon="videogame_asset"></mu-text-field>
              <p>游戏路径</p>
              <mu-text-field full-width v-model="gamePath" disabled multi-line :rows-max="3" icon="folder"></mu-text-field>
              <br/>
            </mu-card>
          </mu-scale-transition>

          <mu-scale-transition>
            <mu-card class="full" style="position: absolute; padding: 24px;" v-show="showStepTwo">
              <p class="text-h2">请输入特殊码（如果无需则为空）</p>
              <br/>
              <mu-text-field full-width v-model="gameCode" label="特殊码" label-float icon="code"></mu-text-field>
              <br/>
            </mu-card>
          </mu-scale-transition>
        </div>

        <div style="position: relative; margin-top: 24px;">
          <mu-button flat class="demo-step-button" :disabled="activeStep === 0" @click="handlePrev"> 上一步 </mu-button>
          <mu-button class="demo-step-button" color="primary" @click="handleNext"> {{activeStep === 1 ? '完成' : '下一步'}} </mu-button>
        </div>
      </mu-col>
      <mu-col span="2"></mu-col>
    </mu-row>
    </gt-page-content>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ipcRenderer } from 'electron'
import {
  Component
} from 'vue-property-decorator'

import GtPageHeader from '@/components/PageHeader.vue'
import GtPageContent from '@/components/PageContent.vue'
import ipcTypes from '../../common/ipcTypes';

@Component({
  components: {
    GtPageHeader,
    GtPageContent
  }
})
export default class FavoritePage extends Vue {
  activeStep: number = -1
  gameName: string = ''
  gamePath: string = ''
  gameCode: string = ''

  get showStepOne() {
    return this.activeStep === 0
  }
  get showStepTwo() {
    return this.activeStep === 1
  }
  get finished() {
    return this.activeStep > 1;
  }

  handleNext() {
    this.activeStep++
    if (this.finished) {

    }
  }
  handlePrev() {
    this.activeStep--
  }
  handleRequestGamePath() {
    ipcRenderer.once(ipcTypes.HAS_NEW_GAME_PATH, (event: Electron.Event, gamePath: string) => {
      this.gamePath = gamePath
      if (this.gameName === '') {
        this.gameName = gamePath.substring(
          gamePath.lastIndexOf('\\') + 1, 
          gamePath.lastIndexOf('.exe')
        )
      }
    })
    ipcRenderer.send(ipcTypes.REQUEST_NEW_GAME_PATH)
  }

  mounted() {
    this.activeStep = 0
  }
}
</script>

<style scoped>
</style>
