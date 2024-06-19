<script setup name="WarningConfigDetail">
import {
  addWarningConfigDetail,
  delWarningConfigDetail,
  getWarningConfigDetail,
  listWarningConfigDetail,
  optionsEffectType,
  optionsVoiceType,
  optionsWarningType,
  updateWarningConfigDetail,
} from '@/api/basic/warningConfigDetail'

const { proxy } = getCurrentInstance()

const { op_fault_order_alarm, op_fault_order_alarm_channel } = proxy.useDict('op_fault_order_alarm', 'op_fault_order_alarm_channel')

const warningConfigDetailList = ref([])
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
    warningConfigCode: undefined,
    warningConfigName: undefined,
    opFaultOrderAlarmCode: undefined,
    opFaultOrderAlarmName: undefined,
    opFaultOrderAlarmValue: undefined,
    opFaultOrderAlarmNumber: undefined,
    opFaultOrderAlarmValueParameter: undefined,
    opFaultOrderAlarmChannelCode: undefined,
    opFaultOrderAlarmChannelName: undefined,
    opFaultOrderAlarmDelayedTime: undefined,
    finishTime: undefined,
    templateCode: undefined,
    templateName: undefined,
    takeEffectPostIds: undefined,
    takeEffectPostNames: undefined,
    takeEffectStartTime: undefined,
    takeEffectEndTime: undefined,
  },
  rules: {
    warningConfigCode: [
      { required: true, message: '告警策略不能为空', trigger: 'blur' },
    ],
    warningConfigName: [
      { required: true, message: '告警策略不能为空', trigger: 'blur' },
    ],
    opFaultOrderAlarmCode: [
      { required: true, message: '告警时间策略不能为空', trigger: 'blur' },
    ],
    opFaultOrderAlarmName: [
      { required: true, message: '告警时间策略不能为空', trigger: 'blur' },
    ],
    opFaultOrderAlarmValue: [
      { required: true, message: '告警时间策略值不能为空', trigger: 'blur' },
    ],
    opFaultOrderAlarmNumber: [
      { required: true, message: '告警次数不能为空', trigger: 'blur' },
    ],
    opFaultOrderAlarmValueParameter: [
      { required: true, message: '告警辅助参数不能为空', trigger: 'blur' },
    ],
    opFaultOrderAlarmChannelCode: [
      { required: true, message: '告警渠道不能为空', trigger: 'blur' },
    ],
    opFaultOrderAlarmChannelName: [
      { required: true, message: '告警渠道不能为空', trigger: 'blur' },
    ],
    opFaultOrderAlarmDelayedTime: [
      { required: true, message: '首次延时时间不能为空', trigger: 'blur' },
    ],
    // finishTime: [
    //   { required: true, message: '结束时长不能为空', trigger: 'blur' },
    // ],
    templateCode: [
      { required: true, message: '模板名称不能为空', trigger: 'blur' },
    ],
    takeEffectPostIds: [
      { required: true, message: '生效岗位不能为空', trigger: 'blur' },
    ],
    takeEffectPostNames: [
      { required: true, message: '生效岗位不能为空', trigger: 'blur' },
    ],
    // takeEffectStartTime: [
    //   { required: true, message: '生效开始时间不能为空', trigger: 'blur' },
    // ],
    // takeEffectEndTime: [
    //   { required: true, message: '生效结束时间不能为空', trigger: 'blur' },
    // ],
  },
})

const { queryParams, form, rules } = toRefs(data)

