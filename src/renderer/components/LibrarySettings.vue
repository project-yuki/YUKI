<template>
  <div>
    <mu-button color="primary" @click="saveSettings">保存</mu-button>
    <mu-button color="warning" @click="resetSettings">重置</mu-button>
    <p class="text-h1">程序库设置</p>
    <p class="text-h2">Textractor</p>
    <p class="text-h3">默认已提供，位于lib\textractor目录下</p>
    <p class="text-h2">MeCab</p>
    <mu-form :model="{}">
      <mu-row gutter>
        <mu-col span="10">
          <mu-form-item label="路径">
            <mu-text-field v-model="tempLibraries.mecab.path" full-width label-float disabled></mu-text-field>
          </mu-form-item>
        </mu-col>
        <mu-col span="1">
          <mu-form-item label="选择...">
            <mu-button icon small color="primary" @click="requestPath('mecab', 'libmecab.dll')">
              <mu-icon value="more_horiz"></mu-icon>
            </mu-button>
          </mu-form-item>
        </mu-col>
        <mu-col span="1">
          <mu-form-item label="启用">
            <mu-switch v-model="tempLibraries.mecab.enable"></mu-switch>
          </mu-form-item>
        </mu-col>
      </mu-row>
    </mu-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { namespace, State } from 'vuex-class'

import { ipcRenderer } from 'electron'
import IpcTypes from '../../common/IpcTypes'

@Component
export default class LibrarySettings extends Vue {
  @(namespace('Config').State('default'))
  public defaultConfig!: Yagt.ConfigState['default']

  public tempLibraries: Yagt.Config.Libraries = {
    mecab: { enable: false, path: '' }
  }

  public saveSettings () {
    const savingConfig = {
      ...this.defaultConfig,
      ...this.tempLibraries
    }
    ipcRenderer.send(IpcTypes.REQUEST_SAVE_CONFIG, 'default', savingConfig)
    this.$toast.success('保存成功！')
  }

  public requestPath (library: string, filename: string) {
    ipcRenderer.once(
      IpcTypes.HAS_PATH_WITH_FILE,
      (event: Electron.Event, path: string) => {
        if (path.indexOf(filename) === -1) {
          this.$toast.error(`请选择文件夹下的 ${filename} !`)
          return
        }

        this.tempLibraries[library].path = path.substring(
          0,
          path.indexOf(filename) - 1
        )
      }
    )
    ipcRenderer.send(IpcTypes.REQUEST_PATH_WITH_FILE, filename)
  }

  @Watch('defaultConfig', { immediate: true, deep: true })
  public resetSettings () {
    this.tempLibraries.mecab = { ...this.defaultConfig.mecab }
  }
}
</script>

<style scoped>
.mu-button {
  margin: 8px;
}

.mu-button:first-child {
  margin: 0;
}

.center-width {
  text-align: center;
}
</style>
