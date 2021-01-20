<template>
  <div id="pagelabdata">
    <el-container id="labdataelc">
  <el-container>
    <el-header id="labdataelhe" style="text-align:left; background-color: black">
      <div id="select">
      <el-dropdown @command="chooselab" trigger="click">
            <span class="el-dropdown-link">
            <el-button plain type="primary" @click="putselect">
    实验<i class="el-icon-arrow-down el-icon--right"></i>
  </el-button>
          </span>
          <el-dropdown-menu slot="dropdown" >
             <el-dropdown-item v-for="item in lablist" v-bind:key="item.labname" v-text="'['+item.labname+']' +' <'+ dateFormat(item.date)+'>'" :command="item" ></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="choosebd" trigger="click">
            <span class="el-dropdown-link">
            <el-button plain type="success"  @click="putbd" >
    边界<i class="el-icon-arrow-down el-icon--right"></i>
  </el-button>
          </span>
          <el-dropdown-menu slot="dropdown" >
             <el-dropdown-item v-for="item in bdlist" v-bind:key="item"  v-text="item" :command="item"> </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </div>
        <div id="d">
          <el-tooltip :content="'Echars: ' + showec" placement="top">
            <el-switch @change="test" v-model="showec" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-tooltip>
          <el-button size="small" type="primary" icon="el-icon-refresh" circle  @click="rerender"></el-button>
      <router-link to='/ccsl'><el-button  type="success" icon="el-icon-s-promotion" >工具</el-button></router-link>
      <el-button  type="danger" icon="el-icon-delete"  :disabled="ifchooselab" @click="deletelab">删除</el-button>
        <el-button type="primary"  icon="el-icon-refresh-left" :disabled="ifchooselab" @click="redo">重做</el-button>
        </div>
    </el-header>
    <el-main id="labdataelm">
      <el-table :data="tableData">
      <el-table-column
        prop="labname"
        label="当前实验"
        width="200">
      </el-table-column>
      <el-table-column
        prop="bound"
        label="当前边界"
        width="100">
      </el-table-column>
      <el-table-column
        prop="res"
        label="结果"
        width="100">
      <template slot-scope="scope">
            <span v-if="scope.row.res==='sat'"><i class="el-icon-success"/></span>
            <span v-if="scope.row.res==='unsat'"><i class="el-icon-error"/></span>
            <span v-if="scope.row.res==='inprogress'"><i class="el-icon-loading"/></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        label="用时"
        width="200">
      </el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        width="250">
      </el-table-column>
    </el-table>
    </el-main>
  </el-container>
</el-container>
      <div class="display" :class="{showht:showec === false}">
          <div v-show="showec" id="ec" ref="mychart"></div>
          <div v-show="!showec" id="ht" v-html="outputHtml"></div>
      </div>
      <div id="info" v-text="ccsl" >
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'

