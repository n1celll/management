<template>
  <header class="header">
    <div class="user">
      <div class="logo">
        <img src="../assets/logo.png" alt="登录图片" />
      </div>
      <div>{{userInfo.username}}</div>

      <el-popconfirm title="是否退出" @onConfirm="logout">
        <el-button slot="reference">安全退出</el-button>
      </el-popconfirm>
    </div>
    <div>
      <el-button v-if="userInfo.level=='user'" type="danger" plain @click="downloadZip">下载插件</el-button>
    </div>
  </header>
</template>

<script>
import cookie from "../utils/cookie";
export default {
  name: "",
  components: {},
  data() {
    return {
      userInfo: {}
    };
  },
  computed: {},
  created() {
    this.$http({
      method: "get",
      url: "/users/userinfo"
    }).then(res => {
      if (res.data.status != 200) {
        this.$router.push({ path: "/login" });
      } else {
        this.userInfo = res.data.data;
        this.$emit("userInfo", this.userInfo);
      }
    });
  },
  methods: {
    logout() {
      cookie.setCookie("token", "");
      this.$router.push({ path: "/login" });
    },
    downloadZip() {
      this.$message({
            message: "请求成功，请稍后...",
            type: "success",
            duration: 3000
          });
      this.$http({
        method: "post",
        url: "/users/download"
      }).then(res => {
        if (res.data.status == 200) {
          window.open(res.data.data.url);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  background-color: #545c64;
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  .user {
    width: 250px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: #fff;
  }
  .logo {
    img {
      width: 50px;
      height: 50px;
    }
  }
}
</style>
