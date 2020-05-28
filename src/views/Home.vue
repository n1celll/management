<template>
  <div class="layout">
    <Header @userInfo="setuserInfo"></Header>
    <div class="next-header">
      <div class="left-side">
        <aside-nav @addTab="changeValue" :userInfo="userInfo"></aside-nav>
      </div>
      <div class="right-side">
        <div class="tab">
          <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
            <el-tab-pane
              v-for="(index, value) in editableTabs"
              :key="value"
              :label="index"
              :name="index"
            ></el-tab-pane>
          </el-tabs>
          <div class="mian">
            <div v-show="editableTabsValue=='修改密码'">
              <setting></setting>
            </div>
            <div v-show="editableTabsValue == '营收数据'">
              <sale-data :userInfo="userInfo" @allChannel="allChannel"></sale-data>
            </div>
            <div v-show="editableTabsValue == '渠道管理'">
              <management :channels="channels"></management>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less"></style>

<script>
import AsideNav from "../components/AsideNav";
import Header from "../components/Header";
import Setting from "../components/Setting";
import SaleData from "../components/SaleData";
import Management from "../components/Management";

export default {
  data() {
    return {
      editableTabsValue: "营收数据",
      editableTabs: ["营收数据"],
      tabIndex: 1,
      userInfo:{},
      channels: []
    };
  },
  created() {},
  methods: {
    allChannel(channels) {
      this.channels = channels;
    },
    addTab(targetName) {
      if (this.editableTabs.indexOf(targetName) == -1) {
        this.editableTabs.push(targetName);
      }
      this.editableTabsValue = targetName;
    },
    setuserInfo(userInfo) {
      this.userInfo = userInfo;
    },

    removeTab(targetName) {
      this.editableTabs.splice(this.editableTabs.indexOf(targetName), 1);
      if (this.editableTabsValue.length > 0) {
        this.editableTabsValue = this.editableTabs[0];
      }
    },
    changeValue(tabName) {
      this.addTab(tabName);
    }
  },
  components: {
    AsideNav,
    Header,
    Setting,
    Management,
    SaleData
  }
};
</script>
<style lang="less" scoped>
.layout {
  height: 100%;
}
.next-header {
  height: 100%;
  display: flex;
  .left-side {
    width: 300px;
    position: relative;
    height: 100%;
  }

  .right-side {
    width: 100%;
    .tab {
      height: 100%;
      margin-top: 10px;
      padding-left: 30px;
      padding-right: 30px;
    }
  }
}
</style>
