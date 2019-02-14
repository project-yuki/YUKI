<template>
  <div>
    <mu-button color="primary">保存</mu-button>
    <mu-button color="warning">重置</mu-button>
    <p class="text-h1">程序库设置</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";

import { ipcRenderer } from "electron";
import ipcTypes from "../../common/ipcTypes";

@Component
export default class LibrarySettings extends Vue {}
</script>

<style scoped>
.mu-button {
  margin: 8px;
}

.mu-button:first-child {
  margin: 0;
}
</style>
