<template>
  <div>
    <div class="c-panel">
      <div class="c-title">系统设置</div>
      <el-form :inline="false" size="mini" label-width="150px">
        <el-form-item label="签到增加积分：">
          <el-input
            v-model="integral.value"
            placeholder="请输入数值"
          ></el-input>
          <el-button
            style="margin-left: 31px"
            type="primary"
            @click="updateIntegral"
            >确定</el-button
          >
        </el-form-item>
        <el-form-item label="分销增加积分比：">
          <el-input
            v-model="fenxiao.value"
            placeholder="请输入百分比"
          ></el-input>
          <span style="margin-left: 10px">%</span>
          <el-button
            style="margin-left: 10px"
            type="primary"
            @click="updateFenxiao"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "system",
  data() {
    return {
      integral: {},
      fenxiao: {},
    };
  },
  methods: {
    // 修改积分
    updateIntegral() {
      if (this.integral.value < 0) {
        return this.sa.error2("数值不得小于0");
      }
      this.$post("/system/operateSigin", this.integral)
        .then(() => {
          this.sa.ok("修改成功");
          this.f5();
        })
        .catch(() => {
          this.sa.error2("修改失败");
        });
    },
    // 修改分销
    updateFenxiao() {
      if (this.fenxiao.value < 0) {
        return this.sa.error2("数值不得小于0");
      } else if (this.fenxiao.value > 100) {
        return this.sa.error2("数值不得大于100");
      }
      this.$post("/system/operateCommission", {
        ...this.fenxiao,
        value: this.fenxiao.value / 100,
      })
        .then(() => {
          this.sa.ok("修改成功");
          this.f5();
        })
        .catch(() => {
          this.sa.error2("修改失败");
        });
    },
    f5() {
      this.$get("/system/selectSetUpByType", {
        params: {
          type: 1, // 1.签到，2.提成
        },
      }).then((res) => {
        this.integral = res.data.data;
      });
      this.$get("/system/selectSetUpByType", {
        params: {
          type: 2, // 1.签到，2.提成
        },
      }).then((res) => {
        this.fenxiao = {
          ...res.data.data,
          value: res.data.data.value * 100,
        };
      });
    },
  },
  created() {
    this.f5();
  },
};
</script>

<style>
</style>