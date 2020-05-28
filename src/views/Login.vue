<template>
  <div class="login" @keyup.enter="login">
    <img src="../assets/logo.png" alt />
    <h2>WELCOME</h2>
    <el-input v-model="username" placeholder="账号" ></el-input>
    <el-input placeholder="密码" v-model="pwd" show-password></el-input>
    <el-button type="success" @click="login">登录</el-button>
  </div>
</template>

<style lang="less" scoped>
.login {
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  .el-input {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  img {
    height: 100px;
    width: 100px;
  }
}
</style>

<script>
import cooike from "../utils/cookie";
export default {
  data() {
    return {
      username: "",
      pwd: ""
    };
  },
  methods: {
    login() {
      this.$http({
        method: "post",
        url: "/users/login",
        data: {
          username: this.username,
          pwd: this.pwd
        }
      }).then(res => {
        if (res.data.status == 200) {
          this.$message({
            message: "登录成功",
            type: "success",
            duration: 800
          });
          cooike.setCookie("token", res.data.data.token);
          this.$router.push({ path: "/" });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
            duration: 800
          });
        }
      });
    }
  },
  
};
</script>