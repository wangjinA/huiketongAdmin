<style scoped>
.td-img {
  width: 50px;
  height: 50px;
  cursor: pointer;
  vertical-align: middle;
  object-fit: cover;
}
.c-panel-add .td-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
}
</style>

<template>
  <div class="vue-box">
    <div class="c-panel">
      <!-- 参数栏 -->
      <!-- <div class="c-title">检索参数</div>
			<el-form size="mini" :inline="true" @submit.native.prevent >
				<el-form-item label="标题：">
					<el-input v-model="p.title"></el-input>
				</el-form-item>
				<el-form-item style="min-width: 0px;">
					<el-button type="primary" icon="el-icon-search" @click="p.pageNo = 1; f5()">查询</el-button>
				</el-form-item>
				<br>
				<el-form-item label="排序：">
					<el-radio-group v-model="p.sort_type">
						<el-radio :label="0">排序值</el-radio>
						<el-radio :label="1">创建时间</el-radio>
						<el-radio :label="2">点击量</el-radio>
					</el-radio-group>
				</el-form-item>
      </el-form>-->
      <!-- 数据栏 -->
      <div class="c-title">商城订单列表</div>
      <el-table :data="list" size="mini">
        <!-- <el-table-column prop="bannerId" label="编号" width="70px"></el-table-column> -->
        <el-table-column label="联系人">
          <template slot-scope="s">{{ s.row.contact }}</template>
        </el-table-column>
        <el-table-column label="收获地址">
          <template slot-scope="s">{{ s.row.address }}</template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="s">{{ s.row.phone }}</template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="s">{{ s.row.integralProduct.productName }}</template>
        </el-table-column>
        <el-table-column label="商品简介">
          <template slot-scope="s">{{ s.row.integralProduct.introduce }}</template>
        </el-table-column>
        <el-table-column label="兑换所需积分" align="center">
          <template slot-scope="s">{{ s.row.integralProduct.integral }}</template>
        </el-table-column>
        <el-table-column label="商品类型">
          <template slot-scope="s">
            <el-tag type="success" v-if="s.row.integralProduct.type == 1">实物商品</el-tag>
            <el-tag type="info" v-else>虚拟商品</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态 / 操作">
          <template slot-scope="s">
            <div v-if="s.row.status === 0">
              <el-button
                class="c-btn"
                type="primary"
                icon=""
                @click="updateStatus(s.row)"
                >完成</el-button
              >
            </div>
            <div v-else>
              已完成
            </div>
            <!-- <el-badge class="item" :is-dot="false" style="margin: 5px 10px">
              <el-button
                class="c-btn"
                type="danger"
                icon="el-icon-delete"
                @click="del(s.row)"
                >删除</el-button
              >
            </el-badge> -->
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
          :total="p.dataCount"
          :page-sizes="[1, 10, 20, 30, 40, 50, 100]"
          @current-change="f5()"
          @size-change="f5()"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      p: {
        // 查询参数
        pageNo: 1,
        pageSize: 10,
        sort_type: 0,
        dataCount: 0,
      },
      bannerList: [], // 数据集合
      m: {
        // 添加信息
        is_update: false,
        integralProductId: "",
        productName: "",
        type: "",
        integral: "",
        integralImgStr: [],
      },
      curr_m: null, // 当前操作的 m
      list: [],
    };
  },
  methods: {
    updateStatus(item) {
      this.sa.confirm('确认完成', () => {
        this.$post('/system/updateIntegralOrder', {
          status: 1,
          integralOrderId: item.integralOrderId
        }).then(() => {
          this.sa.ok("修改成功");
          this.f5()
        })
      });
    },
    beforeUpload(file) {
      console.log(file);
      const formData = new FormData();
      formData.append("file", file);
      this.$post("/api/user/uploadFile", formData).then((res) => {
        this.m.integralImgStr = this.m.integralImgStr || [];
        this.m.integralImgStr.push(res.data.data);
      });
      return false;
    },
    // 保存
    add() {
      if (!this.m.integralImgStr || !this.m.integralImgStr.length) {
        return this.sa.error2("请选择商品图片");
      } else if (!this.m.productName) {
        return this.sa.error2("请输入商品名称");
      } else if (!this.m.introduce) {
        return this.sa.error2("请输入商品简介");
      } else if (!this.m.integral) {
        return this.sa.error2("请输入所需积分");
      } else if(!this.editor.txt.html()) {
        return this.sa.error2("请输入详情");
      }
      this.$post("/system/addOrUpdateIntegralProduct", {
        integralImgStr: JSON.stringify(this.m.integralImgStr),
        integralProductId: this.m.integralProductId,
        productName: this.m.productName,
        introduce: this.m.introduce,
        integral: this.m.integral,
        type: this.m.type,
        detailedIntroduce: this.editor.txt.html()
      }).then((res) => {
        console.log(res);
        this.sa.alert(this.m.is_update ? "修改成功" : "添加成功");
        this.m = {};
        this.f5();
        this.editor.txt.html('')
      });
      // var m = this.sa.copyJSON(this.m);
      // this.sa.ajax2(
      //   "/SysSwiper/add",
      //   m,
      //   function () {
      //     this.sa.alert(
      //       "添加成功",
      //       function () {
      //         this.dataList.push(m);
      //       }.bind(this)
      //     );
      //   }.bind(this)
      // );
    },
    // 修改
    update: function (data) {
      var data2 = this.sa.copyJSON(data);
      data2.create_time = undefined;
      this.sa.ajax2("/SysSwiper/update", data2, function () {
        this.sa.ok("修改成功");
        data.is_update = false;
      });
    },
    // 删除
    del(data) {
      console.log(data);
      this.sa.confirm("是否删除，此操作不可撤销", () => {
        this.$get("/system/delIntegralProduct", {
          params: {
            integralProductId: data.integralProductId,
          },
        })
          .then(() => {
            this.sa.alert("删除成功");
            this.f5();
          })
          .catch(() => {
            this.sa.alert("删除失败");
          });
      });
    },
    f5() {
      this.$get("/system/getIntegralOrderList", {
        params: {
          current: this.p.pageNo,
          pageSize: this.p.pageSize,
          type: 1 // 区分用户端或后台 0用户端 1后台
        },
      }).then((res) => {
        this.list = res.data.data.list
        this.p.dataCount = res.data.data.total;
      });
    },
  },
  created() {
    this.f5();
  },
};
</script>

