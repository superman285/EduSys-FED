import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store/*, { key }*/ from './store'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import './styles/index.scss'

createApp(App)
  .use(store/*, key*/)
  .use(router)
  .use(ElementPlus,{locale})
  .mount('#app')

