<template>
  <avue-crud :option="option"
             v-model="form"
             @row-save="rowSave"
             @row-update="rowUpdate"
             @row-del="rowDel"
             :before-open="beforeOpen"
             @refresh-change="refreshChange"
             @selection-change="selectionChange"
             :data="data">
    <template slot="menuLeft"
              slot-scope="{size}">
      <el-button :size="size"
                 type="primary"
                 icon="el-icon-plus"
                 @click="goAdd">新增
      </el-button>
    </template>
    <template slot="menu"
              slot-scope="{size,type,row}">
      <el-button :size="size"
                 :type="type"
                 v-if="row.id"
                 icon="el-icon-edit"
                 @click="goEdit(row)">编辑
      </el-button>
      <el-button :size="size"
                 :type="type"
                 v-if="row.path"
                 icon="el-icon-edit"
                 @click="goApi(row)">接口
      </el-button>
    </template>
  </avue-crud>
</template>

<script>
import {url} from '@/config';

export default {
  props: {
    menu: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      form: {},
      data: [],
      option: {
        rowKey: 'groupId',
        tip: false,
        selection: true,
        selectable: (row, index) => {
          return !!row.path
        },
        index: true,
        align: 'center',
        headerAlign: 'center',
        editBtn: false,
        addBtn: false,
        delBtn: false,
        column: [
          {
            label: '名称',
            prop: 'groupName'
          }, {
            label: '路径',
            prop: 'path'
          }
        ]
      }
    }
  },
  created() {
    if (this.menu === false) {
      this.option.header = false
      this.option.menu = false
    }
    this.getList()
  },
  methods: {
    selectionChange(val) {
      this.$emit('change', val[0])
    },
    goApi(item) {
      window.open(url + '/' + item.path)
    },
    goAdd() {
      window.localStorage.setItem('magic-recent_opened_tab', [])
      window.open(url + '/api/designer/index.html', 'magic')
    },
    goEdit(item) {
      window.localStorage.setItem('magic-recent_opened_tab', `["${item.id}"]`)
      window.open(url + '/api/designer/index.html', 'magic')
    },
    getList() {
      axios.get(url + '/api/list').then(res => {
        res.data.forEach(ele => {
          ele.children = ele.apis
          ele.children.forEach(column => {
            column.groupName = column.name
            column.groupId = column.id
          })
        })
        this.data = res.data;
      })
    },
    refreshChange() {
      this.getList();
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
