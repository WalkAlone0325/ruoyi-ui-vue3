<script setup name="PersonnelBasicInfo">
import { addPersonnelBasicInfo, delPersonnelBasicInfo, getPersonnelBasicInfo, listPersonnelBasicInfo, updatePersonnelBasicInfo } from '@/api/basic/personnelBasicInfo'
import { deptTreeSelect } from '@/api/system/user'
import { listPost } from '@/api/system/post'

const { proxy } = getCurrentInstance()

const { personnel_status } = proxy.useDict('personnel_status')
const { sys_user_sex } = proxy.useDict('sys_user_sex')
const { politics_status } = proxy.useDict('politics_status')
const { nation } = proxy.useDict('nation')
const { marital } = proxy.useDict('marital')

const personnelBasicInfoList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')
const deptOptions = ref(undefined)
const postOptions = ref([])

/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then((response) => {
    deptOptions.value = response.data
  })
}
function getListPost() {
  listPost().then((response) => {
    postOptions.value = response.rows
  })
}

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    personnelId: undefined,
    personnelCode: undefined,
    name: undefined,
    statusCode: undefined,
    deptIdSearching: undefined,
  },
  rules: {
    name: [
      { required: true, message: '人员姓名不能为空', trigger: 'blur' },
    ],
    contactEmail: [
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
    ],
    identityCard: [
      { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/i, message: '请输入正确的身份证号码', trigger: 'blur' },
    ],
    contactMobile: [
      { required: true, message: '人员联系手机不能为空', trigger: 'blur' },
      { pattern: /^1[3-9|]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
    statusCode: [
      { required: true, message: '人员状态不能为空', trigger: 'blur' },
    ],
    deptId: [
      { required: true, message: '部门不能为空', trigger: 'blur' },
      // 判断数组 deptId 是否为空
      { validator: (rule, value, callback) => {
        if (!value[0].deptId || !value[0].postId) {
          callback(new Error('部门不能为空'))
        }
        else {
          callback()
        }
      }, trigger: 'blur' },
    ],
  },
})

const { queryParams, form, rules } = toRefs(data)

