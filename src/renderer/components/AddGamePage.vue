<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "chooseGamePath": "选择游戏路径",
    "gameName": "游戏名称",
    "gamePath": "游戏路径",
    "nextStep": "下一步",
    "pleaseInputSpecialCodeEmptyIfNotNeeded": "请输入特殊码（如果无需则为空）",
    "specialCode": "特殊码",
    "prevStep": "上一步",
    "finish": "完成",
    "gameAdded": "添加成功！"
  },
  "en": {
    "chooseGamePath": "Choose Game Path",
    "gameName": "Game Name",
    "gamePath": "Game Path",
    "nextStep": "Next",
    "pleaseInputSpecialCodeEmptyIfNotNeeded": "Please input special code (empty if not needed)",
    "specialCode": "Special Code",
    "prevStep": "Prev",
    "finish": "Finish",
    "gameAdded": "Game Added!"
  }
}
</i18n>

<template>
  <div>
    <yk-page-header :title="$t('addGame')" />
    <yk-page-content>
      <v-stepper v-model="activeStep" vertical class="elevation-0" style="background: none">
        <v-stepper-step :complete="activeStep > 1" step="1">{{$t('chooseGamePath')}}</v-stepper-step>
        <v-stepper-content step="1">
          <v-btn color="secondary" @click="handleRequestGamePath">{{$t('chooseGamePath')}}</v-btn>
          <br />
          <br />
          <br />
          <p>{{$t('gameName')}}</p>
          <v-text-field v-model="game.name" prepend-icon="mdi-gamepad-square"></v-text-field>
          <p>{{$t('gamePath')}}</p>
          <v-textarea v-model="game.path" disabled rows="1" auto-grow prepend-icon="mdi-folder"></v-textarea>
          <br />
          <v-btn color="primary" @click="handleNext" :disabled="isNameOrPathNull">{{$t('nextStep')}}</v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="activeStep > 2" step="2">{{$t('inputSpecialCode')}}</v-stepper-step>
        <v-stepper-content step="2">
          <p>{{$t('pleaseInputSpecialCodeEmptyIfNotNeeded')}}</p>
          <v-text-field v-model="game.code" :label="$t('specialCode')" prepend-icon="mdi-code-tags"></v-text-field>
          <br />
          <v-btn @click="handlePrev">{{$t('prevStep')}}</v-btn>
          <v-btn color="primary" @click="handleNext">{{$t('finish')}}</v-btn>
        </v-stepper-content>
      </v-stepper>
    </yk-page-content>
  </div>
</template>

<script lang="ts">
import {
  ipcRenderer
} from 'electron'
import Vue from 'vue'
import {
  Component
} from 'vue-property-decorator'
import {
  namespace,
  State
} from 'vuex-class'
import IpcTypes from '../../common/IpcTypes'

import YkPageContent from '@/components/PageContent.vue'
import YkPageHeader from '@/components/PageHeader.vue'

@Component({
  components: {
    YkPageHeader,
    YkPageContent
  }
})
export default class FavoritePage extends Vue {
  public activeStep: number = 1
  public game: yuki.Game = {
    name: '',
    path: '',
    code: '',
    localeChanger: ''
  }

  @namespace('Config').State('default')
  public defaultConfig!: yuki.ConfigState['default']

  get showStepOne () {
    return this.activeStep === 1
  }
  get showStepTwo () {
    return this.activeStep === 2
  }
  get finished () {
    return this.activeStep > 2
  }
  get isNameOrPathNull () {
    return this.game.path === '' || this.game.name === ''
  }

  public handleNext () {
    this.activeStep++
    if (this.finished) {
      ipcRenderer.once(IpcTypes.HAS_ADDED_GAME, () => {
        this.$dialog.notify.success(this.$i18n.t('gameAdded').toString())
        this.handleRedirect()
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
    this.activeStep = 1
  }
}
</script>

<style scoped>
</style>
