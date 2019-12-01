<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "addHook": "加载钩子",
    "invalidHookFormat": "特殊码格式不正确"
  },
  "en": {
    "addHook": "Add Hook",
    "invalidHookFormat": "Invalid hook format"
  }
}
</i18n>

<template>
  <div :class="classObject">
    <v-btn type="primary" @click="openInputHookDialog">{{$t('addHook')}}</v-btn>

    <v-dialog v-model="openInputHook" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('inputSpecialCode')}}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-text-field v-model="hookCode" :error-messages="errorText" :label="$t('specialCode')"></v-text-field>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeInputHookDialog">{{$t('cancel')}}</v-btn>
          <v-btn color="primary" text @click="addHook">{{$t('ok')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <yk-hook-info v-for="hook in orderedHooks" :hook="hook" :isChosen="isChosen(hook.handle)" :key="hook.handle + '-info'" class="hook-info" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component
} from 'vue-property-decorator'
import {
  namespace,
  State
} from 'vuex-class'

import {
  ipcRenderer
} from 'electron'

import YkHookInfo from '@/components/HookSettingsHookInfo.vue'
import IpcTypes from '../../common/IpcTypes'

import * as _ from 'lodash'

@Component({
  components: {
    YkHookInfo
  }
})
export default class HookSettings extends Vue {
  public openInputHook = false
  public errorText = ''
  public hookCode = ''

  get orderedHooks () {
    const selected = this.hooks.find((h) => h.handle === this.currentIndex)
    if (selected) {
      const result = _.orderBy(
        _.without(this.hooks, selected),
        (hook: yuki.TextThread) => this.texts[hook.handle].length,
        'desc'
      )
      result.unshift(selected)
      return result
    } else {
      return _.orderBy(
        this.hooks,
        (hook: yuki.TextThread) => this.texts[hook.handle].length,
        'desc'
      )
    }
  }

  @(namespace('Hooks').State('hookInfos'))
  public hooks!: yuki.TextThread[]
  @(namespace('Hooks').State('texts'))
  public texts!: string[]
  @(namespace('Hooks').State('currentDisplayHookIndex'))
  public currentIndex!: number
  @(namespace('View').State('isWindowTooHigh'))
  public isWindowTooHigh!: boolean

  get classObject () {
    return {
      'small-margin': true,
      'fixed-scroll': !this.isWindowTooHigh,
      'fixed-scroll-margin-top': this.isWindowTooHigh
    }
  }

  public openInputHookDialog () {
    this.openInputHook = true
  }
  public closeInputHookDialog () {
    this.openInputHook = false
    this.hookCode = ''
    this.errorText = ''
  }
  public addHook () {
    if (new RegExp(/\/H\w+/).test(this.hookCode)) {
      ipcRenderer.send(IpcTypes.REQUEST_INSERT_HOOK, this.hookCode)
      this.closeInputHookDialog()
    } else {
      this.errorText = this.$i18n.t('invalidHookFormat').toString()
    }
  }
  public isChosen (num: number) {
    return this.currentIndex === num
  }
}
</script>

<style scoped>
.margin-top {
  margin-top: 1em;
}
</style>
