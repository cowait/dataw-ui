<template>
  <avue-crud :option="option"
             v-model="form"
             @row-save="rowSave"
             @row-update="rowUpdate"
             @row-del="rowDel"
             :before-close="beforeClose"
             :before-open="beforeOpen"
             :data="data">
    <template slot="contentForm"
              slot-scope="{}">
      <template v-if="isStatic">
        <el-form-item label="数据值"
                      label-position="top">
          <monaco-editor v-model="form.data"
                         language="javascript"
                         height="100"></monaco-editor>
          <br />
          <el-upload :show-file-list="false"
                     :auto-upload="false"
                     style="display:inline-block"
                     accept=".xls,.xlsx"
                     :on-change="handleImport">
            <el-button size="small"
                       icon="el-icon-upload"
                       type="success">导入数据(Excel)</el-button>
          </el-upload>

        </el-form-item>
      </template>
      <template v-else-if="isSql">
        <el-form-item label="数据源选择">
          <avue-select :dic="DIC.sql"
                       v-model="form.dbId"></avue-select>
        </el-form-item>

        <el-form-item label="SQL语句"
                      label-position="top">
          <monaco-editor v-model="form.dbSql"
                         language="sql"
                         height="100"></monaco-editor>
        </el-form-item>
      </template>
      <template v-else-if="isApi">
        <el-form-item label="接口地址">
          <avue-input v-model="form.url"></avue-input>
        </el-form-item>
        <el-form-item label="请求方式">
          <avue-select v-model="form.dataMethod"
                       :dic="DIC.method"></avue-select>
        </el-form-item>
      </template>
      <template v-else-if="isWs">
        <el-form-item label="WS地址">
          <el-input v-model="form.wsUrl">
          </el-input>
        </el-form-item>
      </template>
      <template v-else-if="isMqtt">
        <el-form-item label="MQTT地址">
          <el-input v-model="form.mqttUrl">
          </el-input>
        </el-form-item>
        <el-form-item label="MQTT配置">
          <monaco-editor v-model="form.mqttConfig"
                         height="250"></monaco-editor>
        </el-form-item>
      </template>
      <template v-else-if="isJava">
        <el-form-item label="调用类型">
          <avue-select v-model="form.javaMethod"
                       :dic="DIC.javaMethod"></avue-select>
        </el-form-item>
        <el-form-item label="Bean名称">
          <el-input v-model="form.javaBeanName">
          </el-input>
        </el-form-item>
        <el-form-item label="方法名称">
          <el-input v-model="form.javaBeanMethodName">
          </el-input>
        </el-form-item>
        <el-form-item label="请求参数">
          <avue-array v-model="form.javaParams" placeholder="请输入参数"></avue-array>
        </el-form-item>
      </template>
      <el-form-item label="请求配置"
                    v-if="isWs || isApi">
        <el-tabs class="menu__tabs"
                 v-model="tabs">
          <el-tab-pane label="请求参数（Body）"
                       name="0">
            <template v-if="tabs==0">
              <el-radio-group size="mini"
                              v-if="['post','put'].includes(form.dataMethod)"
                              v-model="form.dataQueryType">
                <el-radio label="json">JSON数据</el-radio>
                <el-radio label="form">FORM表单</el-radio>
              </el-radio-group>
              <monaco-editor v-model="form.dataQuery"
                             language="javascript"
                             height="100"></monaco-editor>
            </template>
          </el-tab-pane>
          <el-tab-pane label="请求头（Headers）"
                       v-if="isApi"
                       name="1">
            <template v-if="tabs==1">
              <monaco-editor v-model="form.dataHeader"
                             language="javascript"
                             height="100"></monaco-editor>
            </template>
          </el-tab-pane>

        </el-tabs>
      </el-form-item>
      <el-form-item label="过滤器">
        <monaco-editor v-model="form.dataFormatter"
                       height="100"></monaco-editor>
      </el-form-item>
      <el-form-item label="响应数据">
        <monaco-editor v-model="result"
                       disabled
                       height="100"></monaco-editor>
      </el-form-item>
    </template>
    <template slot="menuForm">
      <el-button @click="handleRes"
                 size="small"
                 icon="el-icon-upload"
                 type="primary">刷新数据</el-button>
    </template>
  </avue-crud>
</template>

<script>
import {addParam, deepClone, validatenull} from '@/echart/util';
import { getFunction, funEval } from '@/utils/utils'
import MonacoEditor from '@/page/components/editor'
import { getList, getObj, addObj, delObj, updateObj } from '@/api/record'
import { getList as getDbList, dynamicSql, dynamicJava } from "@/api/db";
import { dicOption } from '@/option/config'
import mqtt from 'mqtt'

