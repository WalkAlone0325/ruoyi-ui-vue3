<script setup name="MessageNotificationLog">
import { delMsgLog, getMessageNotificationLog, listMsgLog } from '@/api/basic/msgSend'

const { proxy } = getCurrentInstance()

const { inform_type, op_fault_order_alarm_channel, inform_send_type, sys_common_status } = proxy.useDict('inform_type', 'op_fault_order_alarm_channel', 'inform_send_type', 'sys_common_status', 'sys_common_status')

const messageNotificationLogList = ref([])
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
    platformId: undefined,
    content: undefined,
    typeCode: undefined,
    typeName: undefined,
    channelCode: undefined,
    channelName: undefined,
    sendTypeCode: undefined,
    sendTypeName: undefined,
    sendPersonnelId: undefined,
    sendPersonnelCode: undefined,
    sendPersonnelName: undefined,
    sendPersonnelTerminalCode: undefined,
    sendTime: undefined,
    sendRequestStatusCode: undefined,
    sendRequestStatusName: undefined,
    platformSendRequestStatusMsg: undefined,
    platformReportTime: undefined,
    sendOpStatusCode: undefined,
    sendOpStatusName: undefined,
    platformSendOpStatusMsg: undefined,
    personnelRespondCode: undefined,
    personnelRespondName: undefined,
    personnelRespondTime: undefined,
    businessParameters: undefined,
  },
  rules: {
    id: [
      { required: true, message: '消息记录ID不能为空', trigger: 'blur' },
    ],
    platformId: [
      { required: true, message: '消息内容不能为空', trigger: 'blur' },
    ],
    content: [
      { required: true, message: '消息内容不能为空', trigger: 'blur' },
    ],
    typeCode: [
      { required: true, message: '消息类型不能为空', trigger: 'blur' },
    ],
    typeName: [
      { required: true, message: '消息类型不能为空', trigger: 'blur' },
    ],
    channelCode: [
      { required: true, message: '发送渠道不能为空', trigger: 'blur' },
    ],
    channelName: [
      { required: true, message: '发送渠道不能为空', trigger: 'blur' },
    ],
    sendTypeCode: [
      { required: true, message: '发送类型不能为空', trigger: 'blur' },
    ],
    sendTypeName: [
      { required: true, message: '发送类型不能为空', trigger: 'blur' },
    ],
    sendPersonnelId: [
      { required: true, message: '人员ID不能为空', trigger: 'blur' },
    ],
    sendPersonnelCode: [
      { required: true, message: '人员工号不能为空', trigger: 'blur' },
    ],
    sendPersonnelName: [
      { required: true, message: '人员姓名不能为空', trigger: 'blur' },
    ],
    sendPersonnelTerminalCode: [
      { required: true, message: '发送人员终端标识不能为空', trigger: 'blur' },
    ],
    sendTime: [
      { required: true, message: '发送时间不能为空', trigger: 'blur' },
    ],
    sendRequestStatusCode: [
      { required: true, message: '发送状态不能为空', trigger: 'blur' },
    ],
    sendRequestStatusName: [
      { required: true, message: '发送状态不能为空', trigger: 'blur' },
    ],
    platformSendRequestStatusMsg: [
      { required: true, message: '发送状态，平台原始数据不能为空', trigger: 'blur' },
    ],
    platformReportTime: [
      { required: true, message: '回执时间不能为空', trigger: 'blur' },
    ],
    sendOpStatusCode: [
      { required: true, message: '平台回执业务状态不能为空', trigger: 'blur' },
    ],
    sendOpStatusName: [
      { required: true, message: '平台回执业务状态不能为空', trigger: 'blur' },
    ],
    platformSendOpStatusMsg: [
      { required: true, message: '平台回执业务状态，平台原始数据不能为空', trigger: 'blur' },
    ],
    personnelRespondCode: [
      { required: true, message: '人员是否响应不能为空', trigger: 'blur' },
    ],
    personnelRespondName: [
      { required: true, message: '人员是否响应不能为空', trigger: 'blur' },
    ],
    personnelRespondTime: [
      { required: true, message: '人员响应时间不能为空', trigger: 'blur' },
    ],
    businessParameters: [
      { required: true, message: '消息对应业务的扩展参数不能为空', trigger: 'blur' },
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
  listMsgLog(queryParams.value).then((response) => {
    messageNotificationLogList.value = response.data.records
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
    platformId: null,
    content: null,
    typeCode: null,
    typeName: null,
    channelCode: null,
    channelName: null,
    sendTypeCode: null,
    sendTypeName: null,
    sendPersonnelId: null,
    sendPersonnelCode: null,
    sendPersonnelName: null,
    sendPersonnelTerminalCode: null,
    sendTime: null,
    sendRequestStatusCode: null,
    sendRequestStatusName: null,
    platformSendRequestStatusMsg: null,
    platformReportTime: null,
    sendOpStatusCode: null,
    sendOpStatusName: null,
    platformSendOpStatusMsg: null,
    personnelRespondCode: null,
    personnelRespondName: null,
    personnelRespondTime: null,
    businessParameters: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
  }
  proxy.resetForm('messageNotificationLogRef')
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
  getMessageNotificationLog(_id).then((response) => {
    loading.value = false
    form.value = response.data
    open.value = true
    title.value = '查看日志'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs.messageNotificationLogRef.validate((valid) => {
    if (valid) {
      buttonLoading.value = true
      if (form.value.id != null) {
        updateMessageNotificationLog(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        }).finally(() => {
          buttonLoading.value = false
        })
      }
      else {
        addMessageNotificationLog(form.value).then((response) => {
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
    return delMsgLog(_ids)
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
  proxy.download('op/messageNotificationLog/export', {
    ...queryParams.value,
  }, `messageNotificationLog_${new Date().getTime()}.xlsx`)
}

getList()
</script>

<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="70px">
      <el-form-item label="消息类型" prop="typeCode">
        <el-select v-model="queryParams.typeCode" placeholder="请选择消息类型" style="width: 220px" clearable>
          <el-option
            v-for="dict in inform_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发送渠道" prop="channelCode">
        <el-select v-model="queryParams.channelCode" placeholder="请选择发送渠道" style="width: 220px" clearable>
          <el-option
            v-for="dict in op_fault_order_alarm_channel"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发送类型" prop="sendTypeCode">
        <el-select v-model="queryParams.sendTypeCode" placeholder="请选择发送类型" style="width: 220px" clearable>
          <el-option
            v-for="dict in inform_send_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发送状态" prop="sendRequestStatusCode">
        <el-select v-model="queryParams.sendRequestStatusCode" placeholder="请选择发送状态" style="width: 220px" clearable>
          <el-option
            v-for="dict in sys_common_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="平台回执业务状态" prop="sendOpStatusCode" label-width="130px">
        <el-select v-model="queryParams.sendOpStatusCode" placeholder="请选择平台回执业务状态" style="width: 220px" clearable>
          <el-option
            v-for="dict in sys_common_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="人员姓名" prop="sendPersonnelName">
        <el-input
          v-model="queryParams.sendPersonnelName"
          placeholder="请输入人员姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发送人员终端标识" prop="sendPersonnelTerminalCode" label-width="130px">
        <el-input
          v-model="queryParams.sendPersonnelTerminalCode"
          placeholder="请输入发送人员终端标识"
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
      <!-- <el-col :span="1.5">
        <el-button
          v-hasPermi="['op:messageNotificationLog:add']"
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
        >
          新增
        </el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['op:messageNotificationLog:query']"
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
          v-hasPermi="['op:messageNotificationLog:remove']"
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
          v-hasPermi="['op:messageNotificationLog:export']"
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

    <el-table v-loading="loading" :data="messageNotificationLogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column v-if="true" label="消息记录ID" align="center" prop="id" min-width="110" />
      <!-- <el-table-column label="消息内容" align="center" prop="platformId" /> -->
      <el-table-column label="消息内容" align="center" prop="content" min-width="200px" />
      <!-- <el-table-column label="消息类型" align="center" prop="typeCode" /> -->
      <el-table-column label="消息类型" align="center" prop="typeName" />
      <!-- <el-table-column label="发送渠道" align="center" prop="channelCode" /> -->
      <el-table-column label="发送渠道" align="center" prop="channelName" />
      <!-- <el-table-column label="发送类型" align="center" prop="sendTypeCode" /> -->
      <el-table-column label="发送类型" align="center" prop="sendTypeName" />
      <el-table-column label="人员ID" align="center" prop="sendPersonnelId" />
      <!-- <el-table-column label="人员工号" align="center" prop="sendPersonnelCode" /> -->
      <el-table-column label="人员姓名" align="center" prop="sendPersonnelName" min-width="110" />
      <el-table-column label="发送人员终端标识" align="center" prop="sendPersonnelTerminalCode" />
      <el-table-column label="发送时间" align="center" prop="sendTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.sendTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="发送状态" align="center" prop="sendRequestStatusCode" /> -->
      <el-table-column label="发送状态" align="center" prop="sendRequestStatusName" />
      <el-table-column label="发送状态，平台原始数据" align="center" prop="platformSendRequestStatusMsg" min-width="200" />
      <el-table-column label="回执时间" align="center" prop="platformReportTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.platformReportTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="平台回执业务状态" align="center" prop="sendOpStatusCode" /> -->
      <el-table-column label="平台回执业务状态" align="center" prop="sendOpStatusName" />
      <el-table-column label="平台回执业务状态，平台原始数据" align="center" prop="platformSendOpStatusMsg" min-width="200" />
      <!-- <el-table-column label="人员是否响应" align="center" prop="personnelRespondCode" />/ -->
      <el-table-column label="人员是否响应" align="center" prop="personnelRespondName" />
      <el-table-column label="人员响应时间" align="center" prop="personnelRespondTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.personnelRespondTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消息对应业务的扩展参数" align="center" prop="businessParameters" min-width="120" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="150">
        <template #default="scope">
          <el-button v-hasPermi="['op:messageNotificationLog:query']" link type="primary" icon="View" @click="handleUpdate(scope.row)">
            查看
          </el-button>
          <el-button v-hasPermi="['op:messageNotificationLog:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)">
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
    <el-dialog v-model="open" :title="title" width="700px" append-to-body>
      <!-- :rules="rules" -->
      <el-form ref="messageNotificationLogRef" disabled :model="form" label-width="80px">
        <el-form-item label="消息内容">
          <!-- <editor v-model="form.content" :min-height="192" /> -->
          <el-input v-model="form.content" type="textarea" placeholder="请输入消息对应业务的扩展参数" />
        </el-form-item>
        <el-form-item label="消息类型" prop="typeCode">
          <el-select v-model="form.typeCode" placeholder="请选择消息类型" style="width: 100%" clearable>
            <el-option
              v-for="dict in inform_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发送渠道" prop="channelCode">
          <el-select v-model="form.channelCode" placeholder="请选择发送渠道" style="width: 100%" clearable>
            <el-option
              v-for="dict in op_fault_order_alarm_channel"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发送类型" prop="sendTypeCode">
          <el-select v-model="form.sendTypeCode" placeholder="请选择发送类型" style="width: 100%" clearable>
            <el-option
              v-for="dict in inform_send_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="人员ID" prop="sendPersonnelId">
          <el-input v-model="form.sendPersonnelId" placeholder="请输入人员ID" />
        </el-form-item>
        <el-form-item label="人员工号" prop="sendPersonnelCode">
          <el-input v-model="form.sendPersonnelCode" placeholder="请输入人员工号" />
        </el-form-item>
        <el-form-item label="人员姓名" prop="sendPersonnelName">
          <el-input v-model="form.sendPersonnelName" placeholder="请输入人员姓名" />
        </el-form-item>
        <el-form-item label="发送人员终端标识" prop="sendPersonnelTerminalCode" label-width="136">
          <el-input v-model="form.sendPersonnelTerminalCode" placeholder="请输入发送人员终端标识" />
        </el-form-item>
        <el-form-item label="发送时间" prop="sendTime">
          <el-date-picker
            v-model="form.sendTime"
            clearable
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选择发送时间"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="发送状态" prop="sendRequestStatusCode">
          <el-select v-model="form.sendRequestStatusCode" placeholder="请选择发送状态" style="width: 100%" clearable>
            <el-option
              v-for="dict in sys_common_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发送状态，平台原始数据" prop="platformSendRequestStatusMsg" label-width="180">
          <el-input v-model="form.platformSendRequestStatusMsg" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="回执时间" prop="platformReportTime">
          <el-date-picker
            v-model="form.platformReportTime"
            clearable
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选择回执时间"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="平台回执业务状态" prop="sendOpStatusCode" label-width="140px">
          <el-select v-model="form.sendOpStatusCode" placeholder="请选择平台回执业务状态" style="width: 100%" clearable>
            <el-option
              v-for="dict in sys_common_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="平台回执业务状态，平台原始数据" prop="platformSendOpStatusMsg" label-width="240">
          <el-input v-model="form.platformSendOpStatusMsg" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <!-- <el-form-item label="人员是否响应" prop="personnelRespondCode" label-width="140px">
          <el-select v-model="form.personnelRespondCode" placeholder="请选择人员是否响应" style="width: 100%" clearable>
            <el-option
              v-for="dict in sys_common_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="人员是否响应" prop="personnelRespondName" label-width="110">
          <el-input v-model="form.personnelRespondName" placeholder="请输入人员是否响应" />
        </el-form-item>
        <el-form-item label="人员响应时间" prop="personnelRespondTime" label-width="110">
          <el-date-picker
            v-model="form.personnelRespondTime"
            clearable
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选择人员响应时间"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="消息对应业务的扩展参数" prop="businessParameters" label-width="180">
          <el-input v-model="form.businessParameters" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
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
