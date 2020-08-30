<style scoped>
</style>

<template>
  <div class="vue-box">
    <div class="c-panel">
      <!-- 参数栏 -->
      <!-- <div class="c-title">检索参数</div>
      <el-form :inline="true" size="mini">
        <el-form-item label="酒店名称：">
          <el-input v-model="p.title" placeholder="模糊查询"></el-input>
        </el-form-item>
        <el-form-item label="酒店地址：">
          <el-input v-model="p.title" placeholder="模糊查询"></el-input>
        </el-form-item>
        <el-form-item style="min-width: 10px;">
          <el-button type="primary" icon="el-icon-search" @click="f5">查询</el-button>
        </el-form-item>
        <br />
      </el-form> -->
      <!-- 数据列表 -->
      <!-- <h4 class="c-title">列表</h4> -->
      <el-table class="data-table" :data="dataList">
        <el-table-column label="编号" prop="id" width="70px"></el-table-column>
        <el-table-column label="酒店名" prop="hotelName"></el-table-column>
        <el-table-column label="所在城市" prop="city"></el-table-column>
        <el-table-column label="详细地址" prop="address"></el-table-column>
        <el-table-column label="总机号码" prop="htelPhone"></el-table-column>
        <el-table-column label="酒店星级" prop="starType"></el-table-column>
        <el-table-column label="客房总数" prop="guestRoom"></el-table-column>
        <el-table-column label="联系人姓名" prop="contacts"></el-table-column>
        <el-table-column prop="address" label="操作" width="250px">
          <template slot-scope="s">
            <el-button class="c-btn" type="info" icon="el-icon-view" @click="get(s.row)">联系人信息</el-button>
            <el-button class="c-btn" type="success" icon="el-icon-check" @click="shenhe(s.row, 2)">同意</el-button>
            <el-button class="c-btn" type="danger" icon="el-icon-close" @click="shenhe(s.row, 3)">拒绝</el-button>
          </template>
        </el-table-column>
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

    <!-- 给wangEditor打一波广告 -->
    <!-- <div class="c-panel" style="background-color: rgba(0,0,0,0);">
			<li>
				wangEditor：
				<el-link type="primary" href="http://www.wangeditor.com/" target="_blank">
					基于javascript和css开发的 Web富文本编辑器， 轻量、简洁、易用、开源免费
				</el-link>
			</li>
			<li>
				在vue中集成示例：
				<el-link type="primary" href="https://www.kancloud.cn/wangfupeng/wangeditor3/335789" target="_blank">
					https://www.kancloud.cn/wangfupeng/wangeditor3/335789
				</el-link>
			</li>
    </div>-->

    <!-- 增改组件 -->
    <add-or-update ref="add-or-update"></add-or-update>
  </div>
</template>

<script>
import addOrUpdate from "./art-add.vue";
export default {
  components: {
    addOrUpdate,
  },
  data() {
    return {
      p: {
        // 查询参数
        id: "",
        title: "",
        sort_type: 0,
        pageNo: 1,
        pageSize: 10,
      },
      dataCount: 0, // 数据总数
      dataList: [], // 数据集合
    };
  },
  methods: {
    // 数据刷新
    f5: function () {
      this.sa.loading('正在加载')
      this.$post("/hotel/getHoteInfolList", {
        current: 1,
        pageSize: 20,
        status: 0, // 审核状态 0全部 1.待审核，2审核通过 3 审核不通过
      }).then((res) => {
        this.dataList = res.data.data.list;
        this.dataCount = res.data.data.total
      }).finally(()=>{
        this.sa.hideLoading()
      })
    },
    // 审核 2通过，3不通过
    shenhe(data, status) {
      let text = status == 2 ? "确认同意？" : "确认拒绝？";
      this.sa.confirm(text, () => {
        this.$post("/hotel/auditHotelStatus", {
          hotelId: data.id,
          status,
        });
      });
    },
    // 增加
    add: function () {
      this.$refs["add-or-update"].open(0);
    },
    // 修改
    update: function (data) {
      this.$refs["add-or-update"].open(data.id);
    },
    // 删除
    del: function (data) {
      this.sa.confirm(
        "是否删除，此操作不可撤销",
        function () {
          this.sa.ajax2(
            "/acticle/delete?id=" + data.id,
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
      let imgStr = "";
      if(data.sysUser.callingCard){
        let imgList = JSON.stringify(JSON.parse(data.sysUser.callingCard).map(item=>item.url))
        JSON.parse(data.sysUser.callingCard).forEach((item, index) => {
          imgStr += `
            <p>
              <img style="width: 200px;height:100px;object-fit:cover;" 
              src="${item.url}" onclick='showImageList(${imgList}, ${index})'/>
            </p>`
        })
      }
      var str = `
          <div>
						<p>联系人姓名：${data.sysUser.contacts}</p>
						<p>联系电话：${data.sysUser.phone}</p>
						<p>职位：${data.sysUser.position}</p>
						<p>邮箱：${data.sysUser.finitude}</p>
						<p>名片：</p>
						${imgStr}
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
