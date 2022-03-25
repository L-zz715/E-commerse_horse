<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="25%"
        class="login_form"
      >
        <el-form-item label="用户：" prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 2,
            max: 25,
            message: '长度在 1 到 25 个字符',
            trigger: 'blur',
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 4,
            max: 16,
            message: '长度在 7 到 16 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        // valid 是个boolean值，通过validate进行预验证表单提交成功还是失败了
        console.log(valid)
        // 根据验证结果决定是否发起请求
        if (!valid) return

        // const result = this.$http.post("login",this.loginForm)
        // console.log(result)

        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')

        // 将登录成功后的token保存到sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 编程式导航页面跳转
        this.$router.push('/home')
      })
    },
  },
  mounted() {
    console.log(this)
  },
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background: #2b4b6b;
}

.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  justify-content: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    //less  的语法嵌套
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    top: -25%;
    transform: translateX(-50%);
    background: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }
}

.btns {
  // float: right;
  display: flex;
  justify-content: flex-end;
}

.login_form {
  width: 90%;
  position: absolute;
  bottom: 0;
}
</style>
