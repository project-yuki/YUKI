<template>
<div class="app-content">
  <slot></slot>
</div>
</template>

<script>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class PageContent extends Vue {}
</script>

<style scoped>
.app-content {
  position: absolute;
  top: 88px;
  bottom: 24px;
  left: 264px;
  right: 24px;
  /* padding: 88px 24px 24px 24px; */
}
</style>
