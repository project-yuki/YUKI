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
  <div class="small-margin fixed-scroll">
    <mu-button type="primary" @click="openInputHookDialog">{{$t('addHook')}}</mu-button>
    <mu-dialog :title="$t('inputSpecialCode')" :open.sync="openInputHook">
      <mu-text-field v-model="hookCode" :error-text="errorText"></mu-text-field>
      <mu-button slot="actions" flat @click="closeInputHookDialog">{{$t('cancel')}}</mu-button>
      <mu-button slot="actions" flat color="primary" @click="addHook">{{$t('ok')}}</mu-button>
    </mu-dialog>
    <yk-hook-info
      v-for="hook in orderedHooks"
      :hook="hook"
      :isChosen="isChosen(hook.handle)"
      :key="hook.handle + '-info'"
      class="hook-info"
    />
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

.hook-info {
  margin: 8px 0;
  text-align: center;
}
</style>
