<template>
<div id="app">
  <gt-app-sidebar></gt-app-sidebar>
  <router-view style="margin-left: 240px;"></router-view>
</div>
</template>

<script>
import GtAppSidebar from '@/components/AppSidebar'

export default {
  name: 'main-page',
  components: {
    GtAppSidebar
  },
  computed: {

  },
  methods: {

  },
  mounted() {

  },
}
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
}

.text-h1 {
  font-size: 2em;
}

.text-h2 {
  font-size: 1.5em;
}

.no-margin {
  width: 100%;
  margin: 0;
}
</style>