/** 查询告警配置列表 */
function getList() {
  loading.value = true
  listWarningConfigDetail(queryParams.value).then((response) => {
    warningConfigDetailList.value = response.rows
    total.value = response.total
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
    warningConfigCode: null,
    warningConfigName: null,
    opFaultOrderAlarmCode: null,
    opFaultOrderAlarmName: null,
    opFaultOrderAlarmValue: null,
    opFaultOrderAlarmNumber: null,
    opFaultOrderAlarmValueParameter: null,
    opFaultOrderAlarmChannelCode: null,
    opFaultOrderAlarmChannelName: null,
    opFaultOrderAlarmDelayedTime: null,
    finishTime: null,
    templateCode: null,
    templateName: null,
    takeEffectPostIds: null,
    takeEffectPostNames: null,
    takeEffectStartTime: null,
    takeEffectEndTime: null,
    remark: null,
  }
  proxy.resetForm('warningConfigDetailRef')
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
  title.value = '添加告警配置'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  loading.value = true
  reset()
  const _id = row.id || ids.value
  getWarningConfigDetail(_id).then((response) => {
    loading.value = false
    form.value = {
      ...response.data,
      opFaultOrderAlarmChannelCode: response.data.opFaultOrderAlarmChannelCode ? response.data.opFaultOrderAlarmChannelCode.split(',') : [],
      takeEffectPostIds: response.data.takeEffectPostIds ? response.data.takeEffectPostIds.split(',') : [],
    }
    open.value = true
    title.value = '修改告警配置'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs.warningConfigDetailRef.validate((valid) => {
    const opFaultOrderAlarmName = op_fault_order_alarm.value.find(item => item.value == form.value.opFaultOrderAlarmCode)?.label
    const data = {
      ...form.value,
      opFaultOrderAlarmChannelCode: form.value.opFaultOrderAlarmChannelCode ? form.value.opFaultOrderAlarmChannelCode.join(',') : '',
      takeEffectPostIds: form.value.takeEffectPostIds ? form.value.takeEffectPostIds.join(',') : '',
      opFaultOrderAlarmName,
    }
    if (valid) {
      buttonLoading.value = true
      if (form.value.id != null) {
        updateWarningConfigDetail(data).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        }).finally(() => {
          buttonLoading.value = false
        })
      }
      else {
        addWarningConfigDetail(data).then((response) => {
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
  proxy.$modal.confirm(`是否确认删除告警配置编号为"${_ids}"的数据项？`).then(() => {
    loading.value = true
    return delWarningConfigDetail(_ids)
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
  proxy.download('op/warningConfigDetail/export', {
    ...queryParams.value,
  }, `warningConfigDetail_${new Date().getTime()}.xlsx`)
}

// options
// optionsEffectType,
//   optionsVoiceType,
//   optionsWarningType,
const options1 = ref([])
const options2 = ref([])
const options3 = ref([])
async function getOptions1() {
  const res = await optionsEffectType()
  options1.value = res
}
async function getOptions2() {
  const res = await optionsVoiceType()
  options2.value = res.data
}
async function getOptions3() {
  const res = await optionsWarningType()
  options3.value = res
}

getOptions1()
getOptions2()
getOptions3()

getList()
</script>

<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="auto">
      <el-form-item label="告警策略" prop="warningConfigCode">
        <el-select v-model="queryParams.warningConfigCode" style="width: 200px;" placeholder="请选择告警策略">
          <el-option
            v-for="dict in options3"
            :key="dict.code"
            :label="dict.name"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="告警时间策略" prop="opFaultOrderAlarmCode">
        <el-select v-model="queryParams.opFaultOrderAlarmCode" style="width: 200px;" placeholder="请选择告警时间策略">
          <el-option
            v-for="dict in op_fault_order_alarm"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="告警渠道" prop="opFaultOrderAlarmChannelCode">
        <el-select v-model="queryParams.opFaultOrderAlarmChannelCode" style="width: 200px;" placeholder="请选择告警渠道">
          <el-option
            v-for="dict in op_fault_order_alarm_channel"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生效岗位" prop="takeEffectPostIds">
        <el-select v-model="queryParams.takeEffectPostIds" style="width: 200px;" placeholder="请选择生效岗位">
          <el-option
            v-for="dict in options1"
            :key="dict.postId"
            :label="dict.postName"
            :value="dict.postId"
          />
        </el-select>
      </el-form-item> -->
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
          v-hasPermi="['op:warningConfigDetail:add']"
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
          v-hasPermi="['op:warningConfigDetail:edit']"
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
          v-hasPermi="['op:warningConfigDetail:remove']"
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
        >
          删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['op:warningConfigDetail:export']"
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
        >
          导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
    </el-row>

    <el-table v-loading="loading" :data="warningConfigDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="告警策略" align="center" prop="warningConfigName" />
      <el-table-column label="告警时间策略" align="center" prop="opFaultOrderAlarmName" />
      <el-table-column label="告警时间策略值" align="center" prop="opFaultOrderAlarmValue" width="120" />
      <el-table-column label="告警次数" align="center" prop="opFaultOrderAlarmNumber" />
      <el-table-column label="告警辅助参数" align="center" prop="opFaultOrderAlarmValueParameter" />
      <el-table-column label="告警渠道" align="center" prop="opFaultOrderAlarmChannelName" />
      <el-table-column label="首次延时时间" align="center" prop="opFaultOrderAlarmDelayedTime" />
      <el-table-column label="结束时长" align="center" prop="finishTime" />
      <el-table-column label="模板名称" align="center" prop="templateName" />
      <!-- <el-table-column label="生效岗位" align="center" prop="takeEffectPostIds" /> -->
      <el-table-column label="生效岗位" align="center" prop="takeEffectPostNames" />
      <el-table-column label="生效开始时间" align="center" prop="takeEffectStartTime" />
      <el-table-column label="生效结束时间" align="center" prop="takeEffectEndTime" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-hasPermi="['op:warningConfigDetail:edit']" link type="primary" icon="Edit" @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button v-hasPermi="['op:warningConfigDetail:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)">
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

    <!-- 添加或修改告警配置对话框 -->
    <el-dialog v-model="open" :title="title" width="800px" append-to-body>
      <el-form ref="warningConfigDetailRef" :model="form" :rules="rules" label-width="auto">
        <el-row>
          <el-col :span="12">
            <el-form-item label="告警策略" prop="warningConfigCode">
              <el-select v-model="form.warningConfigCode" placeholder="请选择告警策略">
                <el-option
                  v-for="dict in options3"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警时间策略" prop="opFaultOrderAlarmCode">
              <el-select v-model="form.opFaultOrderAlarmCode" placeholder="请选择告警时间策略">
                <el-option
                  v-for="dict in op_fault_order_alarm"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警时间策略值" prop="opFaultOrderAlarmValue">
              <el-input v-model="form.opFaultOrderAlarmValue" type="number" placeholder="请输入告警时间策略值" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警次数" prop="opFaultOrderAlarmNumber">
              <el-input v-model="form.opFaultOrderAlarmNumber" type="number" placeholder="请输入告警次数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警辅助参数" prop="opFaultOrderAlarmValueParameter">
              <el-input v-model="form.opFaultOrderAlarmValueParameter" placeholder="请输入告警辅助参数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警渠道" prop="opFaultOrderAlarmChannelCode">
              <el-select v-model="form.opFaultOrderAlarmChannelCode" multiple placeholder="请选择告警渠道">
                <el-option
                  v-for="dict in op_fault_order_alarm_channel"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首次延时时间(分)" prop="opFaultOrderAlarmDelayedTime">
              <el-input v-model="form.opFaultOrderAlarmDelayedTime" type="number" placeholder="请输入首次延时时间" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时长(分)" prop="finishTime">
              <el-input v-model="form.finishTime" type="number" placeholder="请输入结束时长" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板编码" prop="templateCode">
              <el-select v-model="form.templateCode" placeholder="请选择模板编码">
                <el-option
                  v-for="dict in options2"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生效岗位" prop="takeEffectPostIds">
              <el-select v-model="form.takeEffectPostIds" multiple placeholder="请选择生效岗位">
                <el-option
                  v-for="dict in options1"
                  :key="`${dict.postId}`"
                  :label="dict.postName"
                  :value="`${dict.postId}`"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生效开始时间" prop="takeEffectStartTime">
              <el-time-picker v-model="form.takeEffectStartTime" format="HH:mm:ss" value-format="HH:mm:ss" style="width: 100%;" placeholder="请选择生效开始时间" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生效结束时间" prop="takeEffectEndTime">
              <el-time-picker v-model="form.takeEffectEndTime" format="HH:mm:ss" value-format="HH:mm:ss" style="width: 100%;" placeholder="请选择生效结束时间" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
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
