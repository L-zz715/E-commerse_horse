<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col :span="4">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!-- 下面这一个column添加的是展开链 可以用来展开三级菜单-->
        <el-table-column type="expand" width="50px">
          <template slot-scope="scope">
            <el-row
              :class="index1 === 0 ? 'bdtop' : ''"
              class="bdbottom"
              v-for="(cObj1, index1) in scope.row.children"
              :key="cObj1.id"
            >
              <!-- 渲染一级权限 col一共有24列-->
              <el-col :span="5">
                <el-tag
                  size="mini"
                  closable
                  @close="removeRightsById(scope.row, cObj1.id)"
                >
                  {{ cObj1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级，三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(cObj2, index2) in cObj1.children"
                  :key="cObj2.id"
                  :class="index2 === 0 ? '' : 'bdtop'"
                >
                  <!--二级 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      size="mini"
                      closable
                      @close="removeRightsById(scope.row, cObj2.id)"
                    >
                      {{ cObj2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      size="mini"
                      closable
                      @close="removeRightsById(scope.row, cObj3.id)"
                      v-for="(cObj3, index3) in cObj2.children"
                      :key="cObj3.id"
                      :class="index3 === 0 ? '' : 'bdtop'"
                    >
                      {{ cObj3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{ scope.row }}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 下面这一个column添加的是索引链 每一列添加索引1，2，3.。。-->
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <!-- 分配角色按钮 -->

            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightsDialog(scope.row)"
            >
              分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightsDialogVisible"
        width="50%"
        @close="setRightsDialogClosed"
      >
        <!-- 树形控件 -->
        <el-tree
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :data="rightsList"
          :props="rightsProps"
          :default-checked-keys="defKeys"
          ref="setRightsTreeRef"
        >
        </el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      setRightsDialogVisible: false,
      // 权限列表数据
      rightsList: [],
      // 树形控件的属性绑定对象
      rightsProps: {
        children: 'children',
        label: 'authName',
      },
      // 默认选中的节点id值数组
      defKeys: [],
      //当前即将被分配权限的角色id
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      // console.log('@@@', res)
      if (res.meta.status !== 200) {
        return this.$message.error('添加角色列表失败')
      }
      this.rolesList = res.data
    },
    // 根据id删除对应权限
    async removeRightsById(role, rightsId) {
      // 弹窗提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      // console.log(confirmResult)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightsId}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      role.children = res.data
      this.$message.success('删除权限成功')
    },
    // 展示分配权限的对话框
    async showSetRightsDialog(role) {
      this.roleId = role.id;

      // 获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.$message.success('获取权限数据成功')
      // 把获取到的数据保存在rightsList中
      this.rightsList = res.data
      // console.log(this.rightsList)
      // console.log('@@@',role.children)

      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)

      this.setRightsDialogVisible = true
    },

    // 通过递归形式获取角色下所有三级权限的id,并保存到defKeyss中
    getLeafKeys(node, arr) {
      // 如果当前节点不包含children属性，则它是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件，
    setRightsDialogClosed() {
      this.defKeys = []
    },
    // 实现权限分配
    async allotRights() {
      // 获得勾选项
      const keys = [
        ...this.$refs.setRightsTreeRef.getCheckedKeys(),
        ...this.$refs.setRightsTreeRef.getHalfCheckedKeys(),
      ]

      const idStr = keys.join(',')
      // console.log('@@@', keys)

      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})

      if(res.meta.status !== 200) {
        return this.$message.error("分配权限失败")
      }
      this.$message.success("分配权限成功")

      this.getRolesList();

      this.setRightsDialogVisible = false;
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 20px;
}

.bdtop {
  border-top: 1px solid #eee; //#eee
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.el-row {
  margin: 0 6%;
  display: flex;
  align-items: center;
}
</style>