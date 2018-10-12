<template>
<div>
  <gt-page-header title="关于Yagt" />
  <gt-page-content style="text-align: center">
    <img src="../assets/icon.png" style="width: 128px; height: 128px">
    <p class="text-h1">Yet Another Galgame Translator</p>
    <p class="text-h2">另一个Galgame翻译器</p>
    <mu-button color="primary" @click="toggleDevTools">切换开发人员工具</mu-button>
  </gt-page-content>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { remote } from "electron";

import GtPageHeader from "@/components/PageHeader.vue";
import GtPageContent from "@/components/PageContent.vue";

@Component({
  components: {
    GtPageHeader,
    GtPageContent
  }
})
export default class FavoritePage extends Vue {
  toggleDevTools() {
    remote.getCurrentWebContents().toggleDevTools();
  }
}
</script>

<style>
</style>
