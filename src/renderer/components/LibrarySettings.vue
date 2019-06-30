<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "appLibrariesSettings": "程序库设置",
    "providedByDefault": "默认已提供，位于lib\\textractor目录下",
    "choose...": "选择...",
    "jBeijingDict": "J 北京辞書"
  },
  "en": {
    "appLibrariesSettings": "App Libraries Settings",
    "providedByDefault": "Provided by default, located in lib\\textractor directory",
    "choose...": "Choose...",
    "jBeijingDict": "JBeijing Dict (Chinese only)"
  }
}
</i18n>

<template>
  <div>
    <mu-button color="primary" @click="saveSettings(true)">{{$t('save')}}</mu-button>
    <mu-button color="warning" @click="resetSettings">{{$t('reset')}}</mu-button>
    <p class="text-h1">{{$t('appLibrariesSettings')}}</p>
    <p class="text-h2">Textractor</p>
    <p class="text-h3">{{$t('providedByDefault')}}</p>

    <p class="text-h2">MeCab</p>
    <mu-form :model="{}">
      <mu-row gutter>
        <mu-col span="10">
          <mu-form-item :label="$t('path')">
            <mu-text-field v-model="tempLibraries.mecab.path" full-width label-float disabled/>
          </mu-form-item>
        </mu-col>
        <mu-col span="1">
          <mu-form-item :label="$t('choose...')">
            <mu-button
              icon
              small
              color="primary"
              @click="requestPath('mecab', 'libmecab.dll', '.')"
            >
              <mu-icon value="more_horiz"></mu-icon>
            </mu-button>
          </mu-form-item>
        </mu-col>
        <mu-col span="1">
          <mu-form-item :label="$t('enable')">
            <mu-switch v-model="tempLibraries.mecab.enable"></mu-switch>
          </mu-form-item>
        </mu-col>
      </mu-row>
    </mu-form>

    <p class="text-h2">{{$t('jBeijingDict')}}</p>
    <yk-download-progress v-if="jbdictDownloadState" :state="jbdictDownloadState"/>
    <mu-form :model="{}">
      <mu-row gutter>
        <mu-col span="11">
          <mu-form-item :label="$t('path')">
            <mu-text-field
              v-model="tempLibraries.translators.jBeijing.dictPath"
              full-width
              label-float
              disabled
            />
          </mu-form-item>
        </mu-col>
        <mu-col span="1">
          <mu-form-item :label="$t('download')">
            <mu-button icon small color="primary" @click="startDownload('dict.jb')">
              <mu-icon value="cloud_download"></mu-icon>
            </mu-button>
          </mu-form-item>
        </mu-col>
      </mu-row>
    </mu-form>
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
import {
  join
} from 'path'
import IpcTypes from '../../common/IpcTypes'

import YkDownloadProgress from '@/components/DownloadProgress.vue'

@Component({
  components: {
    YkDownloadProgress
  }
})
export default class LibrarySettings extends Vue {
  @(namespace('Config').State('default'))
  public defaultConfig!: yuki.ConfigState['default']
  @(namespace('Config').State('librariesBaseStorePath'))
  public librariesBaseStorePath!: string

  public tempLibraries: yuki.Config.Libraries = {
    librariesRepoUrl: '',
    mecab: {
      enable: false,
      path: ''
    },
    translators: {
      jBeijing: {
        enable: false,
        path: '',
        traditionalChinese: false,
        dictPath: ''
      }
    }
  }

  public jbdictDownloadState: RequestProgress.ProgressState | null = null

  public remainingDownloadTaskCount = 0

  public saveSettings (showToast: boolean) {
    const savingConfig = {
      ...this.defaultConfig,
      ...this.tempLibraries
    }
    ipcRenderer.send(IpcTypes.REQUEST_SAVE_CONFIG, 'default', savingConfig)
    if (showToast) {
      this.$toast.success('保存成功！')
    }
  }

  public requestPath (library: string, filename: string, suffix: string) {
    ipcRenderer.once(
      IpcTypes.HAS_PATH_WITH_FILE,
      (event: Electron.Event, path: string) => {
        if (path.indexOf(filename) === -1) {
          this.$toast.error(`请选择文件夹下的 ${filename} !`)
          return
        }

        this.tempLibraries[library].path = join(path.substring(
          0,
          path.indexOf(filename) - 1
        ), suffix)
      }
    )
    ipcRenderer.send(IpcTypes.REQUEST_PATH_WITH_FILE, filename)
  }

  public startDownload (packName: string) {
    ipcRenderer.on(IpcTypes.HAS_DOWNLOAD_PROGRESS,
      (event: Electron.Event, name: string, state: RequestProgress.ProgressState) => {
        switch (name) {
          case 'dict.jb':
            this.jbdictDownloadState = state
            break
        }
      })
    ipcRenderer.on(IpcTypes.HAS_DOWNLOAD_COMPLETE,
      (event: Electron.Event, name: string) => {
        this.$toast.success(`${name} 安装完成，重启生效`)
        switch (name) {
          case 'dict.jb':
            this.resetSettings()
            this.jbdictDownloadState = null
            this.tempLibraries.translators.jBeijing.dictPath =
              `${this.librariesBaseStorePath}\\dict\\jb`
            this.saveSettings(false)
            break
        }
        this.remainingDownloadTaskCount--
        if (this.remainingDownloadTaskCount <= 0) {
          ipcRenderer.removeAllListeners(IpcTypes.HAS_DOWNLOAD_PROGRESS)
          ipcRenderer.removeAllListeners(IpcTypes.HAS_DOWNLOAD_COMPLETE)
        }
      })

    this.$toast.info(`正在下载 ${packName}...`)
    this.remainingDownloadTaskCount++
    ipcRenderer.send(IpcTypes.REQUEST_DOWNLOAD_LIBRARY, packName)
  }

  @Watch('defaultConfig', {
    immediate: true,
    deep: true
  })
  public resetSettings () {
    this.tempLibraries.mecab = {
      ...this.defaultConfig.mecab
    }
    this.tempLibraries.translators.jBeijing = {
      ...this.defaultConfig.translators.jBeijing
    }
    this.tempLibraries.librariesRepoUrl = this.defaultConfig.librariesRepoUrl
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
