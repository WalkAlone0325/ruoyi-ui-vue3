<script setup name="VerifyView">
import { getSeleniumInit, getStatusValue, getUpdateLogin, statusInfo } from '@/api/basic/selenium'

const { proxy } = getCurrentInstance()

const msg1 = ref('')
const msg2 = ref('')
const msg3 = ref('')

const lod1 = ref(false)
const lod2 = ref(false)
const lod3 = ref(false)
const lod4 = ref(false)

async function getStatusInfo() {
  try {
    lod1.value = true
    const res = await statusInfo()
    msg1.value = res.data || res.msg
  }
  finally {
    lod1.value = false
  }
}

async function seleniumInit() {
  try {
    lod2.value = true
    const res = await getSeleniumInit()
    if (res.code === 200) {
      proxy.$modal.msgSuccess(res.msg)
    }
  }
  finally {
    lod2.value = false
  }
}

async function statusValue() {
  try {
    lod3.value = true
    const res = await getStatusValue()
    if (res.code === 200) {
      proxy.$modal.msgSuccess(res.msg)
    }
  }
  finally {
    lod3.value = false
  }
}

async function updateLogin() {
  try {
    lod4.value = true
    const res = await getUpdateLogin()
    if (res.code === 200) {
      proxy.$modal.msgSuccess(res.msg)
    }
  }
  finally {
    lod4.value = false
  }
}
</script>

<template>
  <el-card style="margin: 20px;">
    <template #header>
      <div class="clearfix">
        <span>手动触发</span>
      </div>
    </template>

    <el-row>
      <el-col :span="24" style="margin-bottom: 20px;">
        <el-button type="primary" :loading="lod1" @click="getStatusInfo">
          页面状态信息
        </el-button>
        <span style="margin-left: 30px;">{{ msg1 }}</span>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px;">
        <el-button type="primary" :loading="lod3" @click="statusValue">
          更新操作状态
        </el-button>
        <!-- <span style="margin-left: 30px;">{{ msg1 }}</span> -->
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px;">
        <el-button type="primary" :loading="lod4" @click="updateLogin">
          更新登录状态
        </el-button>
        <span style="margin-left: 30px;">{{ msg2 }}</span>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px;">
        <el-button type="primary" :loading="lod2" @click="seleniumInit">
          初始化
        </el-button>
        <span style="margin-left: 30px;">{{ msg3 }}</span>
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.title-con {
  font-weight: 500;
  font-size: 20px;
}
</style>
