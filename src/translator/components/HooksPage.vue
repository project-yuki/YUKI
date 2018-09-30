<template>
<gt-hook-settings></gt-hook-settings>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import GtHookSettings from "@/components/HookSettings.vue";
import { Route } from "vue-router";
import { remote } from "electron";

@Component({
  components: {
    GtHookSettings
  }
})
export default class HooksPage extends Vue {
  beforeRouteEnter(to: Route, from: Route, next: Function) {
    let newHeight = ~~(remote.screen.getPrimaryDisplay().size.height * 0.6);
    let window = remote.getCurrentWindow();
    let width = window.getSize()[0];
    window.setSize(width, newHeight);
    next();
  }

  beforeRouteLeave(to: Route, from: Route, next: Function) {
    let oldHeight = 240;
    let window = remote.getCurrentWindow();
    let width = window.getSize()[0];
    window.setSize(width, oldHeight);
    next();
  }
}
</script>

<style scoped>
</style>
