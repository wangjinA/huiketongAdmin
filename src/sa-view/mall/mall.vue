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
      <div class="c-title">商品列表</div>
      <el-table :data="list" size="mini">
        <!-- <el-table-column prop="bannerId" label="编号" width="70px"></el-table-column> -->
        <el-table-column label="图片" width="300px">
          <template slot-scope="s">
            <img
              v-for="(item, index) in s.row.integralImgStr"
              :key="index"
              :src="item"
              class="td-img"
              title="点击预览"
              :style="index>0&&'margin-left:8px;'"
              @click="sa.showImageList(s.row.integralImgStr, index)"
            />
          </template>
        </el-table-column>
        <el-table-column label="商品名称" width="150px">
          <template slot-scope="s">{{ s.row.productName }}</template>
        </el-table-column>
        <el-table-column label="商品简介" width="150px">
          <template slot-scope="s">{{ s.row.introduce }}</template>
        </el-table-column>
        <el-table-column label="商品类型">
          <template slot-scope="s">
            <el-tag type="success" v-if="s.row.type == 1">实物商品</el-tag>
            <el-tag type="info" v-else>虚拟商品</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="兑换积分">
          <template slot-scope="s">{{ s.row.integral }}</template>
        </el-table-column>
        <!-- <el-table-column label="创建时间" width="150px">
          <template slot-scope="s">{{sa.forDate(s.row.createTime, 2)}}</template>
        </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="s">
            <el-badge
              class="item"
              :is-dot="s.row.is_update"
              style="margin: 5px 0"
            >
              <el-button
                class="c-btn"
                type="primary"
                icon="el-icon-edit"
                @click="updateBanner(s.row)"
                >修改</el-button
              >
            </el-badge>
            <el-badge class="item" :is-dot="false" style="margin: 5px 10px">
              <el-button
                class="c-btn"
                type="danger"
                icon="el-icon-delete"
                @click="del(s.row)"
                >删除</el-button
              >
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
      <h4 class="c-title">添加商品</h4>
      <el-form size="mini" v-if="m">
        <el-form-item label="商品图片：">
          <template v-if="m.integralImgStr && m.integralImgStr.length">
            <span
              style="position: relative; display: inline-block; margin-left: 20px"
              v-for="(item, index) in m.integralImgStr"
              :key="index"
            >
              <img
                :src="item"
                class="td-img"
                @click="sa.showImageList(m.integralImgStr, index)"
              />
              <i
                style="
                  position: absolute;
                  right: 3px;
                  top: 3px;
                  background: rgba(0, 0, 0, 0.2);
                  color: #fff;
                "
                class="el-icon-close"
                @click.stop="m.integralImgStr.splice(index, 1)"
              ></i>
            </span>
          </template>
          <span
            v-if="m.integralImgStr && m.integralImgStr.length"
            class="c-remark"
            >点击图片预览</span
          >
          <!-- <el-button type="primary" style="margin-left: 20px;" @click="selectImg">选择图片</el-button> -->
          <el-upload
            style="display: inline-block;"
            action
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">选择图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品名称：">
          <el-input v-model="m.productName"></el-input>
        </el-form-item>
        <el-form-item label="商品简介：">
          <el-input
            :autosize="{ minRows: 2, maxRows: 2 }"
            style="width: 500px"
            type="textarea"
            v-model="m.introduce"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品类型：">
          <el-switch
            v-model="m.type"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
          <span style="color: #999" v-if="m.type === 1">实物商品</span>
          <span style="color: #999" v-else>虚拟商品</span>
        </el-form-item>
        <el-form-item label="兑换积分：">
          <el-input v-model="m.integral"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态：">
					<el-switch v-model="m.status" :active-value="1" :inactive-value="2"></el-switch>
					<span style="color: #999;" v-if="m.status==1">显示</span>
					<span style="color: #999;" v-else>隐藏</span>
        </el-form-item>-->
        <el-form-item label="商品详情：">
          <div style="display: inline-block; width: 900px" id="edit"></div>
        </el-form-item>
        <el-form-item>
          <span class="c-label"></span>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="add"
            >{{ m.is_update ? "修改" : "添加" }}</el-button
          >
          <el-button
            type="info"
            v-if="m.is_update"
            size="mini"
            @click="
              m = {
                type: 1,
              }
              ,
              editor.txt.html('')
            "
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import E from "wangeditor";
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
    updateBanner(item) {
      this.m.integralProductId = item.integralProductId;
      this.m = {
        ...this.m,
        ...item,
        integralImgStr: [...item.integralImgStr],
        is_update: true,
      };
      this.editor.txt.html(item.detailedIntroduce || '')
      console.log(item);
      console.log(this);
      // this.$post("/banner/inset", item).then(() => {
      //   this.sa.alert("修改成功");
      //   this.f5();
      // });
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
    // 刷新
    f5() {
      this.getBanner();
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
    getBanner() {
      this.$get("/system/getIntegralPage", {
        params: {
          current: this.p.pageNo,
          pageSize: this.p.pageSize,
        },
      }).then((res) => {
        this.list = res.data.data.list.map((item) => ({
          ...item,
          integralImgStr: JSON.parse(item.integralImgStr),
        }));
        this.p.dataCount = res.data.data.total;
      });
    },
  },
  created() {
    this.f5();
  },
  mounted() {
    const editor = new E("#edit");
    editor.create();
    editor.config.customUploadImg = (resultFiles, insertImgFn) => {
      const formData = new FormData();
      formData.append("file", resultFiles[0]);
      this.$post("/api/user/uploadFile", formData).then((res) => {
        insertImgFn(res.data.data);
      });
    };
    this.editor = editor
  },
};
</script>

