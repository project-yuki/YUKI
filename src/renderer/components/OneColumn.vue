<template>
  <mu-row class="full-height">
    <mu-col span="2"></mu-col>
    <mu-col span="8" class="full-height">
      <slot></slot>
    </mu-col>
    <mu-col span="2"></mu-col>
  </mu-row>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component
} from 'vue-property-decorator'

@Component
export default class PageContent extends Vue { }
</script>

<style>
</style>
