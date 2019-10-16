<i18n src="../../common/locales.json"></i18n>

<template>
  <div>
    <yk-page-header :title="$t('applicationSettings')" />
    <yk-page-content>
      <v-container>
        <router-view></router-view>
      </v-container>
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
