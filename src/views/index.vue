<script setup name="Index">
import welcomeImg from '@/assets/images/welcome.jpg'
</script>

<template>
  <div class="home">
    <el-image :src="welcomeImg" style="width: 100%" fit="fill" />
    <h1>欢迎使用系统</h1>
  </div>
</template>

<style scoped lang="scss">
.home {
  position: relative;

  .el-image {
    width: 100%;
  }

  h1 {
    position: absolute;
    top: 20px;
    left: 42%;
    color: #fff;
    font-size: 34px;
    font-weight: 600;
    text-align: center;
    width: 300px;
    height: 50px;
    line-height: 50px;
    background: rgba(0, 0, 0, 0.7);
  }
}
</style>
