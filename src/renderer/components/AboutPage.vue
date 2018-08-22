<template>
<div>
  <gt-page-header title="关于Yagt" />
  <gt-page-content>
    <gt-hook-settings />
  </gt-page-content>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

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

}


</script>

<style>

</style>
