<template>
  <div class="app-content">
    <v-container style="min-height: 100%">
      <slot></slot>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop
} from 'vue-property-decorator'

@Component
export default class PageContent extends Vue { }
</script>

<style scoped>
.app-content {
  position: absolute;
  top: 64px;
  bottom: 0px;
  left: 240px;
  right: 0px;
  /* padding: 88px 24px 24px 24px; */
}
</style>
