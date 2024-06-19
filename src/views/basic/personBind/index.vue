<script setup name="StationBind">
import { getCities, getCounties, getProvinces } from '@/api/basic'
import { addBind, delBind, listStationNotBind, listStationYesBind } from '@/api/basic/personBind'
import { deptTreeSelect } from '@/api/system/user'
import { listPost } from '@/api/system/post'

const { proxy } = getCurrentInstance()

const bindList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const unbindIds = ref([])
const single = ref(true)
const multiple = ref(true)
const multipleBind = ref(true)
const total = ref(0)
const title = ref('')
const deptName = ref('')
const deptOptions = ref(undefined)
const notBindList = ref([])
const total2 = ref(0)
const currentTitle = ref('')
const openPost = ref(false)
const postOptions = ref([])
const postId = ref('')
const personnelId = ref('')

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptIdSearching: undefined,
    personnelCode: undefined,
    name: undefined,
  },
})

const { queryParams } = toRefs(data)

function getListPost() {
  listPost().then((response) => {
    postOptions.value = response.rows
  })
}

function handleBind(row) {
  openPost.value = true
  personnelId.value = row.personnelId
}

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value)
    return true
  return data.label.includes(value)
}
/** 根据名称筛选部门树 */
watch(deptName, (val) => {
  proxy.$refs.deptTreeRef.filter(val)
})
/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then((response) => {
    deptOptions.value = response.data
  })
}
/** 查询用户列表 */
function getList() {
  loading.value = true
  listStationYesBind({ ...queryParams.value, pageNum: 1, deptIdSearching: queryParams.value.deptIdSearching || 100 }).then(
    (res) => {
      loading.value = false
      bindList.value = res.rows
      total.value = res.total
    },
  )
}
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.deptIdSearching = data.id
  currentTitle.value = data.label
  handleQuery()
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef')
  queryParams.value.deptIdSearching = deptOptions.value[0].id
  currentTitle.value = deptOptions.value[0].label
  proxy.$refs.deptTreeRef.setCurrentKey(deptOptions.value[0].id)
  handleQuery()
}
function resetQuery2() {
  queryParams.value = {
    ...queryParams.value,
    pageNum: 1,
    pageSize: 10,
    personnelCode: undefined,
    name: undefined,
    deptIdSearching: queryParams.value.deptIdSearching || 100,
  }
  handleQuery2()
}

function handleQuery2() {
  queryParams.value.pageNum = 1
  handleAdd()
}

/** 解绑按钮操作 */
function handleDelete(row) {
  const arr = row.deptId ? row.deptId : []
  const findRow = arr.find(item => item.deptId == queryParams.value.deptIdSearching)

  proxy.$modal
    .confirm('是否确认解绑选中的数据项？')
    .then(() => {
      return delBind({
        personnelId: row.personnelId,
        deptId: findRow ? findRow.deptId : queryParams.value.deptIdSearching,
        postId: findRow ? findRow.postId : '',
      })
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('解除成功')
    })
    .catch(() => {})
}

/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.opStationId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

// 绑定的选择
function handleSelectionBindChange(selection) {
  unbindIds.value = selection.map(item => ({ opStationId: item.opStationId, deptId: item.deptId }))
  multipleBind.value = !selection.length
}

/** 取消按钮 */
function cancel() {
  if (!open.value) return
  open.value = false
  getList()
}
function cancelPost() {
  openPost.value = false
  postId.value = ''
}
/** 新增按钮操作 */
function handleAdd() {
  if (queryParams.value.deptIdSearching == undefined) {
    queryParams.value.deptIdSearching = deptOptions.value[0].id
    currentTitle.value = deptOptions.value[0].label
  }
  loading.value = true
  listStationNotBind({ ...queryParams.value, pageNum: 1 }).then((response) => {
    open.value = true
    loading.value = false
    title.value = `添加站点绑定：${currentTitle.value}`
    notBindList.value = response.rows
    total2.value = response.total
  })
}

const buttonLoading = ref(false)

/** 提交按钮 */
function submitForm() {
  if (postId.value == '') {
    proxy.$modal.msgError('请选择岗位')
    return
  }
  buttonLoading.value = true
  addBind({
    personnelId: personnelId.value,
    postId: postId.value,
    deptId: queryParams.value.deptIdSearching,
  }).then(() => {
    personnelId.value = ''
    postId.value = ''
    proxy.$modal.msgSuccess('绑定成功')
    buttonLoading.value = false
    openPost.value = false
    loading.value = true
    listStationNotBind({ ...queryParams.value }).then((response) => {
      loading.value = false
      notBindList.value = response.rows
      total2.value = response.total
    })
  })
}

