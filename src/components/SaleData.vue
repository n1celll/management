<template>
  <div>
    <div class="all" v-show="showAll || userInfo.level == 'user'">
      <div class="card">
        <img src="../assets/money.png" class="money-img" alt />
        <div class="block">
          <el-date-picker
            v-model="dataValue"
            type="daterange"
            value-format="yyyy-MM-dd"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getData"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
        <div class="data-block">
          <div class="block-left">
            <div class="aggregatetimemoney">￥ {{total}}</div>
            <div class="aggregatetimename">渠道总流水</div>
          </div>
          <div v-if="userInfo.level =='admin'" class="block-right">
            <div class="online">{{total_online}} 台</div>
            <div class="online-name">在线终端</div>
          </div>
        </div>
      </div>
      <div class="card" v-show="userInfo.level =='admin'">
        <div class="topContent">渠道流水</div>
        <el-divider></el-divider>
        <el-table :data="tableData">
          <el-table-column fixed prop="id" label="ID"></el-table-column>
          <el-table-column prop="channel_number" label="渠道号"></el-table-column>
          <el-table-column prop="channel_name" label="渠道名"></el-table-column>
          <el-table-column prop="username" label="用户"></el-table-column>
          <el-table-column prop="online_client" label="在线终端"></el-table-column>
          <el-table-column prop="total_amt" label="渠道流水"></el-table-column>
          <el-table-column prop="options" label="操作" width="250">
            <template slot-scope="scope">
              <el-button type="danger" @click="detail(scope.row.channel_number)">查看详情</el-button>
              <el-button type="warning" @click="download(scope.row.channel_number)">下载插件</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="card" v-show="!showAll || userInfo.level=='user'">
      <div class="allDetail">
        <el-button
          class="bkBtn"
          type="primary"
          icon="el-icon-arrow-left"
          @click="showAll=!showAll"
          v-if="userInfo.level=='admin'"
        >返回</el-button>
        <div class="detail">
          <div class="detailContent">
            <h3>渠道：{{ chosenChannel }} 共{{ totalLine }}条</h3>
          </div>
          <el-divider></el-divider>
          <div>
            <div class="block">
              <el-date-picker
                v-model="dataValue2"
                type="daterange"
                value-format="yyyy-MM-dd"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="detail(chosenChannel)"
                v-show="userInfo.level == 'admin'"
              ></el-date-picker>
            </div>
            <el-divider></el-divider>
            <el-table :data="detailData">
              <el-table-column fixed prop="id" label="id"></el-table-column>
              <el-table-column fixed prop="orid" label="订单号"></el-table-column>
              <el-table-column prop="price" label="订单金额"></el-table-column>
              <el-table-column prop="username" label="用户QQ"></el-table-column>
              <el-table-column prop="ordertime" label="充值时间"></el-table-column>
            </el-table>
            <el-button class="moreBtn" @click="getMore">查看更多</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["userInfo"],
  watch: {
    async userInfo() {
      if (this.userInfo.level == "user") {
        await this.detail(this.userInfo.channel_number);
        this.showDetail = true;
      } else {
        this.getData();
      }
    }
  },

  data() {
    var today = new Date();
    var y = today.getFullYear();
    var m = today.getMonth() + 1;
    var d = today.getDate();
    var t = `${y}-${m}-${d}`;
    return {
      dataValue: [t, t],
      dataValue2: [t, t],
      showAll: true,
      showDetail: false,
      chosenChannel: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, start]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      total: 0,
      total_online: 0,
      tableData: [],
      detailData: [],
      page: 1,
      pcount: 30,
      totalLine: 0
    };
  },
  methods: {
    rank(propertyName) {
      return function(object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value1 < value2) {
          return 1;
        } else if (value1 > value2) {
          return -1;
        } else {
          return 0;
        }
      };
    },
    //获取所有渠道数据
    getData() {
      this.dataValue2 = this.dataValue;
      //当为管理员权限时，可获取所有渠道数据
      if (this.userInfo.level == "admin") {
        var data = {};
        if (this.dataValue.length > 0) {
          data.start = this.dataValue[0];
          data.end = this.dataValue[1];
        }
        this.$http({
          method: "post",
          url: "/users/allchannel",
          data: data
        }).then(res => {
          if (res.data.status == 200) {
            this.tableData = res.data.data.list;
            this.tableData.sort(this.rank("total_amt"))
            this.$emit("allChannel", this.tableData);
            this.total = res.data.data.total;
          }
        });
      } else {
        //若不为管理员，则获取该用户渠道所有订单
        this.detail(this.userInfo.channel_number);
      }
    },
    //下载插件
    download(channel_number) {
      this.$message({
        message: "请求成功，请等待下载...",
        type: "success",
        duration: 3000
      });
      this.$http({
        method: "post",
        url: `/users/download`,
        data: {
          channel_number: channel_number
        }
      }).then(res => {
        if (res.data.status == 200) {
          window.open(res.data.data.url);
        }
      });
    },
    //获取该渠道所有订单信息
    async detail(channel_number) {
      this.page = 1; //调用该方法时，将page重设为1
      this.showAll = false;
      this.showDetail = true;
      this.chosenChannel = channel_number;
      var data = {
        number: channel_number,
        page: this.page,
        pcount: this.pcount
      };
      if (this.dataValue2.length > 0) {
        data.start = this.dataValue2[0];
        data.end = this.dataValue2[1];
      }
      const { data: res } = await this.$http({
        method: "post",
        url: "/users/channelDetail",
        data: data
      });
      if (res.status == 200) {
        this.detailData = res.data.list;
        this.totalLine = res.data.totla;
        if (this.userInfo.level == "user") {
          this.total = res.data.earning;
          this.chosenChannel = this.userInfo.channel_number;
          // for (var i = 0; i < this.detailData.length; i++) {
          //   this.total += parseInt(this.detailData[i].price);
          // }
        }
      }
    },
    async getMore() {
      this.page++;
      var data = {
        number: this.chosenChannel,
        page: this.page,
        pcount: this.pcount
      };
      data.start = this.dataValue2[0];
      data.end = this.dataValue2[1];
      const { data: res } = await this.$http({
        method: "post",
        url: "/users/channelDetail",
        data: data
      });
      if (res.status == 200) {
        if (res.data.list.length > 0) {
          this.detailData.push(...res.data.list);
          this.totalLine = res.data.totla;
          if (this.userInfo.level == "user") {
            this.total = 0;
            this.chosenChannel = this.userInfo.channel_number;
            for (var i = 0; i < this.detailData.length; i++) {
              this.total += parseInt(this.detailData[i].price);
            }
          }
        } else {
          this.$message({
            message: "没有更多",
            type: "warning",
            duration: 800
          });
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card {
  margin-top: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 5px 1px #dcdcdc;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .topContent {
    margin-top: 10px;
    font-size: 25px;
  }
  .money-img {
    margin-top: 10px;
  }
  .block {
    margin-top: 30px;
  }
  .data-block {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .block-left {
      margin-right: 20px;
      .aggregatetimemoney {
        font-size: 26px;
        margin-top: 20px;
        margin-bottom: 10px;
        color: #ffc600;
      }
      .aggregatetimename {
        font-size: 18px;
        color: #b3b3b3;
      }
    }
    .block-right {
      margin-left: 20px;
      .online {
        font-size: 26px;
        margin-top: 20px;
        margin-bottom: 10px;
        color: #fc5849;
      }
      .online-name {
        font-size: 18px;
        color: #b3b3b3;
      }
    }
  }

  .allDetail {
    display: flex;
    width: 100%;
    flex-direction: column;
    padding-top: 20px;
    .bkBtn {
      align-self: start;
    }
    .moreBtn {
      margin-top: 15px;
    }
  }
}
.all {
  height: 100%;
}
</style>
