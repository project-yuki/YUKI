<template>
  <div class="titlebar">
    <p class="text-h3 text-center title">YUKI GALGAME TRANSLATOR</p>
    <mu-button
      v-if="pauseNewText"
      icon
      small
      class="manipulate-button-pause"
      @click="disablePauseNewText"
      color="#FFFFFF"
    >
      <mu-icon value="play_arrow"></mu-icon>
    </mu-button>
    <mu-button
      v-else
      icon
      small
      class="manipulate-button-pause"
      @click="enablePauseNewText"
      color="#FFFFFF"
    >
      <mu-icon value="pause"></mu-icon>
    </mu-button>
    <mu-button
      v-if="isAlwaysOnTop"
      icon
      small
      class="manipulate-button-top"
      @click="toggleAlwaysOnTop"
      color="#FFFFFF"
    >
      <mu-icon value="lock"></mu-icon>
    </mu-button>
    <mu-button
      v-else
      icon
      small
      class="manipulate-button-top"
      @click="toggleAlwaysOnTop"
      color="#FFFFFF"
    >
      <mu-icon value="lock_open"></mu-icon>
    </mu-button>
    <mu-button
      icon
      small
      class="manipulate-button-close"
      @click="closeWindow"
      color="#FFFFFF"
      :disabled="!isHideWindowValid"
    >
      <mu-icon value="close"></mu-icon>
    </mu-button>
  </div>
</template>

<script lang="ts">
import {
  remote
} from 'electron'
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  namespace
} from 'vuex-class'

@Component
export default class Titlebar extends Vue {
  @namespace('View').State('pauseNewText')
  public pauseNewText!: boolean
  @namespace('View').Action('setPauseNewText')
  public setPauseNewText!: (value: boolean) => void

  public isHideWindowValid: boolean = true

  public isAlwaysOnTop = remote.getCurrentWindow().isAlwaysOnTop()
  public closeWindow () {
    remote.getCurrentWindow().hide()
  }

  public toggleAlwaysOnTop () {
    remote
      .getCurrentWindow()
      .setAlwaysOnTop(!remote.getCurrentWindow().isAlwaysOnTop())
    this.isAlwaysOnTop = !this.isAlwaysOnTop
  }

  public enablePauseNewText() {
    this.setPauseNewText(true)
    this.isHideWindowValid = false
  }
  public disablePauseNewText() {
    this.setPauseNewText(false)
    this.isHideWindowValid = true
  }
}
</script>

<style scoped>
.titlebar {
  width: 100%;
  -webkit-app-region: drag;
  background-color: rgba(13, 71, 161, 0.8);
  text-align: center;
  height: 32px;
}

.title {
  width: 100%;
  height: 100%;
  float: left;
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
