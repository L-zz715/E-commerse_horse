<template>
  <!-- 这个添加分类的部分选择有问题还没做好 -->
  <!-- 面包屑导航区 -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <tree-table
        class="treeTable"
        :data="goodsList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text=""
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 列 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deleted"
            style="color: green"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序列 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <!-- {{scope.row}} -->
          <!-- 修改按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
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

    <!-- 添加分类弹窗 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatDialogVisible"
      width="50%"
      @close="addCatDialogClosed"
    >
      <!-- 主体区域 -->
      <!-- 分类表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="90px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- props 用来指定配置对象 v-model 选中的值双向绑定到data中，只能绑定数组-->
          <!--  change-on-select -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类弹窗 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCatDialogVisible"
      width="50%"
      @close="editCatDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      goodsList: [],
      queryInfo: {
        //查询条件
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          //   表示，将当前列定义为模板列
          type: 'template',
          //   表示当前这一列使用模板名称
          template: 'isok',
        },
        {
          label: '排序',
          //   表示，将当前列定义为模板列
          type: 'template',
          //   表示当前这一列使用模板名称
          template: 'order',
        },
        {
          label: '操作',
          //   表示，将当前列定义为模板列
          type: 'template',
          //   表示当前这一列使用模板名称
          template: 'opt',
        },
      ],
      total: 0,
      addCatDialogVisible: false,
      addCateForm: {
        //   将要添加的分类的名称
        cat_name: '',
        // 父级分类的名称 默认设置为0
        cat_pid: 0,
        // 分类等级，默认添加的是1级分类
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 10,
            message: '分类名的长度在3~10',
            trigger: 'blur',
          },
        ],
      },

      //   父级分类的列表
      parentCateList: [],
      //   指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
      //   选中的父类分级的id数组
      selectedKeys: [],
      editCatDialogVisible: false,
      editForm: {
        cat_name: '',
      },
      editFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 10,
            message: '分类名的长度在3~10',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getGoodesList()
  },
  methods: {
    async getGoodesList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })

      if (res.meta.status !== 200) {
        this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')

      this.goodsList = res.data.result

      this.total = res.data.total

      console.log(res)
    },

    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getGoodesList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getGoodesList()
    },
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      this.addCatDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据列表失败')
      }
      this.$message.success('获取父级分类数据列表成功')
      this.parentCateList = res.data
    },
    // 选择项发生变换触发这个函数
    parentCateChange() {
      console.log('###', this.selectedKeys)
      // 如果selectedKeys数组的length大于0，证明选中了父级分类
      // 反之就是没有选中父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，添加新的分类
    addCate() {
      // console.log('sdfaf', this.addCateForm)
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        console.log(res)

        if (res.meta.status !== 201) {
          return this.$message.error('添加新分类失败')
        }
        this.getGoodesList()
        this.addCatDialogVisible = false
        this.$message.success('添加新分类成功')
      })
    },
    addCatDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },

    // 展示分类窗口
    async showEditDialog(id) {
      // console.log(id)
      // 查询cat id 获得分类
      const { data: res } = await this.$http.get(`categories/${id}`)
      // console.log(res)
      this.editForm = res.data

      this.editCatDialogVisible = true
    },

    editCatDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    // 确认修改分类名
    editCate() {
      // console.log(this.editForm)

      // 预验证
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        // 修改请求
        const { data: res } = await this.$http.put(
          `categories/${this.editForm.cat_id}`,
          this.editForm
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户失败')
        }
        this.getGoodesList()
        this.editCatDialogVisible = false
        this.$message.success('更新用户成功')
      })
    },
    // 删除分类
    async removeCateById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      // 执行删除操作
      const { data: res } = await this.$http.delete(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('删除分类成功')
      this.getGoodesList()
    },
  },
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>