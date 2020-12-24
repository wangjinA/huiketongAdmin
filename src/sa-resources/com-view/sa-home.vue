<style scoped>
.vue-box {
  display: flex;
  flex-direction: column;
  background-color: #eee;
  font-size: 14px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.content-box {
  margin: 1em;
  padding: 1em;
  background-color: #fff;
  color: #666;
}
.logo-wrap {
  flex: 1;
  margin: 1em;
  margin-top: 0;
  padding: 1em;
  background-color: #fff;
  color: #666;
}
.el-tag {
  border-radius: 1px;
}
/*800之下*/
@media (max-width: 800px) {
  .kapian {
    width: 100% !important;
    margin-right: 0px !important;
  }
  .saoma {
    display: none;
  }
}
/* markdown格式 */
.md-contetn {
  padding-left: 1.5em;
  line-height: 26px;
}
</style>
<style>
/* 多个ul时，切换那个啥 */
.md-contetn h4 {
  margin-left: -0.5em;
}
.md-contetn ul,
.md-contetn ol {
  padding-left: 1em;
}
.md-contetn pre {
  padding: 5px;
  background-color: #eee;
  font-family: "times new roman";
}
</style>

<template>
  <div class="vue-box">
    <!-- 欢迎 -->
    <div class="content-box">
      <div
        style="
          padding: 1em;
          border-left: 5px #2d8cf0 solid;
          background-color: #eee;
        "
      >
        <big><big>欢迎来到会客通后台管理系统 </big></big>
        <span style="display: inline-block; margin-left: 1em; color: #888">
          —— 解决客户需求，对接优质酒店</span
        >
      </div>
    </div>
    <div class="total-list">
      <div
        class="pay saleBgcolor data_list rflex"
        v-for="item in list"
        :key="item.name"
        :style="{ backgroundColor: item.color }"
      >
        <div class="leftItem cflex wflex">
          <p class="investor">{{ item.name }}</p>
          <p class="number">
            <v-countup :end-value="form[item.key]"></v-countup
            ><small>{{ item.company }}</small>
          </p>
        </div>
        <div class="rightItem">
          <i :class="item.icon"> </i>
        </div>
      </div>
    </div>
    <!-- 介绍 -->
    <div class="logo-wrap" style="text-align: center; padding: 40px 0">
      <img src="@/assets/images/logo.png" style="width: 30%" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        user: 0,
        hotel: 0,
        hotelCreate: 0,
        hotelSettle: 0,
        huiyi: 0,
        hunyan: 0,
      },
      list: [
        {
          name: "用户总数",
          key: "user",
          company: "人",
          color: "#FFA3A1",
          icon: "el-icon-s-custom",
        },
        {
          name: "酒店总数",
          key: "hotel",
          company: "家",
          color: "#84D9D2",
          icon: "el-icon-s-shop",
        },
        {
          name: "会议订单",
          key: "huiyi",
          company: "条",
          color: "#93B7E3",
          icon: "el-icon-s-order",
        },
        {
          name: "婚宴订单",
          key: "hunyan",
          company: "条",
          color: "#EDAFDA",
          icon: "el-icon-s-order",
        },
        {
          name: "酒店创建",
          key: "hotelCreate",
          company: "条",
          color: "#87DE75",
          icon: "el-icon-circle-plus",
        },
        {
          name: "酒店入驻",
          key: "hotelSettle",
          company: "条",
          color: "#A5E7F0",
          icon: "el-icon-success",
        },
        // http://www.jiouai.com/permission/index/index
      ],
    };
  },
  methods: {
    f5() {
      // 用户
      this.$post("/api/user/getUserDataList", {
        current: 1,
        pageSize: 1,
      }).then((res) => {
        this.form.user = res.data.data.total;
      });
      // 酒店
      this.$post("/hotel/getHotelDataList", {
        current: 1,
        pageSize: 1,
      }).then((res) => {
        this.form.hotel = res.data.data.total;
      });
      // 创建
      this.$post("/hotel/getHoteInfolList", {
        current: 1,
        pageSize: 1,
        status: 1, // 审核状态 0全部 1.待审核，2审核通过 3 审核不通过
      }).then((res) => {
        this.form.hotelCreate = res.data.data.total;
      });
      // 入驻
      this.$post("/hotel/getAuditHotelList", {
        current: 1,
        pageSize: 1,
      }).then((res) => {
        this.form.hotelSettle = res.data.data.total;
      });

      this.$get("/demand/getDemandDataList", {
        params: {
          current: 1,
          pageSize: 1,
        },
      }).then((res) => {
        this.form.huiyi = res.data.data.total;
      });

      // 婚宴订单
      this.$get("/demand/getWeddingBanquet", {
        params: {
          current: 1,
          pageSize: 1,
        },
      }).then((res) => {
        this.form.hunyan = res.data.data.total;
      });
    },
  },
  created() {
    this.f5();
    if(process.env.NODE_ENV === "production"){
      this.timer = setInterval(this.f5, 1000);
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>


<style scoped>
.total-list {
  display: grid;
  padding: 1em;
  margin: 1em;
  margin-top: 0;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  background-color: #fff;
}
.data_list {
  text-align: center;
  font-size: 14px;
  border-radius: 6px;
  padding: 10px 6%;
  color: #fff;
  height: 80px;
  background-color: #ffa3a1;
}
.leftItem {
  align-items: start;
  justify-content: space-between;
  text-align: left;
}
.investor {
  font-size: 20px;
  font-weight: 700;
}
.number {
  font-size: 22px;
  font-weight: bold;
}
.rightItem {
  width: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}
.rflex {
  display: flex;
  flex-direction: row;
}
.cflex {
  display: flex;
  flex-direction: column;
}
.wflex {
  flex: 1;
}
</style>