<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "run": "运行",
    "confirmDelete": "确认删除？",
    "deleteSuccess": "删除成功！",
    "saveSuccess": "保存成功！",
    "openFolder": "打开文件夹"
  },
  "en": {
    "run": "Run",
    "confirmDelete": "Are you sure to delete this game?",
    "deleteSuccess": "Successfully deleted!",
    "saveSuccess": "Successfully saved!",
    "openFolder": "Open game folder"
  }
}
</i18n>

<template>
<v-hover v-slot:default="{ hover }">
  <v-card :elevation="hover ? 8 : 2">
    <v-card-title>{{game.name}}</v-card-title>
    <v-card-subtitle>{{game.code}}</v-card-subtitle>
    <v-card-text>{{game.path}}</v-card-text>
    <v-card-actions>
      <v-btn rounded color="primary" min-width="40%" @click.stop="handleRunGame" :loading="showLoaders" :disabled="showLoaders">
        {{$t('run')}}
        <v-icon right dark>mdi-play</v-icon>
      </v-btn>
      <v-btn rounded color="error" min-width="40%" @click.stop="handleDeleteConfirm">
        {{$t('delete')}}
        <v-icon right dark>mdi-delete</v-icon>
      </v-btn>
      <v-spacer></v-spacer>

      <v-btn icon @click="showExpansion = !showExpansion">
        <v-icon>{{ showExpansion ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="showExpansion">
        <v-divider></v-divider>

        <v-container>
          <v-radio-group v-model="selectedLocaleChanger" :label="$t('localeChanger')">
            <v-radio v-for="(value, key) in defaultConfig.localeChangers" :key="game.name+'-changer-'+key" :value="value.name" :label="value.name"></v-radio>
          </v-radio-group>

          <v-text-field v-model="code" :label="$t('specialCode')">
          </v-text-field>

          <v-btn @click="save">
            {{$t('save')}}
          </v-btn>

          <v-btn @click="openFolder">
            {{$t('openFolder')}}
          </v-btn>
        </v-container>
      </div>
    </v-expand-transition>
  </v-card>
</v-hover>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop,
  Watch
} from 'vue-property-decorator'
import {
  namespace,
  State
} from 'vuex-class'

import {
  ipcRenderer,
  remote
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
  @(namespace('Gui').State('isGameStartingEnded'))
  public isGameStartingEnded!: yuki.GuiState['isGameStartingEnded']

  public selectedLocaleChanger: string = ''
  public code: string = ''
  public showExpansion: boolean = false
  public showLoaders: boolean = false

  @Watch('isGameStartingEnded', {
    immediate: true,
    deep: true
  })
  public checkGameStartingEnded (newValue: boolean) {
    this.showLoaders = false
    if (newValue === true) {
      this.$store.commit('Gui/SET_GAME_STARTING_ENDED', { value: false })
    }
  }

  public handleDeleteConfirm () {
    this.$dialog.confirm({
      text: this.$i18n.t('confirmDelete').toString(),
      type: 'warning',
      actions: {
        false: this.$i18n.t('cancel').toString(),
        true: {
          text: this.$i18n.t('ok').toString(),
          handle: () => {
            this.handleDeleteGame()
            this.$dialog.notify.success(this.$i18n.t('deleteSuccess').toString())
          }
        }
      }
    })
  }
  public handleRunGame () {
    this.showLoaders = true
    ipcRenderer.send(IpcTypes.REQUEST_RUN_GAME, this.game)
  }
  public handleDeleteGame () {
    ipcRenderer.send(IpcTypes.REQUEST_REMOVE_GAME, this.game)
  }

  public save () {
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
      thisGame.code = this.code
    }

    ipcRenderer.send(IpcTypes.REQUEST_SAVE_CONFIG, 'games', savingConfig)
    this.$dialog.notify.success(this.$i18n.t('saveSuccess').toString())
  }

  public openFolder () {
    remote.shell.showItemInFolder(this.game.path)
  }

  public beforeMount () {
    this.selectedLocaleChanger = this.defaultConfig.localeChangers[
      this.game.localeChanger
    ].name
    this.code = this.game.code
  }
}
</script>

<style scoped>
</style>