getListPost()
getDeptTree()
getList()
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部门数据 -->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            prefix-icon="Search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            ref="deptTreeRef"
            :data="deptOptions"
            :props="{ label: 'label', children: 'children' }"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :default-checked-keys="[100]"
            node-key="id"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!-- 用户数据 -->
      <el-col :span="20" :xs="24">
        <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="人员工号" prop="personnelCode">
            <el-input
              v-model="queryParams.personnelCode"
              placeholder="请输入人员工号"
              clearable
              style="width: 200px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="人员姓名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入人员姓名"
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
              v-hasPermi="['system:user:add']"
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
            >
              绑定
            </el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              v-hasPermi="['system:user:remove']"
              type="danger"
              :disabled="multipleBind"
              plain
              icon="Delete"
              @click="handleDelete"
            >
              解绑
            </el-button>
          </el-col> -->
          <right-toolbar
            v-model:showSearch="showSearch"
            @query-table="getList"
          />
        </el-row>

        <el-table v-loading="loading" :data="bindList" @selection-change="handleSelectionBindChange">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="人员工号" align="center" prop="personnelCode" />
          <el-table-column label="人员姓名" align="center" prop="name" />
          <el-table-column label="人员性别" align="center" prop="genderName" />
          <el-table-column label="人员婚姻" align="center" prop="maritalName" />
          <el-table-column label="通讯地址" align="center" prop="contactAddress" />
          <el-table-column label="人员联系手机" align="center" prop="contactMobile" />
          <el-table-column label="人员联系电话" align="center" prop="contactTel" />
          <el-table-column label="人员联系邮箱" align="center" prop="contactEmail" />
          <el-table-column label="人员状态" align="center" prop="statusName" />
          <el-table-column label="备注" align="center" prop="remark" width="200" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button v-hasPermi="['system:user:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)">
                解绑
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
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog v-model="open" :title="title" width="80%" append-to-body @close="cancel">
      <el-form v-show="showSearch" ref="queryRef2" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="人员工号" prop="personnelCode">
          <el-input
            v-model="queryParams.personnelCode"
            placeholder="请输入人员工号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="人员姓名" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入人员姓名"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery2">
            搜索
          </el-button>
          <el-button icon="Refresh" @click="resetQuery2">
            重置
          </el-button>
        </el-form-item>
        <el-form-item>
          <div style="color: #e47470; font-size: 26px; font-weight: bold; display: flex; justify-content: flex-end;">
            正在为：【<span>{{ currentTitle }}</span>】绑定站点
          </div>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" height="600px" :data="notBindList" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="人员工号" align="center" prop="personnelCode" />
        <el-table-column label="人员姓名" align="center" prop="name" />
        <el-table-column label="人员性别" align="center" prop="genderName" />
        <el-table-column label="人员婚姻" align="center" prop="maritalName" />
        <el-table-column label="通讯地址" align="center" prop="contactAddress" />
        <el-table-column label="人员联系手机" align="center" prop="contactMobile" />
        <el-table-column label="人员联系电话" align="center" prop="contactTel" />
        <el-table-column label="人员联系邮箱" align="center" prop="contactEmail" />
        <el-table-column label="人员状态" align="center" prop="statusName" />
        <el-table-column label="备注" align="center" prop="remark" width="200" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button v-hasPermi="['system:user: add']" link type="primary" icon="Plus" @click="handleBind(scope.row)">
              绑定
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total2 > 0"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        style="margin-top: 10px; padding-right: 20px;"
        :total="total2"
        @pagination="handleAdd"
      />

      <el-dialog
        v-model="openPost"
        style="margin-top: 30vh !important;"
        width="500"
        title="选择部门"
        append-to-body
      >
        <el-select v-model="postId" placeholder="请选择部门">
          <el-option
            v-for="item in postOptions"
            :key="item.postId"
            width="100%"
            :label="item.postName"
            :value="item.postId"
            :disabled="item.status == 1"
          />
        </el-select>

        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" :loading="buttonLoading" @click="submitForm">
              确 定
            </el-button>
            <el-button @click="cancelPost">
              取 消
            </el-button>
          </div>
        </template>
      </el-dialog>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">
            取 消
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style>
.menu-dialog-height {
  height: 500px;
}
</style>
