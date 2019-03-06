<template>
  <div>
    <mu-button color="primary" @click="saveSettings">保存</mu-button>
    <mu-button color="warning" @click="resetSettings">重置</mu-button>
    <p class="text-h1">区域转换器设置</p>
    <p>点击表格行展开编辑界面</p>
    <mu-button @click="addLocaleChanger">添加</mu-button>
    <br>
    <mu-paper :z-depth="1" style="margin-top: 24px">
      <mu-data-table stripe :columns="tableColumns" :data="tempLocaleChangers">
        <template slot="expand" slot-scope="prop">
          <div style="padding: 24px">
            <mu-row gutter>
              <mu-col span="6">
                <mu-text-field v-model="prop.row.id" label="ID" full-width label-float></mu-text-field>
              </mu-col>
              <mu-col span="6">
                <mu-text-field v-model="prop.row.name" label="名称" full-width label-float></mu-text-field>
              </mu-col>
            </mu-row>
            <mu-text-field
              v-model="prop.row.exec"
              label="执行方式"
              full-width
              multi-line
              :rows-max="10"
            ></mu-text-field>
            <p>参数</p>
            <p>%GAME_PATH% - 游戏所在路径</p>
          </div>
        </template>
        <template slot-scope="scope">
          <td>{{scope.row.id}}</td>
          <td>{{scope.row.name}}</td>
          <td>{{scope.row.exec}}</td>
          <td>
            <mu-switch v-model="scope.row.enable" @click.stop="setDefault(scope.row.id)"></mu-switch>
          </td>
          <td>
            <mu-button color="secondary" icon @click.stop="deleteLocaleChanger(scope.row.id)">
              <mu-icon value="delete"></mu-icon>
            </mu-button>
          </td>
        </template>
      </mu-data-table>
    </mu-paper>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";

import { ipcRenderer } from "electron";
import IpcTypes from "../../common/ipcTypes";

type TempLocaleChangerItem = Yagt.Config.LocaleChangerItem & { id: string };

@Component
export default class localeChangerSettings extends Vue {
  tableColumns = [
    { title: "ID", name: "id" },
    { title: "名称", name: "name" },
    { title: "执行方式", name: "exec" },
    { title: "设为默认", name: "enable", width: 80 },
    { title: "删除", name: "delete", width: 96 }
  ];

  @(namespace("Config").State("default"))
  defaultConfig!: Yagt.ConfigState["default"];

  tempLocaleChangers: TempLocaleChangerItem[] = [];

  saveSettings() {
    let savingLocaleChangers = {};
    for (const localeChanger of this.tempLocaleChangers) {
      savingLocaleChangers[localeChanger.id] = localeChanger;
      delete savingLocaleChangers[localeChanger.id].id;
    }

    let savingConfig = {
      ...this.defaultConfig,
      localeChangers: savingLocaleChangers
    };
    ipcRenderer.send(IpcTypes.REQUEST_SAVE_CONFIG, "default", savingConfig);
    this.$toast.success("保存成功！");
  }

  @Watch("defaultConfig", { immediate: true, deep: true })
  resetSettings() {
    this.tempLocaleChangers = [];
    for (const key in this.defaultConfig.localeChangers) {
      this.tempLocaleChangers.push({
        ...this.defaultConfig.localeChangers[key],
        id: key
      });
    }
  }

  setDefault(id: string) {
    let afterLocaleChangers = [];
    for (const localeChanger of this.tempLocaleChangers) {
      if (localeChanger.id === id) {
        afterLocaleChangers.push({ ...localeChanger, enable: true });
      } else {
        afterLocaleChangers.push({ ...localeChanger, enable: false });
      }
    }
    this.tempLocaleChangers = afterLocaleChangers;
  }

  addLocaleChanger() {
    this.tempLocaleChangers.push({ id: "", name: "", enable: false, exec: "" });
  }

  deleteLocaleChanger(id: string) {
    this.tempLocaleChangers = this.tempLocaleChangers.filter(
      value => value.id !== id
    );
    let hasDefault = false;
    this.tempLocaleChangers.forEach(
      value => (hasDefault = hasDefault || value.enable)
    );
    if (!hasDefault) {
      for (const localeChanger of this.tempLocaleChangers) {
        this.setDefault(localeChanger.id);
        break;
      }
    }
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
</style>