let dataType = deepClone(dicOption.dataType)
dataType.splice(6, 1)
export default {
  components: {
    MonacoEditor,
  },
  data () {
    return {
      tabs: 0,
      box: false,
      client: {},
      mqClient: {},
      DIC: {
        javaMethod: dicOption.javaMethod,
        method: dicOption.dataMethod,
        sql: []
      },
      result: {
      },
      form: {
        javaParams: []
      },
      data: [],
      option: {
        labelWidth: 130,
        index: true,
        align: 'center',
        headerAlign: 'center',
        column: [
          {
            label: '名称',
            prop: 'name',
            rules: [{
              required: true,
              message: "请输入名称",
              trigger: "blur"
            }]
          },
          {
            label: '类型',
            prop: 'dataType',
            type: 'select',
            dataType: 'number',
            dicData: dataType,
            rules: [{
              required: true,
              message: "请选择类型",
              trigger: "blur"
            }]
          },
          {
            label: '',
            prop: 'content',
            hide: true,
            labelWidth: 0,
            span: 24,
          }
        ]
      }
    }
  },
  computed: {
    isStatic () {
      return this.form.dataType == 0
    },
    isApi () {
      return this.form.dataType == 1
    },
    isSql () {
      return this.form.dataType == 2
    },
    isWs () {
      return this.form.dataType == 3
    },
    isMqtt () {
      return this.form.dataType == 4
    },
    isJava () {
      return this.form.dataType == 5
    },
  },
  watch: {
    'form.dataType' () {
      this.result = ''
      this.tabs = '0'
    }
  },
  created () {
    this.init()
    this.getList()
  },
  methods: {
    init () {
      getDbList({
        current: 1,
        size: 100,
      }).then(res => {
        const data = res.data.data;
        this.DIC.sql = data.records.map(ele => {
          return {
            label: ele.name,
            value: ele.id
          }
        })
      });
    },
    handleClose () {
      this.client.close && this.client.close()
      this.mqClient.end && this.mqClient.end()
      this.mqClient.close && this.mqClient.close()
    },
    handleRes (tip = true) {
      this.handleClose()
      const formatter = (data) => {
        const dataFormatter = getFunction(this.form.dataFormatter)
        if (tip) {
          this.$message.success('数据刷新成功')
        }
        if (typeof dataFormatter == 'function') {
          return dataFormatter(data)
        }
        return data
      }
      if (this.isStatic) {
        let result = funEval(this.form.data)
        this.result = formatter(result);
      } else if (this.isApi) {
        let dataQuery = this.form.dataQuery ? getFunction(this.form.dataQuery)() : {}
        let dataHeader = this.form.dataHeader ? getFunction(this.form.dataHeader)() : {}
        let params = {}, method = this.form.dataMethod
        if (['post', 'put'].includes(method)) {
          params.data = dataQuery
          if (this.form.dataQueryType == 'form') {
            let formData = new FormData()
            Object.keys(dataQuery).forEach(ele => {
              formData.append(ele, dataQuery[ele])
            })
            params.data = formData
          }
        } else if (['get', 'delete'].includes(method)) {
          params.params = dataQuery
        }
        this.$axios({
          ...{
            method: this.form.dataMethod,
            url: this.form.url,
            headers: dataHeader
          },
          ...params
        }).then(res => {
          this.result = formatter(res.data)
        })
      } else if (this.isSql) {
        dynamicSql({
          id: this.form.dbId,
          sql: this.form.dbSql
        }).then(res => {
          this.result = formatter(res.data.data)
        })
      } else if (this.isWs) {
        let dataQuery = this.form.dataQuery ? getFunction(this.form.dataQuery)() : {}
        let url = this.form.wsUrl + addParam(dataQuery)
        this.client = new WebSocket(url)
        this.client.onmessage = (msgEvent = {}) => {
          const data = JSON.parse(msgEvent.data)
          this.result = formatter(data)
        }
      } else if (this.isMqtt) {
        let url = this.form.mqttUrl
        let dataMqttConfig = JSON.parse(this.form.mqttConfig)
        this.mqClient = mqtt.connect(url, dataMqttConfig)
        this.mqClient.subscribe(dataMqttConfig.topic.name, { qos: dataMqttConfig.topic.qos }, (error, res) => {
          console.log('Subscribe to topics res', res, error)
        })
        this.mqClient.on('message', (topic, message) => {
          let defaultTopic = dataMqttConfig.topic
          if (topic === defaultTopic.name) {
            let data = JSON.parse(message)
            this.result = formatter(data)
          }
        })

      } else if (this.isJava) {
        let params = []
        let globParams = Object.assign(window.$glob.query, window.$glob.params)
        if (!validatenull(this.form.javaParams)){
          this.form.javaParams.forEach(param => {
            let key = param.replace("${", "").replace("}", "");
            if (globParams[key]) {
              params.push(globParams[key])
            } else if (param) {
              params.push(param)
            }
          })
        }


        let data = {
          javaMethod: this.form.javaMethod,
          javaBeanName: this.form.javaBeanName,
          javaBeanMethodName: this.form.javaBeanMethodName,
          params
        }
        dynamicJava(data).then(res => {
          let data = res.data.data
          this.result = formatter(data)
        })
      }
    },
    handleImport (file, fileLis) {
      this.$Export.xlsx(file.raw)
        .then(data => {
          this.form.data = data.results;
          this.$message.success('导入成功')
        })
    },
    vaildData (id) {
      return [0, 1, 2].includes(id)
    },
    beforeClose (done) {
      this.handleClose()
      done()
    },
    beforeOpen (done, type) {
      this.result = '';
      if (type == 'edit') {
        getObj(this.form.id).then(res => {
          const data = res.data.data;
          this.form = data
          this.handleRes(false)
          done()
        })
      } else {
        done()
      }
      this.form.dataFormatter = this.form.dataFormatter || "(data)=>{\n    return data\n}"
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
      row.dataQuery = row.dataQuery || ''
      row.dataHeader = row.dataHeader || ''
      updateObj(row).then(() => {
        done();
        this.$message.success('修改成功');
        this.getList()

      })
    },
    rowSave (row, done) {
      row.dataQuery = row.dataQuery || ''
      row.dataHeader = row.dataHeader || ''
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
