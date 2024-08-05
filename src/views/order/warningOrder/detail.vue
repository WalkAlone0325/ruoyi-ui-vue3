<script setup name="WarningOrderDetail">
import { endWarningOrderDetail, listDetailWarningOrder, listWarningConfig, listWarningType } from '@/api/basic/warningOrder'

const { proxy } = getCurrentInstance()
const route = useRoute()

const { sys_yes_no, op_fault_order_alarm_channel } = proxy.useDict('sys_yes_no', 'op_fault_order_alarm_channel')

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  faultOrderCode: undefined,
  warningConfigCode: undefined,
  warningConfigDetailId: undefined,
  warningFaultOrderAlarmId: undefined,
  opFaultOrderAlarmChannelCode: undefined,
  isEnd: undefined,
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
  listDetailWarningOrder({ ...queryParams.value }).then((response) => {
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

watch(() => route.query.id, (val, preVal) => {
  if (val && val !== preVal) {
    queryParams.value.warningFaultOrderAlarmId = val
  }
}, { immediate: true })

onMounted(() => {
  // 获取查询
  getTypeData()
  getConfigData()
})

getList()
</script>

<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="auto">
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
            :key="dict.opFaultOrderAlarmCode"
            :label="dict.opFaultOrderAlarmName"
            :value="dict.opFaultOrderAlarmCode"
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
      <el-table-column label="故障单编码" align="center" prop="faultOrderCode" />
      <el-table-column label="操作序列" align="center" prop="operationSort" />
      <el-table-column label="操作时间" align="center" prop="operationTime" />
      <el-table-column label="告警配置编码" align="center" prop="warningConfigDetailId" />
      <el-table-column label="告警渠道" align="center" prop="opFaultOrderAlarmChannelName" />
      <el-table-column label="告警配置类型" align="center" prop="warningConfigName" />
      <el-table-column label="业务辅助参数" align="center" prop="auxiliaryParameter" />
      <el-table-column label="最后发送时间" align="center" prop="lastSendTime" />
      <el-table-column label="下次发送时间" align="center" prop="nextSendTime" />
      <el-table-column label="最后发送告警时间策略值" align="center" prop="lastSendAlarmValue" />
      <el-table-column label="下次发送告警时间策略值" align="center" prop="nextSendAlarmValue" />
      <el-table-column label="历史发送次数" align="center" prop="pastSendNumber" />
      <el-table-column label="是否结束" align="center" prop="isEnd">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.isEnd" />
        </template>
      </el-table-column>
      <el-table-column label="消息模板内容" align="center" prop="voiceTemplateContent" />
      <el-table-column label="告警通知联系人" align="center" prop="contactMobiles" />
      <el-table-column label="备注" align="center" prop="remark" />
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
