import Vue from 'vue'
import Router from 'vue-router'
import prepare from './components/container'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/prepare',
            name: 'prepare',
            component: prepare
        }
    ]
})
