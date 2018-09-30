<template>
<div>
</div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import GtHookSettings from "@/components/HookSettings.vue";
import { Route } from "vue-router";
import { remote } from "electron";

@Component
export default class BlankPage extends Vue {}
</script>

<style scoped>
</style>
