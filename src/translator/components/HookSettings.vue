<template>
  <div class="small-margin fixed-scroll">
    <mu-button type="primary" @click="openInputHookDialog">加载钩子</mu-button>
    <mu-dialog title="请输入特殊码" :open.sync="openInputHook">
      <mu-text-field v-model="hookCode" :error-text="errorText"></mu-text-field>
      <mu-button slot="actions" flat @click="closeInputHookDialog">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="addHook">确定</mu-button>
    </mu-dialog>
    <gt-hook-info
      v-for="hook in orderedHooks"
      :hook="hook"
      :isChosen="isChosen(hook.handle)"
      :key="hook.handle + '-info'"
      class="hook-info"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { State, namespace } from "vuex-class";

import { ipcRenderer } from "electron";

import GtHookInfo from "@/components/HookSettingsHookInfo.vue";
import IpcTypes from "../../common/ipcTypes";

import * as _ from "lodash";

@Component({
  components: {
    GtHookInfo
  }
})
export default class HookSettings extends Vue {
  openInputHook = false;
  errorText = "";
  hookCode = "";

  get orderedHooks() {
    return _.orderBy(
      this.hooks,
      (hook: Yagt.TextThread) => this.texts[hook.handle].length,
      "desc"
    );
  }

  @(namespace("Hooks").State("hookInfos"))
  hooks!: Yagt.TextThread[];
  @(namespace("Hooks").State("texts"))
  texts!: string[];
  @(namespace("Hooks").State("currentDisplayHookIndex"))
  currentIndex!: number;

  openInputHookDialog() {
    this.openInputHook = true;
  }
  closeInputHookDialog() {
    this.openInputHook = false;
    this.hookCode = "";
    this.errorText = "";
  }
  addHook() {
    if (new RegExp(/\/H\w+/).test(this.hookCode)) {
      ipcRenderer.send(IpcTypes.REQUEST_INSERT_HOOK, this.hookCode);
      this.closeInputHookDialog();
    } else {
      this.errorText = "特殊码格式不正确";
    }
  }
  isChosen(num: number) {
    return this.currentIndex === num;
  }

  mounted() {}
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