/** 查询员工信息列表 */
function getList() {
  loading.value = true
  listPersonnelBasicInfo(queryParams.value).then((response) => {
    personnelBasicInfoList.value = response.rows
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
    personnelId: null,
    personnelCode: null,
    name: null,
    genderCode: null,
    genderName: null,
    birthdate: null,
    politicsStatusCode: null,
    politicsStatusName: null,
    nationCode: null,
    nationName: null,
    maritalCode: null,
    maritalName: null,
    introduction: null,
    contactAddress: null,
    contactMobile: null,
    contactTel: null,
    contactEmail: null,
    identityCard: null,
    statusCode: null,
    statusName: null,
    deptId: [{ id: 0, deptId: '', postId: '' }],
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    delFlag: null,
  }
  proxy.resetForm('personnelBasicInfoRef')
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
  ids.value = selection.map(item => item.personnelId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = '添加员工信息'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  loading.value = true
  reset()
  const _personnelId = row.personnelId || ids.value
  getPersonnelBasicInfo(_personnelId).then((response) => {
    loading.value = false
    form.value = response.data
    form.value.deptId = response.data.deptId
      ? response.data.deptId.map((item, index) => ({ id: index, deptId: item.deptId, postId: item.postId }))
      : [{ id: 0, deptId: '', postId: '' }]
    open.value = true
    title.value = '修改员工信息'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs.personnelBasicInfoRef.validate((valid) => {
    if (valid) {
      buttonLoading.value = true
      if (form.value.personnelId != null) {
        updatePersonnelBasicInfo(form.value).then(() => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        }).finally(() => {
          buttonLoading.value = false
        })
      }
      else {
        addPersonnelBasicInfo(form.value).then(() => {
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
  const _personnelIds = row.personnelId || ids.value
  proxy.$modal.confirm(`是否确认删除员工信息编号为"${_personnelIds}"的数据项？`).then(() => {
    loading.value = true
    return delPersonnelBasicInfo(_personnelIds)
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
  proxy.download('system/personnelBasicInfo/export', {
    ...queryParams.value,
  }, `personnelBasicInfo_${new Date().getTime()}.xlsx`)
}

// 添加
const num = ref(10)
function handleAddDept() {
  form.value.deptId.push({ id: num.value++, deptId: '', postId: '' })
}
// 删除
function handleDeleteDept(i) {
  form.value.deptId = form.value.deptId.filter(item => item.id !== i.id)
}

getListPost()
getDeptTree()
getList()
</script>

<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="部门ID" prop="deptIdSearching">
        <el-tree-select
          v-model="queryParams.deptIdSearching"
          style="width: 240px;"
          :data="deptOptions"
          :props="{ value: 'id', label: 'label', children: 'children' }"
          value-key="id"
          placeholder="请选择归属部门"
          check-strictly
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="人员ID" prop="personnelId">
        <el-input
          v-model="queryParams.personnelId"
          placeholder="请输入人员ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
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
      <el-form-item label="人员状态" prop="statusCode">
        <el-select
          v-model="queryParams.statusCode"
          placeholder="人员状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in personnel_status"
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
          v-hasPermi="['system:personnelBasicInfo:add']"
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
          v-hasPermi="['system:personnelBasicInfo:edit']"
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
          v-hasPermi="['system:personnelBasicInfo:remove']"
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
          v-hasPermi="['system:personnelBasicInfo:export']"
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

    <el-table v-loading="loading" :data="personnelBasicInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
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
          <el-button v-hasPermi="['system:personnelBasicInfo:edit']" link type="primary" icon="Edit" @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button v-hasPermi="['system:personnelBasicInfo:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)">
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

    <!-- 添加或修改员工信息对话框 -->
    <el-dialog v-model="open" :title="title" width="800px" append-to-body>
      <el-form ref="personnelBasicInfoRef" :model="form" :rules="rules" label-width="auto">
        <el-row>
          <el-col :span="12">
            <el-form-item label="人员工号" prop="personnelCode">
              <el-input v-model.trim="form.personnelCode" placeholder="请输入人员工号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员姓名" prop="name">
              <el-input v-model.trim="form.name" placeholder="请输入人员姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员性别" prop="genderCode">
              <el-select
                v-model="form.genderCode"
                placeholder="请选择人员性别"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员生日" prop="birthdate">
              <el-date-picker
                v-model="form.birthdate"
                clearable
                style="width: 100%"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择人员生日"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员政治面貌" prop="politicsStatusCode">
              <el-select
                v-model="form.politicsStatusCode"
                placeholder="请选择人员政治面貌"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in politics_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员民族" prop="nationCode">
              <el-select
                v-model="form.nationCode"
                placeholder="请选择人员民族"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in nation"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员婚姻" prop="maritalCode">
              <el-select
                v-model="form.maritalCode"
                placeholder="请选择人员婚姻"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in marital"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通讯地址" prop="contactAddress">
              <el-input v-model="form.contactAddress" placeholder="请输入通讯地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="人员简介" prop="introduction">
              <el-input v-model="form.introduction" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="人员联系手机" prop="contactMobile">
              <el-input v-model.trim="form.contactMobile" placeholder="请输入人员联系手机" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员联系电话" prop="contactTel">
              <el-input v-model.trim="form.contactTel" placeholder="请输入人员联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员联系邮箱" prop="contactEmail">
              <el-input v-model.trim="form.contactEmail" placeholder="请输入人员联系电子邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员状态" prop="statusCode">
              <el-select
                v-model="form.statusCode"
                placeholder="请选择人员状态"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in personnel_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="人员身份证" prop="identityCard">
              <el-input v-model.trim="form.identityCard" placeholder="请输入人员身份证" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="归属部门" prop="deptId">
              <el-row style="display: flex; width: 100%; align-items: center;">
                <el-col v-for="i in form.deptId" :key="i.id" :span="23" class="dept-con">
                  <div style="display: flex; width: 100%;">
                    <el-tree-select
                      v-model="i.deptId"
                      width="100%"
                      :data="deptOptions"
                      :props="{ value: 'id', label: 'label', children: 'children' }"
                      value-key="id"
                      placeholder="请选择归属部门"
                      check-strictly
                    />
                    <el-select v-model="i.postId" placeholder="请选择">
                      <el-option
                        v-for="item in postOptions"
                        :key="item.postId"
                        width="100%"
                        :label="item.postName"
                        :value="item.postId"
                        :disabled="item.status == 1"
                      />
                    </el-select>
                  </div>
                  <el-icon v-if="i.id !== 0" size="24" style="margin-left: 6px; cursor: pointer;" @click="handleDeleteDept(i)">
                    <Delete />
                  </el-icon>
                  <el-icon v-else size="24" style="margin-left: 6px; cursor: pointer;" @click="handleAddDept">
                    <Plus />
                  </el-icon>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入" />
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

<style lang="scss" scoped>
.dept-con {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
