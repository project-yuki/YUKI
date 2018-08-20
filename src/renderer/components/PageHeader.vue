<template>
<mu-appbar class="app-header" color="primary">
  {{title}}
  <mu-button icon color="secondary" slot="right" class="exit-button" @click="closeWindow">
    <mu-icon value="close"></mu-icon>
  </mu-button>
</mu-appbar>
</template>

<script>
import { ipcRenderer } from 'electron'
import ipcTypes from '../../common/ipcTypes.js'

export default {
  props: ['title'],
  methods: {
    closeWindow() {
      ipcRenderer.send(ipcTypes.APP_EXIT)
    }
  }
}
</script>

<style scoped>
.app-header {
  top: 0;
  left: 240px;
  right: 0;
  position: fixed;
  -webkit-app-region: drag;
}

.exit-button {
  -webkit-app-region: no-drag;
}
</style>
