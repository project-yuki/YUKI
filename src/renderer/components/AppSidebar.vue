<i18n src="../../common/locales.json"></i18n>

<template>
  <mu-drawer :z-depth="5" class="nav-list full-height" docked open>
    <mu-card-header :title="$t('YUKIGalgameTranslator')" sub-title>
      <mu-avatar slot="avatar" color="white">
        <img src="../assets/icon.png">
      </mu-avatar>
    </mu-card-header>
    <mu-list>
      <mu-list-item button to="/games">
        <mu-list-item-action>
          <mu-icon value="games"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>{{$t('myGames')}}</mu-list-item-title>
      </mu-list-item>
      <mu-list-item button to="/addgame">
        <mu-list-item-action>
          <mu-icon value="library_add"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>{{$t('addGame')}}</mu-list-item-title>
      </mu-list-item>
      <mu-list-item button nested :ripple="false" :open="true">
        <mu-list-item-action>
          <mu-icon value="settings"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>{{$t('applicationSettings')}}</mu-list-item-title>
        <mu-list-item button to="/settings/localechanger" slot="nested">
          <mu-list-item-action>
            <mu-icon value="location_on"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>{{$t('localeChangers')}}</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button to="/settings/library" slot="nested">
          <mu-list-item-action>
            <mu-icon value="apps"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>{{$t('applicationLibraries')}}</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button to="/settings/translator" slot="nested">
          <mu-list-item-action>
            <mu-icon value="translate"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>{{$t('translators')}}</mu-list-item-title>
        </mu-list-item>
      </mu-list-item>
      <mu-list-item button to="/about">
        <mu-list-item-action>
          <mu-icon value="feedback"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>{{$t('aboutYUKI')}}</mu-list-item-title>
      </mu-list-item>
    </mu-list>
  </mu-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component
} from 'vue-property-decorator'

@Component
export default class AppSidebar extends Vue { }
</script>

<style>
.nav-list {
  background-color: white;
  width: 230px;
  position: fixed;
  z-index: 5;
}
</style>
