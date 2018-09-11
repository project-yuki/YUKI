<template>
<div>
  
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class BlankPage extends Vue {
  @Prop(String) originText!: string;

}
</script>

<style scoped>
</style>
