<template>
  <div>
    <el-dialog append-to-body
               @open="open"
               title="导入导出"
               :close-on-click-modal="false"
               :visible.sync="show"
               width="60%">
      <monaco-editor v-model="json"
                     height="400"
                     language="javascript"></monaco-editor>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="openBlock"
                   size="small"
                   type="success">导入组件</el-button>
        <el-button @click="importData"
                   size="small"
                   type="primary">导入数据</el-button>
        <el-button @click="exportData"
                   size="small"
                   type="danger">导出数据</el-button>
      </span>

    </el-dialog>
    <el-dialog append-to-body
               @open="open"
               title="导入组件"
               :close-on-click-modal="false"
               :visible.sync="show1"
               width="30%">
      <monaco-editor v-model="json1"
                     height="200"
                     language="javascript"></monaco-editor>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="importBlock"
                   size="small"
                   type="primary">导入组件</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import MonacoEditor from '@/page/components/editor'
export default {
  components: { MonacoEditor },
  inject: ["contain"],
  data () {
    return {
      show: false,
      show1: false,
      json: {},
      json1: {}
    }
  },
  methods: {
    open () {
      this.json = {
        detail: this.contain.config,
        component: this.contain.nav
      }
      this.json1 = {}
    },
    importBlock () {
      try {
        let json = typeof (this.json1) == 'string' ? JSON.parse(this.json1) : this.json1
        this.contain.nav.unshift(json)
        this.show = false
        this.show1 = false
        this.$message.success('导入组件成功')
      } catch (err) {
        this.$message.error('导入数据错误')
      }
    },
    openBlock () {
      this.show1 = true
    },
    importData () {
      try {
        let json = typeof (this.json) == 'string' ? JSON.parse(this.json) : this.json
        this.contain.config = json.detail
        this.contain.nav = json.component
        this.show = false;
        this.$message.success('数据导入成功')
      } catch (err) {
        this.$message.error('导入数据错误')
      }
    },
    exportData () {
      var zip = new window.JSZip();
      zip.file("data.txt", this.json);
      zip.generateAsync({ type: "base64" })
        .then((content) => {
          this.downFile("data:application/zip;base64," + content, 'data.zip')
        });
    }
  }
}
</script>

<style>
</style>