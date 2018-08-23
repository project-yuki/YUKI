<template>
<div>
  <gt-page-header title="添加游戏" />
  <gt-page-content>
    <gt-one-column>
      <mu-stepper :active-step="activeStep">
        <mu-step>
          <mu-step-label>
            选择游戏路径
          </mu-step-label>
        </mu-step>
        <mu-step>
          <mu-step-label>
            输入特殊码
          </mu-step-label>
        </mu-step>
      </mu-stepper>
      <div style="position: relative; height: 64%">
        <mu-scale-transition>
          <mu-card class="full" style="position: absolute; padding: 24px;" v-show="showStepOne">
            <mu-button color="secondary" @click="handleRequestGamePath">选择游戏路径</mu-button>
            <br/>
            <br/>
            <p>游戏名称</p>
            <mu-text-field full-width v-model="game.name" icon="videogame_asset"></mu-text-field>
            <p>游戏路径</p>
            <mu-text-field full-width v-model="game.path" disabled multi-line :rows-max="3" icon="folder"></mu-text-field>
            <br/>
          </mu-card>
        </mu-scale-transition>

        <mu-scale-transition>
          <mu-card class="full" style="position: absolute; padding: 24px;" v-show="showStepTwo">
            <p class="text-h2">请输入特殊码（如果无需则为空）</p>
            <br/>
            <mu-text-field full-width v-model="game.code" label="特殊码" label-float icon="code"></mu-text-field>
            <br/>
          </mu-card>
        </mu-scale-transition>
      </div>

      <div style="position: relative; margin-top: 24px;">
        <mu-button flat class="demo-step-button" :disabled="activeStep === 0" @click="handlePrev"> 上一步 </mu-button>
        <mu-button class="demo-step-button" color="primary" @click="handleNext" > {{activeStep >= 1 ? '完成' : '下一步'}} </mu-button>
      </div>

      <mu-dialog title="Dialog" width="360" :open.sync="openDialog">
        添加成功！
        <mu-button slot="actions" flat color="primary" @click="handleRedirect">确定</mu-button>
      </mu-dialog>
    </gt-one-column>
  </gt-page-content>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { ipcRenderer } from "electron";
import ipcTypes from "../../common/ipcTypes";
import { Component } from "vue-property-decorator";

import GtPageHeader from "@/components/PageHeader.vue";
import GtPageContent from "@/components/PageContent.vue";
import GtOneColumn from "@/components/OneColumn.vue";

@Component({
  components: {
    GtPageHeader,
    GtPageContent,
    GtOneColumn
  }
})
export default class FavoritePage extends Vue {
  activeStep: number = -1;
  game: Yagt.Game = {
    name: "",
    path: "",
    code: ""
  };
  openDialog: boolean = false;

  get showStepOne() {
    return this.activeStep === 0;
  }
  get showStepTwo() {
    return this.activeStep === 1;
  }
  get finished() {
    return this.activeStep > 1;
  }

  handleNext() {
    this.activeStep++;
    if (this.finished) {
      ipcRenderer.once(ipcTypes.HAS_ADDED_GAME, () => {
        this.openDialog = true;
      });
      ipcRenderer.send(ipcTypes.REQUEST_ADD_GAME, this.game);
    }
  }
  handlePrev() {
    this.activeStep--;
  }
  handleRequestGamePath() {
    ipcRenderer.once(
      ipcTypes.HAS_NEW_GAME_PATH,
      (event: Electron.Event, gamePath: string) => {
        this.game.path = gamePath;
        if (this.game.name === "") {
          this.game.name = gamePath.substring(
            gamePath.lastIndexOf("\\") + 1,
            gamePath.lastIndexOf(".exe")
          );
        }
      }
    );
    ipcRenderer.send(ipcTypes.REQUEST_NEW_GAME_PATH);
  }
  handleRedirect() {
    this.$router.push({ name: "Games" });
  }

  mounted() {
    this.activeStep = 0;
  }
}
</script>

<style scoped>
</style>