export default {
  name: 'labdata',
  data: function () {
    return {
      ccsl: '这里显示ccsl',
      outputHtml: '请选择一个具体实验',
      showec: true,
      lablist: [],
      bdlist: [],
      curlab: '',
      curbd: '',
      tableData: [{
        bound: '无',
        labname: '无',
        time: '',
        res: '',
        date: ''}],
      reqout: {'labname': '', 'bound': ''},
      myChart: {},
      CLKDATA: [],
      XDATA: [],
      YDATA: [],
      SCHEDATA: []
    }
  },
  methods: {
    test () {
      console.log(this.showec)
    },
    oncopy (e) {
      console.log(e)
    },
    onerr (e) {

    },
    show () {
      // console.log(row.name)
      // console.log(this.$refs.ccsltext.$el.offsetHeight)
    },
    rerender () {
      this.putselect()
      this.putbd()
      if (this.curlab !== '' && this.curbd !== '' && this.tableData[0].res === 'inprogress') {
        alert('refresh data in case of inprogress' + this.curlab + ',' + this.curbd)
        this.getoutput()
      }
      console.log(this.ccsl)
      let dom = this.$refs.mychart
      this.myChart = echarts.init(dom)
      this.myChart.setOption(this.opt)
      this.myChart.resize()
    },
    cleardata () {
      this.curlab = ''
      this.curbd = ''
      this.tableData = [{
        bound: '无',
        labname: '无',
        time: '',
        res: '',
        date: ''}]
      this.ccsl = ''
      this.CLKDATA = []
      this.XDATA = []
      this.YDATA = []
      this.SCHEDATA = []
      this.outputHtml = '请选择一个具体实验'
      let dom = this.$refs.mychart
      this.showec = true
      this.myChart = echarts.init(dom)
      this.myChart.setOption(this.opt)
      this.myChart.resize()
      this.getlab()
      this.bdlist = []
    },
    deletelab () {
      // console.log(this.ifchooselab)
      this.$confirm('此操作将永久删除' + this.curlab + ',是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.reqout.labname = this.curlab
        const path = 'http://127.0.0.1:5000/DeleteLab'
        axios.post(path, this.reqout).then((response) => {
          if (response.data.r === true) {
            this.cleardata()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getoutput () {
      this.reqout.labname = this.curlab
      this.reqout.bound = this.curbd
      const path = 'http://127.0.0.1:5000/QueryOutput'
      axios.post(path, this.reqout).then((response) => {
        this.ccsl = response.data.ccsl
        this.tableData[0].time = response.data.time
        this.tableData[0].res = response.data.res
        if (this.tableData[0].res !== 'sat') {
          this.CLKDATA = []
          this.XDATA = []
          this.YDATA = []
          this.SCHEDATA = []
          this.outputHtml = response.data.output
          let dom = this.$refs.mychart
          this.myChart = echarts.init(dom)
          this.myChart.setOption(this.opt)
          this.myChart.resize()
        } else {
          this.CLKDATA = response.data.ec.CLK
          this.XDATA = response.data.ec.X
          this.YDATA = response.data.ec.Y
          this.SCHEDATA = response.data.ec.SCHE
          this.outputHtml = response.data.output
          let dom = this.$refs.mychart
          this.myChart = echarts.init(dom)
          this.myChart.setOption(this.opt)
          this.myChart.resize()
        }
      })
    },
    getbd () {
      this.reqout.labname = this.curlab
      const path = 'http://127.0.0.1:5000/Querybd'
      axios.post(path, this.reqout).then((response) => {
        this.bdlist = response.data.bdlist
        this.ccsl = response.data.ccsl
        // console.log(this.bdlist)
        // for(var i=0;i<this.bdlist.length;i++)
        // {
        //   console.log(this.bdlist[i])
        // }
      })
    },
    redo () {
      this.$router.push({
        name: 'ccsl',
        params: {
          ccslsrc: this.ccsl
        }
      })
    },
    dateFormat (time) {
      return this.$moment(time).utcOffset(0).format('YYYY/MM/DD-H:mm:ss')
    },
    getlab () {
      const path = 'http://127.0.0.1:5000/Query'
      axios.post(path, null).then((response) => {
        this.lablist = response.data
        // console.log(this.lablist)
        // for(var i=0;i<this.lablist.length;i++)
        // {
        //   console.log(this.lablist[i].labname)
        // }
      })
    },
    putbd () {
      if (this.curlab !== '') {
        this.getbd()
      }
    },
    putselect () {
      this.getlab()
    },
    chooselab (lab) {
      this.curlab = lab.labname
      this.curbd = ''
      this.tableData = [{
        bound: '',
        labname: lab.labname,
        time: '',
        res: '',
        date: this.$moment(lab.date).utcOffset(0).format('YYYY/MM/DD-H:mm')}]
      this.getbd()
    },
    choosebd (bd) {
      this.curbd = bd
      this.tableData[0].bound = bd
      this.getoutput()
    }
  },
  computed: {
    ifchooselab () {
      if (this.curlab === '') {
        return true
      } else {
        return false
      }
    },
    opt () {
      let that = this
      let obj =
        {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: that.CLKDATA,
            textStyle: {
              color: '#ffffff'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            data: that.XDATA,
            axisLabel: {
              textStyle: {
                color: '#ffffff'
              }
            }
          },
          yAxis: {
            type: 'category',
            data: that.YDATA,
            axisLabel: {
              textStyle: {
                color: '#ffffff'
              }
            }
          },
          series: that.SCHEDATA
        }
      return obj
    }
  },
  mounted () {
    let dom = this.$refs.mychart
    this.myChart = echarts.init(dom)
    this.myChart.setOption(this.opt)
    this.myChart.resize()
    this.getlab()
    // this.getData()
  }
}
</script>
<style>
#pagelabdata{
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(105, 105, 101);
  background-color:black;
  height: 100%;
  padding: 0px;
  margin: 0px;
}
#labdataelc{
  padding: 0px;
  margin: 0px;
  border: 0px;
  height: 170px;
}
.display{
  height: 70%;
  background:rgb(48, 49, 49);
}
#ec{
  height: 100%;
}
#choose{
  background-color:gray;
  display: flex;
  flex-direction: column;
}
#select{
  background-color:rgb(206, 206, 205);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-left: 10px;
}
#info{
  color: white;
}
#labdataelhe{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  margin: 0px;
  border: 0px;
}
#labdataelm{
  margin:0px;
  padding: 0 10px;
  border:0px;
  background-color: black;
}
#d{
  margin-right: 10px;
}
.showht {
  background-color: rgb(224, 219, 210);
}
#ht {
  overflow: scroll;
}
</style>
