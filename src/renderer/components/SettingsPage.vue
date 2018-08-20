<template>
<div>
  <gt-page-header title="应用设置" />
  <gt-page-content>
    <gt-locale-changer-settings />
  </gt-page-content>
</div>
</template>

<script>
import GtPageHeader from '@/components/PageHeader'
import GtPageContent from '@/components/PageContent'
import GtLocaleChangerSettings from '@/components/LocaleChangerSettings'

export default {
  components: {
    GtPageHeader,
    GtPageContent,
    GtLocaleChangerSettings
  }
}
</script>

<style>

</style>
