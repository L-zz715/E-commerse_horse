<template>
  <!-- 面包屑导航区 -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 用户列表区 -->
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <!-- 下面这一个column添加的是索引链 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag type="" v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'rights',
  data() {
    return {
      rightsList: [],
      alevel: 0,
      tagList: [
        {
          level: 0,
          tagName: '一级',
          type: '',
        },
        {
          level: 1,
          tagName: '二级',
          type: 'success',
        },
        {
          level: 0,
          tagName: '三级',
          type: 'warning',
        },
      ],
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('添加权限列表失败')
      }
      this.rightsList = res.data
    },
    tagChose(level) {
      this.tagList.forEach((obj) => {
        if (obj.level === level) return obj.type
      })
    },
  },
}
</script>

<style>
</style>