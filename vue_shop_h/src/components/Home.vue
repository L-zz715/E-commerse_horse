<template>
  <!-- 标签就是类名 -->
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <!-- :unique-opened加冒号变为表达式，或者直接写unique-opened 表示启用这个属性 -->
      <el-aside :width="isCollapse? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse" >|||</div>

        <el-menu
          
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
        <!-- 一级菜单 -->
          <el-submenu v-for="(m,index) in menulist" :key="m.id" :index="`${index}+1`">
            <template slot="title">
                <!-- 图标 -->
              <i :class="`iconfont ${iconObj[m.id]}`"></i>
              <span>{{m.authName}}</span>
            </template>
        <!-- 二级菜单 -->          
            <el-menu-item v-for="c in m.children" :key="c.id" :index="`/${c.path}`"
            @click="saveNavState(c.path)" >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{c.authName}}</span>
              </template>
            </el-menu-item>
            
          </el-submenu>

        
        </el-menu>
      </el-aside>
      <!-- 右侧内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data(){
      return{
          menulist:[],
          iconObj:{
            '125':'icon-users',
            '103':'icon-tijikongjian',
            '101':'icon-shangpin',
            '102':'icon-danju',
            '145':'icon-baobiao',
          },
          isCollapse:false,
          activePath:'',

      }
  },
  created(){
      this.getMenuList();
      this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    logOut() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    // 获取所有的菜单
    async getMenuList(){
        const {data:res} = await this.$http.get('menus');
        console.log(res)
        if(res.meta.status !== 200) return this.$message.console.error(res.meta.msg);
        this.menulist = res.data;
    },
    // 实现菜单的水平折叠与否
    toggleCollapse(){
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(path){
      window.sessionStorage.setItem('activePath','/' + path);
     
    }
  },
}
</script>

<style lang="less">
.el-container {
  height: 100%;
}

.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;
    span {
        margin-left: 15px;
    }
  }
}

.el-aside {
  background: #333744;
  .el-menu {
    border-right:none;  //解决侧边没有对齐问题
  }
}

.el-main {
  background: #eaedf1;
}


.iconfont{
  margin-right: 10px;
}

.toggle-button{
  background-color: #4A5064;
  color: #FFF;
  text-align: center;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>