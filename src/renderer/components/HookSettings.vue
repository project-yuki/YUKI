<template>
  <div>
    <p class="text-h1">文本钩子设置</p>
    <mu-button type="primary" @click="openInputHookDialog">加载钩子</mu-button>
    <mu-dialog title="请输入特殊码" :open.sync="openInputHook">
      <mu-text-field v-model="hookCode" :error-text="errorText"></mu-text-field>
      <mu-button slot="actions" flat @click="closeInputHookDialog">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="addHook">确定</mu-button>
    </mu-dialog>
    <mu-row gutter>
      <mu-col sm="12" md="6" lg="4" v-for="hook in hooks" :key="hook.handle" class="margin-top">
        <gt-hook-info :hook="hook" :isChosen="isChosen(hook.handle)"/>
      </mu-col>
    </mu-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { State, namespace } from "vuex-class";

import { ipcRenderer } from "electron";

import GtHookInfo from "@/components/HookSettingsHookInfo.vue";
import ipcTypes from "../../common/ipcTypes";

@Component({
  components: {
    GtHookInfo
  }
})
export default class HookSettings extends Vue {
  openInputHook = false;
  errorText = "";
  hookCode = "";

  @namespace("Hooks").State("hookInfos") hooks!: Yagt.TextOutputObject[];
  @namespace("Hooks").State("currentDisplayHookIndex") currentIndex!: number;

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
</style>
