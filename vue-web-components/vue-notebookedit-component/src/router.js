import Vue from 'vue'
import Router from 'vue-router'
import NotebookEditor from './components/container'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/notebook-editor',
            name: 'NotebookEditor',
            component: NotebookEditor
        }
    ]
})
