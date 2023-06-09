<template>
  <avue-crud :option="option"
             v-model="form"
             :page.sync="page"
             :search.sync="searchForm"
             @row-save="rowSave"
             @row-update="rowUpdate"
             @row-del="rowDel"
             :before-open="beforeOpen"
             @on-load="getList"
             @search-change="searchChange"
             @refresh-change="refreshChange"
             @size-change="sizeChange"
             @current-change="currentChange"
             :data="data">
    <template slot-scope="{}"
              slot="menuLeft">
      <div style="display: inline-block;">
        <a class="title"
           target="_blank"
           href="https://datav.aliyun.com/tools/atlas/#&lat=33.521903996156105&lng=104.29849999999999&zoom=4">
          <el-button type="primary"
                     icon="el-icon-add-location"
                     size="small">
            添加更多地图11122
          </el-button>
        </a>
      </div>
    </template>
  </avue-crud>
</template>

<script>
import { getPage, getObj, addObj, delObj, updateObj } from '@/api/map'
export default {
  data () {
    return {
      form: {},
      data: [],
      searchForm:{},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      option: {
        labelWidth: 100,
        index: true,
        align: 'center',
        searchMenuSpan: 8,
        headerAlign: 'center',
        column: [
          {
            label: '地图名称',
            prop: 'name',
            search: true,
            searchLabelWidth: 150,
            row: true,
            rules: [{
              required: true,
              message: "请输入地图名称",
              trigger: "blur"
            }]
          },
          {
            label: '地图数据',
            prop: 'data',
            span: 24,
            hide: true,
            type: 'textarea',
            minRows: 20
          }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    vaildData (id) {
      return [0, 1, 2].includes(id)
    },
    beforeOpen (done, type) {
      if (type == 'edit') {
        getObj(this.form.id).then(res => {
          const data = res.data.data;
          this.form = data
          this.form.data = JSON.stringify(JSON.parse(this.form.data), null, 4)
          done()
        })
      } else {
        done()
      }
    },
    rowDel (row, index) {
      if (this.vaildData(index) && this.$website.isDemo) {
        this.$message.error(this.$website.isDemoTip)
        return false;
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.id).then(() => {
          this.$message.success('删除成功');
          this.getList()
        })
      }).catch(() => {

      });

    },
    rowUpdate (row, index, done) {
      if (this.vaildData(index) && this.$website.isDemo) {
        done();
        this.$message.error(this.$website.isDemoTip)
        return false;
      }
      updateObj(row).then(() => {
        done();
        this.$message.success('修改成功');
        this.getList()

      })
    },
    rowSave (row, done) {
      addObj(row).then(() => {
        this.$message.success('新增成功');
        this.getList()
        done();
      })
    },
    getList () {
      getPage(Object.assign({
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize,
      },this.searchForm)).then(res => {
        const data = res.data.data;
        this.data = data.records;
        this.page.total = data.total;
      })
    },
    searchChange(params,done) {
      this.getList()
      done()
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    currentChange(current) {
      this.page.currentPage = current;
    },
    refreshChange() {
      this.getList();
    }
  }
}
</script>
