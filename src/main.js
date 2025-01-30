import { createApp } from 'vue'
import App from './App'
import store from './store'  // Same as './store/index.js'
import router from './routes' // Same as './routes/index.js'

createApp(App)
    .use(store)
    .use(router)
    .mount('#app')