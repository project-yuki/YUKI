<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "appLibrariesSettings": "程序库设置",
    "providedByDefault": "默认已提供，位于lib\\textractor目录下",
    "choose...": "选择...",
    "jBeijingDict": "J 北京辞書",
    "pleaseSelect1": "请选择目录下的",
    "pleaseSelect2": "",
    "nowDownloading": "正在下载",
    "installed": "安装完成，重启生效",
    "lingoes": "灵格斯词典",
    "failed": "下载失败"
  },
  "en": {
    "appLibrariesSettings": "App Libraries Settings",
    "providedByDefault": "Provided by default, located in lib\\textractor directory",
    "choose...": "Choose...",
    "jBeijingDict": "JBeijing Dict (Chinese only)",
    "pleaseSelect1": "Please select",
    "pleaseSelect2": "in the directory",
    "nowDownloading": "Now downloading",
    "installed": "installed. Restart to take effect",
    "lingoes": "Lingoes Dictionary (ja to zh-CN)",
    "failed": "Download failed"
  }
}
</i18n>

<template>
  <div>
    <!-- <v-btn rounded large color="primary" @click="saveSettings(true)">{{$t('save')}}</v-btn> -->
    <!-- <v-btn rounded large color="warning" @click="resetSettings">{{$t('reset')}}</v-btn> -->
    <p class="text-h1">{{$t('appLibrariesSettings')}}</p>
    <p class="text-h2">Textractor</p>
    <p class="text-h3">{{$t('providedByDefault')}}</p>

    <p class="text-h2">MeCab</p>
    <v-row>
      <v-col cols="10">
        <v-text-field
          :label="$t('path')"
          v-model="tempLibraries.mecab.path"
          readonly
          outlined
          rounded
          append-icon="mdi-dots-horizontal"
          @click:append="requestPath('mecab', 'libmecab.dll', '.')"
        />
      </v-col>
      <v-col cols="2">
        <v-switch
          :label="$t('enable')"
          @change="saveSettings(false)"
          :disabled="canSaveMecab"
          v-model="tempLibraries.mecab.enable"
          inset
        ></v-switch>
      </v-col>
    </v-row>

    <p class="text-h2">{{$t('lingoes')}}</p>
    <v-row>
      <v-col cols="10">
        <v-text-field
          :label="$t('path')"
          v-model="tempLibraries.dictionaries.lingoes.path"
          readonly
          outlined
          rounded
          append-icon="mdi-dots-horizontal"
          @click:append="requestPath('lingoes', 'njcd.db', 'njcd.db')"
        />
      </v-col>
      <v-col cols="2">
        <v-switch
          :label="$t('enable')"
          @change="saveSettings(false)"
          :disabled="canSaveLingoes"
          v-model="tempLibraries.dictionaries.lingoes.enable"
          inset
        ></v-switch>
      </v-col>
    </v-row>

    <p class="text-h2">{{$t('jBeijingDict')}}</p>
    <yk-download-progress v-if="jbdictDownloadState" :state="jbdictDownloadState" />
    <v-row style="width: 100%">
      <v-col cols="10">
        <v-text-field
          :label="$t('path')"
          v-model="tempLibraries.translators.jBeijing.dictPath"
          outlined
          rounded
        />
      </v-col>
      <v-col cols="2" class="vertical-center">
        <v-btn
          color="primary"
          @click="startDownload('dict.jb')"
          :disabled="downloading.dictjb"
          outlined
          rounded
        >
          {{$t('download')}}&nbsp;
          <v-icon>mdi-cloud-download</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { namespace, State } from 'vuex-class'

import { ipcRenderer } from 'electron'
import { join } from 'path'
import IpcTypes from '../../common/IpcTypes'

import YkDownloadProgress from '@/components/DownloadProgress.vue'

@Component({
  components: {
    YkDownloadProgress
  }
})
export default class LibrarySettings extends Vue {
  @namespace('Config').State('default')
  public defaultConfig!: yuki.ConfigState['default']
  @namespace('Config').State('librariesBaseStorePath')
  public librariesBaseStorePath!: string

