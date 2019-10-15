<i18n src="../../common/locales.json"></i18n>

<template>
  <v-card class="nav-list full-height">
    <v-navigation-drawer permanent>
      <v-list-item two-line>
        <v-list-item-avatar>
          <img src="../assets/icon.png" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>YUKI</v-list-item-title>
          <v-list-item-subtitle>{{$t('YUKIGalgameTranslator')}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list rounded>
        <v-list-item-group color="primary">
          <v-list-item to="/games">
            <v-list-item-icon>
              <v-icon>mdi-gamepad</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{$t('myGames')}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/addgame">
            <v-list-item-icon>
              <v-icon>mdi-plus-box-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{$t('addGame')}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group :value="true">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>mdi-settings</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{$t('applicationSettings')}}</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item to="/settings/localechanger">
              <v-list-item-action>
                <v-icon>mdi-map-marker</v-icon>
              </v-list-item-action>
              <v-list-item-title>{{$t('localeChangers')}}</v-list-item-title>
            </v-list-item>

            <v-list-item to="/settings/library">
              <v-list-item-action>
                <v-icon>mdi-apps</v-icon>
              </v-list-item-action>
              <v-list-item-title>{{$t('applicationLibraries')}}</v-list-item-title>
            </v-list-item>

            <v-list-item to="/settings/translator">
              <v-list-item-action>
                <v-icon>mdi-translate</v-icon>
              </v-list-item-action>
              <v-list-item-title>{{$t('translators')}}</v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-list-item to="/about">
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{$t('aboutYUKI')}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>
  <!-- <mu-drawer :z-depth="5" class="nav-list full-height" docked open>
    <mu-card-header :title="$t('YUKIGalgameTranslator')" sub-title>
      <mu-avatar slot="avatar" color="white">
        <img src="../assets/icon.png" />
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
  </mu-drawer>-->
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
  width: 230px;
  position: fixed;
  z-index: 5;
}
</style>
