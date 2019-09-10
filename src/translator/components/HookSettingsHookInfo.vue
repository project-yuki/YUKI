<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "waitForTexts...": "等待文本获取...",
    "choose": "选择"
  },
  "en": {
    "waitForTexts...": "Wait for texts...",
    "choose": "Choose"
  }
}
</i18n>

<template>
  <mu-scale-transition>
    <mu-paper :z-depth="zIndex" class="hook-info">
      <mu-row gutter align-content="center" wrap="wrap">
        <mu-col sm="12" md="4" lg="2" class="vertical-center">
          <strong>{{hook.name}}</strong>
        </mu-col>
        <mu-col sm="12" md="8" lg="3" class="vertical-center selectable">
          <div>{{hook.code}}</div>
        </mu-col>
        <mu-col sm="12" md="8" lg="5" class="vertical-center">
          <mu-text-field
            solo
            full-width
            disabled
            :value="lastHookText"
            :placeholder="$t('waitForTexts...')"
          />
        </mu-col>
        <mu-col sm="12" md="4" lg="2" class="vertical-center">
          <mu-button flat color="success" @click="chooseAsDisplay" v-show="!isChosen">
            {{$t('choose')}}
            <mu-icon right value="done"></mu-icon>
          </mu-button>
        </mu-col>
      </mu-row>
    </mu-paper>
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
