<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "nothingHere": "什么都没有呢(っ °Д °;)っ",
    "goAddSomeGames": "快去添加游戏吧~ヾ(•ω•`)o"
  },
  "en": {
    "nothingHere": "Hmmm nothing here (っ °Д °;)っ",
    "goAddSomeGames": "Go add some games now~ヾ(•ω•`)o"
  }
}
</i18n>

<template>
  <div>
    <yk-page-header :title="$t('myGames')" />
    <yk-page-content>
      <p v-show="noGame" class="all-center text-h3">
        {{$t('nothingHere')}}
        <br />
        {{$t('goAddSomeGames')}}
      </p>
      <v-row>
        <v-col sm="12" md="6" lg="4" v-for="game in games" :key="game.path">
          <yk-game-card :game="game"></yk-game-card>
        </v-col>
      </v-row>
      <!-- <mu-col sm="12" md="6" lg="4" v-for="game in games" :key="game.path">
        <yk-game-card :game="game"></yk-game-card>
      </mu-col>-->
    </yk-page-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component
} from 'vue-property-decorator'
import {
  namespace
} from 'vuex-class'

import YkGameCard from '@/components/GamesPageGameCard.vue'
import YkPageContent from '@/components/PageContent.vue'
import YkPageHeader from '@/components/PageHeader.vue'

@Component({
  components: {
    YkPageHeader,
    YkPageContent,
    YkGameCard
  }
})
export default class GamesPage extends Vue {
  @(namespace('Config').State('games')) public games!: yuki.Game[]

  @(namespace('Gui').State('noGame')) public noGame!: boolean
}
</script>

<style>
.margin-bottom {
  margin-bottom: 24px;
}
</style>
