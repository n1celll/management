<template>
  <div class="login">
    <h2>修改密码</h2>
    <el-input placeholder="输入密码" v-model="pwd" show-password></el-input>
    <el-input placeholder="确认密码" v-model="repwd" show-password></el-input>
    <el-button type="warning" @click="changePwd">确认修改</el-button>
  </div>
</template>

<style lang="less" scoped>
.login {
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  width: 500px;
  .el-input {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>

<script>
export default {
  data() {
    return {
      pwd: "",
      repwd: ""
    };
  },
  methods: {
    changePwd() {
      if (this.pwd.length < 6) {
        this.$message({
          message: "密码长度不能少于6位",
          type: "error",
          duration: 1000
        });
      } else if (this.pwd != this.repwd) {
        this.$message({
          message: "两次输入密码不一致",
          type: "error",
          duration: 1000
        });
      } else {
        this.$http({
          method: "put",
          url: "/users/userinfo",
          data: {
            pwd: this.pwd,
            repwd: this.repwd
          }
        }).then(res => {
          if (res.data.status == 200) {
            this.$message({
              message: "修改成功",
              type: "success",
              duration: 1000
            });
            window.location.reload()
          }
        });
      }
    }
  }
};
</script>