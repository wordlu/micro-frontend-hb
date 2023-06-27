import Vue from 'vue'
import Router from 'vue-router'
import menu from './components/panel/menu.vue'
import subscribeTable from './components/panel/data-list-table.vue'
import dataListDetail from './components/panel/data-list-detail.vue'
import viewJson from './components/panel/view-json.vue'
import excelHandler from './components/bp-excel-handler'
import excelColumnClean from './components/panel/excel-column-clean'
import prepare from './components/panel/prepare-set.vue'
import overview from './components/panel/overview.vue'
import codeditor from './components/bp-codeditor-page'
import fileListPanel from './components/panel/files-list'
// import fileContent from './components/panel/file-content.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/my-data-table',
            name: 'myDataTable',
            component: myDataTable
        },
        {
            path: '/menu',
            name: 'menu',
            component: menu
        },
        {
            path: '/data-list-table',
            name: 'subscribeTable',
            component: subscribeTable
        },
        {
            path: '/data-list-detail',
            name: 'dataListDetail',
            component: dataListDetail
        },
        {
            path: '/view-json',
            name: 'viewJson',
            component: viewJson
        },

        {
            path: '/project',
            name: 'project',
            component: project
        },
        {
            path: '/data-list-home',
            name: 'dataListHome',
            component: dataListHome
        },
        {
            path: '/upload-dataset',
            name: 'uploadDataset',
            component: uploadDataset
        },
        {
            path: '/select-file',
            name: 'selectFile',
            component: selectFile
        },
        {
            path: '/next-dialog',
            name: 'nextDialog',
            component: nextDialog
        },
        {
            path: '/excel-column-clean',
            name: 'excelColumnClean',
            component: excelColumnClean
        },
        {
            path: '/clear-dataset-dialog',
            name: 'clearDatasetDialog',
            component: clearDatasetDialog
        },
        {
            path:'/create-tags-dialog',
            name:'createTagsDialog',
            component:createTagsDialog
        },
        {
            path: '/delete-tags-dialog',
            name: 'deleteTagsDialog',
            component: deleteTagsDialog
        },
        {
            path: '/excel-handler',
            name: 'excelHandler',
            component: excelHandler
        },
        {
            path: '/codeditor',
            name: 'codeditor',
            component: codeditor
        },
        {
            path: '/scripts-list',
            name: 'scriptsList',
            component: scriptsList
        },
        {
            path: '/prepare',
            name: 'prepare',
            component: prepare
        },
        {
            path: '/overview',
            name: 'overview',
            component: overview
        },
        {
            path: '/file-list-panel',
            name: 'fileListPanel',
            component: fileListPanel
        },
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
