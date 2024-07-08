<script setup name="StationBind">
import { getCities, getCounties, getProvinces } from '@/api/basic'
import { addBind, delBind, deptTreeSelectNotStation, listStationNotBind, listStationYesBind } from '@/api/basic/stationBind'

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

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    provinceCode: undefined,
    cityCode: undefined,
    countyCode: undefined,
    stationName: undefined,
    opStationId: undefined,
    stationCode: undefined,
    parentId: undefined,
  },
})

const { queryParams } = toRefs(data)

const options1 = ref([])
const options2 = ref([])
const options3 = ref([])

const getProvincesData = async () => {
  const res = await getProvinces({ })
  options1.value = res
}
const getCitiesData = async () => {
  const res = await getCities({ parentCode: queryParams.value.provinceCode })
  options2.value = res
}
const getCountiesData = async () => {
  const res = await getCounties({ parentCode: queryParams.value.cityCode })
  options3.value = res
}

const changeProvinceCode = () => {
  queryParams.value.cityCode = undefined
  queryParams.value.countyCode = undefined

  getCitiesData()
}
const changeCityCode = () => {
  queryParams.value.countyCode = undefined
  getCountiesData()
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
  deptTreeSelectNotStation().then((response) => {
    deptOptions.value = response.data
  })
}
/** 查询用户列表 */
function getList() {
  loading.value = true
  listStationYesBind(queryParams.value).then(
    (res) => {
      loading.value = false
      bindList.value = res.records
      total.value = res.total
    },
  )
}
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.parentId = data.id
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
  options2.value = []
  options3.value = []
  queryParams.value.parentId = deptOptions.value[0].id
  currentTitle.value = deptOptions.value[0].label
  proxy.$refs.deptTreeRef.setCurrentKey(deptOptions.value[0].id)
  handleQuery()
}
function resetQuery2() {
  // proxy.resetForm('queryRef2')
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    provinceCode: undefined,
    cityCode: undefined,
    countyCode: undefined,
    stationName: undefined,
    opStationId: undefined,
    stationCode: undefined,
    parentId: queryParams.value.parentId || 100,
  }
  options2.value = []
  options3.value = []
  handleQuery2()
}

function handleQuery2() {
  queryParams.value.pageNum = 1
  handleAdd()
}

