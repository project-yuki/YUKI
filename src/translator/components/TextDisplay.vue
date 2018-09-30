<template>
<mu-container>
  <mu-row>
    <mu-col span="2">
      <div class="text-h3 name">{{name}}</div>
    </mu-col>
    <mu-col span="10">
      <div class="text-h2">{{translation}}</div>
    </mu-col>
  </mu-row>
  
  
</mu-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class TextDisplay extends Vue {
  @Prop(String)
  name!: string;
  @Prop(String)
  translation!: string;
}
</script>

<style scoped>
.name {
  color: #2196f3;
}
</style>
