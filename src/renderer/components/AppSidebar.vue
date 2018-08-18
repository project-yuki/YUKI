<template>
<mu-drawer :z-depth="5" class="nav-list" docked open>
  <mu-card-header title="另一个Galgame翻译器" sub-title="">
    <mu-avatar slot="avatar" color="white">
      <img src="../assets/icon.png">
    </mu-avatar>
  </mu-card-header>
  <mu-list>
    <mu-list-item button :to="{'name': 'Games'}">
      <mu-list-item-action>
        <mu-icon value="games"></mu-icon>
      </mu-list-item-action>
      <mu-list-item-title>我的游戏</mu-list-item-title>
    </mu-list-item>
    <mu-list-item button :to="{'name': 'Favorite'}">
      <mu-list-item-action>
        <mu-icon value="grade"></mu-icon>
      </mu-list-item-action>
      <mu-list-item-title>我的收藏</mu-list-item-title>
    </mu-list-item>
    <mu-list-item button :to="{'name': 'Settings'}">
      <mu-list-item-action>
        <mu-icon value="settings"></mu-icon>
      </mu-list-item-action>
      <mu-list-item-title>应用设置</mu-list-item-title>
    </mu-list-item>
    <mu-list-item button :to="{'name': 'About'}">
      <mu-list-item-action>
        <mu-icon value="feedback"></mu-icon>
      </mu-list-item-action>
      <mu-list-item-title>关于Yagt</mu-list-item-title>
    </mu-list-item>
  </mu-list>

</mu-drawer>
</template>

<script>
export default {
  methods: {

  }
}
</script>

<style>
.nav-list {
  background-color: white;
  height: 100%;
  width: 240px;
  position: fixed;
  z-index: 5;
}
</style>
