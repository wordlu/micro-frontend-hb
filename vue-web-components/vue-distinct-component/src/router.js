import Vue from 'vue'
import Router from 'vue-router'
import distinct from './components/container'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/distinct',
            name: 'distinct',
            component: distinct
        }
    ]
})
