<script setup name="Index">
import welcomeImg from '@/assets/images/welcome.jpg'
</script>

<template>
  <div class="home">
    <el-image :src="welcomeImg" style="width: 100%" fit="fill" />
    <h1>欢迎使用管理系统</h1>
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
    left: 41%;
    color: #fff;
    text-shadow: 0 0 20px #000;
    letter-spacing: 2px;
    font-family: "楷体";
    font-weight: bold;
    font-size: 36px;
    line-height: 40px;
  }
}
</style>
