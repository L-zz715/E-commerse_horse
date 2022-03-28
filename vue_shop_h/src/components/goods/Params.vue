<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 警告区 -->
      <el-alert
        title="注意： 只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>

      <!-- 选择商品分类区 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>

          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="handleCateListChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!--   tab页签区域  -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddParamDialog"
            >添加参数</el-button
          >
          <!-- 动态列表 -->
          <el-table
            :data="manyTableData"
            border
            stripe
            empty-text="暂无数据"
            :show-header="hasData(manyTableData)"
          >
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- {{ scope.row }} -->

                <el-tag
                  size="mini"
                  closable
                  @close="removeTag(index, scope.row)"
                  v-for="(val, index) in scope.row.attr_vals"
                  :key="index"
                >
                  {{ val }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引链 -->
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParamDialog(scope.row)"
                  >修改</el-button
                >
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddParamDialog"
          >
            添加属性</el-button
          >
          <!-- 静态列表 -->
          <el-table
            :data="onlyTableData"
            border
            stripe
            empty-text="暂无数据"
            :show-header="hasData(onlyTableData)"
          >
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- {{ scope.row }} -->
                <el-tag
                  size="mini"
                  closable
                  @close="removeTag(index, scope.row)"
                  v-for="(val, index) in scope.row.attr_vals"
                  :key="index"
                >
                  {{ val }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引链 -->
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParamDialog(scope.row)"
                  >修改</el-button
                >
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数对话框 -->
      <el-dialog
        :title="`添加${titleText}`"
        :visible.sync="addParamDialogVisible"
        width="50%"
        @close="addParamDialogClosed"
      >
        <!-- 参数对话框表单 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
        >
          <!-- prop 名称看接口找的数据对应名称 -->
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addParamDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改参数对话框 -->
      <el-dialog
        :title="`修改${titleText}`"
        :visible.sync="editParamDialogVisible"
        width="50%"
        @close="editParamDialogClosed"
      >
        <!-- 参数对话框表单 -->
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="100px"
        >
          <!-- prop 名称看接口找的数据对应名称 -->
          <el-form-item :label="titleText" prop="attr_name">
            <template slot="scope"></template>
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editParamDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
      // 级联选择框的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //   被激活的页签名称
      activeName: 'many',
      manyTableData: [], //动态参数数据
      onlyTableData: [], //静态参数数据
      addParamDialogVisible: false,
      addForm: {}, //添加参数表单数据对象
      addFormRules: {
        //添加参数表单验证规则数据对象
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 10,
            message: '参数名的长度在2~10',
            trigger: 'blur',
          },
        ],
      },
      editParamDialogVisible: false,
      editForm: {}, //修改参数表单数据对象
      editFormRules: {
        //修改参数表单验证规则数据对象
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 10,
            message: '参数名的长度在2~10',
            trigger: 'blur',
          },
        ],
      },
      // inputVisible: false, //控制按钮与文本框的切换
      // inputValue: '', //文本框中输入的内容,
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    //   如果按钮需要被禁用，则返回true， 否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 当前选中的三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        // console.log('###', this.selectedCateKeys[2])
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
  methods: {
    //   获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      // console.log('@@@', res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.$message.success('获取商品分类列表成功')
      this.cateList = res.data
    },
    //   级联选择框选中项变化，会触发这个函数
    handleCateListChange() {
      this.getParamsData()
    },
    // tab页签的点击事件处理函数
    handleTabClick() {
      this.getParamsData()
    },

    // 获取参数的列表数据
    async getParamsData() {
      // console.log(this.selectedCateKeys)
      //   判断选中的是不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return this.$message.error('只允许为第三级分类设置相关参数！')
      }
      // console.log(this.cateId)
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数属性列表失败')
      }
      this.$message.success('获取参数属性列表成功')

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })

      // 判断获取的数据是静态还是动态表格然后再挂载
      if (this.activeName === 'many') {
        this.manyTableData = res.data
        // console.log("@@@###",this.manyTableData)
      } else {
        this.onlyTableData = res.data
        // console.log("@@@###",this.onlyTableData)
      }
    },
    hasData(tableData) {
      if (tableData.length !== 0) {
        return true
      }
      return false
    },
    showAddParamDialog() {
      this.addParamDialogVisible = true
    },
    addParamDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加参数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')

        this.addParamDialogVisible = false
        this.getParamsData()
      })
    },
    async showEditParamDialog(rowInfo) {
      // this.editForm = rowInfo
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${rowInfo.attr_id}`,
        { params: { attr_sel: this.activeName } }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('查询参数失败')
      }
      this.$message.success('查询参数成功')

      this.editForm = res.data

      this.editParamDialogVisible = true
    },
    editParamDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editParams() {
      // 编辑预验证
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return

        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')

        this.getParamsData()
        this.editParamDialogVisible = false
      })
    },
    // 根据id删除对应参数
    async removeParam(id) {
      const confirmResult = await this.$confirm(
        '此操作将永远删除该参数，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      // 删除逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')

      this.getParamsData()
    },

    showInput(rowInfo) {
      rowInfo.inputVisible = true
      // 页面渲染完毕后再执行回调中的内容
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 文本框失去焦点或摁下enter都会触发
    async handleInputConfirm(rowInfo) {
      if (rowInfo.inputValue.trim().length === 0) {
        rowInfo.inputVisible = false
        rowInfo.inputValue = ''
        return
      }

      // 没有return 要进行后续的添加tag操作
      rowInfo.attr_vals.push(rowInfo.inputValue.trim()) //前端展示新增

      // 加入到后台，，发起请求保存操作
      this.saveAttrVals(rowInfo)

      rowInfo.inputValue = ''
      rowInfo.inputVisible = false
    },
    // 将对 tag  attr_vals 的操作保存到数据库
    async saveAttrVals(rowInfo) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${rowInfo.attr_id}`,
        {
          attr_name: rowInfo.attr_name,
          attr_sel: rowInfo.attr_sel,
          attr_vals: rowInfo.attr_vals.join(','),
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('添加参数tag失败')
      }
      this.$message.success('添加参数tag成功')
    },

    // 删除参数的tag项
    removeTag(tagIn, rowInfo) {
      rowInfo.attr_vals.splice(tagIn, 1) //从index tagIn处删除1个元素
      this.saveAttrVals(rowInfo)
    },
  },
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 15px;
}

.input-new-tag {
  width: 120px;
}
</style>