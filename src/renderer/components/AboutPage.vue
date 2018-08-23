<template>
<div>
  <gt-page-header title="关于Yagt" />
  <gt-page-content>
    <mu-button color="primary" @click="toggleDevTools">切换开发人员工具</mu-button>
    <gt-hook-settings />
  </gt-page-content>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { remote } from 'electron'

import GtPageHeader from '@/components/PageHeader.vue'
import GtPageContent from '@/components/PageContent.vue'
import GtHookSettings from '@/components/HookSettings.vue'

@Component({
  components: {
    GtPageHeader,
    GtPageContent,
    GtHookSettings
  }
})
export default class FavoritePage extends Vue {
  toggleDevTools() {
    remote.getCurrentWebContents().toggleDevTools()
  }
}


</script>

<style>

</style>
