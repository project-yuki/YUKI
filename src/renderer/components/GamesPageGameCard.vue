<template>
  <mu-scale-transition>
    <mu-card>
      <mu-card-title :title="game.name" :sub-title="game.code"></mu-card-title>
      <mu-card-text>{{game.path}}</mu-card-text>
      <mu-card-actions style="padding: 8px 0">
        <mu-expansion-panel :zDepth="0">
          <div slot="header">
            <mu-button color="primary" @click.stop="handleRunGame">运行</mu-button>
            <mu-button color="error" @click.stop="handleDeleteConfirm">删除</mu-button>
          </div>
          <mu-select
            label="区域转换器"
            v-model="selectedLocaleChanger"
            full-width
            @change="updateLocaleChanger"
          >
            <mu-option
              v-for="(value, key) in defaultConfig.localeChangers"
              :key="game.name+'-changer-'+key"
              :value="value.name"
              :label="value.name"
            ></mu-option>
          </mu-select>
        </mu-expansion-panel>
      </mu-card-actions>
    </mu-card>
  </mu-scale-transition>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { State, namespace } from "vuex-class";

import { ipcRenderer } from "electron";
import IpcTypes from "../../common/ipcTypes";

import * as _ from "lodash";

@Component
export default class HookSettingsHookInfo extends Vue {
  @Prop()
  game!: Yagt.Game;

  @(namespace("Config").State("default"))
  defaultConfig!: Yagt.ConfigState["default"];
  @(namespace("Config").State("games"))
  gamesConfig!: Yagt.ConfigState["games"];
  selectedLocaleChanger: string = "";

  handleDeleteConfirm() {
    this.$confirm("确认删除？", { type: "warning" }).then(({ result }) => {
      if (result) {
        this.handleDeleteGame();
        this.$toast.success("删除成功！");
      }
    });
  }
  handleRunGame() {
    ipcRenderer.send(IpcTypes.REQUEST_RUN_GAME, this.game);
  }
  handleDeleteGame() {
    ipcRenderer.send(IpcTypes.REQUEST_REMOVE_GAME, this.game);
  }

  updateLocaleChanger() {
    let savingConfig = _.cloneDeep(this.gamesConfig);
    const thisGame = savingConfig.find(game => game.name === this.game.name);
    if (!thisGame) return;

    for (const key in this.defaultConfig.localeChangers) {
      if (
        this.defaultConfig.localeChangers[key].name !==
        this.selectedLocaleChanger
      )
        continue;

      thisGame.localeChanger = key;
    }

    ipcRenderer.send(IpcTypes.REQUEST_SAVE_CONFIG, "games", savingConfig);
  }

  beforeMount() {
    this.selectedLocaleChanger = this.defaultConfig.localeChangers[
      this.game.localeChanger
    ].name;
  }
}
</script>

<style scoped>
.hooker-textarea {
  padding: 8px;
}

.half-width {
  width: 49%;
}
</style>
