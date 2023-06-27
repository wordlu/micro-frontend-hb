import Vue from 'vue';
// import wrap from '@vue/web-component-wrapper';
import App from './App.vue'
import router from './router'
// import HelloWorld from './components/HelloWorld';
// import sassTest from './components/sassTest';

// const CustomElement = wrap(Vue, sassTest);

// window.customElements.define('vue-example-component', CustomElement);

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')