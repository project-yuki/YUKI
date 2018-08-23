<template>
<div>
  <gt-page-header title="我的游戏" />
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import GtPageHeader from "@/components/PageHeader.vue";

@Component({
  components: {
    GtPageHeader
  }
})
export default class GamesPage extends Vue {}
</script>

<style>
</style>
