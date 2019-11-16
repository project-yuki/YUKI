<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "maxColumns": "最大行数"
  },
  "en": {
    "maxColumns": "Max Columns"
  }
}
</i18n>

<template>
<div>
  <yk-page-header :title="$t('debugMessages')" />
  <yk-page-content>
    <div class="console" id="terminal"></div>
    <p class="text-h3">{{$t('maxColumns')}}</p>
    <p>1000</p>
  </yk-page-content>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Watch
} from 'vue-property-decorator'
import {
  namespace,
  State
} from 'vuex-class'

import {
  ipcRenderer
} from 'electron'
import IpcTypes from '../../common/IpcTypes'

import YkPageContent from '@/components/PageContent.vue'
import YkPageHeader from '@/components/PageHeader.vue'

import {
  Terminal
} from 'xterm'
import {
  FitAddon
} from 'xterm-addon-fit'

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

  @(namespace('Gui').State('debugMessages'))
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
