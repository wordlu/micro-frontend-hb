import Vue from 'vue'
import Router from 'vue-router'
import topn from './components/container'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/topn',
            name: 'topn',
            component: topn
        }
    ]
})
