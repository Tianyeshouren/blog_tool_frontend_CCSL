<template>
<div>
  <el-container id="blogcontainer">
  <el-aside style="width:30%;background-color: white">
    <el-date-picker
      v-model="value1"
      type="date"
      placeholder="选择日期" style="">
    </el-date-picker>
  <div id="blog">
    <blogblock v-for="(item,index) in blog" v-bind:key="index"
    :title="item.title"
    :desc="item.desc"
    :date="changetime(item.date)"
    :id="item.id"
    v-on:getcontent="get"
    v-on:deleteblog="del"
    />
  </div>
  </el-aside>
  <el-container>
    <el-main style="border:gray solid 2px; background-color:rgb(48, 49, 49)">
      <div id="bloghtml" v-html="blogcontent"></div>
    </el-main>
    <el-footer style="text-align: right; font-size: 12px">
          <el-button @click="modify">复制</el-button>
      <span>选项</span>
    </el-footer>
  </el-container>
</el-container>
</div>
</template>

<script>
import axios from 'axios'
import blogblock from '@/components/blogblock'

export default {
  name: 'blog',
  components: {
    blogblock
  },
  data: function () {
    return {
      curid: '',
      curblogtitle: '',
      value1: '',
      blogcontent: '请选择一篇文章',
      blogori: '',
      blog: []
    }
  },
  methods: {
    get (info) {
      this.blogcontent = info.content
      this.blogori = info.ori
      this.curblogtitle = info.title
    },
    del (r) {
      alert('Delete: ' + r)
      this.getData()
    },
    modify () {
      console.log(this.blogori)
      this.$router.push({
        name: 'editor',
        params: {
          blogori: this.blogori
        }
      })
    },
    changetime (time) {
      return this.$moment(time).utcOffset(0).format('YYYY/MM/DD H:mm')
    },
    getData () {
      // 对应 Python 提供的接口，这里的地址填写下面服务器运行的地址，本地则为127.0.0.1，外网则为 your_ip_address
      const path = 'http://127.0.0.1:5000/queryblog'
      // const output = 'http://127.0.0.1:5000/static/output.html'
      axios.post(path, null).then((response) => {
        this.blog = response.data
      }).catch(function (error) {
        alert('Error ' + error)
      })
      // axios.get(output).then((res) => {
      //   console.log(res.data)
      //   that.inputccsl = res.data
      // })
    }
  },
  computed: {
  },
  mounted () {
    // this.getData()
  },
  activated () {
    this.getData()
  }
}
</script>
<style>
#blog{
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: flex-start;
}
img {
  max-width:100%;
  height:auto;
}
#blogcontainer{
  height: 1300px;
  width: 100%;
}
#bloghtml {
  color: aliceblue;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
