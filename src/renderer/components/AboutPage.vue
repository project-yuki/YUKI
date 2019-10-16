<i18n src="../../common/locales.json"></i18n>

<template>
  <div>
    <yk-page-header :title="$t('aboutYUKI')" />
    <yk-page-content style="text-align: center">
      <img src="../assets/icon.png" style="width: 128px; height: 128px" />
      <p class="text-h1">Yummy Utterance Knowledge Interface</p>
      <p class="text-h2" style="padding-bottom: 16px">YUKI {{$t('YUKIGalgameTranslator')}}</p>
      <v-btn color="primary" @click="toggleDevTools">{{$t('toggleDevTools')}}</v-btn>
    </yk-page-content>
  </div>
</template>

<script lang="ts">
import {
  remote
} from 'electron'
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
export default class FavoritePage extends Vue {
  public toggleDevTools () {
    remote.getCurrentWebContents().toggleDevTools()
  }
}
</script>

<style>
</style>
