<template>
  <avue-crud :option="option"
             v-model="form"
             @row-save="rowSave"
             @row-update="rowUpdate"
             @row-del="rowDel"
             @refresh-change="refreshChange"
             :before-open="beforeOpen"
             :data="data"></avue-crud>
</template>

<script>
import { getList, getObj, addObj, delObj, updateObj } from '@/api/category'
export default {
  data () {
    return {
      form: {},
      data: [],
      option: {
        index: true,
        align: 'center',
        headerAlign: 'center',
        column: [
          {
            label: '模块名',
            prop: 'categoryKey',
            rules: [{
              required: true,
              message: "请输入模块名",
              trigger: "blur"
            }]
          },
          {
            label: '模块值',
            prop: 'categoryValue',
            type: 'number',
            rules: [{
              required: true,
              message: "请输入模块值",
              trigger: "blur"
            }]
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
      getList({
        current: 1,
        size: 100,
      }).then(res => {
        const data = res.data.data;
        this.data = data;
      })
    },
    refreshChange () {
      this.get();
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
