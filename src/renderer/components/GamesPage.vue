<template>
  <div>
    <gt-page-header title="我的游戏"/>
    <gt-page-content>
      <mu-row gutter>
        <mu-col sm="12" md="6" lg="4" v-for="game in games" :key="game.path">
          <gt-game-card :game="game"></gt-game-card>
        </mu-col>
      </mu-row>
    </gt-page-content>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

import GtPageHeader from "@/components/PageHeader.vue";
import GtPageContent from "@/components/PageContent.vue";
import GtGameCard from "@/components/GamesPageGameCard.vue";

@Component({
  components: {
    GtPageHeader,
    GtPageContent,
    GtGameCard
  }
})
export default class GamesPage extends Vue {
  @namespace("Config").State("games") games!: Yagt.Game[];
}
</script>

<style>
</style>
