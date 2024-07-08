<script setup name="TowerConfig">
import { getTowerConfig, postTowerConfig } from '@/api/basic/towerConfig'

const { proxy } = getCurrentInstance()

const user = ref({
  chinaTowerUsername: undefined,
  chinaTowerPassword: undefined,
})

// const equalToPassword = (rule, value, callback) => {
//   if (user.newPassword !== value) {
//     callback(new Error('两次输入的密码不一致'))
//   }
//   else {
//     callback()
//   }
// }
const rules = ref({
  chinaTowerUsername: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  chinaTowerPassword: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
})

/** 提交按钮 */
function submit() {
  proxy.$refs.pwdRef.validate((valid) => {
    if (valid) {
      postTowerConfig({ ...user.value }).then((response) => {
        proxy.$modal.msgSuccess('修改成功')
        getTowerConfigData()
      })
    }
  })
};
/** 关闭按钮 */
function close() {
  proxy.$tab.closePage()
};

async function getTowerConfigData() {
  const res = await getTowerConfig()
  if (res) {
    user.value = res.data
  }
}

getTowerConfigData()
</script>

<template>
  <el-card style="margin: 20px;">
    <template #header>
      <div class="clearfix">
        <span>铁塔配置</span>
      </div>
    </template>

    <el-form ref="pwdRef" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="chinaTowerUsername">
        <el-input v-model="user.chinaTowerUsername" placeholder="请输入用户名" type="text" />
      </el-form-item>
      <el-form-item label="密码" prop="chinaTowerPassword">
        <el-input v-model="user.chinaTowerPassword" placeholder="请输入密码" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['chinatower:config:add']" type="primary" @click="submit">
          保存
        </el-button>
        <el-button type="danger" @click="close">
          关闭
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
