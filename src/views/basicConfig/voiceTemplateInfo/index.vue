<script setup name="VoiceTemplateInfo">
import {
  addVoiceTemplateInfo,
  chekUniQue,
  delVoiceTemplateInfo,
  getVoiceTemplateInfo,
  listVoiceTemplateInfo,
  updateVoiceTemplateInfo,
} from '@/api/basic/voiceTemplateInfo'

const { proxy } = getCurrentInstance()

const { sys_normal_disable, op_fault_order_alarm_channel } = proxy.useDict('sys_normal_disable', 'op_fault_order_alarm_channel')

const voiceTemplateInfoList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
const isUpdate = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    code: undefined,
    name: undefined,
    status: undefined,
    statusName: undefined,
    channel: undefined,
    channelName: undefined,
    content: undefined,
    platformContent: undefined,
    platformId: undefined,
  },
  rules: {
    code: [
      { required: true, message: '模板编码不能为空', trigger: 'blur' },
    ],
    name: [
      { required: true, message: '模板名称不能为空', trigger: 'blur' },
    ],
    status: [
      { required: true, message: '模板状态不能为空', trigger: 'change' },
    ],
    channel: [
      { required: true, message: '消息渠道不能为空', trigger: 'blur' },
    ],
    content: [
      { required: true, message: '模板内容不能为空', trigger: 'blur' },
    ],
  },
})

const { queryParams, form, rules } = toRefs(data)

/** 查询语音模板配置列表 */
function getList() {
  loading.value = true
  listVoiceTemplateInfo({ ...queryParams.value }).then((response) => {
    voiceTemplateInfoList.value = response.data.records
    total.value = response.data.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    code: null,
    name: null,
    status: null,
    statusName: null,
    channel: null,
    channelName: null,
    content: null,
    platformContent: null,
    platformId: null,
    remark: null,
  }
  proxy.resetForm('voiceTemplateInfoRef')
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.code)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  isUpdate.value = false
  title.value = '添加语音模板配置'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  loading.value = true
  isUpdate.value = true
  reset()
  const _code = row.code || ids.value
  getVoiceTemplateInfo(_code).then((response) => {
    loading.value = false
    form.value = {
      ...response.data,
      preCode: response.data.code,
    }
    open.value = true
    title.value = '修改语音模板配置'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs.voiceTemplateInfoRef.validate((valid) => {
    if (valid) {
      buttonLoading.value = true
      if (isUpdate.value) {
        updateVoiceTemplateInfo(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        }).finally(() => {
          buttonLoading.value = false
        })
      }
      else {
        addVoiceTemplateInfo(form.value).then((response) => {
          proxy.$modal.msgSuccess('新增成功')
          open.value = false
          getList()
        }).finally(() => {
          buttonLoading.value = false
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _codes = row.code || ids.value
  proxy.$modal.confirm(`是否确认删除语音模板配置编号为"${_codes}"的数据项？`).then(() => {
    loading.value = true
    return delVoiceTemplateInfo(_codes)
  }).then(() => {
    loading.value = true
    getList()
    proxy.$modal.msgSuccess('删除成功')
  }).catch(() => {
  }).finally(() => {
    loading.value = false
  })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('op/voiceTemplateInfo/export', {
    ...queryParams.value,
  }, `voiceTemplateInfo_${new Date().getTime()}.xlsx`)
}

async function checkCodeUnique(e) {
  if (form.value.preCode === form.value.code) return
  const res = await chekUniQue({ code: e.target.value })
  if (!res) {
    proxy.$modal.msgError('编码已存在')
    form.value.code = ''
  }
}

getList()
</script>

<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="模板状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择模板状态" clearable style="width: 200px">
          <el-option
            v-for="dict in sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="消息渠道" prop="channel">
        <el-select v-model="queryParams.channel" placeholder="请选择消息渠道" clearable style="width: 200px">
          <el-option
            v-for="dict in op_fault_order_alarm_channel"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">
          搜索
        </el-button>
        <el-button icon="Refresh" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['op:voiceTemplateInfo:add']"
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
        >
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['op:voiceTemplateInfo:edit']"
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
        >
          修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['op:voiceTemplateInfo:remove']"
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
        >
          删除
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          v-hasPermi="['op:voiceTemplateInfo:export']"
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
        >
          导出
        </el-button>
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
    </el-row>

    <el-table v-loading="loading" :data="voiceTemplateInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模板编码" align="center" prop="code" />
      <el-table-column label="模板名称" align="center" prop="name" />
      <el-table-column label="模板状态" align="center" prop="statusName">
        <template #default="{ row }">
          <dict-tag :options="sys_normal_disable" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="消息渠道" align="center" prop="channelName" />
      <el-table-column label="模板内容" align="center" prop="content" />
      <el-table-column label="平台模板样式" align="center" prop="platformContent" />
      <el-table-column label="模板平台ID" align="center" prop="platformId" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-hasPermi="['op:voiceTemplateInfo:edit']" link type="primary" icon="Edit" @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button v-hasPermi="['op:voiceTemplateInfo:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="getList"
    />

    <!-- 添加或修改语音模板配置对话框 -->
    <el-dialog v-model="open" :title="title" width="700px" append-to-body>
      <el-form ref="voiceTemplateInfoRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="模板编码" prop="code">
          <el-input v-model="form.code" :disabled="isUpdate" placeholder="请输入模板编码" @blur="checkCodeUnique" />
        </el-form-item>
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="模板状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消息渠道" prop="channel">
          <el-select v-model="form.channel" placeholder="请选择消息渠道" clearable>
            <el-option
              v-for="dict in op_fault_order_alarm_channel"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模板内容" prop="content">
          <!-- <editor v-model="form.content" :min-height="192" /> -->
          <el-input v-model="form.content" placeholder="请输入模板内容" type="textarea" />
        </el-form-item>
        <el-form-item label="平台模板样式" prop="platformContent">
          <!-- <editor v-model="form.platformContent" :min-height="192" /> -->
          <el-input v-model="form.platformContent" placeholder="请输入平台模板样式" type="textarea" />
        </el-form-item>
        <el-form-item label="模板平台ID" prop="platformId">
          <el-input v-model="form.platformId" placeholder="请输入模板平台ID" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">
            确 定
          </el-button>
          <el-button @click="cancel">
            取 消
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
