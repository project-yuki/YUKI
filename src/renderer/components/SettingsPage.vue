<template>
<div>
  <gt-page-header title="应用设置" />
  <gt-page-content>
    <gt-locale-changer-settings />
  </gt-page-content>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import GtPageHeader from '@/components/PageHeader.vue'
import GtPageContent from '@/components/PageContent.vue'
import GtLocaleChangerSettings from '@/components/LocaleChangerSettings.vue'

@Component({
  components: {
    GtPageHeader,
    GtPageContent,
    GtLocaleChangerSettings
  }
})
export default class PageContent extends Vue {
}
</script>

<style>

</style>
