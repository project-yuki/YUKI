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

          <v-list-group :value="false">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>mdi-settings</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{$t('applicationSettings')}}</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item class="grey lighten-3" to="/settings/localechanger">
              <v-list-item-action>
                <v-icon>mdi-map-marker</v-icon>
              </v-list-item-action>
              <v-list-item-title>{{$t('localeChangers')}}</v-list-item-title>
            </v-list-item>

            <v-list-item class="grey lighten-3" to="/settings/library">
              <v-list-item-action>
                <v-icon>mdi-apps</v-icon>
              </v-list-item-action>
              <v-list-item-title>{{$t('applicationLibraries')}}</v-list-item-title>
            </v-list-item>

            <v-list-item class="grey lighten-3" to="/settings/translator">
              <v-list-item-action>
                <v-icon>mdi-translate</v-icon>
              </v-list-item-action>
              <v-list-item-title>{{$t('translators')}}</v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-list-item to="/debugMessages">
            <v-list-item-icon>
              <v-icon>mdi-alert</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{$t('debugMsg')}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

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
