<template>
  <div class="vue-box">
    <div class="c-panel">
      <!-- 参数栏 -->
      <div class="c-title">酒店列表</div>
      <el-form :inline="true" size="mini">
        <!-- <el-form-item label="酒店名称：">
          <el-input v-model="p.username" placeholder="模糊查询"></el-input>
        </el-form-item>
        <el-form-item label="管理员：">
          <el-input v-model="p.username" placeholder="模糊查询"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="p.username" placeholder="模糊查询"></el-input>
        </el-form-item>
        <el-form-item label="注册日期：">
          <el-date-picker
            v-model="p.start_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
          ></el-date-picker>-
          <el-date-picker
            v-model="p.end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item style="min-width: 0px;">
          <el-button type="primary" icon="el-icon-search" @click="p.pageNo = 1; f5()">查询</el-button>
        </el-form-item>
        <br /> -->
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
        <el-table-column label="编号" prop="id" width="70px"></el-table-column>
        <el-table-column label="酒店名" prop="hotelName"></el-table-column>
        <el-table-column label="所在城市" prop="city"></el-table-column>
        <el-table-column label="详细地址" prop="address"></el-table-column>
        <el-table-column label="总机号码" prop="htelPhone"></el-table-column>
        <el-table-column label="酒店星级" prop="starType"></el-table-column>
        <el-table-column label="客房总数" prop="guestRoom"></el-table-column>
        <el-table-column label="联系人姓名" prop="contacts"></el-table-column>
        <el-table-column label="联系电话" prop="phone"></el-table-column>
        <!-- <el-table-column label="已接单" prop="yfb">
          <template slot-scope="{row}">{{row.yfb}}条</template>
        </el-table-column>
        <el-table-column label="已成交" prop="ycj">
          <template slot-scope="{row}">{{row.ycj}}单</template>
        </el-table-column> -->
        <el-table-column label="是否推荐" prop="recommend">
          <template slot-scope="s">
            <el-switch
              v-model="s.row.recommend"
              :active-value="true"
              :inactive-value="false"
              @change="setRecommend(s.row)"
            ></el-switch>
            <span style="color: #999;" v-if="s.row.recommend">推荐</span>
          </template>
        </el-table-column>
        <el-table-column label="是否签约" prop="signing">
          <template slot-scope="s">
            <el-switch
              v-model="s.row.signing"
              :active-value="true"
              :inactive-value="false"
              @change="setSigning(s.row)"
              active-color="#13ce66"
            ></el-switch>
            <span style="color: #999;" v-if="s.row.signing">签约</span>
          </template>
        </el-table-column>
        <el-table-column label="签约比例" prop="rebate">
          <template slot-scope="{row}">
            <!-- <span style="color: #999;">{{s.row.rebate + '%' || 0}}</span> -->
            <div style="dispaly: flex;" :class="row.signing && 'rebateModal'">
              <template v-if="!row.isSetRebate">
                <span style="padding: 0 10px;">{{row.rebate}}%</span>
                <el-button class="isSetRebateBtn" type="primary" icon="el-icon-edit" circle size="mini" @click="row.isSetRebate = true"></el-button>
              </template>
              <template v-else>
                <el-input v-model="row.rebate" size="mini"></el-input>
                <el-button style="margin-top: 10px;" size="mini" type="success" @click="setRebate(row)">确认</el-button>
                <el-button size="mini" @click="row.isSetRebate = false">取消</el-button>
              </template>
            </div>
          </template>
          
        </el-table-column>
        <!-- <el-table-column prop="address" label="操作">
          <template slot-scope="s">
            <el-button class="c-btn" type="success" icon="el-icon-view" @click="get(s.row)">详情</el-button>
            <el-button class="c-btn" type="danger" icon="el-icon-delete" @click="del(s.row)">删除</el-button>
          </template>
        </el-table-column> -->
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
        username: "",
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
    setRebate(data) {
      this.$post('/hotel/setUpTheRebate', {
        id: data.id,
        rebate: data.rebate,
      }).then(()=>{
        this.sa.ok("修改成功");
        this.f5()
      }).catch(() => {
        this.sa.error2("修改失败");
      })
    },
    // 设置是否签约酒店
    setSigning(data) {
      this.$post('/hotel/setUpTheSigning', {
        id: data.id,
        signing: data.signing
      }).then(()=>{
        this.sa.ok("修改成功");
        this.setRebate({
          ...data,
          rebate: '10%'
        })
      }).catch(() => {
        this.sa.error2("修改失败");
      })
    },
    // 设置是否推荐
    setRecommend(data) {
      this.$post('/hotel/updateRecommend', {
        id: data.id,
        recommend:data.recommend
      }).then(()=>{
        this.sa.ok("修改成功");
      }).catch(() => {
        this.sa.error2("修改失败");
      })
    },
    // 数据刷新
    f5: function () {
      this.sa.loading("正在加载");
      this.$post("/hotel/getHotelDataList", {
        current: this.p.pageNo,
        pageSize: this.p.pageSize,
        userName: this.p.userName,
      })
        .then((res) => {
          this.dataList = res.data.data.list.map(item => ({
            ...item,
            isSetRebate: false,
          }));
          this.dataCount = res.data.data.total;
        })
        .finally(() => {
          this.sa.hideLoading();
        });
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
      console.log(data.name);
      var str = `
          <div>
            <p>酒店员工：3人</p>
            <p>小汪：1527048182 <span class="el-button c-btn el-button--danger" type="danger" icon="el-icon-delete" @click="del">删除</span></p>
            <p>小吴：1307276666 <span class="el-button c-btn el-button--danger" type="danger" icon="el-icon-delete" @click="del">删除</span></p>
            <p>小冲：1389997555 <span class="el-button c-btn el-button--danger" type="danger" icon="el-icon-delete" @click="del">删除</span></p>
          </div>
        `;
      this.sa.alert(str);
    },
  },
  created: function () {
    this.f5();
  },
};
</script>


<style scoped>
.isSetRebateBtn{
  display: none;
}
.rebateModal:hover .isSetRebateBtn{
  display: inline-block;
}
</style>