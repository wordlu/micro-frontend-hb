import Vue from 'vue'
import Router from 'vue-router'
import graph from './components/graph-dag-chart.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/graph',
            name: 'graph',
            component: graph
        }
    ]
})
