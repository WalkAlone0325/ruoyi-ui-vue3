<script setup name="WarningConfigInfo">
import { addWarningConfigInfo, checkUniQue, delWarningConfigInfo, getWarningConfigInfo, listWarningConfigInfo, updateWarningConfigInfo } from '@/api/basic/warningConfigInfo'

const { proxy } = getCurrentInstance()

const warningConfigInfoList = ref([])
const open = ref(false)
const updateStatus = ref(false)
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
    name: undefined,
  },
  rules: {
    code: [
      { required: true, message: '告警策略类型不能为空', trigger: 'blur' },
    ],
    name: [
      { required: true, message: '告警策略名称不能为空', trigger: 'blur' },
    ],
  },
})

const { queryParams, form, rules } = toRefs(data)

/** 查询告警配置列表 */
function getList() {
  loading.value = true
  listWarningConfigInfo(queryParams.value).then((response) => {
    warningConfigInfoList.value = response.rows
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
    code: null,
    name: null,
    shortName: null,
    timeOutPeriod: null,
    remark: null,
  }
  proxy.resetForm('warningConfigInfoRef')
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
  title.value = '添加告警配置'
  updateStatus.value = false
}

/** 修改按钮操作 */
function handleUpdate(row) {
  loading.value = true
  reset()
  updateStatus.value = true
  const _code = row.code || ids.value
  getWarningConfigInfo(_code).then((response) => {
    loading.value = false
    form.value = { ...response.data, preCode: response.data.code }
    open.value = true
    title.value = '修改告警配置'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs.warningConfigInfoRef.validate((valid) => {
    if (valid) {
      buttonLoading.value = true
      if (updateStatus.value) {
        updateWarningConfigInfo(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        }).finally(() => {
          buttonLoading.value = false
        })
      }
      else {
        addWarningConfigInfo(form.value).then((response) => {
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
  proxy.$modal.confirm(`是否确认删除告警配置编号为"${_codes}"的数据项？`).then(() => {
    loading.value = true
    return delWarningConfigInfo(_codes)
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
  proxy.download('op/warningConfigInfo/export', {
    ...queryParams.value,
  }, `warningConfigInfo_${new Date().getTime()}.xlsx`)
}

// 检测 code 是否唯一
async function checkCodeUnique(e) {
  if (form.value.preCode === form.value.code) return
  const res = await checkUniQue({ code: e.target.value })
  if (!res) {
    proxy.$modal.msgError('告警策略类型编码已存在')
    form.value.code = ''
  }
}

getList()
</script>

<template>
  <div class="app-container warningConfigInfo-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="auto" @submit.prevent>
      <el-form-item label="告警类型名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入告警类型名称"
          clearable
          style="width: 200px"
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
          v-hasPermi="['op:warningConfigInfo:add']"
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
          v-hasPermi="['op:warningConfigInfo:edit']"
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
          v-hasPermi="['op:warningConfigInfo:remove']"
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
          v-hasPermi="['op:warningConfigInfo:export']"
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

    <el-table v-loading="loading" :data="warningConfigInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column v-if="true" label="告警类型编码" align="center" prop="code" />
      <el-table-column label="告警简称" align="center" prop="shortName" />
      <el-table-column label="告警类型名称" align="center" prop="name" />
      <el-table-column label="超时时长（分钟）" align="center" prop="timeOutPeriod" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-hasPermi="['op:warningConfigInfo:edit']" link type="primary" icon="Edit" @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button v-hasPermi="['op:warningConfigInfo:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)">
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
    <el-dialog v-model="open" :title="title" width="500px" append-to-body align-center>
      <el-form ref="warningConfigInfoRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="告警类型编码" prop="code">
          <el-input v-model="form.code" :disabled="updateStatus" placeholder="请输入告警类型编码" @blur="checkCodeUnique" />
        </el-form-item>
        <el-form-item label="告警类型名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入告警类型名称" />
        </el-form-item>
        <el-form-item label="告警类型简称" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入告警类型简称" />
        </el-form-item>
        <el-form-item label="超时时长（分钟）" prop="timeOutPeriod">
          <el-input v-model="form.timeOutPeriod" placeholder="请输入超时时长（分钟）" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
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

<style lang="scss" scoped>
.warningConfigInfo-container {
  :v-deep(.el-dialog:not(.is-fullscreen)) {
    margin-top: 40vh !important;
  }
}
</style>
