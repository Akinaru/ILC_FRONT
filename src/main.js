import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router.js'
import Vue3Lottie from 'vue3-lottie'

const pinia = createPinia()

createApp(App)
    .use(Vue3Lottie)
    .use(router)
    .use(pinia)
    .mount('#app')
