<template>
  <div class="small-margin fixed-scroll">
    <mu-button type="primary" @click="openInputHookDialog">加载钩子</mu-button>
    <mu-dialog title="请输入特殊码" :open.sync="openInputHook">
      <mu-text-field v-model="hookCode" :error-text="errorText"></mu-text-field>
      <mu-button slot="actions" flat @click="closeInputHookDialog">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="addHook">确定</mu-button>
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
    return _.orderBy(
      this.hooks,
      (hook: yuki.TextThread) => this.texts[hook.handle].length,
      'desc'
    )
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
      this.errorText = '特殊码格式不正确'
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
