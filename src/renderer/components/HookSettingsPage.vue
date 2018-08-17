<template>
<div>
  <p class="text-h1">文本钩子设置</p>
  <el-button type="primary" @click="addHook">加载钩子</el-button>
  <el-row :gutter="16">
    <el-col :xs="24" :sm="24" :md="12" :lg="8" v-for="hook in hooks" :key="hook.num">
      <gt-hook-info :hook="hook" :isChosen="isChosen(hook.num)" />
    </el-col>
  </el-row>
</div>
</template>

<script>
import {
  ipcRenderer
} from 'electron'

import GtHookInfo from '@/components/HookSettingsHookInfo'

export default {
  name: 'hook-settings-page',
  components: {
    GtHookInfo
  },
  computed: {
    hooks() {
      return this.$store.state.Hooks.hooks
    }
  },
  methods: {
    addHook() {
      this.$prompt('请输入特殊码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\/H\w+/,
        inputErrorMessage: '特殊码格式不正确'
      }).then(({ value }) => {
        ipcRenderer.send('insert-hook', value)
      })
    },
    isChosen(num) {
      return this.$store.state.Hooks.currentDisplayHookIndex === num
    }
  },
  mounted() {
    ipcRenderer.send('load-finished')
  },
}
</script>

<style scoped>
.el-col {
  padding-top: 1em
}
</style>
