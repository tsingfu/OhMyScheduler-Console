<template>
  <div id="wf_instance_manager">
    <!-- 第一行，搜索区 -->
    <el-row>
      <el-col :span="20">
        <el-form
          :inline="true"
          :model="wfInstanceQueryContent"
          class="el-form--inline"
        >
          <el-form-item label="工作流实例ID">
            <el-input
              v-model="wfInstanceQueryContent.wfInstanceId"
              placeholder="工作流实例ID"
            />
          </el-form-item>
          <el-form-item label="工作流ID">
            <el-input
              v-model="wfInstanceQueryContent.workflowId"
              placeholder="工作流ID"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="listWfInstances">查询</el-button>
            <el-button type="cancel" @click="onClickRest">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <div style="float:right;padding-right:10px">
          <el-button type="primary" @click="listWfInstances"
            >刷新状态</el-button
          >
        </div>
      </el-col>
    </el-row>

    <!-- 第二行，表单 -->
    <el-row>
      <el-table
        :data="wfInstancePageResult.data"
        style="width: 100%"
        :row-class-name="wfInstanceTableRowClassName"
      >
        <el-table-column prop="workflowId" label="工作流ID" width="80" />
        <el-table-column prop="workflowName" label="工作流名称" />
        <el-table-column prop="wfInstanceId" label="工作流实例ID" />
        <el-table-column prop="statusStr" label="状态" width="80" />
        <el-table-column prop="actualTriggerTime" label="触发时间" />
        <el-table-column prop="finishedTime" label="结束时间" />

        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="medium" @click="onClickShowDetail(scope.row)"
              >详情</el-button
            >
            <el-button size="medium" @click="onClickStop(scope.row)"
              >停止</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 第三行，分页插件 -->
    <el-row>
      <el-col :span="24">
        <el-pagination
          :total="this.wfInstancePageResult.totalItems"
          :page-size="this.wfInstancePageResult.pageSize"
          @current-change="onClickChangeInstancePage"
          layout="prev, pager, next"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "WFInstanceManager",
  data() {
    return {
      // 查询条件
      wfInstanceQueryContent: {
        appId: this.$store.state.appInfo.id,
        index: 0,
        pageSize: 10,
        wfInstanceId: undefined,
        workflowId: undefined,
      },
      // 查询结果
      wfInstancePageResult: {
        pageSize: 10,
        totalItems: 0,
        data: [],
      }
    };
  },
  methods: {
    listWfInstances() {
      let that = this;
      this.axios
        .post("/wfInstance/list", this.wfInstanceQueryContent)
        .then((res) => (that.wfInstancePageResult = res));
    },
    // 重置搜索条件
    onClickRest() {
      this.wfInstanceQueryContent.wfInstanceId = undefined;
      this.wfInstanceQueryContent.workflowId = undefined;
    },
    // 查看工作流详情
    onClickShowDetail(data) {
      console.log(data);
      this.$router.push({
        name: 'WorkflowInstanceDetail',
        params: {
          wfInstanceId: data.wfInstanceId
        }
      })
    },

    // 停止工作流
    onClickStop(data) {
      let that = this;
      let url =
        "/wfInstance/stop?wfInstanceId=" +
        data.wfInstanceId +
        "&appId=" +
        this.$store.state.appInfo.id;
      this.axios.get(url).then(() => {
        that.$message.success("停止成功");
        // 重新加载列表
        that.listInstanceInfos();
      });
    },
    // 换页
    onClickChangeInstancePage(index) {
      // 后端从0开始，前端从1开始
      this.wfInstanceQueryContent.index = index - 1;
      this.listWfInstances();
    },
    // 表单颜色
    wfInstanceTableRowClassName({ row }) {
      switch (row.status) {
        // 失败
        case 3:
          return "error-row";
        // 成功
        case 4:
          return "success-row";
        case 10:
          return "warning-row";
      }
    }
  },
  mounted() {
    this.listWfInstances();
  },
};
</script>

<style>

  svg{
    font-size: 10px;
    border: 1px solid red;
  }

  text {
    font-weight: 300;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
  }

  .node rect {
    stroke: #999;
    fill: #fff;
    stroke-width: 1.5px;
  }

  .edgePath path {
    stroke: #333;
    stroke-width: 1px;
  }

</style>
