<template>
  <yk-hook-settings></yk-hook-settings>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import YkHookSettings from '@/components/HookSettings.vue'
import { remote } from 'electron'
import { Route } from 'vue-router'
import { updateWindowHeight } from '../common/Window'

@Component({
  components: {
    YkHookSettings
  }
})
export default class HooksPage extends Vue {
  public beforeRouteEnter (to: Route, from: Route, next: () => void) {
    updateWindowHeight(
      this,
      false,
      Math.trunc(remote.screen.getPrimaryDisplay().size.height * 0.6)
    )
    next()
  }
}
</script>

<style scoped>
</style>
