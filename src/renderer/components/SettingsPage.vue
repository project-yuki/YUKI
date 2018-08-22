<template>
<div>
  <gt-page-header title="应用设置" />
  <gt-page-content>
    <mu-row class="full-height">
      <mu-col span="2"></mu-col>
      <mu-col span="8" class="full-height">
        <gt-locale-changer-settings />
      </mu-col>
      <mu-col span="2"></mu-col>
    </mu-row>
  </gt-page-content>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component
} from 'vue-property-decorator'

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
export default class PageContent extends Vue {}
</script>

<style>

</style>
