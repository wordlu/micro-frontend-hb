import Vue from 'vue'
import Router from 'vue-router'
import ScenarioLst from "../src/components/scenario/scenario-lst"
import ScenarioDetail from "../src/components/scenario-detail/scenario-detail-container"

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/scenarios',
            name: 'scenarios',
            component: ScenarioLst
        },
        {
            path: '/scenario-detail',
            name: 'scenario-detail',
            component: ScenarioDetail
        }
    ]
})
