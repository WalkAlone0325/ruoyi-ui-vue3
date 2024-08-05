<script setup name="VerifyView">
import { checkCode, checkLogin, checkLoginCondition, checkLoginConditionSession, checkRefresh, checkVerification, getVerify, postVerify } from '@/api/basic/verify'

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

const msg1 = ref('')
const msg2 = ref('')
const msg3 = ref('')
const msg4 = ref('')
const msg5 = ref('')
const disabled3 = ref(true)
const disabled4 = ref(true)
const disabled5 = ref(true)
async function getVerifyData() {
  const res = await checkLoginCondition()
  msg1.value = res.data || res.msg
}

async function getSession() {
  const res = await checkLoginConditionSession()
  msg2.value = res.data || res.msg
  if (res.code === 200) {
    disabled3.value = false
  }
}

async function getLogin() {
  const res = await checkLogin()
  msg3.value = res.data || res.msg
  if (res.code === 200) {
    disabled4.value = false
  }
}

async function getRefresh() {
  const res = await checkRefresh()
  msg4.value = res.data || res.msg
  if (res.code === 200) {
    disabled5.value = false
  }
}

async function getCode() {
  const res = await checkCode()
  msg5.value = res.data || res.msg
  if (res.code === 200) {
    disabled4.value = false
  }
}

async function getVerification() {
  proxy.$refs.pwdRef.validate(async (valid) => {
    if (valid) {
      const res = await checkVerification(user.value.verification)
      msg6.value = res.data || res.msg
    }
  })
}

onDeactivated(() => {
  clearInterval(timer.value)
  timer.value = null
})

onUnmounted(() => {
  clearInterval(timer.value)
  timer.value = null
})

// getVerifyData()
</script>

<template>
  <el-card style="margin: 20px;">
    <template #header>
      <div class="clearfix">
        <span>登录管理</span>
      </div>
    </template>

    <el-row>
      <el-col :span="24" style="margin-bottom: 20px;">
        <el-button v-hasPermi="['op:selenium:conditions']" type="primary" @click="getVerifyData">
          判断是否满足登录
        </el-button>
        <span style="margin-left: 30px;">{{ msg1 }}</span>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px;">
        <el-button v-hasPermi="['op:selenium:conditions']" type="primary" @click="getSession">
          判断是否满足登录（SESSION）
        </el-button>
        <span style="margin-left: 30px;">{{ msg2 }}</span>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px;">
        <el-button v-hasPermi="['op:selenium:password']" type="primary" :disabled="disabled3" @click="getLogin">
          填充用户名密码
        </el-button>
        <span style="margin-left: 30px;">{{ msg3 }}</span>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px;">
        <el-button v-hasPermi="['op:selenium:refreshmsg']" type="primary" :disabled="disabled4" @click="getRefresh">
          获取消息发送按钮内容
        </el-button>
        <span style="margin-left: 30px;">{{ msg4 }}</span>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px;">
        <el-button v-hasPermi="['op:selenium:sendcheckcode']" type="primary" :disabled="disabled5" @click="getCode">
          发送短信按钮
        </el-button>
        <span style="margin-left: 30px;">{{ msg5 }}</span>
      </el-col>
      <el-col :span="24">
        <el-form ref="pwdRef" :model="user" :rules="rules" label-width="100px" @submit.prevent>
          <el-form-item label="验证码：" prop="verification" @submit.prevent>
            <el-input v-model="user.verification" placeholder="请输入验证码" type="text" />
          </el-form-item>
        </el-form>
        <el-button v-hasPermi="['op:selenium:verification']" type="primary" :disabled="disabled5" @click="getVerification">
          输入校验码，进行校验
        </el-button>
        <span style="margin-left: 30px;">{{ msg6 }}</span>
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
