import Vue from 'vue'
import Router from 'vue-router'
import insight from "./components/insight-container"
import slide from "./components/slide"
import slidepage from "./components/slidespage"
import insightpage from "./components/insightpage"
Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/insight',
            name: 'insight',
            component: insight
        },
        {
            path: '/slide',
            name: 'slide',
            component: slide
        }, 
        {
            path: '/slidepage',
            name: 'slidepage',
            component: slidepage
        }, 
        {
            path: '/insightpage',
            name: 'insightpage',
            component: insightpage
        }
    ]
})
