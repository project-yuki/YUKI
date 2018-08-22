<template>
<div class="app-content full-height">
  <slot></slot>
</div>
</template>

<script>
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class PageContent extends Vue {
}
</script>

<style scoped>
.app-content {
  padding-top: 64px;
}
</style>
