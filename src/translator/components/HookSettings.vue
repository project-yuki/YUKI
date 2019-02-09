<template>
  <div class="small-margin" id="hook-settings">
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
import ipcTypes from "../../common/ipcTypes";

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
      (hook: Yagt.TextOutputObject) => this.texts[hook.handle].length,
      "desc"
    );
  }

  @namespace("Hooks").State("hookInfos")
  hooks!: Yagt.TextOutputObject[];
  @namespace("Hooks").State("texts")
  texts!: string[];
  @namespace("Hooks").State("currentDisplayHookIndex")
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
      ipcRenderer.send(ipcTypes.REQUEST_INSERT_HOOK, this.hookCode);
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

.small-margin {
  margin: 16px;
}

.hook-info {
  margin: 8px 0;
  text-align: center;
}

#hook-settings {
  margin: 0 auto;
  padding: 16px;
  position: fixed;
  top: 32px;
  width: 100%;
  height: 88%;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
