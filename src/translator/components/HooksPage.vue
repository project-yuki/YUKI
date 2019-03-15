<template>
  <gt-hook-settings></gt-hook-settings>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  Prop
} from 'vue-property-decorator'

import GtHookSettings from '@/components/HookSettings.vue'
import {
  remote
} from 'electron'
import {
  Route
} from 'vue-router'

@Component({
  components: {
    GtHookSettings
  }
})
export default class HooksPage extends Vue {
  public beforeRouteEnter (to: Route, from: Route, next: () => void) {
    const newHeight = Math.trunc(remote.screen.getPrimaryDisplay().size.height * 0.6)
    const window = remote.getCurrentWindow()
    const width = window.getSize()[0]
    window.setSize(width, newHeight)
    next()
  }
}
</script>

<style scoped>
</style>