/** 解绑按钮操作 */
function handleDelete(row) {
  const delList = row.opStationId ? [{ opStationId: row.opStationId, deptId: row.deptId }] : unbindIds.value
  proxy.$modal
    .confirm('是否确认解绑选中的数据项？')
    .then(() => {
      return delBind(delList)
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
  open.value = false
}
/** 新增按钮操作 */
function handleAdd() {
  if (queryParams.value.parentId == undefined) {
    queryParams.value.parentId = deptOptions.value[0].id
    currentTitle.value = deptOptions.value[0].label
  }
  loading.value = true
  listStationNotBind({ ...queryParams.value, parentId: queryParams.value.parentId }).then((response) => {
    open.value = true
    loading.value = false
    title.value = `添加站点绑定：${currentTitle.value}`
    notBindList.value = response.records
    total2.value = response.total
  })
}

/** 提交按钮 */
function submitForm() {
  if (ids.value.length == 0) {
    proxy.$modal.msgError('请选择要绑定的站点')
    return
  }
  addBind({
    opStationIdList: ids.value,
    deptId: queryParams.value.parentId,
  }).then(() => {
    proxy.$modal.msgSuccess('绑定成功')
    open.value = false
    getList()
  })
}

getDeptTree()
getProvincesData()
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
          <el-form-item label="所属省" prop="provinceCode">
            <el-select v-model="queryParams.provinceCode" placeholder="请选择" style="width: 240px" clearable @change="changeProvinceCode">
              <el-option
                v-for="dict in options1"
                :key="dict.code"
                :label="dict.name"
                :value="dict.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属地市" prop="cityCode">
            <el-select v-model="queryParams.cityCode" placeholder="请选择" style="width: 240px" clearable @change="changeCityCode">
              <el-option
                v-for="dict in options2"
                :key="dict.code"
                :label="dict.name"
                :value="dict.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属区县" prop="countyCode">
            <el-select v-model="queryParams.countyCode" placeholder="请选择" style="width: 240px" clearable>
              <el-option
                v-for="dict in options3"
                :key="dict.code"
                :label="dict.name"
                :value="dict.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="站址编码" prop="stationCode">
            <el-input v-model="queryParams.stationCode" placeholder="请输入站址编码" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="站址名称" prop="stationName">
            <el-input v-model="queryParams.stationName" placeholder="请输入站址名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="运维ID" prop="opStationId">
            <el-input v-model="queryParams.opStationId" placeholder="请输入运维ID" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <!-- <el-form-item label="部门ID" prop="parentId">
            <el-tree-select
              v-model="queryParams.parentId"
              style="width: 240px;"
              :data="deptOptions"
              :props="{ value: 'id', label: 'label', children: 'children' }"
              value-key="id"
              placeholder="请选择归属部门"
              check-strictly
              @keyup.enter="handleQuery"
            />
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
              v-hasPermi="['op:stationInfo:binding']"
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
            >
              绑定
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['op:stationInfo:unbound']"
              type="danger"
              :disabled="multipleBind"
              plain
              icon="Delete"
              @click="handleDelete"
            >
              解绑
            </el-button>
          </el-col>
          <right-toolbar
            v-model:showSearch="showSearch"
            @query-table="getList"
          />
        </el-row>

        <el-table v-loading="loading" :data="bindList" @selection-change="handleSelectionBindChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="绑定部门" align="center" prop="deptName" />
          <el-table-column label="站址编码" align="center" prop="stationCode" />
          <el-table-column label="站址名称" align="center" prop="stationName" />
          <el-table-column label="运维ID" align="center" prop="opStationId" />
          <el-table-column label="所属省" align="center" prop="provinceName" />
          <el-table-column label="地市名称" align="center" prop="cityName" />
          <el-table-column label="区县名称" align="center" prop="countyName" />
          <el-table-column label="乡镇名称" align="center" prop="townsName" />
          <el-table-column label="网格名称" align="center" prop="gridName" />
          <el-table-column label="站址地址" align="center" prop="stationAddress" />
          <el-table-column label="原产权单位" align="center" prop="originalPropertyRight" />
          <el-table-column label="运营商共享情况名称" align="center" prop="accessOperatorName" />
          <el-table-column label="移动公司维护服务等级" align="center" prop="mobileServiceLevelName" />
          <el-table-column label="联通公司维护服务等级" align="center" prop="unicomServiceLevelName" />
          <el-table-column label="电信公司维护服务等级" align="center" prop="telecomServiceLevelName" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button v-hasPermi="['op:stationInfo:unbound']" link type="primary" icon="Delete" @click="handleDelete(scope.row)">
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
    <el-dialog v-model="open" :title="title" width="80%" append-to-body>
      <el-form v-show="showSearch" ref="queryRef2" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="所属省" prop="provinceCode">
          <el-select v-model="queryParams.provinceCode" placeholder="请选择" style="width: 240px" clearable @change="changeProvinceCode">
            <el-option
              v-for="dict in options1"
              :key="dict.code"
              :label="dict.name"
              :value="dict.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属地市" prop="cityCode">
          <el-select v-model="queryParams.cityCode" placeholder="请选择" style="width: 240px" clearable @change="changeCityCode">
            <el-option
              v-for="dict in options2"
              :key="dict.code"
              :label="dict.name"
              :value="dict.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属区县" prop="countyCode">
          <el-select v-model="queryParams.countyCode" placeholder="请选择" style="width: 240px" clearable>
            <el-option
              v-for="dict in options3"
              :key="dict.code"
              :label="dict.name"
              :value="dict.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="站址编码" prop="stationCode">
          <el-input v-model="queryParams.stationCode" placeholder="请输入站址编码" clearable style="width: 240px" @keyup.enter="handleQuery2" />
        </el-form-item>
        <el-form-item label="站址名称" prop="stationName">
          <el-input v-model="queryParams.stationName" placeholder="请输入站址名称" clearable style="width: 240px" @keyup.enter="handleQuery2" />
        </el-form-item>
        <el-form-item label="运维ID" prop="opStationId">
          <el-input v-model="queryParams.opStationId" placeholder="请输入运维ID" clearable style="width: 240px" @keyup.enter="handleQuery2" />
        </el-form-item>
        <!-- <el-form-item label="部门ID" prop="parentId">
          <el-tree-select
            v-model="queryParams.parentId"
            style="width: 240px;"
            :data="deptOptions"
            :props="{ value: 'id', label: 'label', children: 'children' }"
            value-key="id"
            placeholder="请选择归属部门"
            check-strictly
            @keyup.enter="handleQuery2"
          />
        </el-form-item> -->

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
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="站址编码" align="center" prop="stationCode" />
        <el-table-column label="站址名称" align="center" prop="stationName" />
        <el-table-column label="运维ID" align="center" prop="opStationId" />
        <el-table-column label="所属省" align="center" prop="provinceName" />
        <el-table-column label="地市名称" align="center" prop="cityName" />
        <el-table-column label="区县名称" align="center" prop="countyName" />
        <el-table-column label="乡镇名称" align="center" prop="townsName" />
        <el-table-column label="网格名称" align="center" prop="gridName" />
        <el-table-column label="站址地址" align="center" prop="stationAddress" />
        <el-table-column label="原产权单位" align="center" prop="originalPropertyRight" />
        <el-table-column label="运营商共享情况名称" align="center" prop="accessOperatorName" />
        <el-table-column label="移动公司维护服务等级" align="center" prop="mobileServiceLevelName" />
        <el-table-column label="联通公司维护服务等级" align="center" prop="unicomServiceLevelName" />
        <el-table-column label="电信公司维护服务等级" align="center" prop="telecomServiceLevelName" />
      </el-table>

      <pagination
        v-show="total2 > 0"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        style="margin-top: 10px; padding-right: 20px;"
        :total="total2"
        @pagination="handleAdd"
      />

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">
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

<style>
.menu-dialog-height {
  height: 500px;
}
</style>
