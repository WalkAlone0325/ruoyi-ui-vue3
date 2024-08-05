<script setup name="MessageNotificationWarningLog">
import { delMsgErrorLog, getMessageNotificationWarningLog, listMsgErrorLog } from '@/api/basic/msgSend'

const { proxy } = getCurrentInstance()

const { message_notification_warning_type } = proxy.useDict('message_notification_warning_type')

const messageNotificationWarningLogList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
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
    warningCode: undefined,
    warningName: undefined,
    businessParameters: undefined,
    faultOrderCode: undefined,
    opStationId: undefined,
    warningLogDescription: undefined,
  },
  rules: {
    id: [
      { required: true, message: '消息记录ID不能为空', trigger: 'blur' },
    ],
    warningCode: [
      { required: true, message: '错误类型不能为空', trigger: 'blur' },
    ],
    warningName: [
      { required: true, message: '消息类型不能为空', trigger: 'blur' },
    ],
    businessParameters: [
      { required: true, message: '消息对应业务的扩展参数不能为空', trigger: 'blur' },
    ],
    faultOrderCode: [
      { required: true, message: '故障单编码不能为空', trigger: 'blur' },
    ],
    opStationId: [
      { required: true, message: '站址运维ID不能为空', trigger: 'blur' },
    ],
    warningLogDescription: [
      { required: true, message: '错误描述不能为空', trigger: 'blur' },
    ],
    remark: [
      { required: true, message: '备注不能为空', trigger: 'blur' },
    ],
  },
})

const { queryParams, form, rules } = toRefs(data)

/** 查询通知公告列表 */
function getList() {
  loading.value = true
  listMsgErrorLog(queryParams.value).then((response) => {
    messageNotificationWarningLogList.value = response.data.records
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
    id: null,
    warningCode: null,
    warningName: null,
    businessParameters: null,
    faultOrderCode: null,
    opStationId: null,
    warningLogDescription: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
  }
  proxy.resetForm('messageNotificationWarningLogRef')
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
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = '添加通知公告'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  loading.value = true
  reset()
  const _id = row.id || ids.value
  getMessageNotificationWarningLog(_id).then((response) => {
    loading.value = false
    form.value = response.data
    open.value = true
    title.value = '查看日志'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs.messageNotificationWarningLogRef.validate((valid) => {
    if (valid) {
      buttonLoading.value = true
      if (form.value.id != null) {
        updateMessageNotificationWarningLog(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        }).finally(() => {
          buttonLoading.value = false
        })
      }
      else {
        addMessageNotificationWarningLog(form.value).then((response) => {
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
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除所选的数据项？').then(() => {
    loading.value = true
    return delMsgErrorLog(_ids)
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
  proxy.download('op/messageNotificationWarningLog/export', {
    ...queryParams.value,
  }, `messageNotificationWarningLog_${new Date().getTime()}.xlsx`)
}

getList()
</script>

<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="auto">
      <el-form-item label="错误类型" prop="warningCode">
        <el-select v-model="queryParams.warningCode" placeholder="请选择错误类型" style="width: 200px" clearable>
          <el-option
            v-for="dict in message_notification_warning_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="故障单编码" prop="faultOrderCode">
        <el-input
          v-model="queryParams.faultOrderCode"
          placeholder="请输入故障单编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="站址运维ID" prop="opStationId">
        <el-input
          v-model="queryParams.opStationId"
          placeholder="请输入站址运维ID"
          clearable
          @keyup.enter="handleQuery"
        />
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
          v-hasPermi="['op:messageNotificationWarningLog:query']"
          type="primary"
          plain
          icon="View"
          :disabled="single"
          @click="handleUpdate"
        >
          查看
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['op:messageNotificationWarningLog:remove']"
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
          v-hasPermi="['op:messageNotificationWarningLog:export']"
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

    <el-table v-loading="loading" :data="messageNotificationWarningLogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column v-if="true" label="消息记录ID" align="center" prop="id" /> -->
      <el-table-column label="错误类型" align="center" prop="warningCode">
        <template #default="scope">
          <dict-tag :options="message_notification_warning_type" :value="scope.row.warningCode" />
        </template>
      </el-table-column>
      <el-table-column label="消息类型" align="center" prop="warningName" />
      <el-table-column label="消息对应业务的扩展参数" align="center" prop="businessParameters" />
      <el-table-column label="故障单编码" align="center" prop="faultOrderCode" />
      <el-table-column label="站址运维ID" align="center" prop="opStationId" />
      <el-table-column label="错误描述" align="center" prop="warningLogDescription" />
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-hasPermi="['op:messageNotificationWarningLog:query']" link type="primary" icon="View" @click="handleUpdate(scope.row)">
            查看
          </el-button>
          <el-button v-hasPermi="['op:messageNotificationWarningLog:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)">
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

    <!-- 添加或修改通知公告对话框 -->
    <el-dialog v-model="open" :title="title" width="600px" append-to-body>
      <!-- :rules="rules"  -->
      <el-form ref="messageNotificationWarningLogRef" disabled :model="form" label-width="100px">
        <el-form-item label="错误类型" prop="warningCode">
          <el-select v-model="queryParams.warningCode" placeholder="请选择错误类型" style="width: 100%" clearable>
            <el-option
              v-for="dict in message_notification_warning_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="消息类型" prop="warningName">
          <el-input v-model="form.warningName" placeholder="请输入消息类型" />
        </el-form-item>
        <el-form-item label="消息对应业务的扩展参数" label-width="110px" prop="businessParameters">
          <el-input v-model="form.businessParameters" type="textarea" placeholder="请输入消息对应业务的扩展参数" />
        </el-form-item>
        <el-form-item label="故障单编码" prop="faultOrderCode">
          <el-input v-model="form.faultOrderCode" placeholder="请输入故障单编码" />
        </el-form-item>
        <el-form-item label="站址运维ID" prop="opStationId">
          <el-input v-model="form.opStationId" placeholder="请输入站址运维ID" />
        </el-form-item>
        <el-form-item label="错误描述" prop="warningLogDescription">
          <el-input v-model="form.warningLogDescription" type="textarea" placeholder="请输入错误描述" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <!-- <el-button :loading="buttonLoading" type="primary" @click="submitForm">
            确 定
          </el-button> -->
          <el-button @click="cancel">
            取 消
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
