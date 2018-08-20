<template>
<div class="app-content">
  <slot></slot>
</div>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style scoped>
.app-content {
  padding-top: 64px;
}
</style>
