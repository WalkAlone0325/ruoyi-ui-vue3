<script setup name="StationInfo">
import { addStationInfo, delStationInfo, getStationInfo, listStationInfo, updateStationInfo } from '@/api/basic/stationInfo'
import { getCities, getCounties, getProvinces, getStreet } from '@/api/basic'

const { proxy } = getCurrentInstance()
const { sys_yes_no } = proxy.useDict('sys_yes_no')

const stationInfoList = ref([])
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
    stationName: undefined,
    opStationId: undefined,
    provinceCode: undefined,
    provinceName: undefined,
    provinceCompanyCode: undefined,
    provinceCompanyName: undefined,
    cityCode: undefined,
    cityName: undefined,
    cityCompanyCode: undefined,
    cityCompanyName: undefined,
    countyCode: undefined,
    countyName: undefined,
    townsCode: undefined,
    townsName: undefined,
    isBinding: undefined,
  },
  rules: {
    stationCode: [
      { required: true, message: '站址编码不能为空', trigger: 'blur' },
    ],
    stationName: [
      { required: true, message: '站址名称不能为空', trigger: 'blur' },
    ],
    opStationId: [
      { required: true, message: '运维ID不能为空', trigger: 'blur' },
    ],
    provinceCode: [
      { required: true, message: '所属省编码不能为空', trigger: 'blur' },
    ],
    provinceName: [
      { required: true, message: '所属省不能为空', trigger: 'blur' },
    ],
    provinceCompanyCode: [
      { required: true, message: '所属省公司编码不能为空', trigger: 'blur' },
    ],
    provinceCompanyName: [
      { required: true, message: '所属省公司名称不能为空', trigger: 'blur' },
    ],
    cityCode: [
      { required: true, message: '地市编码不能为空', trigger: 'blur' },
    ],
    cityName: [
      { required: true, message: '地市名称不能为空', trigger: 'blur' },
    ],
    cityCompanyCode: [
      { required: true, message: '所属市公司编码不能为空', trigger: 'blur' },
    ],
    cityCompanyName: [
      { required: true, message: '所属市公司名称不能为空', trigger: 'blur' },
    ],
    countyCode: [
      { required: true, message: '区县编码不能为空', trigger: 'blur' },
    ],
    countyName: [
      { required: true, message: '区县名称不能为空', trigger: 'blur' },
    ],
    townsCode: [
      { required: true, message: '乡镇编码不能为空', trigger: 'blur' },
    ],
    townsName: [
      { required: true, message: '乡镇名称不能为空', trigger: 'blur' },
    ],
    gridCode: [
      { required: true, message: '网格编码不能为空', trigger: 'blur' },
    ],
    gridName: [
      { required: true, message: '网格名称不能为空', trigger: 'blur' },
    ],
    stationLongitude: [
      { required: true, message: '站址经度(小数点后6位)不能为空', trigger: 'blur' },
    ],
    stationLatitude: [
      { required: true, message: '站址纬度(小数点后6位)不能为空', trigger: 'blur' },
    ],
    supervisionLongitude: [
      { required: true, message: '运监经度(小数点后6位)不能为空', trigger: 'blur' },
    ],
    supervisionLatitude: [
      { required: true, message: '运监纬度(小数点后6位)不能为空', trigger: 'blur' },
    ],
    fsuLongitude: [
      { required: true, message: 'FSU经度(小数点后6位)不能为空', trigger: 'blur' },
    ],
    fsuLatitude: [
      { required: true, message: 'FSU纬度(小数点后6位)不能为空', trigger: 'blur' },
    ],
    positionalDeviation: [
      { required: true, message: 'FSU上报经纬度与手工锁定经纬度的偏差不能为空', trigger: 'blur' },
    ],
    elevation: [
      { required: true, message: '海拔高度不能为空', trigger: 'blur' },
    ],
    stationStatusCode: [
      { required: true, message: '站址状态编码不能为空', trigger: 'blur' },
    ],
    stationStatusName: [
      { required: true, message: '站址状态名称不能为空', trigger: 'blur' },
    ],
    fsuStatusCode: [
      { required: true, message: 'FSU状态编码不能为空', trigger: 'blur' },
    ],
    fsuStatusName: [
      { required: true, message: 'FSU状态名称不能为空', trigger: 'blur' },
    ],
    fsuHandoverDate: [
      { required: true, message: 'FSU交维时间不能为空', trigger: 'blur' },
    ],
    stationAddress: [
      { required: true, message: '站址地址不能为空', trigger: 'blur' },
    ],
    stationSourceCode: [
      { required: true, message: '站址来源编码不能为空', trigger: 'blur' },
    ],
    stationSourceName: [
      { required: true, message: '站址来源名称不能为空', trigger: 'blur' },
    ],
    originalPropertyRight: [
      { required: true, message: '原产权单位不能为空', trigger: 'blur' },
    ],
    accessOperatorCode: [
      { required: true, message: '运营商共享情况编码不能为空', trigger: 'blur' },
    ],
    accessOperatorName: [
      { required: true, message: '运营商共享情况名称不能为空', trigger: 'blur' },
    ],
    firstBusinessScenarioCode: [
      { required: true, message: '一级业务场景编码不能为空', trigger: 'blur' },
    ],
    firstBusinessScenarioName: [
      { required: true, message: '一级业务场景名称不能为空', trigger: 'blur' },
    ],
    secondBusinessScenarioCode: [
      { required: true, message: '二级业务场景编码不能为空', trigger: 'blur' },
    ],
    secondBusinessScenarioName: [
      { required: true, message: '二级业务场景名称不能为空', trigger: 'blur' },
    ],
    adminAreasCode: [
      { required: true, message: '所属管理区域编码不能为空', trigger: 'blur' },
    ],
    adminAreasName: [
      { required: true, message: '所属管理区域名称不能为空', trigger: 'blur' },
    ],
    adminAreasManagerCode: [
      { required: true, message: '所属管理区域经理编码不能为空', trigger: 'blur' },
    ],
    adminAreasManagerName: [
      { required: true, message: '所属管理区域经理名称不能为空', trigger: 'blur' },
    ],
    adminAreasManagerPhone: [
      { required: true, message: '所属管理区域经理电话不能为空', trigger: 'blur' },
    ],
    opMachinePersonnelCode: [
      { required: true, message: '机房(动环)维护人员编码不能为空', trigger: 'blur' },
    ],
    opMachinePersonnelName: [
      { required: true, message: '机房(动环)维护人员名称不能为空', trigger: 'blur' },
    ],
    opMachinePersonnelPhone: [
      { required: true, message: '机房(动环)维护人员电话不能为空', trigger: 'blur' },
    ],
    opChinaTowerPersonnelCode: [
      { required: true, message: '铁塔维护人员编码不能为空', trigger: 'blur' },
    ],
    opChinaTowerPersonnelName: [
      { required: true, message: '铁塔维护人员名称不能为空', trigger: 'blur' },
    ],
    opChinaTowerPersonnelPhone: [
      { required: true, message: '铁塔维护人员电话不能为空', trigger: 'blur' },
    ],
    tenementPersonnelCode: [
      { required: true, message: '物业人员编码不能为空', trigger: 'blur' },
    ],
    tenementPersonnelName: [
      { required: true, message: '物业人员名称不能为空', trigger: 'blur' },
    ],
    tenementPersonnelPhone: [
      { required: true, message: '物业人员电话不能为空', trigger: 'blur' },
    ],
    firstPowerSupplyModeCode: [
      { required: true, message: '一级供电方式编码不能为空', trigger: 'blur' },
    ],
    firstPowerSupplyModeName: [
      { required: true, message: '一级供电方式名称不能为空', trigger: 'blur' },
    ],
    secondPowerSupplyModeCode: [
      { required: true, message: '二级供电方式编码不能为空', trigger: 'blur' },
    ],
    secondPowerSupplyModeName: [
      { required: true, message: '二级供电方式名称不能为空', trigger: 'blur' },
    ],
    powerSupplyStationCode: [
      { required: true, message: '电力公变编码不能为空', trigger: 'blur' },
    ],
    powerSupplyStationName: [
      { required: true, message: '电力公变名称不能为空', trigger: 'blur' },
    ],
    electricPowerLineCode: [
      { required: true, message: '电力线路编码不能为空', trigger: 'blur' },
    ],
    electricPowerLineName: [
      { required: true, message: '电力线路名称不能为空', trigger: 'blur' },
    ],
    powerDepartmentPhone: [
      { required: true, message: '供电部门联系电话不能为空', trigger: 'blur' },
    ],
    firstTowerCaptainCode: [
      { required: true, message: '一级“塔长”编码不能为空', trigger: 'blur' },
    ],
    firstTowerCaptainName: [
      { required: true, message: '一级“塔长”名称不能为空', trigger: 'blur' },
    ],
    firstTowerCaptainPhone: [
      { required: true, message: '一级“塔长”电话不能为空', trigger: 'blur' },
    ],
    secondTowerCaptainCode: [
      { required: true, message: '二级“塔长”编码不能为空', trigger: 'blur' },
    ],
    secondTowerCaptainName: [
      { required: true, message: '二级“塔长”名称不能为空', trigger: 'blur' },
    ],
    secondTowerCaptainPhone: [
      { required: true, message: '二级“塔长”电话不能为空', trigger: 'blur' },
    ],
    thirdTowerCaptainCode: [
      { required: true, message: '三级“塔长”(代维单位)编码不能为空', trigger: 'blur' },
    ],
    thirdTowerCaptainName: [
      { required: true, message: '三级“塔长”(代维单位)名称不能为空', trigger: 'blur' },
    ],
    thirdTowerCaptainPhone: [
      { required: true, message: '三级“塔长”(代维单位)电话不能为空', trigger: 'blur' },
    ],
    mobileServiceLevelCode: [
      { required: true, message: '移动公司维护服务等级不能为空', trigger: 'blur' },
    ],
    mobileServiceLevelName: [
      { required: true, message: '移动公司维护服务等级不能为空', trigger: 'blur' },
    ],
    unicomServiceLevelCode: [
      { required: true, message: '联通公司维护服务等级不能为空', trigger: 'blur' },
    ],
    unicomServiceLevelName: [
      { required: true, message: '联通公司维护服务等级不能为空', trigger: 'blur' },
    ],
    telecomServiceLevelCode: [
      { required: true, message: '电信公司维护服务等级不能为空', trigger: 'blur' },
    ],
    telecomServiceLevelName: [
      { required: true, message: '电信公司维护服务等级不能为空', trigger: 'blur' },
    ],
    deptId: [
      { required: true, message: '部门ID不能为空', trigger: 'blur' },
    ],
    deptName: [
      { required: true, message: '部门名称不能为空', trigger: 'blur' },
    ],
  },
})

