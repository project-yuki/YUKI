<template>
<div class="one-col">
  <p class="text-h1">文本钩子设置</p>
  <mu-button type="primary" @click="openInputHookDialog">加载钩子</mu-button>
  <mu-dialog title="请输入特殊码" :open.sync="openInputHook">
    <mu-text-field v-model="hookCode" :error-text="errorText"></mu-text-field>
    <mu-button slot="actions" flat @click="closeInputHookDialog">取消</mu-button>
    <mu-button slot="actions" flat color="primary" @click="addHook">确定</mu-button>
  </mu-dialog>
  <mu-row gutter>
    <mu-col sm="12" md="6" lg="4" v-for="hook in hooks" :key="hook.num" class="margin-top">
      <gt-hook-info :hook="hook" :isChosen="isChosen(hook.num)" />
    </mu-col>
  </mu-row>
</div>
</template>

<script>
import {
  ipcRenderer
} from 'electron'

import GtHookInfo from '@/components/HookSettingsHookInfo'
import ipcTypes from '../../common/ipcTypes.js'

export default {
  name: 'hook-settings-page',
  components: {
    GtHookInfo
  },
  data() {
    return {
      openInputHook: false,
      errorText: '',
      hookCode: ''
    }
  },
  computed: {
    hooks() {
      return this.$store.state.Hooks.hooks
    }
  },
  methods: {
    openInputHookDialog() {
      this.openInputHook = true;
    },
    closeInputHookDialog() {
      this.openInputHook = false;
      this.hookCode = ''
      this.errorText = ''
    },
    addHook() {
      if (new RegExp(/\/H\w+/).test(this.hookCode)) {
        ipcRenderer.send('insert-hook', this.hookCode)
        this.closeInputHookDialog()
      } else {
        this.errorText = '特殊码格式不正确'
      }
    },
    isChosen(num) {
      return this.$store.state.Hooks.currentDisplayHookIndex === num
    }
  },
  mounted() {
    ipcRenderer.send(ipcTypes.MAIN_PAGE_LOAD_FINISHED)
  },
}
</script>

<style scoped>
.one-col {
  margin: 24px;
}

.margin-top {
  margin-top: 1em;
}
</style>
