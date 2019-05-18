<template>
  <div>
    <yk-page-header title="应用设置"/>
    <yk-page-content>
      <mu-container>
        <router-view></router-view>
      </mu-container>
    </yk-page-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component
} from 'vue-property-decorator'

import YkPageContent from '@/components/PageContent.vue'
import YkPageHeader from '@/components/PageHeader.vue'

@Component({
  components: {
    YkPageHeader,
    YkPageContent
  }
})
export default class PageContent extends Vue { }
</script>

<style>
</style>
