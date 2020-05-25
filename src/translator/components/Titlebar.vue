<template>
  <div class="titlebar" :style="{'-webkit-app-region': dragStyle}">
    <p class="text-h3 title">YUKI GALGAME TRANSLATOR</p>
    <v-btn
      v-if="pauseNewText"
      text
      icon
      small
      class="manipulate-button-pause"
      @click="disablePauseNewText"
      color="#FFFFFF"
    >
      <v-icon dark>mdi-play</v-icon>
    </v-btn>
    <v-btn
      v-else
      text
      icon
      small
      class="manipulate-button-pause"
      @click="enablePauseNewText"
      color="#FFFFFF"
    >
      <v-icon dark>mdi-pause</v-icon>
    </v-btn>
    <v-btn
      v-if="isAlwaysOnTop"
      text
      icon
      small
      class="manipulate-button-top"
      @click="toggleAlwaysOnTop"
      color="#FFFFFF"
    >
      <v-icon dark>mdi-lock</v-icon>
    </v-btn>
    <v-btn
      v-else
      text
      icon
      small
      class="manipulate-button-top"
      @click="toggleAlwaysOnTop"
      color="#FFFFFF"
    >
      <v-icon dark>mdi-lock-open-outline</v-icon>
    </v-btn>
    <v-btn
      text
      icon
      small
      class="manipulate-button-close"
      @click="closeWindow"
      color="#FFFFFF"
      :disabled="!isHideWindowValid"
    >
      <v-icon dark>mdi-close</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { remote } from 'electron'
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

@Component
export default class Titlebar extends Vue {
  get shouldEnableDrag () {
    return !this.getAutoHideTitlebar() || this.$route.path !== '/translate'
  }

  get dragStyle () {
    return this.shouldEnableDrag ? 'drag' : 'no-drag'
  }

  @namespace('View').State('pauseNewText') public pauseNewText!: boolean
  @namespace('View').Action('setPauseNewText')
  public setPauseNewText!: (value: boolean) => void

  public isHideWindowValid: boolean = true

  public isAlwaysOnTop = remote.getCurrentWindow().isAlwaysOnTop()

  @namespace('Config').Getter('getAutoHideTitlebar')
  public getAutoHideTitlebar!: () => boolean
  public closeWindow () {
    remote.getCurrentWindow().hide()
  }

  public toggleAlwaysOnTop () {
    remote
      .getCurrentWindow()
      .setAlwaysOnTop(!remote.getCurrentWindow().isAlwaysOnTop())
    this.isAlwaysOnTop = !this.isAlwaysOnTop
  }

  public enablePauseNewText () {
    this.setPauseNewText(true)
    this.isHideWindowValid = false
  }
  public disablePauseNewText () {
    this.setPauseNewText(false)
    this.isHideWindowValid = true
  }
}
</script>

<style scoped>
.v-btn {
  width: 32px;
  height: 32px;
}

.titlebar {
  width: 100%;
  background-color: rgba(13, 71, 161, 0.8);
  text-align: center;
  height: 32px;
}

.title {
  width: 100%;
  height: 100%;
  float: left;
  text-align: center;
}

.manipulate-button-pause {
  -webkit-app-region: no-drag;
  position: fixed;
  right: 64px;
  top: 0;
}

.manipulate-button-top {
  -webkit-app-region: no-drag;
  position: fixed;
  right: 32px;
  top: 0;
}

.manipulate-button-close {
  -webkit-app-region: no-drag;
  position: fixed;
  right: 0;
  top: 0;
}
</style>
