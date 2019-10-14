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
    "finish": "完成"
  },
  "en": {
    "chooseGamePath": "Choose Game Path",
    "gameName": "Game Name",
    "gamePath": "Game Path",
    "nextStep": "Next",
    "pleaseInputSpecialCodeEmptyIfNotNeeded": "Please input special code (empty if not needed)",
    "specialCode": "Special Code",
    "prevStep": "Prev",
    "finish": "Finish"
  }
}
</i18n>

<template>
  <div>
    <yk-page-header :title="$t('addGame')" />
    <yk-page-content>
      <mu-container>
        <mu-stepper :active-step="activeStep" orientation="vertical">
          <mu-step>
            <mu-step-label>{{$t('chooseGamePath')}}</mu-step-label>
            <mu-step-content>
              <mu-container style="padding-top: 16px">
                <mu-button color="secondary" @click="handleRequestGamePath">{{$t('chooseGamePath')}}</mu-button>
                <br />
                <br />
                <p>{{$t('gameName')}}</p>
                <mu-text-field full-width v-model="game.name" icon="videogame_asset"></mu-text-field>
                <p>{{$t('gamePath')}}</p>
                <mu-text-field
                  full-width
                  v-model="game.path"
                  disabled
                  multi-line
                  :rows-max="3"
                  icon="folder"
                ></mu-text-field>
                <br />
                <mu-button
                  class="demo-step-button"
                  color="primary"
                  @click="handleNext"
                  :disabled="isPathNull"
                >{{$t('nextStep')}}</mu-button>
              </mu-container>
            </mu-step-content>
          </mu-step>
          <mu-step>
            <mu-step-label>{{$t('inputSpecialCode')}}</mu-step-label>
            <mu-step-content>
              <mu-container>
                <p>{{$t('pleaseInputSpecialCodeEmptyIfNotNeeded')}}</p>
                <mu-text-field
                  full-width
                  v-model="game.code"
                  :label="$t('specialCode')"
                  label-float
                  icon="code"
                ></mu-text-field>
                <br />
                <mu-button flat class="demo-step-button" @click="handlePrev">{{$t('prevStep')}}</mu-button>
                <mu-button
                  class="demo-step-button"
                  color="primary"
                  @click="handleNext"
                >{{$t('finish')}}</mu-button>
              </mu-container>
            </mu-step-content>
          </mu-step>
        </mu-stepper>
      </mu-container>
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

import YkOneColumn from '@/components/OneColumn.vue'
import YkPageContent from '@/components/PageContent.vue'
import YkPageHeader from '@/components/PageHeader.vue'

@Component({
  components: {
    YkPageHeader,
    YkPageContent,
    YkOneColumn
  }
})
export default class FavoritePage extends Vue {
  public activeStep: number = -1
  public game: yuki.Game = {
    name: '',
    path: '',
    code: '',
    localeChanger: ''
  }

  @namespace('Config').State('default')
  public defaultConfig!: yuki.ConfigState['default']

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
        this.$alert('添加成功！', {
          type: 'success'
        }).then(() => {
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
