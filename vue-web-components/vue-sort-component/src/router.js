import Vue from 'vue'
import Router from 'vue-router'
import sort from './components/container'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/sort',
            name: 'sort',
            component: sort
        }
    ]
})
