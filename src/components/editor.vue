<template>
 <div id='pageeditor'>
    <div class="editormd" id='myeditor'>
      <textarea class="editormd-markdown-textarea"
                name="$id-markdown-doc" ref="ee"></textarea>
      <!-- html textarea 需要开启配置项 saveHTMLToTextarea == true -->
      <textarea class="editormd-html-textarea"
                name="$id-html-code"></textarea>
    </div>
    <div id="parblock">
    <el-input class="ib" v-model="title" placeholder="请输入标题"><template slot="prepend">标题</template></el-input>
    <el-input class="ib" type="textarea" :rows="2" v-model="desc" placeholder="请输入描述"><template slot="prepend">描述</template></el-input>
  </div>
    <div id="btnblock">
   <el-button plain type="primary" icon="el-icon-s-promotion" @click="blogup">发布</el-button>
   <router-link to='blog'> <el-button plain type="success" icon="el-icon-view" >查看</el-button></router-link>
</div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import $ from 'jquery'
import { defaultConfig } from './configure/editor'
import axios from 'axios'
export default {
  name: 'MarkdownEditor',
  props: {
    /**
     * editormd的选项对象
     */
    options: {
      type: Object
    },
    initData: {
      'type': String
    },
    /*
     * 编辑器配置
     */
    config: {
      type: String
    },
    /*
     *  内容改变时回调，返回（html, markdown, text
     */
    onchange: {
      type: Function
    },
    data: function () {
      return {
        // 最终生成的编辑器
        editor: null,
        timer: null,
        doc: {},
        jsLoadOver: false
      }
    }
  },
  data: function () {
    return {
      desc: '',
      title: '',
      req: {'content': '', 'desc': '', 'title': '', 'ori': ''}
    }
  },
  mounted () {
    let vm = this
    // 加载editormd
    this.requireEditor(function () {
      vm.editor = editormd('myeditor', defaultConfig)
    })
  },
  activated () {
    if (this.$route.params.blogori) {
      console.log(this.$route.params.blogori)
      this.$refs.ee.textContent = this.$route.params.blogori
    }
    this.$refs.ee.focus()
  },
  methods: {
    getConfig: function () {
      return { ...defaultConfig, ...this.config }
    },
    /**
     * 异步加载editormd
     * callback 成功后的回调函数
     */
    requireEditor (callback) {
      // 设置全局变量，因为editormd依赖jquery
      window.$ = window.jQuery = $
      // 异步加载并执行
      $.getScript('/static/editor.md/editormd.min.js', function (script) {
        callback()
      })
      // 加载css
      $('head').append(
        $('<link rel="stylesheet" type="text/css"/>').attr(
          'href',
          '/static/editor.md/css/editormd.min.css'
        )
      )
    },
    blogup () {
      var that = this
      that.req.content = that.editor.getPreviewedHTML()
      that.req.ori = that.editor.getMarkdown()
      that.req.desc = that.desc
      that.req.title = that.title
      // 对应 Python 提供的接口，这里的地址填写下面服务器运行的地址，本地则为127.0.0.1，外网则为 your_ip_address
      const path = 'http://127.0.0.1:5000/blogup'
      // const output = 'http://127.0.0.1:5000/static/output.html'
      axios.post(path, that.req).then((response) => {
        alert('success')
      }).catch(function (error) {
        alert('Error ' + error)
        that.outputHtml = '错误'
      })
    },
    getValue () {
      let html = this.editor.getPreviewedHTML()
      let markdown = this.editor.getMarkdown()
      console.log(this.getConfig())
      let gethtml = this.editor.getHTML()
      console.log('%c this is a message', 'color:#0f0;', '获取 Markdown 源码:', markdown)
      console.log('%c this is a message', 'color:#0f0;', '获取 Textarea 保存的 HTML 源码:', gethtml)
      console.log('%c this is a message', 'color:#0f0;', '获取预览窗口里的 HTML，在开启 watch 且没有开启 saveHTMLToTextarea 时使用:', html)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#pageeditor {
  margin: 0px;
  border: 0px;
  padding: 0px;
  height: 100%;
  background-color: black;
}
#myeditor {
  margin: 0 20 0 0;
  border: 0px;
  padding: 0px;
}
#parblock {
  padding:2px 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color:black;
  color: white;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 100%;
  margin-bottom: 1px;
}
#btnclock {
  display: flex;
  justify-content: flex-start;
}
</style>
