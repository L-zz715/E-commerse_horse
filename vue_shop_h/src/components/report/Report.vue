<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- echarts 展示区准备 -->
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 导入echarts
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  name: 'Report',
  data() {
    return {
      // 用来合并的数据
      options: {
        title: { text: '用户来源' },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross', label: { backgroundColor: '#E9EEF3' } },
        },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: [{ boundaryGap: false }],
        yAxis: [{ type: 'value' }],
      },
    }
  },
  async mounted() {
    //   dom挂载结束后才能初始化echarts实例，所以放在mounted钩子里
    var myChart = echarts.init(document.getElementById('main'))

    // 准备数据和配置项
    // 发起数据请求
    const { data: res } = await this.$http.get('reports/type/1')
    console.log(res)
    if (res.meta.status !== 200) {
      return this.$message.error('查询echart数据失败')
    }
    this.$message.success('查询echart数据成功')

    // 通过lodash进行对象的合并
    const result = _.merge(res.data, this.options)

    // 展示数据
    myChart.setOption(result)
  },
}
</script>

<style lang="less" scoped>
</style>