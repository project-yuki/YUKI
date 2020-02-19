<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "log": "日志",
    "maxColumns": "最大行数",
    "copyToClipboard": "复制到剪贴板",
    "logCopied": "已复制日志"
  },
  "en": {
    "log": "Log",
    "maxColumns": "Max Columns",
    "copyToClipboard": "Copy To Clipboard",
    "logCopied": "Log Copied"
  }
}
</i18n>

<template>
  <div>
    <yk-page-header :title="$t('debugMessages')" />
    <yk-page-content>
      <v-toolbar text color="white">
        <v-toolbar-title>{{$t('log')}}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <p class="vertical-center">{{$t('maxColumns')}}: 1000</p>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mb-2" @click="copyToClipboard">{{$t('copyToClipboard')}}</v-btn>
      </v-toolbar>
      <div class="console" id="terminal"></div>
    </yk-page-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { namespace, State } from 'vuex-class'

import { clipboard, ipcRenderer } from 'electron'
import IpcTypes from '../../common/IpcTypes'

import YkPageContent from '@/components/PageContent.vue'
import YkPageHeader from '@/components/PageHeader.vue'

import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

@Component({
  components: {
    YkPageHeader,
    YkPageContent
  }
})
export default class DebugMessagesPage extends Vue {
  public term!: Terminal
  public resizeEventListern!: EventListener
  public fitAddon!: FitAddon

  @namespace('Gui').State('debugMessages')
  public debugMessages!: yuki.GuiState['debugMessages']

  @Watch('debugMessages', {
    immediate: true,
    deep: true
  })
  public newDebugMessage () {
    if (this.term) {
      this.term.writeln(this.debugMessages[this.debugMessages.length - 1])
      this.term.scrollToBottom()
    }
  }

  public copyToClipboard () {
    const plainText = [...this.debugMessages]
    plainText.forEach((value, index) => {
      // tslint:disable-next-line:no-control-regex
      plainText[index] = value.replace(/\[[^m]+m/g, '')
    })
    clipboard.writeText(plainText.join('\r\n'))
    this.$dialog.notify.success(this.$i18n.t('logCopied').toString())
  }

  public mounted () {
    const terminalContainer = document.getElementById('terminal')
    if (!terminalContainer) return
    this.term = new Terminal()
    this.term.setOption('fontSize', 16)
    this.term.setOption('fontFamily', 'consolas')
    this.fitAddon = new FitAddon()
    this.term.loadAddon(this.fitAddon)
    this.term.open(terminalContainer)
    this.fitAddon.fit()
    this.debugMessages.forEach((message) => {
      this.term.writeln(message)
    })
  }
  public beforeDestroy () {
    this.term.dispose()
  }
}
</script>

<style scoped>
.console {
  height: 100%;
}
</style>
