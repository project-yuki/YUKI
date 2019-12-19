<i18n src="../../common/locales.json"></i18n>
<i18n>
{
  "zh": {
    "localeChangerSettings": "区域转换器设置",
    "clickTableRowToUnfoldEditView": "点击表格行展开编辑界面",
    "executionType": "执行方式",
    "parameter": "参数",
    "%GAME_PATH%": "%GAME_PATH% - 游戏所在路径",
    "setToDefault": "设为默认",
    "noLocaleChanger": "没有区域转换器呢ㄟ( ▔, ▔ )ㄏ",
    "localeChangers": "区域转换器",
    "editLocaleChanger": "编辑区域转换器",
    "actions": "操作",
    "escapePatterns": "转义段",
    "gamePath": "游戏所在路径",
    "noLineBreak": "禁止换行"
  },
  "en": {
    "localeChangerSettings": "Locale Changer Settings",
    "clickTableRowToUnfoldEditView": "Click table row to unfold edit view",
    "executionType": "Execution Type",
    "parameter": "Parameter",
    "%GAME_PATH%": "%GAME_PATH% - Path to the game",
    "setToDefault": "Default",
    "noLocaleChanger": "No Locale Changerㄟ( ▔, ▔ )ㄏ",
    "localeChangers": "Locale Changers",
    "editLocaleChanger": "Edit Locale Changer",
    "actions": "Actions",
    "escapePatterns": "Escape Patterns",
    "gamePath": "The path where game is located",
    "noLineBreak": "No Line Break"
  }
}
</i18n>

<template>
  <div>
    <v-btn rounded large color="primary" @click="saveSettings">{{$t('save')}}</v-btn>
    <v-btn rounded large color="warning" @click="resetSettings">{{$t('reset')}}</v-btn>
    <p class="text-h1">{{$t('localeChangerSettings')}}</p>

    <v-data-table
      :headers="tableColumns"
      :items="tempLocaleChangers"
      disable-sort
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar text color="white">
          <v-toolbar-title>{{$t('localeChangers')}}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" @click="addLocaleChanger">{{$t('add')}}</v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.enable="{ item }">
        <v-switch v-model="item.enable" @click.stop="setDefault(item.id)" inset></v-switch>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-2" @click="editLocaleChanger(item.id)">mdi-pencil</v-icon>
        <v-icon @click="deleteLocaleChanger(item.id)">mdi-delete</v-icon>
      </template>

      <template v-slot:no-data>
        <p class="text-h3">{{$t('noLocaleChanger')}}</p>
      </template>
    </v-data-table>

    <p class="text-h2">{{$t('escapePatterns')}}</p>
    <p class="text-h3">%GAME_PATH%</p>
    <p>{{$t('gamePath')}}</p>

    <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('editLocaleChanger')}}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="editedItem.id" label="ID"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="editedItem.name" :label="$t('name')"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  rows="1"
                  auto-grow
                  v-model="editedItem.exec"
                  :label="$t('executionType')"
                  :rules="[noLineBreakRule]"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">{{$t('cancel')}}</v-btn>
          <v-btn color="blue darken-1" text :disabled="!canSave" @click="finishDialog">{{$t('ok')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

type TempLocaleChangerItem = yuki.Config.LocaleChangerItem & {
  id: string
}

type VuetifyRule = (v?: string) => (boolean | string)

@Component
export default class LocaleChangerSettings extends Vue {
  public tableColumns: Array<{text: string, value: string, width?: number}> = []

  @(namespace('Config').State('default'))
  public defaultConfig!: yuki.ConfigState['default']

  public tempLocaleChangers: TempLocaleChangerItem[] = []
  public showDialog: boolean = false
  public itemPattern: TempLocaleChangerItem = {
    name: '',
    enable: false,
    exec: '',
    id: ''
  }
  public editedItem: TempLocaleChangerItem = { ...this.itemPattern }

  public noLineBreakRule!: VuetifyRule
  public canSave: boolean = true

  public beforeMount () {
    this.tableColumns = [
      {
        text: 'ID',
        value: 'id'
      },
      {
        text: this.$i18n.t('name').toString(),
        value: 'name'
      },
      {
        text: this.$i18n.t('executionType').toString(),
        value: 'exec'
      },
      {
        text: this.$i18n.t('setToDefault').toString(),
        value: 'enable',
        width: 80
      },
      {
        text: this.$i18n.t('actions').toString(),
        value: 'actions',
        width: 96
      }
    ]
    this.noLineBreakRule = (v) => {
      if ((v || '').indexOf('\n') === -1) return true
      else return this.$i18n.t('noLineBreak').toString()
    }
  }

  public closeDialog () {
    this.showDialog = false
  }
  public finishDialog () {
    for (const index in this.tempLocaleChangers) {
      if (this.tempLocaleChangers[index].id === this.editedItem.id) {
        this.tempLocaleChangers[index] = this.editedItem
      }
    }
    this.tempLocaleChangers = [...this.tempLocaleChangers]
    this.editedItem = { ...this.itemPattern }
    this.closeDialog()
  }
  public editLocaleChanger (id: string) {
    this.editedItem = { ...this.tempLocaleChangers.filter(
      (value) => value.id === id
    )[0] }
    this.showDialog = true
  }

  public saveSettings () {
    const savingLocaleChangers = {}
    for (const localeChanger of this.tempLocaleChangers) {
      savingLocaleChangers[localeChanger.id] = localeChanger
      delete savingLocaleChangers[localeChanger.id].id
    }

    const savingConfig = {
      ...this.defaultConfig,
      localeChangers: savingLocaleChangers
    }
    ipcRenderer.send(IpcTypes.REQUEST_SAVE_CONFIG, 'default', savingConfig)
    this.$dialog.notify.success(this.$i18n.t('saved').toString())
  }

  @Watch('defaultConfig', {
    immediate: true,
    deep: true
  })
  public resetSettings () {
    this.tempLocaleChangers = []
    for (const key in this.defaultConfig.localeChangers) {
      if (this.defaultConfig.localeChangers.hasOwnProperty(key)) {
        this.tempLocaleChangers.push({
          ...this.defaultConfig.localeChangers[key],
          id: key
        })
      }
    }
  }

  @Watch('editedItem.exec')
  public checkCanSave (newValue: string) {
    if (this.noLineBreakRule(newValue) === true) {
      this.canSave = true
    } else {
      this.canSave = false
    }
  }

  public setDefault (id: string) {
    const afterLocaleChangers = []
    for (const localeChanger of this.tempLocaleChangers) {
      if (localeChanger.id === id) {
        afterLocaleChangers.push({
          ...localeChanger,
          enable: true
        })
      } else {
        afterLocaleChangers.push({
          ...localeChanger,
          enable: false
        })
      }
    }
    this.tempLocaleChangers = afterLocaleChangers
  }

  public addLocaleChanger () {
    this.tempLocaleChangers.push({ ...this.itemPattern })
  }

  public deleteLocaleChanger (id: string) {
    this.tempLocaleChangers = this.tempLocaleChangers.filter(
      (value) => value.id !== id
    )
    let hasDefault = false
    this.tempLocaleChangers.forEach(
      (value) => (hasDefault = hasDefault || value.enable)
    )
    if (!hasDefault) {
      for (const localeChanger of this.tempLocaleChangers) {
        this.setDefault(localeChanger.id)
        break
      }
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
</style>
