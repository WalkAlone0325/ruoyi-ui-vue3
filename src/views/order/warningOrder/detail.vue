<script setup name="WarningOrderDetail">
import { endWarningOrderDetail, listDetailWarningOrder, listWarningConfig, listWarningType } from '@/api/basic/warningOrder'

const { proxy } = getCurrentInstance()
const route = useRoute()

const { sys_yes_no, op_fault_order_alarm_channel } = proxy.useDict('sys_yes_no', 'op_fault_order_alarm_channel')

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  faultOrderCode: null,
  warningConfigCode: null,
  warningConfigDetailId: null,
  warningFaultOrderAlarmId: null,
  opFaultOrderAlarmChannelCode: null,
  isEnd: null,
})
const showSearch = ref(true)
const configOptions = ref([])
const typeOptions = ref([])
const total = ref(0)
const list = ref([])
const loading = ref(false)

/** 查询站点信息列表 */
function getList() {
  loading.value = true
  listDetailWarningOrder({ ...queryParams.value, warningFaultOrderAlarmId: route.query.id }).then((response) => {
    list.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  queryParams.value.warningFaultOrderAlarmId = null
  route.query.id = null
  proxy.resetForm('queryRef')
  configOptions.value = []
  handleQuery()
}

async function getTypeData() {
  const res = await listWarningType()
  typeOptions.value = res
}

async function getConfigData(payload) {
  const res = await listWarningConfig(payload)
  configOptions.value = res
}

function handleConfigCode(val) {
  if (val) {
    queryParams.value.warningConfigDetailId = undefined
    getConfigData({ warningConfigCode: val })
  }
  else {
    configOptions.value = []
    queryParams.value.warningConfigDetailId = undefined
  }
}

async function handleOver(row) {
  const res = await endWarningOrderDetail({ id: row.id })
  if (res.code === 200) {
    proxy.$modal.msgSuccess('操作成功')
    getList()
  }
}

watch(() => route.query.id, (val) => {
  queryParams.value.warningFaultOrderAlarmId = val
  getList()
})

onMounted(() => {
  queryParams.value.warningFaultOrderAlarmId = route.query.id
  // 获取查询
  getTypeData()
  // getConfigData()
})

getList()
</script>

<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="auto">
      <el-form-item label="故障单ID" prop="warningFaultOrderAlarmId">
        <el-input v-model="queryParams.warningFaultOrderAlarmId" clearable placeholder="请输入故障单编码" style="width: 200px;" />
      </el-form-item>
      <el-form-item label="故障单编码" prop="faultOrderCode">
        <el-input v-model="queryParams.faultOrderCode" clearable placeholder="请输入故障单编码" style="width: 200px;" />
      </el-form-item>
      <el-form-item label="告警渠道" prop="opFaultOrderAlarmChannelCode">
        <el-select v-model="queryParams.opFaultOrderAlarmChannelCode" placeholder="请选择告警渠道" style="width: 200px" clearable>
          <el-option
            v-for="dict in op_fault_order_alarm_channel"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="告警配置类型" prop="warningConfigCode">
        <el-select v-model="queryParams.warningConfigCode" placeholder="请选择告警配置类型" style="width: 200px" clearable @change="handleConfigCode">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.code"
            :label="dict.name"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="告警配置" prop="warningConfigDetailId">
        <el-select v-model="queryParams.warningConfigDetailId" placeholder="请选择告警配置" style="width: 200px" clearable>
          <el-option
            v-for="dict in configOptions"
            :key="dict.id"
            :label="dict.warningConfigDetailName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否结束" prop="isEnd">
        <el-select v-model="queryParams.isEnd" placeholder="请选择" style="width: 200px" clearable>
          <el-option
            v-for="dict in sys_yes_no"
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

    <el-table v-loading="loading" :data="list">
      <!-- <el-table-column label="故障单ID" align="center" prop="id" /> -->
      <el-table-column label="告警工单ID" align="center" prop="warningFaultOrderAlarmId" />
      <el-table-column label="故障单编码" align="center" prop="faultOrderCode" />
      <el-table-column label="省级部门" align="center" prop="provinceDeptName" />
      <el-table-column label="市级部门" align="center" prop="cityDeptName" />
      <el-table-column label="区县部门" align="center" prop="countyDeptName" />
      <el-table-column label="站址运维ID" align="center" prop="opStationId" />
      <el-table-column label="站址名称" align="center" prop="stationName" />
      <el-table-column label="动作列表" align="center" prop="operationSort" />
      <el-table-column label="操作时间" align="center" prop="operationTime" />
      <el-table-column label="告警渠道" align="center" prop="opFaultOrderAlarmChannelName" />
      <el-table-column label="告警配置类型" align="center" prop="warningConfigName" />
      <el-table-column label="最后发送时间" align="center" prop="lastSendTime" />
      <el-table-column label="下次发送时间" align="center" prop="nextSendTime" />
      <el-table-column label="历史发送次数" align="center" prop="pastSendNumber" />
      <el-table-column label="是否结束" align="center" prop="isEnd">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.isEnd" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-if="scope.row.isEnd === 'N'" v-hasPermi="['op:warningFaultOrderAlarmDetail:endAlarm']" link type="primary" icon="CloseBold" @click.stop="handleOver(scope.row)">
            结束
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
  </div>
</template>
