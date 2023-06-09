<template>
  <el-dialog :visible.sync="visible"
             :close-on-click-modal="false"
             :before-close="handleClose"
             :title="title || '数据处理'"
             width="80%">
    <div v-if="['执行逻辑','点击事件'].includes(title)"
         class="event">
      <avue-select :dic="contain.list"
                   size="mini"
                   v-model="select"
                   placeholder="列表对象"
                   :props="{label:'name',value:'index'}">
      </avue-select>
      <span @click="handleCopy"
            v-if="select">refs['{{select}}']</span>
    </div>
    <div class="content">
      <monaco-editor v-model="code"></monaco-editor>
      <monaco-editor v-model="tip"
                     disabled></monaco-editor>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button size="small"
                 @click="setVisible(false)">取 消</el-button>
      <el-button type="primary"
                 @click="submit"
                 size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { tip } from '@/config'
import { funEval } from '@/utils/utils'
import MonacoEditor from '@/page/components/editor'
export default {
  inject: ["contain"],
  components: { MonacoEditor },
  data () {
    return {
      select: '',
      code: '',
      tip: ''
    }
  },
  props: {
    rules: {
      type: Boolean,
      default: true
    },
    title: String,
    visible: Boolean,
    type: String,
    value: [String, Object, Array]
  },
  watch: {
    value: {
      handler (val) {
        if (this.validatenull(val)) {
          if (['dataFormatter', 'stylesFormatter'].includes(this.type) && this.validatenull(val)) {
            this.code = `(data,params,refs)=>{
    return {}
}`
          } else if (['query', 'header', 'dataQuery', 'dataHeader'].includes(this.type) && this.validatenull(val)) {
            this.code = `(data)=>{
    return {}
}`
          } else if (['echartFormatter'].includes(this.type) && this.validatenull(val)) {
            this.code = `(data)=>{
    return {}
}`
          } else if (['clickFormatter'].includes(this.type) && this.validatenull(val)) {
            this.code = `(params,refs)=>{
    console.log(params,refs)
}`
          } else if (['labelFormatter', 'formatter'].includes(this.type) && this.validatenull(val)) {
            this.code = `(name,data)=>{
    console.log(name,data)
    return ''
}`
          }
        } else {
          this.code = val;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created () {
    this.tip = tip
  },
  methods: {
    handleCopy () {
      this.$Clipboard({
        text: `refs['${this.select}']`,
      }).then(() => {
        this.$message.success('复制成功')
      }).catch(() => {
        this.$message.error('复制失败')
      });
    },
    handleClose () {
      this.setVisible(false);
    },
    submit () {
      let value = this.code;
      if (!this.rules) {
        this.$emit('submit', value);
        this.setVisible(false)
        return
      }
      try {
        funEval(value);
        if (['data'].includes(this.type)) value = funEval(value);
        this.$emit('submit', value);
        this.setVisible(false)
      } catch (error) {
        console.log(error);
        this.$message.error('数据格式有误')
      }

    },
    setVisible (val) {
      this.$emit('update:visible', val);
    }
  }
}
</script>
<style lang="scss" scoped>
.event {
  margin-bottom: 10px;
  .avue-select {
    margin-right: 10px;
  }
}
.content {
  display: flex;
  .monaco_editor_container {
    flex: 1;
    &:first-child {
      flex: 2;
    }
  }
}
</style>
