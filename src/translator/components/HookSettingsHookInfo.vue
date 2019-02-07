<template>
  <mu-scale-transition>
    <mu-paper :z-depth="zIndex" class="hook-info">
      <mu-row gutter align-content="center" wrap="wrap">
        <mu-col sm="12" md="4" lg="2" class="vertical-center">
          <strong>{{hook.name}}</strong>
        </mu-col>
        <mu-col
          sm="12"
          md="8"
          lg="4"
          class="vertical-center"
        >{{hook.code}}</mu-col>
        <mu-col sm="12" md="8" lg="4" class="vertical-center">
          <mu-text-field solo full-width :value="lastHookText" placeholder="等待文本获取..."/>
        </mu-col>
        <mu-col sm="12" md="4" lg="2" class="vertical-center">
          <mu-button fab small color="success" @click="chooseAsDisplay" v-show="!isChosen">
            <mu-icon value="done"></mu-icon>
          </mu-button>
        </mu-col>
      </mu-row>
    </mu-paper>
    <!-- <mu-paper :z-depth="zIndex">
    <mu-card>
      <mu-card-header :title="hook.name" :sub-title="hook.hcode" />
      <mu-text-field multi-line full-width :value="hookText" :rows="8" placeholder="等待文本获取..." class="hooker-textarea" />
      <mu-card-actions>
        <mu-button fab small color="success" @click="chooseAsDisplay" v-show="!isChosen">
          <mu-icon value="done"></mu-icon>
        </mu-button>
      </mu-card-actions>
    </mu-card>
    </mu-paper>-->
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
  @Prop(Object)
  hook!: Yagt.TextOutputObject;
  @Prop(Boolean)
  isChosen!: boolean;

  @namespace("Hooks").Getter("getTextById")
  getTextById!: (id: number) => string[];
  @namespace("Hooks").Getter("getLastTextById")
  getLastTextById!: (id: number) => string;
  @namespace("Hooks").Action("chooseHookAsDisplay")
  chooseHookAsDisplayAction!: (id: number) => void;

  openConfirm = false;

  get zIndex() {
    return this.isChosen ? 5 : 1;
  }
  get hookText() {
    return this.getTextById(this.hook.handle).join("\n");
  }
  get lastHookText() {
    return this.getLastTextById(this.hook.handle);
  }

  openConfirmDialog() {
    this.openConfirm = true;
  }
  closeConfirmDialog() {
    this.openConfirm = false;
  }
  chooseAsDisplay() {
    this.chooseHookAsDisplayAction(this.hook.handle);
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
</style>
