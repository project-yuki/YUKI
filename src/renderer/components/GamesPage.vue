<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "nothingHere": "什么都没有呢(っ °Д °;)っ",
    "goAddSomeGames": "快去添加游戏吧~ヾ(•ω•`)o",
    "startFromProcess": "从进程启动",
    "start": "启动"
  },
  "en": {
    "nothingHere": "Hmmm nothing here (っ °Д °;)っ",
    "goAddSomeGames": "Go add some games now~ヾ(•ω•`)o",
    "startFromProcess": "Start From Process",
    "start": "Start"
  }
}
</i18n>

<template>
  <div>
    <yk-page-header :title="$t('myGames')" />
    <yk-page-content>
      <v-toolbar dense color="white">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          @click="startFromProcess"
          :loading="showLoaders"
        >{{$t('startFromProcess')}}</v-btn>
      </v-toolbar>

      <v-dialog v-model="showDialog" max-width="640px">
        <v-card>
          <v-card-title>
            <span class="headline">{{$t('startFromProcess')}}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-autocomplete
                v-model="selectedProcess"
                :items="getProcessesWithText()"
                item-value="pid"
                return-object
                single-line
              ></v-autocomplete>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">{{$t('cancel')}}</v-btn>
            <v-btn color="blue darken-1" text @click="startGame">{{$t('start')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <p v-show="noGame" class="all-center text-h3">
        {{$t('nothingHere')}}
        <br />
        {{$t('goAddSomeGames')}}
      </p>

      <v-row>
        <v-col sm="12" md="6" lg="4" v-for="game in games" :key="game.path">
          <v-scroll-y-transition :appear="true">
            <yk-game-card :game="game"></yk-game-card>
          </v-scroll-y-transition>
        </v-col>
      </v-row>
    </yk-page-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import YkGameCard from '@/components/GamesPageGameCard.vue'
import YkPageContent from '@/components/PageContent.vue'
import YkPageHeader from '@/components/PageHeader.vue'
import { ipcRenderer } from 'electron'
import IpcTypes from '../../common/IpcTypes'

@Component({
  components: {
    YkPageHeader,
    YkPageContent,
    YkGameCard
  }
})
export default class GamesPage extends Vue {
  @namespace('Config').State('games') public games!: yuki.Game[]

  @namespace('Gui').State('noGame') public noGame!: boolean
  @namespace('Gui').State('processes') public processes!: yuki.Processes
  @namespace('Gui').Getter('getProcessesWithText')
  public getProcessesWithText!: () => yuki.ProcessesWithText

  public showDialog: boolean = false
  public showLoaders: boolean = false
  public selectedProcess: yuki.Process = { name: '', pid: -1 }

  @Watch('processes', {
    immediate: true,
    deep: true
  })
  public onProcessesUpdate () {
    if (this.processes.length !== 0 && this.showLoaders === true) {
      this.showDialog = true
      this.showLoaders = false
    }
  }

  public closeDialog () {
    this.showDialog = false
    this.selectedProcess = { name: '', pid: -1 }
    this.$store.commit('Gui/SET_PROCESSES', { value: [] })
  }

  public startFromProcess () {
    ipcRenderer.send(IpcTypes.REQUEST_PROCESSES)
    this.showLoaders = true
  }

  public startGame () {
    ipcRenderer.send(IpcTypes.REQUEST_RUN_GAME, undefined, this.selectedProcess)
    this.closeDialog()
  }
}
</script>

<style>
.margin-bottom {
  margin-bottom: 24px;
}
</style>
