import Vue from 'vue'
import Router from 'vue-router'
import importFileList from './components/import-file-list.vue'
import customMapping from './components/custom-mapping.vue'
import nav from './components/bp-nav-top-max.vue'
import bpExcelContainer from './components/bp-excel-container'
import bpNavMax from './components/bp-nav-top-max'
import dataList from './components/data-list-home'
import dashboards from './components/dashboards'
import datasets from './components/upload-dataset'
import executionHistory from './components/executionHistory/bp-executions-history'
import executionsLogs from './components/executionHistory/bp-executions-logs'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'bpExcelContainer',
            component: bpExcelContainer
        },
        {
            path: '/datasets',
            name: 'datasets',
            component: datasets
        },
        {
            path: '/data-list',
            name: 'dataList',
            component: dataList
        },
        {
            path: '/import-file-list',
            name: 'importFileList',
            component: importFileList
        },
        {
            path: '/custom-mapping',
            name: 'customMapping',
            component: customMapping
        },
        {
            path: '/nav',
            name: 'nav',
            component: nav
        },
        {
            path: '/bp-nav-max',
            name: 'bp-nav-max',
            component: bpNavMax
        },
        {
            path: '/dashboards',
            name: 'dashboards',
            component: dashboards
        },{
            path: '/executions',
            name: 'executionHistory',
            component: executionHistory
        },{
            path: '/executions-logs',
            name: 'executionsLogs',
            component: executionsLogs
        }
    ]
})
