<template>
  <div class="vue-box">
    <div class="c-panel">
      <!-- 参数栏 -->
      <div class="c-title">用户列表</div>
      <el-form :inline="true" size="mini">
        <el-form-item label="用户名：">
          <el-input v-model="p.userName" placeholder="模糊查询"></el-input>
        </el-form-item>
        <!-- <el-form-item label="手机号：">
					<el-input v-model="p.username" placeholder="模糊查询"></el-input>
				</el-form-item>
				<el-form-item label="公司名称：">
					<el-input v-model="p.username" placeholder="模糊查询"></el-input>
				</el-form-item>
				<el-form-item label="注册日期：">
					<el-date-picker v-model="p.start_time" type="date" value-format="yyyy-MM-dd" placeholder="开始日期"></el-date-picker> - 
					<el-date-picker v-model="p.end_time" type="date" value-format="yyyy-MM-dd" placeholder="结束日期"></el-date-picker>
        </el-form-item>-->
        <el-form-item style="min-width: 0px">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="
              p.pageNo = 1;
              f5();
            "
            >查询</el-button
          >
        </el-form-item>
        <br />
        <!-- <el-form-item label="综合排序：" class="s-radio-text">
					<el-radio-group v-model="p.sort_type">
						<el-radio :label="1">注册时间</el-radio>
						<el-radio :label="2">最近登录</el-radio>
						<el-radio :label="3">登陆次数</el-radio>
						<el-radio :label="4">最近签到</el-radio>
						<el-radio :label="5">签到次数</el-radio>
					</el-radio-group>
        </el-form-item>-->
      </el-form>
      <!-- <div class="c-title">数据列表</div> -->
      <el-table :data="dataList">
        <!-- <el-table-column label="编号" prop="id" width="70px" > </el-table-column> -->
        <el-table-column label="头像" prop="url">
          <template slot-scope="{ row }">
            <img
              :src="row.url"
              style="width: 50px; height: 50px"
              @click="sa.showImage(row.url)"
            />
          </template>
        </el-table-column>
        <el-table-column label="微信昵称" prop="name"></el-table-column>
        <el-table-column label="姓名" prop="contacts"></el-table-column>
        <!-- <el-table-column label="性别" prop="sex"></el-table-column> -->
        <el-table-column label="性别" prop="sex">
          <template slot-scope="{ row }">
            {{ row.sex ? "男" : "女 " }}
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column label="公司名称" prop="companyName"></el-table-column>
        <el-table-column label="邮箱" prop="finitude"></el-table-column>
        <el-table-column label="职位" prop="position"></el-table-column>
        <!-- <el-table-column label="出生日期" prop="dateBirth"></el-table-column> -->
        <!-- <el-table-column label="注册于" prop="creatTime"></el-table-column> -->
        <!-- <el-table-column label="已发布" prop="yfb">
					<template slot-scope="{row}">{{row.yfb}}条</template>
				</el-table-column>
				<el-table-column label="已成交" prop="ycj">
					<template slot-scope="{row}">{{row.ycj}}单</template>
        </el-table-column>-->
        <el-table-column label="积分" prop="integral">
          <template slot-scope="{ row }">
            <div style="dispaly: flex" class="integralModal">
              <template v-if="!row.isSetIntegral">
                <span style="padding: 0 10px">{{ row.integral }}</span>
                <el-button
                  class="isSetIntegralBtn"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  size="mini"
                  @click="
                    (row.oldIntegral = row.integral), (row.isSetIntegral = true)
                  "
                ></el-button>
              </template>
              <template v-else>
                <el-input v-model="row.integral" size="mini"></el-input>
                <el-button
                  style="margin-top: 10px"
                  size="mini"
                  type="success"
                  @click="updateIntegral(row)"
                  >确认</el-button
                >
                <el-button size="mini" @click="row.isSetIntegral = false, row.integral = row.oldIntegral"
                  >取消</el-button
                >
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="查看下级" prop="look">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="lookChild(row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="操作">
					<template slot-scope="s">
						<el-button class="c-btn" type="success"  icon="el-icon-view" @click="get(s.row)">详情</el-button>
						<el-button class="c-btn" type="danger" icon="el-icon-delete" @click="del(s.row)">删除</el-button>
					</template>
        </el-table-column>-->
      </el-table>
      <!-- 分页 -->
      <div class="page-box">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes, jumper"
          :current-page.sync="p.pageNo"
          :page-size.sync="p.pageSize"
          :total="dataCount"
          :page-sizes="[1, 10, 20, 30, 40, 50, 100]"
          @current-change="f5(true)"
          @size-change="f5(true)"
        ></el-pagination>
      </div>
    </div>
    <!-- 给layer打一波广告 -->
    <!-- <div class="c-panel" style="background-color: rgba(0,0,0,0);">
			layer：<el-link type="primary" href="http://layer.layui.com/" target="_blank">
				一个可以让你想到即可做到的JavaScript弹窗（层）解决方案
			</el-link>
    </div>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      p: {
        // 查询参数
        userName: "",
        create_type: 0,
        sort_type: 1,
        start_time:
          new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-1", // 本月一号
        end_time:
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate(), // 本月当日
        pageNo: 1,
        pageSize: 10,
      },
      dataCount: 0,
      dataList: [],
    };
  },
  methods: {
    lookChild(data) {
      this.$get("/api/user/getMyLowerLevel", {
        params: {
          userId: data.id,
        },
      }).then((res) => {
        let list = res.data.data.list;
        let str = list.map((item) => {
          console.log(item);
          return `
            <p>${item.contacts}：${item.phone}</p>
          `;
        });
        console.log(str);
        str = `
            <div>
              <p>邀请人数：${list.length}人</p>
              ${str}
            </div>
          `;
        this.sa.alert(str);
      });
    },
    updateIntegral(data) {
      if (data.integral < 0) {
        return this.sa.error2("数值错误");
      }
      const val = data.integral - data.oldIntegral;
      this.sa.loading("正在加载");
      this.$post("/api/user/updateUserIntegral", {
        id: data.id,
        integral: val,
      })
        .then(() => {
          this.sa.ok("修改成功");
          this.f5()
          data.isSetIntegral = false
        })
        .catch(() => {
          this.sa.error2("修改失败");
        })
        .finally(() => {
          setTimeout(() => {
            this.sa.hideLoading();
          }, 2000);
        });
    },
    // 数据刷新
    f5: function () {
      this.sa.loading("正在加载");
      this.$post("/api/user/getUserDataList", {
        current: this.p.pageNo,
        pageSize: this.p.pageSize,
        userName: this.p.userName,
      })
        .then((res) => {
          this.dataList = res.data.data.list.map((item) => ({
            ...item,
            isSetIntegral: false,
          }));
          this.dataCount = res.data.data.total;
        })
        .finally(() => {
          this.sa.hideLoading();
        });
      // this.sa.ajax2('/user/getList', this.p, function(res){
      // 	this.dataList = res.data;	// 数据
      // 	this.dataCount = res.dataCount;		// 分页
      // }.bind(this), {res: mockData});
    },
    // 删除
    del: function (data) {
      this.sa.confirm(
        "是否删除，此操作不可撤销",
        function () {
          this.sa.ajax2(
            "/user/delete?id=" + data.id,
            function () {
              this.sa.arrayDelete(this.dataList, data);
              this.sa.ok("删除成功");
            }.bind(this)
          );
        }.bind(this)
      );
    },
    // 查看
    get: function (data) {
      var str = "<div>";
      str += "<p>编号：" + data.id + "</p>";
      str += "<p>昵称：" + data.username + "</p>";
      str += "<p>性别：" + data.sex + "</p>";
      str +=
        "<p>当前状态：<b>" + (data.status == 1 ? "正常" : "禁用") + "</b></p>";
      str += "<p>注册方式：" + data.create_type + "</p>";
      str += "<p>注册时间：" + data.create_time + "</p>";
      str += "</div>";
      this.sa.alert(str);
    },
  },
  created: function () {
    this.f5();
  },
};
</script>

<style scoped>
.isSetIntegralBtn {
  display: none;
}
.integralModal:hover .isSetIntegralBtn {
  display: inline-block;
}
</style>