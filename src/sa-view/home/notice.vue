<style scoped>
.td-img {
  width: 180px;
  height: 90px;
  cursor: pointer;
  vertical-align: middle;
}
.c-panel-add .td-img {
  width: 200px;
}
</style>

<template>
  <div class="vue-box">
    <div class="c-panel">
      <!-- 参数栏 -->
      <!-- <div class="c-title">检索参数</div>
      <el-form size="mini" :inline="true" @submit.native.prevent>
        <el-form-item label="内容：">
          <el-input v-model="p.title"></el-input>
        </el-form-item>
        <el-form-item style="min-width: 0px;">
          <el-button type="primary" icon="el-icon-search" @click="p.pageNo = 1; f5()">查询</el-button>
        </el-form-item>
        <br />
      </el-form>-->
      <!-- 数据栏 -->
      <div class="c-title">通知列表</div>
      <el-table :data="dataList" size="mini">
        <el-table-column prop="id" label="编号" width="70px"></el-table-column>
        <el-table-column label="内容">
          <template slot-scope="s">{{s.row.content}}</template>
        </el-table-column>
        <el-table-column label="商家 & 用户">
          <template slot-scope="s">
            <span style="color: #999;" v-if="s.row.type==1">商家</span>
            <span style="color: #999;" v-else>用户</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150px">
          <template slot-scope="s">{{sa.forDate(s.row.createTime, 2)}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="s">
            <!-- <el-badge class="item" :is-dot="s.row.is_update" style="margin: 5px 0;">
              <el-button class="c-btn" type="primary" icon="el-icon-edit" @click="update(s.row)">修改</el-button>
            </el-badge>-->
            <el-badge class="item" :is-dot="false" style="margin: 5px 0;">
              <el-button class="c-btn" type="danger" icon="el-icon-delete" @click="del(s.row)">删除</el-button>
            </el-badge>
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
    <!-- 添加一个 -->
    <div class="c-panel c-panel-add">
      <h4 class="c-title">添加一个</h4>
      <el-form size="mini" v-if="m">
        <el-form-item label="内容：">
          <el-input v-model="m.content" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="商家 & 用户：">
          <el-switch v-model="m.type" :active-value="1" :inactive-value="2"></el-switch>
          <span style="color: #999;" v-if="m.type === 1">商家</span>
          <span style="color: #999;" v-else>用户</span>
        </el-form-item>
        <!-- <el-form-item label="状态：">
					<el-switch v-model="m.status" :active-value="1" :inactive-value="2"></el-switch>
					<span style="color: #999;" v-if="m.status==1">显示</span>
					<span style="color: #999;" v-else>隐藏</span>
        </el-form-item>-->
        <el-form-item>
          <span class="c-label"></span>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">添加</el-button>
        </el-form-item>
      </el-form>
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
      dataList: [], // 数据集合
      m: {
        content: "",
        type: 2,
      },
      curr_m: null, // 当前操作的 m
    };
  },
  methods: {
    // 刷新
    f5() {
      this.$get("/notice/selectNoticePage", {
        params: {
          current: this.p.pageNo,
          pageSize: this.p.pageSize,
        },
      }).then((res) => {
        this.dataList = res.data.data.list;
        this.p.dataCount = res.data.data.total;
      });
    },
    // 保存
    add() {
      if (!this.m.content) {
        return this.sa.error2("请输入内容");
      }
      this.$post("/notice/inset", {
        content: this.m.content,
        type: this.m.type,
      }).then(() => {
        this.sa.alert("添加成功");
        this.m.content = "";
        this.f5();
      });
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
      this.sa.confirm("是否删除，此操作不可撤销", () => {
        this.$get("/notice/delete", {
          params: {
            id: data.id,
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
  },
  created() {
    this.f5();
  },
};
</script>

