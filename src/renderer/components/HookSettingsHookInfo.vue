<template>
<mu-scale-transition>
  <mu-paper :z-depth="zIndex">
    <mu-card>
      <mu-card-header :title="hook.name" :sub-title="hook.hcode" />
      <mu-text-field multi-line full-width :value="hookText" :rows="8" placeholder="等待文本获取..." class="hooker-textarea" />
      <mu-flex justify-content="end">
        <mu-button fab small color="success" @click="chooseAsDisplay" v-show="!isChosen">
          <mu-icon value="done"></mu-icon>
        </mu-button>
        <mu-button fab small color="error" @click="openConfirmDialog" style="margin-left: 8px;">
          <mu-icon value="delete"></mu-icon>
        </mu-button>
        <mu-dialog title="Dialog" width="360" :open.sync="openConfirm">
          确认卸载钩子？
          <mu-button slot="actions" flat @click="closeConfirmDialog">否</mu-button>
          <mu-button slot="actions" flat color="primary" @click="removeHook">是</mu-button>
        </mu-dialog>
      </mu-flex>
    </mu-card>
  </mu-paper>
</mu-scale-transition>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { State, namespace } from "vuex-class";

import { ipcRenderer } from "electron";
import ipcTypes from "../../common/ipcTypes";

@Component
export default class HookSettingsHookInfo extends Vue {
  @Prop(Object) hook!: TextThread;
  @Prop(Boolean) isChosen!: boolean;

  // @namespace('Hooks').State('texts') texts!: HooksState['texts']
  @namespace("Hooks").Getter("getTextById")
  getTextById!: (id: number) => string[];
  @namespace("Hooks").Action("chooseHookAsDisplay")
  chooseHookAsDisplayAction!: (id: number) => void;

  openConfirm = false;

  get zIndex() {
    return this.isChosen ? 5 : 1;
  }
  get hookText() {
    return this.getTextById(this.hook.num).join("\n");
  }

  openConfirmDialog() {
    this.openConfirm = true;
  }
  closeConfirmDialog() {
    this.openConfirm = false;
  }
  removeHook() {
    ipcRenderer.send(ipcTypes.REQUEST_REMOVE_HOOK, this.hook);
    this.closeConfirmDialog();
  }
  chooseAsDisplay() {
    this.chooseHookAsDisplayAction(this.hook.num);
  }
}
</script>

<style scoped>
.hooker-textarea {
  padding: 8px;
}
</style>
