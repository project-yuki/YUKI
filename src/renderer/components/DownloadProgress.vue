<template>
<div class="container">
  <mu-linear-progress :value="percent100" mode="determinate" color="green" />
  <div>
    <div class="left">
      {{ speedKB }} KB/s - {{ remainingTime }} s
    </div>
    <div class="right">
      {{ transferedSizeMB }} MB / {{ totalSizeMB }} MB
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {
  remote
} from 'electron'
import Vue from 'vue'
import {
  Component,
  Prop
} from 'vue-property-decorator'

import GtPageContent from '@/components/PageContent.vue'
import GtPageHeader from '@/components/PageHeader.vue'
import { IProgressState } from '../../main/Downloader'

@Component
export default class DownloadProgress extends Vue {
  @Prop() public state!: IProgressState

  get percent100 () {
    return parseFloat((this.state.percent * 100).toFixed(2))
  }
  get speedKB () {
    return parseFloat((this.state.speed / 1000).toFixed(2))
  }
  get totalSizeMB () {
    return parseFloat((this.state.size.total / 1000000).toFixed(2))
  }
  get transferedSizeMB () {
    return parseFloat((this.state.size.transferred / 1000000).toFixed(2))
  }
  get remainingTime () {
    return parseInt(this.state.time.remaining, 10)
  }
}
</script>

<style scoped>
.left {
  float: left;
}

.right {
  float: right;
}

.container {
  width: 100%;
  height: 32px;
}
</style>
