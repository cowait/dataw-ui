<template>
  <div>
    <avue-crud ref="crud"
               :page.sync="page"
               :option="option"
               v-model="form"
               @row-del="rowDel"
               @on-load="getList"
               @refresh-change="refreshChange"
               @size-change="sizeChange"
               @selection-change="selectionChange"
               @current-change="currentChange"
               :data="data">
      <template slot="menu"
                slot-scope="{row,size,type}">
        <el-button icon="el-icon-check"
                   :size="size"
                   :type="type"
                   @click="handleView(row)">预览
        </el-button>
      </template>
    </avue-crud>
    <el-dialog title="预览素材"
               :visible.sync="box"
               width="60%">
      <el-image :key="url"
                :src="url"
                lazy></el-image>
    </el-dialog>
  </div>
</template>

<script>
import { getPage } from '@/api/file'
import { remove } from "@/api/db";

export default {
  props: {
    menu: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      url: '',
      box: false,
      content: '',
      index: -1,
      form: {},
      vueOption: {},
      data: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      option: {
        tip: false,
        header: true,
        menu: true,
        addBtn: false,
        editBtn: false,
        selection: true,
        dialogWidth: '70%',
        labelWidth: 100,
        index: true,
        align: 'center',
        headerAlign: 'center',
        column: [
          {
            label: '素材ID',
            prop: 'id',
            span: 24,
            hide: true,
          },
          {
            label: '素材名称',
            prop: 'name'
          },
          {
            label: '素材类型',
            prop: 'type'
          },
          {
            label: '素材地址',
            type: 'img',
            prop: 'url'
          }
        ]
      }
    }
  },
  created () {
    if (this.menu === false) {
      this.option.header = false
      this.option.menu = false
    }
    this.getList()
  },
  methods: {
    getList () {
      getPage({ currentPage: this.page.currentPage, pageSize: this.page.pageSize }).then(res => {
        const data = res.data.data;
        this.data = data.records;
        this.page.total = data.total;
      })
    },
    handleView (row) {
      this.box = true;
      this.url = row.url;
    },
    rowDel (row) {
      this.$confirm("确定将选择素材?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });

    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    currentChange (current) {
      this.page.currentPage = current;
    },
    refreshChange () {
      this.getList(this.page);
    },
    selectionChange (val) {
      this.$emit('change', val[0])
    },
  }
}
</script>
