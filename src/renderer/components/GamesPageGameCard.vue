<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "run": "运行",
    "confirmDelete": "确认删除？",
    "deleteSuccess": "删除成功！"
  },
  "en": {
    "run": "Run",
    "confirmDelete": "Are you sure to delete this game?",
    "deleteSuccess": "Successfully deleted!"
  }
}
</i18n>

<template>
  <mu-scale-transition>
    <mu-card>
      <mu-card-title :title="game.name" :sub-title="game.code"></mu-card-title>
      <mu-card-text>{{game.path}}</mu-card-text>
      <mu-card-actions style="padding: 8px 0">
        <mu-expansion-panel :zDepth="0">
          <div slot="header">
            <mu-button color="primary" @click.stop="handleRunGame">{{$t('run')}}</mu-button>
            <mu-button color="error" @click.stop="handleDeleteConfirm">{{$t('delete')}}</mu-button>
          </div>
          <mu-select
            :label="$t('localeChanger')"
            v-model="selectedLocaleChanger"
            full-width
            @change="updateLocaleChanger"
          >
            <mu-option
              v-for="(value, key) in defaultConfig.localeChangers"
              :key="game.name+'-changer-'+key"
              :value="value.name"
              :label="value.name"
            ></mu-option>
          </mu-select>
        </mu-expansion-panel>
      </mu-card-actions>
    </mu-card>
  </mu-scale-transition>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop
} from 'vue-property-decorator'
import {
  namespace,
  State
} from 'vuex-class'

import {
  ipcRenderer
} from 'electron'
import IpcTypes from '../../common/IpcTypes'

import * as _ from 'lodash'

@Component
export default class HookSettingsHookInfo extends Vue {
  @Prop()
  public game!: yuki.Game

  @(namespace('Config').State('default'))
  public defaultConfig!: yuki.ConfigState['default']
  @(namespace('Config').State('games'))
  public gamesConfig!: yuki.ConfigState['games']
  public selectedLocaleChanger: string = ''

  public handleDeleteConfirm () {
    this.$confirm(this.$i18n.t('confirmDelete').toString(), {
      type: 'warning',
      okLabel: this.$i18n.t('ok').toString(),
      cancelLabel: this.$i18n.t('cancel').toString()
    }).then(({
      result
    }) => {
      if (result) {
        this.handleDeleteGame()
        this.$toast.success(this.$i18n.t('deleteSuccess').toString())
      }
    })
  }
  public handleRunGame () {
    ipcRenderer.send(IpcTypes.REQUEST_RUN_GAME, this.game)
  }
  public handleDeleteGame () {
    ipcRenderer.send(IpcTypes.REQUEST_REMOVE_GAME, this.game)
  }

  public updateLocaleChanger () {
    const savingConfig = _.cloneDeep(this.gamesConfig)
    const thisGame = savingConfig.find((game) => game.name === this.game.name)
    if (!thisGame) return

    for (const key in this.defaultConfig.localeChangers) {
      if (
        this.defaultConfig.localeChangers[key].name !==
        this.selectedLocaleChanger
      ) {
        continue
      }

      thisGame.localeChanger = key
    }

    ipcRenderer.send(IpcTypes.REQUEST_SAVE_CONFIG, 'games', savingConfig)
  }

  public beforeMount () {
    this.selectedLocaleChanger = this.defaultConfig.localeChangers[
      this.game.localeChanger
    ].name
  }
}
</script>

<style scoped>
.hooker-textarea {
  padding: 8px;
}

.half-width {
  width: 49%;
}
</style>
