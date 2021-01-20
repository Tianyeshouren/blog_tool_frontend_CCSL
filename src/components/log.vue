<template>
  <div id="logblock">
     <el-input placeholder="请输入账号" v-model="id" clearable></el-input>
     <el-input placeholder="请输入密码" v-model="pwd" show-password></el-input>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pwd: '',
      id: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#logblock {
    width: 50%;
    margin: auto;
    margin-top: 6px;
}
</style>
