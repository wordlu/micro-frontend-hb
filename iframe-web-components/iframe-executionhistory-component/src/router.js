import Vue from 'vue'
import Router from 'vue-router'
import history from '../src/components/execution-history-container'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/history',
            name: 'history',
            component: history
        }
    ]
})
