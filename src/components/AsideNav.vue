<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        class="el-menu-vertical-demo"
        :unique-opened="true"
        @select="handleSelect"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="sale">
          <i class="el-icon-location"></i>
          <span slot="title">营收数据</span>
        </el-menu-item>
        <el-menu-item v-if="userInfo.level == 'admin'" index="management">
          <i class="el-icon-location"></i>渠道管理
        </el-menu-item>

        <el-menu-item index="setting">
          <i class="el-icon-location"></i>修改密码
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "AsideNav",
  components: {},
  props: ["userInfo"],
  data() {
    return {
      tabName: {
        sale: "营收数据",
        management: "渠道管理",
        setting: "修改密码"
      }
    };
  },
  methods: {
    handleSelect(index, indexPath) {
      this.$emit("addTab", this.tabName[index]);
    }
  }
};
</script>

