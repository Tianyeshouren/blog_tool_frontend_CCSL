<template>
<div>
  <el-container id="blogcontainer">
  <el-aside style="max-width:30%;background-color: white">
    <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                    <el-menu-item index="1">
                      <template slot="title">
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
                      </template>
                    </el-menu-item>
                </el-menu>

  </el-aside>
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
      <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
  <el-radio-button :label="false">展开</el-radio-button>
  <el-radio-button :label="true">收起</el-radio-button>
  </el-radio-group>
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>查看</el-dropdown-item>
          <el-dropdown-item>新增</el-dropdown-item>
          <el-dropdown-item>删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>选项</span>
    </el-header>
    <el-main style="border:gray solid 2px; background-color:rgb(48, 49, 49)">
      <div id="bloghtml" v-html="blogcontent"></div>
    </el-main>
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
      isCollapse: false,
      curid: '',
      curblogtitle: '',
      value1: '',
      blogcontent: 'please',
      blog: []
    }
  },
  methods: {
    get (info) {
      this.blogcontent = info.content
      this.curblogtitle = info.title
    },
    del (r) {
      alert('Delete: ' + r)
      this.getData()
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
#blogcontainer{
  height: 1300px;
  width: 100%;
}
#bloghtml {
  color: aliceblue;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 100%;
    min-height: 100%;
  }
</style>
