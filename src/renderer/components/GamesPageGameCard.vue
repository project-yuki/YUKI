<template>
  <mu-scale-transition>
    <mu-card>
      <mu-card-title :title="game.name" :sub-title="game.code"></mu-card-title>
      <mu-card-text>{{game.path}}</mu-card-text>
      <mu-card-actions style="padding: 8px 0">
        <mu-expansion-panel :zDepth="0">
          <div slot="header">
            <mu-button color="primary" @click.stop="handleRunGame">运行</mu-button>
            <mu-button color="error" @click.stop="handleOpenConfirm">删除</mu-button>
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
      <mu-dialog title="确认删除？" width="360" :open.sync="openConfirm">
        <mu-button slot="actions" flat @click="handleCloseConfirm">否</mu-button>
        <mu-button slot="actions" flat color="primary" @click="handleDeleteGame">是</mu-button>
      </mu-dialog>
    </mu-card>
  </mu-scale-transition>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { State, namespace } from "vuex-class";

import { ipcRenderer } from "electron";
import ipcTypes from "../../common/ipcTypes";

import * as _ from "lodash";

@Component
export default class HookSettingsHookInfo extends Vue {
  @Prop()
  game!: Yagt.Game;

  @namespace("Config").State("default")
  defaultConfig!: Yagt.ConfigState["default"];
  @namespace("Config").State("games")
  gamesConfig!: Yagt.ConfigState["games"];
  selectedLocaleChanger: string = "";

  openConfirm = false;

  handleOpenConfirm() {
    this.openConfirm = true;
  }
  handleCloseConfirm() {
    this.openConfirm = false;
  }
  handleRunGame() {
    ipcRenderer.send(ipcTypes.REQUEST_RUN_GAME, this.game);
  }
  handleDeleteGame() {
    this.openConfirm = false;
    ipcRenderer.send(ipcTypes.REQUEST_REMOVE_GAME, this.game);
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

    ipcRenderer.send(ipcTypes.REQUEST_SAVE_CONFIG, "games", savingConfig);
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
