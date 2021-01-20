<template>
  <div id="pageccsl">
    <div id="parblock">
    <el-input class="ib" v-model="bound" placeholder="请输入边界"><template slot="prepend">边界</template></el-input>
    <el-input class="ib" v-model="labname" placeholder="请输入名称"><template slot="prepend">实验名称</template></el-input>
    <el-input class="ib" v-model="times" placeholder="请输入次数"><template slot="prepend">次数</template></el-input>
    <el-input class="ib" v-model="gap" placeholder="请输入跨度"><template slot="prepend">跨度</template></el-input>
  </div>
  <div class="main">
   <div class="text-area">
     <div class="btn">
      <button @click="inputsymbol($event)">#</button>
      <button @click="inputsymbol($event)">&lt;</button>
      <button @click="inputsymbol($event)">≤</button>
      <button @click="inputsymbol($event)">⊆</button>
      <button @click="inputsymbol($event)">+</button>
      <button @click="inputsymbol($event)">*</button>
      <button @click="inputsymbol($event)">∧</button>
      <button @click="inputsymbol($event)">∨</button>
      <button @click="inputsymbol($event)">$</button>
      <button @click="inputsymbol($event)">∝</button>
      <button @click="inputsymbol($event)">☇</button>
      <button @click="inputsymbol($event)">==</button>
      <button @click="inputsymbol($event)">∈</button>
      <button @click="inputsymbol($event)">-</button>
      <button @click="inputsymbol($event)">±</button>
      <button @click="inputsymbol($event)">⋈</button>
    </div>
    <textarea placeholder="请输入CCSL..." v-model="inputccsl" ref="input">
    </textarea>
   </div>
  </div>
  <div v-html="outputHtml" class="output" v-loading="loading"></div>
<div id="btnblock">
   <el-button plain type="primary" icon="el-icon-s-promotion" @click="getData">提交任务</el-button>
   <router-link to='labdata'> <el-button plain type="success" icon="el-icon-view" >查看结果</el-button></router-link>
</div>
  </div>
</template>

<script>
import Submit from '@/components/Submit'
import axios from 'axios'
export default {
  name: 'ccsl',
  components: {
    Submit
  },
  data: function () {
    return {
      serverResponse: 'resp',
      data: {'ccsl': 'null', 'bound': '', 'labname': '', 'times': '1', 'gap': '10'},
      inputccsl: '',
      bound: 20,
      outputHtml: '',
      savefilename: '',
      saveinfo: {'name': '', 'bound': '', 'result': '', 'time': ''},
      cansave: false,
      cansubmit: 1,
      loading: false,
      labname: 'test',
      times: '1',
      gap: '10'
    }
  },
  methods: {
    save () {
      const path = 'http://127.0.0.1:5000/store'
      axios.post(path, this.saveinfo).then((response) => {
        console.log(response.data.output)
        alert('Success ')
        this.cansave = false
        // console.log(this.saveinfo.result)
      }).catch(function (error) {
        alert('Error ' + error)
        this.cansave = true
      })
    },
    open () {
      this.$prompt('请输入', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你的文件名是: ' + value
        })
        this.savefilename = value
        this.saveinfo.name = value
        this.saveinfo.bound = this.bound
        this.save()
      }).catch(() => {
      })
    },
    getData () {
      var that = this
      that.data.ccsl = that.inputccsl
      that.data.bound = that.bound
      that.data.labname = that.labname
      that.data.times = that.times
      that.data.gap = that.gap
      // 对应 Python 提供的接口，这里的地址填写下面服务器运行的地址，本地则为127.0.0.1，外网则为 your_ip_address
      const path = 'http://127.0.0.1:5000/do'
      // const output = 'http://127.0.0.1:5000/static/output.html'
      that.outputHtml = '正在计算中'
      that.loading = true
      axios.post(path, that.data).then((response) => {
        var msg = response.data.ccsl
        var res = response.data.result
        var time = response.data.time
        that.serverResponse = msg
        that.outputHtml = response.data.output
        console.log(response.data.output)
        that.saveinfo.time = time
        that.saveinfo.result = res
        that.cansave = true
        that.loading = false
        alert(response.data)
      }).catch(function (error) {
        alert('Error ' + error)
        that.outputHtml = '错误'
      })
      // axios.get(output).then((res) => {
      //   console.log(res.data)
      //   that.inputccsl = res.data
      // })
    },
    inputsymbol (e) {
      // console.log(e.target.value)
      const i = this.$refs.input
      if (i.selectionStart || i.selectionStart === 0) {
        var startpos = i.selectionStart
        var endpos = i.selectionEnd
        this.inputccsl = this.inputccsl.substring(0, startpos) + e.target.innerText + this.inputccsl.substring(endpos, i.value.length)
      }
      this.$nextTick(() => {
        this.$refs.input.selectionStart = startpos + e.target.innerText.length
        this.$refs.input.selectionEnd = startpos + e.target.innerText.length
        this.$refs['input'].focus()
      })
    }
  },
  mounted () {
    this.$refs['input'].focus()
  },
  activated () {
    if (this.$route.params.ccslsrc) {
      this.inputccsl = this.$route.params.ccslsrc
    }
    this.$refs['input'].focus()
  }
}
</script>
<style>
#pageccsl {
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color:white;
  background-color:black;
  height: 100%;
  padding: 0px;
  margin: 0px;
  border:0px;
}
.main {
  width: 100%;
  height: 84%;
  display: flex;
  flex-direction: column;
  left:0;
  top:0;
  right:0;
  bottom: 0;
  margin: 0px;
  border: 0px;
  padding: 0px;
}
.text-area{
    width:100%;
    display: flex;
    flex-direction: column;
    flex: 0 0 100%;
    height: 100%;
    border: 0px;
    margin: 0px;
}
.output {
  width: 100%;
  height: 50px;
  background-color: rgb(44, 43, 43);
  margin-left: 4px;
}
.text-area textarea {
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: rgb(44, 43, 43);
    width: 100%;
    height: 99%;
    margin: 0;
    border: 0;
    outline: none;
    padding: 0;
    color:white;
    margin-left: 4px;
}
.text-area textarea::-webkit-input-placeholder {
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #9E9E9E;
}
.btn {
  flex: 0 0 30px;
  display: flex;
  width: 100%;
  margin-bottom: 5px;
  margin-left: 4px;
}
#parblock{
  padding:4px 4px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color:black;
  color: white;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 100%;
  margin-bottom: 1px;
}
#btnblock{
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: white;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 100%;
}
.el-input__inner {
  border: 0;
}
.ib{
   margin-right: 5px;
}
</style>
