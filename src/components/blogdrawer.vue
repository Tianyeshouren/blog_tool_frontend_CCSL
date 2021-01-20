<template>
<div>
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
  <el-drawer id='out'
  :title="curblogtitle"
  :visible.sync="drawer"
  size="80%">
      <div id="bloghtml"  v-html="blogcontent">
      </div>
</el-drawer>
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
      drawer: false,
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
      this.drawer = true
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
    h () {
      return (document.documentElement.clientHeight) + 'px'
    },
    w (){
      return (document.documentElement.clientWidth) + 'px'
    }
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
  margin: 10px;
  color: black;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 1000px;
  height: 1000px;
  overflow:scroll
}
#out {
overflow:scroll;
}

</style>
