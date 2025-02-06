import { createApp } from 'vue'
import App from './App'
import store from './store'  // Same as './store/index.js'
import router from './routes' // Same as './routes/index.js'
// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

// 앱 초기화 시 쿠키에 저장된 토큰을 Vuex에 반영
store.dispatch('initializeAuth');

createApp(App)
    .use(store)
    .use(router)
    .mount('#app')