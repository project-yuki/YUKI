<template>
<div class="one-col">
  <mu-button color="primary" @click="saveSettings">保存</mu-button>
  <mu-button color="warning" @click="resetSettings">重置</mu-button>
  <p class="text-h1">区域转换器设置</p>
  <p class="text-h2">区域转换器选择</p>
  <mu-radio value="localeEmulator" v-model="selected" label="Locale Emulator"></mu-radio>
  <mu-radio value="ntleas" v-model="selected" label="Ntleas"></mu-radio>
  <p class="text-h2">Locale Emulator</p>
  <p class="text-h3">执行方式</p>
  <mu-text-field v-model="localeEmulatorInput" multi-line full-width :rows-max="10"></mu-text-field>
  <p>参数</p>
  <p>%GAME_EXEC% - 游戏所在路径</p>
  <mu-divider></mu-divider>
  <p class="text-h2">Ntleas</p>
  <p class="text-h3">执行方式</p>
  <mu-text-field v-model="ntleasInput" multi-line full-width :rows-max="10"></mu-text-field>
  <p>参数</p>
  <p>%GAME_EXEC% - 游戏所在路径</p>
</div>
</template>

<script>
import { ipcRenderer } from 'electron'
import ipcTypes from '../../common/ipcTypes.js'

export default {
  name: 'locale-changer-settings',
  components: {
  },
  data() {
    return {
      selected: '',
      localeEmulatorInput: '',
      ntleasInput: ''
    }
  },
  computed: {
  },
  methods: {
    saveSettings() {
      let savingConfig = JSON.parse(JSON.stringify(this.$store.state.Config.default))
      savingConfig.localeChanger.localeEmulator.exec = this.localeEmulatorInput
      savingConfig.localeChanger.ntleas.exec = this.ntleasInput
      for (let key in this.$store.state.Config.default.localeChanger) {
        if (key === this.selected) {
          savingConfig.localeChanger[key].enabled = true
        } else {
          savingConfig.localeChanger[key].enabled = false
        }
      }
      ipcRenderer.send(ipcTypes.REQUEST_SAVE_CONFIG, 'default', savingConfig)
    },
    resetSettings() {
      for (let key in this.$store.state.Config.default.localeChanger) {
        if (this.$store.state.Config.default.localeChanger[key].enabled === true) {
          this.selected = key
        }
      }
      this.localeEmulatorInput = this.$store.state.Config.default.localeChanger.localeEmulator.exec
      this.ntleasInput = this.$store.state.Config.default.localeChanger.ntleas.exec
    }
  },
  mounted() {
    this.resetSettings()
  }
}
</script>

<style scoped>
.one-col {
  margin: 24px;
}

.mu-button {
  margin: 8px;
}

.mu-button:first-child {
  margin: 0;
}
</style>
