<script setup name="VerifyView">
import { getVerify, postVerify } from '@/api/basic/verify'

const { proxy } = getCurrentInstance()

const user = ref({
  verification: undefined,
})
const title = ref('')
const timer = ref(null)

const rules = ref({
  verification: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
})

/** 提交按钮 */
function submit() {
  proxy.$refs.pwdRef.validate((valid) => {
    if (valid) {
      postVerify({ ...user.value }).then(() => {
        proxy.$modal.msgSuccess('保存成功')
        timer.value = setInterval(() => getVerifyData(), 1000)
      })
    }
  })
};
/** 关闭按钮 */
function close() {
  proxy.$tab.closePage()
};

async function getVerifyData() {
  const res = await getVerify()
  if (res) {
    title.value = res.data
  }
}

onDeactivated(() => {
  clearInterval(timer.value)
  timer.value = null
})

onUnmounted(() => {
  clearInterval(timer.value)
  timer.value = null
})

getVerifyData()
</script>

<template>
  <el-card style="margin: 20px;">
    <template #header>
      <div class="clearfix">
        <span>验证码管理</span>
      </div>
    </template>

    <el-form ref="pwdRef" :model="user" :rules="rules" label-width="100px" @submit.prevent>
      <el-form-item label="提示信息：">
        <div class="title-con">
          {{ title }}
        </div>
      </el-form-item>
      <el-form-item label="验证码：" prop="verification" @submit.prevent>
        <el-input v-model="user.verification" placeholder="请输入验证码" type="text" />
      </el-form-item>
      <el-form-item>
        <el-button v-hasPermi="['chinatower:verification:add']" type="primary" @click="submit">
          保存
        </el-button>
        <el-button type="danger" @click="close">
          关闭
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped>
.title-con {
  font-weight: 500;
  font-size: 20px;
}
</style>
