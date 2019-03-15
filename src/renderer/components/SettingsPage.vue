<template>
  <div>
    <gt-page-header title="应用设置"/>
    <gt-page-content>
      <mu-container>
        <router-view></router-view>
      </mu-container>
    </gt-page-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component
} from 'vue-property-decorator'

import GtPageContent from '@/components/PageContent.vue'
import GtPageHeader from '@/components/PageHeader.vue'

@Component({
  components: {
    GtPageHeader,
    GtPageContent
  }
})
export default class PageContent extends Vue { }
</script>

<style>
</style>
