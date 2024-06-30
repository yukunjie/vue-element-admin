<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- ordering=price,-create_time&shelf=1&tag=1&category=3&saleable=1&consult_kind=1&search=恋爱&start_time=2024-03-27 00:00:00&end_time=2024-03-28 00:00:00&page_size=1&page=1 -->
      <!-- <el-select v-model="listQuery.ordering" multiple :placeholder="$t('table.ordering')" style="width: 100px;" class="filter-item" @change="handleSortChange" @keyup.enter.native="handleFilter"> -->
      <el-select v-model="orderingInit" multiple :placeholder="$t('table.ordering')" style="width: 100px;" class="filter-item">
        <el-option v-for="item in orderingOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.shelf" :placeholder="$t('table.shelf')" clearable style="width: 100px" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in shelfOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.tag" :placeholder="$t('table.tags')" clearable style="width: 100px" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.category" :placeholder="$t('table.categories')" clearable style="width: 150px" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.saleable" :placeholder="$t('table.saleable')" clearable style="width: 100px" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in saleableOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.consult_kind" :placeholder="$t('table.consultKind')" clearable style="width: 100px" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in consultKindOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker v-model="selectTime" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        {{ $t('table.reviewer') }}
      </el-checkbox> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column fixed :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed :label="$t('table.name')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createTime')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.date | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.consultKind')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.consultKind }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.describe')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.price')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.saleable')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.saleable ? $t('table.yes') : $t('table.no') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.recommended')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.recommended ? $t('table.yes') : $t('table.no') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.stock')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.imageLink')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.imageLink }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.upgradeLink')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.upgradeLink }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.tags')" width="100px" align="center">
        <template slot-scope="{row}">
          <span v-for="tag in row.tags" :key="tag" class="link-type" @click="handleTag(tag)">{{ tag }}</span>
          <!-- <span>{{ row.tags }}</span> -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.categories')" width="100px" align="center">
        <template slot-scope="{row}">
          <span v-for="category in row.categories" :key="category" class="link-type" @click="handleCategory(category)">{{ category }}</span>
          <!-- <span>{{ row.categories }}</span> -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.shelf')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.shelf }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.creator')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.topping')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.topping ? $t('table.yes') : $t('table.no') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.weight')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.merchant')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.merchant }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            {{ $t('table.publish') }}
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            {{ $t('table.draft') }}
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.type')" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.importance')">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/products'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ProductsList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        ordering: undefined,
        shelf: undefined,
        tag: undefined,
        category: undefined,
        saleable: undefined,
        consult_kind: undefined,
        search: undefined,
        start_time: undefined,
        end_time: undefined,
        page: 1,
        page_size: 20
      },
      orderingInit: [],
      orderingOptions: [
        { label: '价格升序', value: '+price' },
        { label: '价格降序', value: '-price' },
        { label: '创建时间升序', value: '+create_time' },
        { label: '创建时间降序', value: '-create_time' }
      ],
      shelfOptions: [
        { label: '上架', value: 1 },
        { label: '下架', value: 0 }
      ],
      tagOptions: [
        { label: '标签1', value: 1 },
        { label: '标签2', value: 2 },
        { label: '标签3', value: 3 }
      ],
      categoryOptions: [
        { label: '分类1', value: 1 },
        { label: '分类2', value: 2 },
        { label: '分类3', value: 3 }
      ],
      saleableOptions: [
        { label: '可售', value: 1 },
        { label: '不可售', value: 0 }
      ],
      consultKindOptions: [
        { label: '咨询', value: 1 },
        { label: '售后', value: 2 }
      ],
      selectTime: [
        new Date(new Date().setDate(new Date().getDate() - 30)), // 昨日此时作为开始时间
        new Date()
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      // 添加检查以确保 orderingInit 已定义且是一个数组
      let orderingParam
      if (Array.isArray(this.orderingInit)) {
        orderingParam = this.orderingInit.join(',')
      } else {
        // 如果 orderingInit 未定义或不是数组，提供一个默认值或处理这种情况
        orderingParam = '' // 或者根据需要设定其他默认值
      }
      // 现在无需检查开头是否有逗号，因为我们控制了 join 的调用时机
      this.listQuery.ordering = orderingParam.trim() // 使用 trim 移除可能的前后空格
      if (this.selectTime[0] && this.selectTime[1]) {
        this.listQuery.start_time = this.formatDate(this.selectTime[0])
        this.listQuery.end_time = this.formatDate(this.selectTime[1])
      }
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    formatDate(date) {
      const year = date.getFullYear()
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      const hours = ('0' + date.getHours()).slice(-2)
      const minutes = ('0' + date.getMinutes()).slice(-2)
      const seconds = ('0' + date.getSeconds()).slice(-2)
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }
}
</script>
