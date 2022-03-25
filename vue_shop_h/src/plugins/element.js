import Vue from 'vue'

// 弹窗提示组件 Message
import { Button, Form, FormItem, Message, Input } from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// Message 要进行全局挂载  $message 是个自定义属性
Vue.prototype.$message = Message
