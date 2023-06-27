import Vue from 'vue'
import Router from 'vue-router'
import hbCodeditor from './components/ph-codeditor.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/hbcodeditor',
            name: 'hbcodeditor',
            component: hbCodeditor
        }
    ]
})
