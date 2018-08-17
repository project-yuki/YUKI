<template>
<transition name="el-fade-in">
  <el-card :class="{ chosen: isChosen }">
    <p>{{hook.name}} ({{hook.hcode}})</p>
    <el-input type="textarea" :value="hook.text" :rows="8" placeholder="等待文本获取..." />
    <el-row type="flex" justify="end" class="function-buttons-row">
      <el-button type="success" icon="el-icon-check" circle 
        @click="chooseAsDisplay"
        v-show="!isChosen"></el-button>
      <el-button type="danger" icon="el-icon-delete" circle 
        @click="removeHook" />
    </el-row>
  </el-card>
</transition>
</template>

<script>
export default {
  props: [
    'hook',
    'isChosen'
  ],
  methods: {
    removeHook() {
      this.$confirm('确认卸载钩子?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('removeHook', this.hook)
      })
    },
    chooseAsDisplay() {
      this.$store.dispatch('chooseHookAsDisplay', this.hook.num)
    }
  }
}
</script>

<style scoped>
.chosen {
  background-color: #BADBFD;
  transition: background-color 0.5s;
}

.function-buttons-row {
  padding-top: 1em;
}
</style>
