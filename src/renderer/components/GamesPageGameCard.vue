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
  <v-card shaped>
    <v-card-title>{{game.name}}</v-card-title>
    <v-card-subtitle>{{game.code}}</v-card-subtitle>
    <v-card-text>{{game.path}}</v-card-text>
    <v-card-actions>
      <v-btn outlined color="primary" @click.stop="handleRunGame">{{$t('run')}}</v-btn>
      <v-btn outlined color="error" @click.stop="handleDeleteConfirm">{{$t('delete')}}</v-btn>
      <v-spacer></v-spacer>

      <v-btn icon @click="showExpansion = !showExpansion">
        <v-icon>{{ showExpansion ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="showExpansion">
        <v-divider></v-divider>

        <v-container>
          <v-radio-group
            v-model="selectedLocaleChanger"
            @change="updateLocaleChanger"
            :label="$t('localeChanger')"
          >
            <v-radio
              v-for="(value, key) in defaultConfig.localeChangers"
              :key="game.name+'-changer-'+key"
              :value="value.name"
              :label="value.name"
            ></v-radio>
          </v-radio-group>
        </v-container>
      </div>
    </v-expand-transition>
  </v-card>
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
  public showExpansion: boolean = false

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
</style>
