
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
      <div class="c-title">会议订单列表</div>
      <el-table :data="list" size="mini">
        <!-- <el-table-column prop="bannerId" label="编号" width="70px"></el-table-column> -->
        <el-table-column label="订单号" width="140">
          <template slot-scope="s">{{ s.row.orderNo  }}</template>
        </el-table-column>
        <el-table-column label="下单时间" width="150px">
          <template slot-scope="s">{{ s.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="会议日期" width="160px">
          <template slot-scope="s">
            {{ s.row.meetingStartTime }} - {{ s.row.meetingEndTime }}
            <!-- {{ s.row.startTime }} - {{ s.row.endTime }} -->
          </template>
        </el-table-column>
        <el-table-column label="参会人数">
          <template slot-scope="s">
            {{ JSON.parse(s.row.meetingPeople) | rs}} 
          </template>
        </el-table-column>
        <el-table-column label="参会公司名称">
          <template slot-scope="s">{{ s.row.userInfo && s.row.userInfo.companyName }}</template>
        </el-table-column>
        <el-table-column label="发单人">
          <template slot-scope="s">{{ s.row.userInfo && s.row.userInfo.contacts }}</template>
        </el-table-column>
        <el-table-column label="发单人联系电话">
          <template slot-scope="s">{{ s.row.userInfo && s.row.userInfo.phone }}</template>
        </el-table-column>
        <el-table-column label="接单商家">
          <template slot-scope="s">{{ s.row.hotel && s.row.hotel.hotelName }}</template>
        </el-table-column>
        <el-table-column label="接单人">
          <template slot-scope="s">{{ s.row.offerUserInfo && s.row.offerUserInfo.contacts }}</template>
        </el-table-column>
        <el-table-column label="接单时间">
          <template slot-scope="s">{{ s.row.orderTime }}</template>
        </el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="s">{{ s.row.status | getStatusText }}</template>
        </el-table-column>
        <el-table-column label="返回积分">
          <template slot-scope="s">{{ s.row. integral }}</template>
        </el-table-column>
        <el-table-column label="返回比率">
          <template slot-scope="s">{{ s.row.ratio ? `${s.row.ratio * 100}%` : '-' }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="s">
            <div v-if="s.row.status >= 4">
              <el-button
                class="c-btn"
                type="primary"
                icon=""
                @click="lookXfd(s.row)"
                >查看消费单</el-button
              >
            </div>
            <div v-if="s.row.status == 4">
              <el-button
                class="c-btn"
                type="success"
                icon=""
                @click="updateXfd(s.row)"
                >上传消费单</el-button
              >
            </div>
            <div v-if="s.row.status == 6">
              <el-button
                class="c-btn"
                type="success"
                icon=""
                @click="okOver(s.row)"
                >确认完成</el-button
              >
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="创建时间" width="150px">
          <template slot-scope="s">{{sa.forDate(s.row.createTime, 2)}}</template>
        </el-table-column> -->
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
    <div class="c-panel c-panel-add" v-if="xfdObj">
      <h4 class="c-title">上传消费单</h4>
      <el-form size="mini">
        <el-form-item label="消费单：">
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
        <el-form-item label="总消费金额：">
          <el-input v-model="m.price"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="c-label"></span>
          <el-button
            type="primary"
            size="mini"
            @click="commitXfd"
            >上传</el-button
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
import {getStatusText, rs} from './config'
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
      xfdObj: null,
    };
  },
  filters: {
    getStatusText,
    rs
  },
  methods: {
    okOver(row) {
      this.sa.confirm(`是否确认完成?<br/> 
      返回积分：<span style="color: #409EFF;">${row.integral}</span>  
      积分比率：<span style="color: #409EFF;">${row.ratio * 100}%</span>`, () => {
        this.$post('/demandorder/systemOrederComplete', {
          objId: row.meetingId,
          type: 1  // 1.会议，2.婚宴
        }).then(res => {
          console.log(res);
          this.sa.alert("确认成功");
          this.f5()
        })
      })
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
    commitXfd() {
      if(!this.m.price){
        return this.sa.error2("请输入价格");
      }else if(!this.m.integralImgStr.length){
        return this.sa.error2("请选择消费单图片");
      }
      this.sa.confirm("是否确认完成", () => {
        this.$post('/order/userDetermineQutoe', {
          invoiceUrl: JSON.stringify(this.m.integralImgStr.map(item => ({
            url: item
          }))),
          price: this.m.price,
          meetingId: this.xfdObj.meetingId,
        }).then(() => {
          this.sa.alert("上传成功");
          this.xfdObj = null
          this.f5()
        }).catch(() => {
          this.sa.error2("上传失败");
        })
      })
    },
    updateXfd(row) {
      this.xfdObj = row
      // this.m.integralImgStr = JSON.parse(row.orderDemandConfirm.userInvoice).map(item=>item.url)
      // this.m.price = row.orderDemandConfirm.price
    },
    // 查看消费单
    lookXfd(row) {
      const imgs = row.orderDemandConfirm.userInvoice
      let imgStr = "";
      if(imgs){
        let imgList = JSON.stringify(JSON.parse(imgs).map(item=>item.url))
        JSON.parse(imgs).forEach((item, index) => {
          imgStr += `
            <p style="display:inline-block; margin-right: 10px;">
              <img style="width: 100px;height:100px;object-fit:cover;" 
              src="${item.url}" onclick='showImageList(${imgList}, ${index})'/>
            </p>`
        })
      }
      var str = `
          <div>
						<p>消费金额：${row.orderDemandConfirm.price}</p>
						<p>消费单：</p>
						${imgStr}
          </div>
        `;
      this.sa.alert(str);
      
    },
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
      this.$get("/demand/getDemandDataList", {
        params: {
          current: this.p.pageNo,
          pageSize: this.p.pageSize,
        },
      }).then((res) => {
        this.list = res.data.data.list.map(item => ({
          meetingPeople: '[]',
          ...item,

        }))
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
