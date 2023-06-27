import Vue from 'vue'
import Router from 'vue-router'
import PhProjects from './components/projects'
import statusPane from './components/status-pane'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/projects',
            name: 'PhProjects',
            component: PhProjects
        },
		{
            path: '/status',
            name: 'statusPane',
            component: statusPane
        }
    ]
})
