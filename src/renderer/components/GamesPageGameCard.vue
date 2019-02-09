<template>
  <mu-scale-transition>
    <mu-card>
      <mu-card-title :title="game.name" :sub-title="game.code"></mu-card-title>
      <mu-card-text>{{game.path}}</mu-card-text>
      <mu-card-actions>
        <mu-expansion-panel :zDepth="0">
          <div slot="header">
            <mu-button color="primary" @click="handleRunGame">运行</mu-button>
            <mu-button color="error" @click="handleOpenConfirm">删除</mu-button>
          </div>
          <mu-select
            label="区域转换器"
            v-model="selectedLocaleChanger.name"
            full-width
            @change="updateLocaleChanger"
          >
            <mu-option
              v-for="(value, key) in defaultConfig.localeChangers"
              :key="game.name+'-changer-'+key"
              :value="value"
              :label="value.name"
            ></mu-option>
          </mu-select>
        </mu-expansion-panel>
      </mu-card-actions>
      <mu-dialog title="Dialog" width="360" :open.sync="openConfirm">确认删除？
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

@Component
export default class HookSettingsHookInfo extends Vue {
  @Prop()
  game!: Yagt.Game;

  @namespace("Config").State("default")
  defaultConfig!: Yagt.ConfigState["default"];
  @namespace("Config").State("games")
  gamesConfig!: Yagt.ConfigState["games"];
  selectedLocaleChanger: { id: string; name: string } = { id: "", name: "" };

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
    for (let game of this.gamesConfig) {
      if (game.name === this.game.name) {
        game.localeChanger = this.selectedLocaleChanger.id;
      }
    }
    ipcRenderer.send(ipcTypes.REQUEST_SAVE_CONFIG, "games", this.gamesConfig);
  }

  mounted() {
    this.selectedLocaleChanger = {
      id: this.game.localeChanger,
      name: this.defaultConfig.localeChangers[this.game.localeChanger].name
    };
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
