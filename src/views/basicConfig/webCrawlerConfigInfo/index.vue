<script setup name="WebCrawlerConfigInfo">
import {
  addWebCrawlerConfigInfo,
  chekUniQue,
  delWebCrawlerConfigInfo,
  getWebCrawlerConfigInfo,
  listWebCrawlerConfigInfo,
  updateWebCrawlerConfigInfo,
} from '@/api/basic/webCrawlerConfigInfo'

const { proxy } = getCurrentInstance()

const webCrawlerConfigInfoList = ref([])
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
    urlPath: undefined,
    viewState: undefined,
    cookie: undefined,
    filePath: undefined,
    fileNamePrefix: undefined,
  },
  rules: {
    code: [
      { required: true, message: '编码不能为空', trigger: 'blur' },
    ],
    name: [
      { required: true, message: '名称不能为空', trigger: 'blur' },
    ],
    urlPath: [
      { required: true, message: '地址不能为空', trigger: 'blur' },
    ],
    viewState: [
      { required: true, message: '状态值不能为空', trigger: 'blur' },
    ],
    cookie: [
      { required: true, message: 'cookie值不能为空', trigger: 'blur' },
    ],
    filePath: [
      { required: true, message: '文件地址不能为空', trigger: 'blur' },
    ],
    fileNamePrefix: [
      { required: true, message: '文件名称前缀不能为空', trigger: 'blur' },
    ],
  },
})

const { queryParams, form, rules } = toRefs(data)

/** 查询网络爬虫配置信息列表 */
function getList() {
  loading.value = true
  listWebCrawlerConfigInfo(queryParams.value).then((response) => {
    webCrawlerConfigInfoList.value = response.rows
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
    urlPath: null,
    viewState: null,
    cookie: null,
    filePath: null,
    fileNamePrefix: null,
  }
  proxy.resetForm('webCrawlerConfigInfoRef')
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
  title.value = '添加网络爬虫配置信息'
  isUpdate.value = false
}

/** 修改按钮操作 */
function handleUpdate(row) {
  loading.value = true
  isUpdate.value = true
  reset()
  const _code = row.code || ids.value
  getWebCrawlerConfigInfo(_code).then((response) => {
    loading.value = false
    form.value = { ...response.data, preCode: response.data.code }
    open.value = true
    title.value = '修改网络爬虫配置信息'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs.webCrawlerConfigInfoRef.validate((valid) => {
    if (valid) {
      buttonLoading.value = true
      if (isUpdate.value) {
        updateWebCrawlerConfigInfo(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        }).finally(() => {
          buttonLoading.value = false
        })
      }
      else {
        addWebCrawlerConfigInfo(form.value).then((response) => {
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
  proxy.$modal.confirm(`是否确认删除网络爬虫配置信息编号为"${_codes}"的数据项？`).then(() => {
    loading.value = true
    return delWebCrawlerConfigInfo(_codes)
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
  proxy.download('op/webCrawlerConfigInfo/export', {
    ...queryParams.value,
  }, `webCrawlerConfigInfo_${new Date().getTime()}.xlsx`)
}

// 检测 code 是否唯一
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
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="68px" @submit.prevent>
      <!-- <el-form-item label="编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
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
          v-hasPermi="['op:webCrawlerConfigInfo:add']"
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
          v-hasPermi="['op:webCrawlerConfigInfo:edit']"
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
          v-hasPermi="['op:webCrawlerConfigInfo:remove']"
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
          v-hasPermi="['op:webCrawlerConfigInfo:export']"
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

    <el-table v-loading="loading" :data="webCrawlerConfigInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="地址" align="center" prop="urlPath" />
      <el-table-column label="状态值" align="center" prop="viewState" />
      <el-table-column label="Cookie值" align="center" prop="cookie" />
      <el-table-column label="文件地址" align="center" prop="filePath" />
      <el-table-column label="文件名称前缀" align="center" prop="fileNamePrefix" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-hasPermi="['op:webCrawlerConfigInfo:edit']" link type="primary" icon="Edit" @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button v-hasPermi="['op:webCrawlerConfigInfo:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)">
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

    <!-- 添加或修改网络爬虫配置信息对话框 -->
    <el-dialog v-model="open" :title="title" width="500px" append-to-body>
      <el-form ref="webCrawlerConfigInfoRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" :disabled="isUpdate" placeholder="请输入编码" @blur="checkCodeUnique" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="地址" prop="urlPath">
          <el-input v-model="form.urlPath" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="状态值" prop="viewState">
          <el-input v-model="form.viewState" placeholder="请输入状态值" />
        </el-form-item>
        <el-form-item label="cookie值" prop="cookie">
          <el-input v-model="form.cookie" type="textarea" placeholder="请输入cookie值" />
        </el-form-item>
        <el-form-item label="文件地址" prop="filePath">
          <el-input v-model="form.filePath" placeholder="请输入文件地址" />
        </el-form-item>
        <el-form-item label="文件名称前缀" prop="fileNamePrefix">
          <el-input v-model="form.fileNamePrefix" placeholder="请输入文件名称前缀" />
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
