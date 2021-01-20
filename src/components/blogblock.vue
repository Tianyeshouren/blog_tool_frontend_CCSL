<template>
  <div class="blogblock">
    <div class="blogb">
      <div class="blogtitle">{{title}}</div>
      <div class="blogdesc">{{desc}}<br/><font face="verdana" size="2" color="grey">{{date}}</font></div>
    </div>
    <div class="blogt">
      <div class="blogbutton">
        <button @click="get">详细</button>
        <button @click="del">删除</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'blogblock',
  props: {
    title: {type: String},
    desc: {type: String},
    date: {type: String},
    id: {type: Number}
  },
  data: function () {
    return {
    }
  },
  methods: {
    dateFormat (time) {
      return this.$moment(time).utcOffset(0).format('YYYY/MM/DD-H:mm:ss')
    },
    get () {
      // console.log(document.documentElement.clientHeight)
      // console.log(document.documentElement.clientWidth)
      var req = {'id': this.id}
      const path = 'http://127.0.0.1:5000/queryblogcontent'
      axios.post(path, req).then((response) => {
        // console.log(response.data.content)
        var info = {'title': this.title, 'content': response.data.content, 'ori': response.data.ori}
        this.$emit('getcontent', info)
      })
    },
    del () {
      var req = {'id': this.id}
      const path = 'http://127.0.0.1:5000/deleteblog'
      axios.post(path, req).then((response) => {
        this.$emit('deleteblog', response.data.r)
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.blogblock {
    width: 99%;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    text-align: center;
    margin-bottom: 20px;
}
.blogtitle {
  padding: 5px 2px;
  width: 95%;
  margin: 0px auto;
  background-color: rgb(138, 135, 135);
  text-align: center;
  color: white;
  word-wrap:break-word;
  font-weight:bold;
}
.blogdesc {
  padding: 2px;
  width: 95%;
  margin: 0px auto;
  text-align: center;
  word-wrap:break-word;
}
.blogbutton {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.blogb {
  width: 90%;
  border:2px solid black;
  background-color: white;
  text-align: center;
  padding: 5px 2px;
  margin: auto;
}
.blogt {
  border:2px solid gray;
  border-top: none;
  width: 90%;
  background-color:gray;
  text-align: center;
  padding: 0px 2px;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: baseline
}
</style>
