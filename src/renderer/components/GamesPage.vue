<template>
  <div>
    <yk-page-header title="我的游戏"/>
    <yk-page-content>
      <p v-show="noGame" class="all-center text-h3">什么都没有呢(っ °Д °;)っ
        <br>快去添加游戏吧~ヾ(•ω•`)o
      </p>
      <mu-row gutter>
        <mu-col class="margin-bottom" sm="12" md="6" lg="4" v-for="game in games" :key="game.path">
          <yk-game-card :game="game"></yk-game-card>
        </mu-col>
      </mu-row>
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
