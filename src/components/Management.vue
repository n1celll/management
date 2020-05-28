<template>
  <div>
    <div class="card">
      <div class="addBtn">
        <el-button type="primary" round @click="registerChannel()">注册渠道</el-button>
      </div>

      <div style="margin-top: 5px;">渠道列表</div>
      <el-divider></el-divider>
      <el-table :data="channels">
        <el-table-column fixed prop="id" label="id" min-width="120"></el-table-column>
        <el-table-column fixed prop="username" label="账户" min-width="120"></el-table-column>
        <el-table-column fixed prop="level" label="等级" min-width="120"></el-table-column>
        <el-table-column prop="channel_name" label="渠道名" min-width="120"></el-table-column>
        <el-table-column prop="channel_number" label="渠道号" min-width="120"></el-table-column>
        <el-table-column prop="options" label="操作" min-width="145">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.banned"
              size="mini"
              type="success"
              round
              @click="banLine(scope.row)"
            >启用</el-button>
            <el-button v-else size="mini" type="danger" round @click="banLine(scope.row)">禁用</el-button>
            <el-button size="mini" type="primary" round @click="editLine(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑渠道" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.pwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.repwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="渠道名称" :label-width="formLabelWidth">
          <el-input v-model="form.channel_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cleanForm">取 消</el-button>
        <el-button v-if="addForm" type="primary" @click="submitAdd">确定添加</el-button>
        <el-button v-else type="primary" @click="submitForm">确定修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["channels"],
  data() {
    return {
      addForm: true,
      form: {
        username: "",
        channel_name: "",
        pwd: "",
        repwd: ""
      },
      row: {},
      dialogFormVisible: false,
      formLabelWidth: "120px"
    };
  },
  created() {},
  methods: {
    cleanForm() {
      this.form = {
        username: "",
        channel_name: "",
        pwd: "",
        repwd: "",
        channel_number: ""
      };
      this.dialogFormVisible = false;
    },
    addLine() {},
    registerChannel() {
      this.addForm = true;
      this.dialogFormVisible = true;
    },
    banLine(row) {
      var operation = row.banned ? "start" : "ban";
      this.$http({
        method: "post",
        url: "/users/operation",
        data: {
          channel_number: row.channel_number,
          operation: operation
        }
      }).then(res => {
        if (res.status == 200) {
          row.banned = !row.banned;
          this.$message({
            message: "操作成功",
            type: "warning",
            duration: 800
          });
        }
      });
    },
    editLine(row) {
      this.addForm = false;
      this.dialogFormVisible = true;
      this.form = row;
      this.row = row;
    },
    submitForm() {
      this.row.username = this.form.username;
      this.row.name = this.form.name;
      if (this.checkPwd() != 1) {
        this.$http({
          method: "put",
          url: "/users/operation",
          data: this.form
        }).then(res => {
          if (res.data.status == 200) {
            this.cleanForm();
            this.$message({
              message: "修改成功",
              type: "success",
              duration: 800
            });
          }
        });
      }
    },
    submitAdd() {
      if (this.checkPwd() != 1) {
        this.$http({
          method: "post",
          url: "/users/register",
          data: this.form
        }).then(res => {
          if (res.data.status == 200) {
            this.form.id = res.data.data.id;
            this.form.level = res.data.data.level;
            this.form.banned = res.data.data.banned;
            res.data.data.total_amt = 0;
            this.channels.push(res.data.data);
            this.$message({
              message: "注册成功",
              type: "success",
              duration: 800
            });
            this.cleanForm();
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
    checkPwd() {
      if (this.form.pwd.length < 6) {
        this.$message({
          message: "密码长度不能少于6位",
          type: "error",
          duration: 1000
        });
        return 1;
      }
      if (this.form.pwd != this.form.repwd) {
        this.$message({
          message: "两次输入密码不一致",
          type: "error",
          duration: 1000
        });
        return 1;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card {
  margin-top: 20px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0px 0px 5px 1px #dcdcdc;
  background-color: #ffffff;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .money-img {
    margin-top: 10px;
  }
  .block {
    margin-top: 30px;
  }
  #aggregatetimemoney {
    font-size: 26px;
    margin-top: 20px;
    margin-bottom: 10px;
    color: #ffc600;
  }
  #aggregatetimename {
    font-size: 18px;
    color: #b3b3b3;
  }
  .addBtn {
    margin-top: 10px;
    margin-left: 10px;
    align-self: start;
  }
}
</style>
