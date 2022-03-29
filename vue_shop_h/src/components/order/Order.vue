<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索和添加区 -->
      <!-- gutter 设置col之间间隙 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList()"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表区 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <!-- 下面这一个column添加的是索引链 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="order_status" label="是否发货">
          <template slot-scope="scope">
            <span v-if="scope.row.order_status === '0'">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 修改地址按钮      -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditAddrBox(scope.row.id)"
            ></el-button>
            <!-- 进度按钮      "-->
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页控制 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddrDialogVisible"
      width="50%"
      @close="editAddrDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRoles"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"
          :props="{ expandTrigger: 'hover' }">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddrDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
  <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
      @close="progressDialogClosed"
    >
    <el-timeline :reverse="false">
    <el-timeline-item
      v-for="(p, index) in progressInfo"
      :key="index"
      :timestamp="p.time">
      {{p.context}}
    </el-timeline-item>
  </el-timeline>


  </el-dialog>



  </div>
</template>

<script>
import cityData from './citydata.js'

export default {
  name: 'Order',
  data() {
    return {
      orderList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      editAddrDialogVisible: false,
      addressForm: {
        address1: [],
        address2: '',
      },
      addressFormRoles: {
        address1: [
          {
            required: true,
            message: '请选择省市区县',
            trigger: 'blur',
          },
        ],
        address2: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur',
          },
        ],
      },
      cityData: cityData, // 或者简写一个cityData  如果名和值是一样
      progressDialogVisible:false, 
      progressInfo:[],
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.$message.success('获取订单列表成功')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showEditAddrBox(id) {
      this.editAddrDialogVisible = true
    },
    editAddrDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox(){
      // 快递的信息
      this.progressInfo = [
        {
          time: '2018-05-10 09:39:00  ',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
       
        {
          time: '2018-05-10 07:32:00  ',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 【北京海淀育新小区营业点】',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00  ',
          ftime: '2018-05-10 02:03:00',
          context: '快件在【北京顺义集散中心】已装车,准备发往 【北京海淀育新小区营业点】',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00  ',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 【北京顺义集散中心】',
          location: ''
        }
        
      ]
      console.log(this.progressInfo)
      this.progressDialogVisible = true
    },
    progressDialogClosed(){}

  },
}
</script>

<style lang="less" scoped>

.el-cascader{
  width: 100%;
}
</style>