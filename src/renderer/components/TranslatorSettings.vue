<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "underConstruction": "开发中m( _ _ )m",
    "pleaseModifyConfigurationFile": "请通过修改配置文件 config\\config.json 来配置翻译器",
    "defaultTranslators": "（默认提供腾讯，沪江，谷歌，有道，彩云翻译）"
  },
  "en": {
    "underConstruction": "Under construction m( _ _ )m",
    "pleaseModifyConfigurationFile": "Please modify configuration file config\\config.json to configure translators",
    "defaultTranslators": "（Defualt translators are QQ, HuJiang, Google, YouDao. These are all Japanese-Chinese translators）"
  }
}
</i18n>

<template>
  <div>
    <v-btn rounded large color="primary">{{$t('save')}}</v-btn>
    <v-btn rounded large color="warning">{{$t('reset')}}</v-btn>
    <p class="text-h1">{{$t('translatorSettings')}}</p>
    <p class="all-center text-h3">
      {{$t('underConstruction')}}
      <br />
      {{$t('pleaseModifyConfigurationFile')}}
      <br />
      {{$t('defaultTranslators')}}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Watch
} from 'vue-property-decorator'
import {
  namespace,
  State
} from 'vuex-class'

import {
  ipcRenderer
} from 'electron'
import IpcTypes from '../../common/IpcTypes'

@Component
export default class TranslatorSettings extends Vue { }
</script>

<style scoped>
.v-btn {
  margin: 8px;
}

.v-btn:first-child {
  margin: 0;
}
</style>
