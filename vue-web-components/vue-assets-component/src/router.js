import Vue from 'vue'
import Router from 'vue-router'
import assetList from './components/panel/assets-list'
import menuItem from './components/tree-item'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/assets-list',
            name: 'assetList',
            component: assetList
        },
        {
            path: '/menu-item',
            name: 'menuItem',
            component: menuItem
        }

    ]
})
