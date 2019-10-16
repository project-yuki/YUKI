<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "waitForTexts...": "等待文本获取...",
    "choose": "选择",
    "lastText": "最新文本"
  },
  "en": {
    "waitForTexts...": "Wait for texts...",
    "choose": "Choose",
    "lastText": "Last Text"
  }
}
</i18n>

<template>
  <v-scroll-y-transition :appear="true">
    <v-card class="hook-info">
      <v-row justify="center" wrap="wrap">
        <v-col sm="12" md="12" lg="4" align="center" align-self="center">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>{{hook.name}}</v-list-item-title>
              <v-list-item-subtitle>{{hook.code}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col sm="12" md="8" lg="6" align="center" align-self="center">
          <v-text-field
            readonly
            dense
            persistent-hint
            counter
            :value="lastHookText"
            :hint="$t('lastText')"
            :placeholder="$t('waitForTexts...')"
          />
        </v-col>
        <v-col sm="12" md="4" lg="2" align="center" align-self="center">
          <v-btn rounded color="green" dark @click="chooseAsDisplay" v-show="!isChosen">
            {{$t('choose')}}
            <v-icon dark right>mdi-check</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-scroll-y-transition>
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

@Component
export default class HookSettingsHookInfo extends Vue {
  @Prop(Object)
  public hook!: yuki.TextThread
  @Prop(Boolean)
  public isChosen!: boolean

  @(namespace('Hooks').Getter('getLastTextByHandle'))
  public getLastTextByHandle!: (handle: number) => string
  @(namespace('Hooks').Action('chooseHookAsDisplay'))
  public chooseHookAsDisplayAction!: (id: number) => void

  public openConfirm = false

  get zIndex () {
    return this.isChosen ? 5 : 1
  }
  get lastHookText () {
    return this.getLastTextByHandle(this.hook.handle)
  }

  public openConfirmDialog () {
    this.openConfirm = true
  }
  public closeConfirmDialog () {
    this.openConfirm = false
  }
  public chooseAsDisplay () {
    this.chooseHookAsDisplayAction(this.hook.handle)
  }
}
</script>

<style scoped>
.hooker-textarea {
  padding: 0 16px;
}

.vertical-center {
  margin: auto;
}

.row {
  margin: 8px;
}

.selectable {
  -webkit-user-select: text;
}
</style>