const { queryParams, form, rules } = toRefs(data)

const options1 = ref([])
const options2 = ref([])
const options3 = ref([])
const options4 = ref([])

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
const getTownsData = async () => {
  const res = await getStreet({ parentCode: queryParams.value.countyCode })
  options4.value = res
}

const changeProvinceCode = (val) => {
  queryParams.value.cityCode = undefined
  queryParams.value.countyCode = undefined
  queryParams.value.townsCode = undefined
  getCitiesData()
}
const changeCityCode = (val) => {
  queryParams.value.countyCode = undefined
  queryParams.value.townsCode = undefined
  getCountiesData()
}
const changeCountyCode = (val) => {
  queryParams.value.townsCode = undefined
  getTownsData()
}

/** 查询站点信息列表 */
function getList() {
  loading.value = true
  listStationInfo(queryParams.value).then((response) => {
    stationInfoList.value = response.records
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
    stationCode: null,
    stationName: null,
    opStationId: null,
    provinceCode: null,
    provinceName: null,
    provinceCompanyCode: null,
    provinceCompanyName: null,
    cityCode: null,
    cityName: null,
    cityCompanyCode: null,
    cityCompanyName: null,
    countyCode: null,
    countyName: null,
    townsCode: null,
    townsName: null,
    gridCode: null,
    gridName: null,
    stationLongitude: null,
    stationLatitude: null,
    supervisionLongitude: null,
    supervisionLatitude: null,
    fsuLongitude: null,
    fsuLatitude: null,
    positionalDeviation: null,
    elevation: null,
    stationStatusCode: null,
    stationStatusName: null,
    fsuStatusCode: null,
    fsuStatusName: null,
    fsuHandoverDate: null,
    stationAddress: null,
    stationSourceCode: null,
    stationSourceName: null,
    originalPropertyRight: null,
    accessOperatorCode: null,
    accessOperatorName: null,
    firstBusinessScenarioCode: null,
    firstBusinessScenarioName: null,
    secondBusinessScenarioCode: null,
    secondBusinessScenarioName: null,
    adminAreasCode: null,
    adminAreasName: null,
    adminAreasManagerCode: null,
    adminAreasManagerName: null,
    adminAreasManagerPhone: null,
    opMachinePersonnelCode: null,
    opMachinePersonnelName: null,
    opMachinePersonnelPhone: null,
    opChinaTowerPersonnelCode: null,
    opChinaTowerPersonnelName: null,
    opChinaTowerPersonnelPhone: null,
    tenementPersonnelCode: null,
    tenementPersonnelName: null,
    tenementPersonnelPhone: null,
    firstPowerSupplyModeCode: null,
    firstPowerSupplyModeName: null,
    secondPowerSupplyModeCode: null,
    secondPowerSupplyModeName: null,
    powerSupplyStationCode: null,
    powerSupplyStationName: null,
    electricPowerLineCode: null,
    electricPowerLineName: null,
    powerDepartmentPhone: null,
    firstTowerCaptainCode: null,
    firstTowerCaptainName: null,
    firstTowerCaptainPhone: null,
    secondTowerCaptainCode: null,
    secondTowerCaptainName: null,
    secondTowerCaptainPhone: null,
    thirdTowerCaptainCode: null,
    thirdTowerCaptainName: null,
    thirdTowerCaptainPhone: null,
    mobileServiceLevelCode: null,
    mobileServiceLevelName: null,
    unicomServiceLevelCode: null,
    unicomServiceLevelName: null,
    telecomServiceLevelCode: null,
    telecomServiceLevelName: null,
    deptId: null,
    deptName: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    delFlag: null,
  }
  proxy.resetForm('stationInfoRef')
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
  ids.value = selection.map(item => item.stationCode)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = '添加站点信息'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  loading.value = true
  reset()
  const _stationCode = row.stationCode || ids.value
  getStationInfo(_stationCode).then((response) => {
    loading.value = false
    form.value = response.data
    open.value = true
    title.value = '修改站点信息'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs.stationInfoRef.validate((valid) => {
    if (valid) {
      buttonLoading.value = true
      if (form.value.stationCode != null) {
        updateStationInfo(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        }).finally(() => {
          buttonLoading.value = false
        })
      }
      else {
        addStationInfo(form.value).then((response) => {
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
  const _stationCodes = row.stationCode || ids.value
  proxy.$modal.confirm(`是否确认删除站点信息编号为"${_stationCodes}"的数据项？`)
    .then(() => {
      loading.value = true
      return delStationInfo(_stationCodes)
    })
    .then(() => {
      loading.value = true
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {
    })
    .finally(() => {
      loading.value = false
    })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('op/stationInfo/export', {
    ...queryParams.value,
  }, `stationInfo_${new Date().getTime()}.xlsx`)
}

getProvincesData()
getList()
</script>

<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="站址编码" prop="stationCode">
        <el-input v-model="queryParams.stationCode" placeholder="请输入站址编码" clearable style="width: 240px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="站址名称" prop="stationName">
        <el-input v-model="queryParams.stationName" placeholder="请输入站址名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="运维ID" prop="opStationId">
        <el-input v-model="queryParams.opStationId" placeholder="请输入运维ID" clearable style="width: 240px" @keyup.enter="handleQuery" />
      </el-form-item>
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
      <el-form-item label="所属市" prop="cityCode">
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
        <el-select v-model="queryParams.countyCode" placeholder="请选择" style="width: 240px" clearable @change="changeCountyCode">
          <el-option
            v-for="dict in options3"
            :key="dict.code"
            :label="dict.name"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属乡镇" prop="townsCode">
        <el-select v-model="queryParams.townsCode" placeholder="请选择" style="width: 240px" clearable>
          <el-option
            v-for="dict in options4"
            :key="dict.code"
            :label="dict.name"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否绑定" prop="isBinding">
        <el-select v-model="queryParams.isBinding" placeholder="请选择" style="width: 240px" clearable>
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['op:stationInfo:export']"
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

    <el-table v-loading="loading" :data="stationInfoList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="运维ID" align="center" prop="opStationId" />
      <el-table-column label="站址编码" align="center" prop="stationCode" />
      <el-table-column label="站址名称" align="center" prop="stationName" />
      <el-table-column label="站址状态" align="center" prop="stationStatusName" />
      <el-table-column label="所属省" align="center" prop="provinceName" />
      <el-table-column label="地市名称" align="center" prop="cityName" />
      <el-table-column label="区县名称" align="center" prop="countyName" />
      <el-table-column label="乡镇名称" align="center" prop="townsName" />
      <el-table-column label="网格名称" align="center" prop="gridName" />
      <el-table-column label="维护人员" align="center" prop="opMachinePersonnelName" />
      <el-table-column label="维护电话" align="center" prop="opMachinePersonnelPhone" />
      <el-table-column label="站址地址" align="center" prop="stationAddress" />
      <!-- <el-table-column label="原产权单位" align="center" prop="originalPropertyRight" /> -->
      <!-- <el-table-column label="运营商共享情况名称" align="center" prop="accessOperatorName" /> -->
      <el-table-column label="移动公司维护服务等级" align="center" prop="mobileServiceLevelName" />
      <el-table-column label="联通公司维护服务等级" align="center" prop="unicomServiceLevelName" />
      <el-table-column label="电信公司维护服务等级" align="center" prop="telecomServiceLevelName" />
      <el-table-column label="是否绑定部门" align="center" prop="isBindingName" />
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="getList"
    />

    <!-- 添加或修改站点信息对话框 -->
    <el-dialog v-model="open" :title="title" width="500px" append-to-body>
      <el-form ref="stationInfoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="站址名称" prop="stationName">
          <el-input v-model="form.stationName" placeholder="请输入站址名称" />
        </el-form-item>
        <el-form-item label="运维ID" prop="opStationId">
          <el-input v-model="form.opStationId" placeholder="请输入运维ID" />
        </el-form-item>
        <el-form-item label="所属省编码" prop="provinceCode">
          <el-input v-model="form.provinceCode" placeholder="请输入所属省编码" />
        </el-form-item>
        <el-form-item label="所属省" prop="provinceName">
          <el-input v-model="form.provinceName" placeholder="请输入所属省" />
        </el-form-item>
        <el-form-item label="所属省公司编码" prop="provinceCompanyCode">
          <el-input v-model="form.provinceCompanyCode" placeholder="请输入所属省公司编码" />
        </el-form-item>
        <el-form-item label="所属省公司名称" prop="provinceCompanyName">
          <el-input v-model="form.provinceCompanyName" placeholder="请输入所属省公司名称" />
        </el-form-item>
        <el-form-item label="地市编码" prop="cityCode">
          <el-input v-model="form.cityCode" placeholder="请输入地市编码" />
        </el-form-item>
        <el-form-item label="地市名称" prop="cityName">
          <el-input v-model="form.cityName" placeholder="请输入地市名称" />
        </el-form-item>
        <el-form-item label="所属市公司编码" prop="cityCompanyCode">
          <el-input v-model="form.cityCompanyCode" placeholder="请输入所属市公司编码" />
        </el-form-item>
        <el-form-item label="所属市公司名称" prop="cityCompanyName">
          <el-input v-model="form.cityCompanyName" placeholder="请输入所属市公司名称" />
        </el-form-item>
        <el-form-item label="区县编码" prop="countyCode">
          <el-input v-model="form.countyCode" placeholder="请输入区县编码" />
        </el-form-item>
        <el-form-item label="区县名称" prop="countyName">
          <el-input v-model="form.countyName" placeholder="请输入区县名称" />
        </el-form-item>
        <el-form-item label="乡镇编码" prop="townsCode">
          <el-input v-model="form.townsCode" placeholder="请输入乡镇编码" />
        </el-form-item>
        <el-form-item label="乡镇名称" prop="townsName">
          <el-input v-model="form.townsName" placeholder="请输入乡镇名称" />
        </el-form-item>
        <el-form-item label="网格编码" prop="gridCode">
          <el-input v-model="form.gridCode" placeholder="请输入网格编码" />
        </el-form-item>
        <el-form-item label="网格名称" prop="gridName">
          <el-input v-model="form.gridName" placeholder="请输入网格名称" />
        </el-form-item>
        <el-form-item label="站址经度(小数点后6位)" prop="stationLongitude">
          <el-input v-model="form.stationLongitude" placeholder="请输入站址经度(小数点后6位)" />
        </el-form-item>
        <el-form-item label="站址纬度(小数点后6位)" prop="stationLatitude">
          <el-input v-model="form.stationLatitude" placeholder="请输入站址纬度(小数点后6位)" />
        </el-form-item>
        <el-form-item label="运监经度(小数点后6位)" prop="supervisionLongitude">
          <el-input v-model="form.supervisionLongitude" placeholder="请输入运监经度(小数点后6位)" />
        </el-form-item>
        <el-form-item label="运监纬度(小数点后6位)" prop="supervisionLatitude">
          <el-input v-model="form.supervisionLatitude" placeholder="请输入运监纬度(小数点后6位)" />
        </el-form-item>
        <el-form-item label="FSU经度(小数点后6位)" prop="fsuLongitude">
          <el-input v-model="form.fsuLongitude" placeholder="请输入FSU经度(小数点后6位)" />
        </el-form-item>
        <el-form-item label="FSU纬度(小数点后6位)" prop="fsuLatitude">
          <el-input v-model="form.fsuLatitude" placeholder="请输入FSU纬度(小数点后6位)" />
        </el-form-item>
        <el-form-item label="FSU上报经纬度与手工锁定经纬度的偏差" prop="positionalDeviation">
          <el-input v-model="form.positionalDeviation" placeholder="请输入FSU上报经纬度与手工锁定经纬度的偏差" />
        </el-form-item>
        <el-form-item label="海拔高度" prop="elevation">
          <el-input v-model="form.elevation" placeholder="请输入海拔高度" />
        </el-form-item>
        <el-form-item label="站址状态编码" prop="stationStatusCode">
          <el-input v-model="form.stationStatusCode" placeholder="请输入站址状态编码" />
        </el-form-item>
        <el-form-item label="站址状态名称" prop="stationStatusName">
          <el-input v-model="form.stationStatusName" placeholder="请输入站址状态名称" />
        </el-form-item>
        <el-form-item label="FSU状态编码" prop="fsuStatusCode">
          <el-input v-model="form.fsuStatusCode" placeholder="请输入FSU状态编码" />
        </el-form-item>
        <el-form-item label="FSU状态名称" prop="fsuStatusName">
          <el-input v-model="form.fsuStatusName" placeholder="请输入FSU状态名称" />
        </el-form-item>
        <el-form-item label="FSU交维时间" prop="fsuHandoverDate">
          <el-date-picker
            v-model="form.fsuHandoverDate"
            clearable
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择FSU交维时间"
          />
        </el-form-item>
        <el-form-item label="站址地址" prop="stationAddress">
          <el-input v-model="form.stationAddress" placeholder="请输入站址地址" />
        </el-form-item>
        <el-form-item label="站址来源编码" prop="stationSourceCode">
          <el-input v-model="form.stationSourceCode" placeholder="请输入站址来源编码" />
        </el-form-item>
        <el-form-item label="站址来源名称" prop="stationSourceName">
          <el-input v-model="form.stationSourceName" placeholder="请输入站址来源名称" />
        </el-form-item>
        <el-form-item label="原产权单位" prop="originalPropertyRight">
          <el-input v-model="form.originalPropertyRight" placeholder="请输入原产权单位" />
        </el-form-item>
        <el-form-item label="运营商共享情况编码" prop="accessOperatorCode">
          <el-input v-model="form.accessOperatorCode" placeholder="请输入运营商共享情况编码" />
        </el-form-item>
        <el-form-item label="运营商共享情况名称" prop="accessOperatorName">
          <el-input v-model="form.accessOperatorName" placeholder="请输入运营商共享情况名称" />
        </el-form-item>
        <el-form-item label="一级业务场景编码" prop="firstBusinessScenarioCode">
          <el-input v-model="form.firstBusinessScenarioCode" placeholder="请输入一级业务场景编码" />
        </el-form-item>
        <el-form-item label="一级业务场景名称" prop="firstBusinessScenarioName">
          <el-input v-model="form.firstBusinessScenarioName" placeholder="请输入一级业务场景名称" />
        </el-form-item>
        <el-form-item label="二级业务场景编码" prop="secondBusinessScenarioCode">
          <el-input v-model="form.secondBusinessScenarioCode" placeholder="请输入二级业务场景编码" />
        </el-form-item>
        <el-form-item label="二级业务场景名称" prop="secondBusinessScenarioName">
          <el-input v-model="form.secondBusinessScenarioName" placeholder="请输入二级业务场景名称" />
        </el-form-item>
        <el-form-item label="所属管理区域编码" prop="adminAreasCode">
          <el-input v-model="form.adminAreasCode" placeholder="请输入所属管理区域编码" />
        </el-form-item>
        <el-form-item label="所属管理区域名称" prop="adminAreasName">
          <el-input v-model="form.adminAreasName" placeholder="请输入所属管理区域名称" />
        </el-form-item>
        <el-form-item label="所属管理区域经理编码" prop="adminAreasManagerCode">
          <el-input v-model="form.adminAreasManagerCode" placeholder="请输入所属管理区域经理编码" />
        </el-form-item>
        <el-form-item label="所属管理区域经理名称" prop="adminAreasManagerName">
          <el-input v-model="form.adminAreasManagerName" placeholder="请输入所属管理区域经理名称" />
        </el-form-item>
        <el-form-item label="所属管理区域经理电话" prop="adminAreasManagerPhone">
          <el-input v-model="form.adminAreasManagerPhone" placeholder="请输入所属管理区域经理电话" />
        </el-form-item>
        <el-form-item label="机房(动环)维护人员编码" prop="opMachinePersonnelCode">
          <el-input v-model="form.opMachinePersonnelCode" placeholder="请输入机房(动环)维护人员编码" />
        </el-form-item>
        <el-form-item label="机房(动环)维护人员名称" prop="opMachinePersonnelName">
          <el-input v-model="form.opMachinePersonnelName" placeholder="请输入机房(动环)维护人员名称" />
        </el-form-item>
        <el-form-item label="机房(动环)维护人员电话" prop="opMachinePersonnelPhone">
          <el-input v-model="form.opMachinePersonnelPhone" placeholder="请输入机房(动环)维护人员电话" />
        </el-form-item>
        <el-form-item label="铁塔维护人员编码" prop="opChinaTowerPersonnelCode">
          <el-input v-model="form.opChinaTowerPersonnelCode" placeholder="请输入铁塔维护人员编码" />
        </el-form-item>
        <el-form-item label="铁塔维护人员名称" prop="opChinaTowerPersonnelName">
          <el-input v-model="form.opChinaTowerPersonnelName" placeholder="请输入铁塔维护人员名称" />
        </el-form-item>
        <el-form-item label="铁塔维护人员电话" prop="opChinaTowerPersonnelPhone">
          <el-input v-model="form.opChinaTowerPersonnelPhone" placeholder="请输入铁塔维护人员电话" />
        </el-form-item>
        <el-form-item label="物业人员编码" prop="tenementPersonnelCode">
          <el-input v-model="form.tenementPersonnelCode" placeholder="请输入物业人员编码" />
        </el-form-item>
        <el-form-item label="物业人员名称" prop="tenementPersonnelName">
          <el-input v-model="form.tenementPersonnelName" placeholder="请输入物业人员名称" />
        </el-form-item>
        <el-form-item label="物业人员电话" prop="tenementPersonnelPhone">
          <el-input v-model="form.tenementPersonnelPhone" placeholder="请输入物业人员电话" />
        </el-form-item>
        <el-form-item label="一级供电方式编码" prop="firstPowerSupplyModeCode">
          <el-input v-model="form.firstPowerSupplyModeCode" placeholder="请输入一级供电方式编码" />
        </el-form-item>
        <el-form-item label="一级供电方式名称" prop="firstPowerSupplyModeName">
          <el-input v-model="form.firstPowerSupplyModeName" placeholder="请输入一级供电方式名称" />
        </el-form-item>
        <el-form-item label="二级供电方式编码" prop="secondPowerSupplyModeCode">
          <el-input v-model="form.secondPowerSupplyModeCode" placeholder="请输入二级供电方式编码" />
        </el-form-item>
        <el-form-item label="二级供电方式名称" prop="secondPowerSupplyModeName">
          <el-input v-model="form.secondPowerSupplyModeName" placeholder="请输入二级供电方式名称" />
        </el-form-item>
        <el-form-item label="电力公变编码" prop="powerSupplyStationCode">
          <el-input v-model="form.powerSupplyStationCode" placeholder="请输入电力公变编码" />
        </el-form-item>
        <el-form-item label="电力公变名称" prop="powerSupplyStationName">
          <el-input v-model="form.powerSupplyStationName" placeholder="请输入电力公变名称" />
        </el-form-item>
        <el-form-item label="电力线路编码" prop="electricPowerLineCode">
          <el-input v-model="form.electricPowerLineCode" placeholder="请输入电力线路编码" />
        </el-form-item>
        <el-form-item label="电力线路名称" prop="electricPowerLineName">
          <el-input v-model="form.electricPowerLineName" placeholder="请输入电力线路名称" />
        </el-form-item>
        <el-form-item label="供电部门联系电话" prop="powerDepartmentPhone">
          <el-input v-model="form.powerDepartmentPhone" placeholder="请输入供电部门联系电话" />
        </el-form-item>
        <el-form-item label="一级“塔长”编码" prop="firstTowerCaptainCode">
          <el-input v-model="form.firstTowerCaptainCode" placeholder="请输入一级“塔长”编码" />
        </el-form-item>
        <el-form-item label="一级“塔长”名称" prop="firstTowerCaptainName">
          <el-input v-model="form.firstTowerCaptainName" placeholder="请输入一级“塔长”名称" />
        </el-form-item>
        <el-form-item label="一级“塔长”电话" prop="firstTowerCaptainPhone">
          <el-input v-model="form.firstTowerCaptainPhone" placeholder="请输入一级“塔长”电话" />
        </el-form-item>
        <el-form-item label="二级“塔长”编码" prop="secondTowerCaptainCode">
          <el-input v-model="form.secondTowerCaptainCode" placeholder="请输入二级“塔长”编码" />
        </el-form-item>
        <el-form-item label="二级“塔长”名称" prop="secondTowerCaptainName">
          <el-input v-model="form.secondTowerCaptainName" placeholder="请输入二级“塔长”名称" />
        </el-form-item>
        <el-form-item label="二级“塔长”电话" prop="secondTowerCaptainPhone">
          <el-input v-model="form.secondTowerCaptainPhone" placeholder="请输入二级“塔长”电话" />
        </el-form-item>
        <el-form-item label="三级“塔长”(代维单位)编码" prop="thirdTowerCaptainCode">
          <el-input v-model="form.thirdTowerCaptainCode" placeholder="请输入三级“塔长”(代维单位)编码" />
        </el-form-item>
        <el-form-item label="三级“塔长”(代维单位)名称" prop="thirdTowerCaptainName">
          <el-input v-model="form.thirdTowerCaptainName" placeholder="请输入三级“塔长”(代维单位)名称" />
        </el-form-item>
        <el-form-item label="三级“塔长”(代维单位)电话" prop="thirdTowerCaptainPhone">
          <el-input v-model="form.thirdTowerCaptainPhone" placeholder="请输入三级“塔长”(代维单位)电话" />
        </el-form-item>
        <el-form-item label="移动公司维护服务等级" prop="mobileServiceLevelCode">
          <el-input v-model="form.mobileServiceLevelCode" placeholder="请输入移动公司维护服务等级" />
        </el-form-item>
        <el-form-item label="移动公司维护服务等级" prop="mobileServiceLevelName">
          <el-input v-model="form.mobileServiceLevelName" placeholder="请输入移动公司维护服务等级" />
        </el-form-item>
        <el-form-item label="联通公司维护服务等级" prop="unicomServiceLevelCode">
          <el-input v-model="form.unicomServiceLevelCode" placeholder="请输入联通公司维护服务等级" />
        </el-form-item>
        <el-form-item label="联通公司维护服务等级" prop="unicomServiceLevelName">
          <el-input v-model="form.unicomServiceLevelName" placeholder="请输入联通公司维护服务等级" />
        </el-form-item>
        <el-form-item label="电信公司维护服务等级" prop="telecomServiceLevelCode">
          <el-input v-model="form.telecomServiceLevelCode" placeholder="请输入电信公司维护服务等级" />
        </el-form-item>
        <el-form-item label="电信公司维护服务等级" prop="telecomServiceLevelName">
          <el-input v-model="form.telecomServiceLevelName" placeholder="请输入电信公司维护服务等级" />
        </el-form-item>
        <el-form-item label="部门ID" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入部门ID" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入部门名称" />
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
