<template>
<mu-appbar class="header" color="primary">
  {{title}}
  <mu-button icon color="secondary" slot="right" class="exit-button" @click="closeWindow">
    <mu-icon value="close"></mu-icon>
  </mu-button>
</mu-appbar>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  props: ['title'],
  methods: {
    closeWindow() {
      ipcRenderer.send('app-exit')
    }
  }
}
</script>

<style scoped>
.header {
  width: 100%;
  -webkit-app-region: drag;
}

.exit-button {
  -webkit-app-region: no-drag;
}
</style>
