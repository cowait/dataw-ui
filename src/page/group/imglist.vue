<template>
  <el-dialog title="图库"
             width="80%"
             :close-on-click-modal="false"
             :visible.sync="imgVisible">
    <div style="margin:0 auto;">
      <el-upload class="upload-demo"
                 :on-success="onSuccess"
                 :show-file-list="false"
                 :data="formData"
                 :action="url+'/file/put-file'"
                 multiple
                 style="display:inline-block;margin-right:10px"
                 list-type="picture">
        <el-button size="small"
                   icon="el-icon-upload"
                   type="primary">点击上传
        </el-button>
      </el-upload>
      <el-button size="small"
                 @click="api.box=true"
                 icon="el-icon-picture-outline"
                 type="primary">素材库
      </el-button>
    </div>
    <el-scrollbar class="imgList">
      <img :src="item.value"
           :style="styleName"
           @click="handleSetimg(item.value)"
           v-for="(item,index) in imgList"
           :key="index" />
    </el-scrollbar>
    <el-dialog title="素材库"
               append-to-body
               :visible.sync="api.box"
               width="70%">
      <materials @change="handleApiChange"
                 :menu="false"></materials>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleApiSubmit()"
                   size="small">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import materials from '@/page/list/materials'
import { url } from '@/config';
import { imgOption } from '@/option/config'
import { getList } from "@/api/file";

export default {
  components: {
    materials
  },
  data () {
    return {
      api: {
        box: false,
        item: {}
      },
      url: url,
      imgVisible: false,
      imgObj: '',
      type: '',
      imgActive: 0,
      imgOption: imgOption,
      imgTabs: [],
      imgList: [],
      formData: { type: this.type }
    }
  },
  computed: {
    styleName () {
      if (this.type === 'background') {
        return {
          width: '200px'
        }
      }
      return {}
    }
  },
  watch: {
    type: {
      handler () {
        if (this.type === 'background') {
          this.imgActive = 0;
        } else if (this.type === 'border') {
          this.imgActive = 1;
        } else {
          this.imgActive = 2;
          this.type = 'img';
        }
        this.formData = { type: this.type }
      },
      immediate: true
    }
  },
  methods: {
    onSuccess (res) {
      const url = res.data.link;
      this.imgList.unshift({
        label: url,
        value: url
      });
    },
    openImg (item, type) {
      getList(this.type).then(res => {
        let list = [];
        list.push(...res.data.data)
        list.push(...this.imgOption[this.imgActive])
        this.imgList = list
      })
      this.type = type;
      this.imgObj = item
      this.imgVisible = true;
    },
    handleApiChange (val) {
      this.api.item = val || {}
    },
    handleApiSubmit () {
      this.api.box = false
      this.handleSetimg(this.api.item.url)
    },
    handleSetimg (item) {
      this.imgVisible = false;
      this.$emit('change', item, this.imgObj);
    }
  }
}
</script>

<style>
</style>