  public tempLibraries: yuki.Config.Libraries & {
    dictionaries: yuki.Config.Dictionaries;
  } = {
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
    },

    dictionaries: {
      lingoes: {
        enable: false,
        path: ''
      }
    }
  }

  public downloading: { dictjb: boolean } = {
    dictjb: false
  }

  get canSaveMecab () {
    return this.tempLibraries.mecab.path === ''
  }

  get canSaveLingoes () {
    return this.tempLibraries.dictionaries.lingoes.path === ''
  }

  public jbdictDownloadState: RequestProgress.ProgressState | boolean = false

  public remainingDownloadTaskCount = 0

  public saveSettings (showToast: boolean) {
    const savingConfig = {
      ...this.defaultConfig,
      ...this.tempLibraries
    }
    ipcRenderer.send(IpcTypes.REQUEST_SAVE_CONFIG, 'default', savingConfig)
    if (showToast) {
      this.$dialog.notify.success(this.$i18n.t('saved').toString())
    }
  }

  public requestPath (library: string, filename: string, suffix: string) {
    ipcRenderer.once(
      IpcTypes.HAS_PATH_WITH_FILE,
      (event: Electron.Event, path: string) => {
        if (path.indexOf(filename) === -1) {
          this.$dialog.notify.error(
            `${this.$i18n
              .t('pleaseSelect1')
              .toString()} ${filename} ${this.$i18n
              .t('pleaseSelect2')
              .toString()}!`
          )
          return
        }

        if (library === 'mecab') {
          this.tempLibraries[library].path = join(
            path.substring(0, path.indexOf(filename) - 1),
            suffix
          )
        } else if (library === 'lingoes') {
          this.tempLibraries.dictionaries[library].path = join(
            path.substring(0, path.indexOf(filename) - 1),
            suffix
          )
        }
      }
    )
    ipcRenderer.send(IpcTypes.REQUEST_PATH_WITH_FILE, filename)
  }

  public startDownload (packName: string) {
    const _this = this
    ipcRenderer.on(
      IpcTypes.HAS_DOWNLOAD_PROGRESS,
      (
        event: Electron.Event,
        name: string,
        state: RequestProgress.ProgressState
      ) => {
        switch (name) {
          case 'dict.jb':
            this.jbdictDownloadState = state
            break
        }
      }
    )
    ipcRenderer.on(
      IpcTypes.HAS_DOWNLOAD_COMPLETE,
      (event: Electron.Event, name: string, err: string | undefined) => {
        this.remainingDownloadTaskCount--
        if (this.remainingDownloadTaskCount <= 0) {
          ipcRenderer.removeAllListeners(IpcTypes.HAS_DOWNLOAD_PROGRESS)
          ipcRenderer.removeAllListeners(IpcTypes.HAS_DOWNLOAD_COMPLETE)
        }
        this.downloading[name.replace('.', '')] = false

        if (err) {
          _this.$dialog.notify.error(
            `${name} ${_this.$i18n.t('failed').toString()}: ${err}`
          )
          return
        }

        _this.$dialog.notify.success(
          `${name} ${_this.$i18n.t('installed').toString()}`
        )
        switch (name) {
          case 'dict.jb':
            this.resetSettings()
            this.jbdictDownloadState = false
            this.tempLibraries.translators.jBeijing.dictPath = `${
              this.librariesBaseStorePath
            }\\dict\\jb`
            this.saveSettings(false)
            break
        }
      }
    )

    this.$dialog.notify.info(
      `${this.$i18n.t('nowDownloading').toString()} ${packName}...`
    )
    this.remainingDownloadTaskCount++
    this.downloading[packName.replace('.', '')] = true
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
    this.tempLibraries.dictionaries.lingoes = {
      ...this.defaultConfig.dictionaries.lingoes
    }
  }
}
</script>

<style scoped>
.v-btn {
  margin: 8px;
}

.v-btn:first-child {
  margin: 0;
}

.vertical-center {
  padding-top: 22px;
}
</style>
