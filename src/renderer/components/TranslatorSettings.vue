<template>
  <div>
    <mu-button color="primary">保存</mu-button>
    <mu-button color="warning">重置</mu-button>
    <p class="text-h1">翻译器设置</p>
    <p class="all-center text-h3">开发中m( _ _ )m
      <br>请通过修改配置文件 config\config.json 来配置翻译器
      <br>（默认提供百度，谷歌，有道翻译）
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";

import { ipcRenderer } from "electron";
import ipcTypes from "../../common/ipcTypes";

@Component
export default class TranslatorSettings extends Vue {}
</script>

<style scoped>
.mu-button {
  margin: 8px;
}

.mu-button:first-child {
  margin: 0;
}
</style>
