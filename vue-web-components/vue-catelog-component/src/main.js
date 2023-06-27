import Vue from 'vue';
// import wrap from '@vue/web-component-wrapper';
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')