<template>
<div>
  <gt-page-header title="关于Yagt" />
  <gt-page-content>
    <gt-hook-settings />
  </gt-page-content>
</div>
</template>

<script>
import GtPageHeader from '@/components/PageHeader'
import GtPageContent from '@/components/PageContent'
import GtHookSettings from '@/components/HookSettings'

export default {
  components: {
    GtPageHeader,
    GtPageContent,
    GtHookSettings
  }
}
</script>

<style>

</style>
