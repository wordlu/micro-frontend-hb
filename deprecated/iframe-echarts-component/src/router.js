import Vue from 'vue'
import Router from 'vue-router'
import map from './components/map-chart.vue'
import waterfull from './components/waterfull-chart.vue'
import heatmap from './components/heatmap-chart.vue'
import bubble from './components/bubble-chart.vue'
import perStacked from './components/per-stacked-chart.vue'
import mixLine from './components/mix-line-stacked-chart.vue'
import graph from './components/graph-dag-chart.vue'
import demo from './components/page/demo.vue'
import dagLogs from './components/dag-logs.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'demo',
            component: demo
        },
        {
            path: '/map',
            name: 'map',
            component: map
        },
        {
            path: '/waterfull',
            name: 'waterfull',
            component: waterfull
        },
        {
            path: '/heatmap',
            name: 'heatmap',
            component: heatmap
        },
        {
            path: '/bubble',
            name: 'bubble',  
            component: bubble
        },
        {
            path: '/per',
            name: 'perStacked',
            component: perStacked
        },
        {
            path: '/mix',
            name: 'mixLine',
            component: mixLine
        },
        {
            path: '/graph',
            name: 'graph',
            component: graph
        },{
            path: '/dag-logs',
            name: 'dagLogs',
            component: dagLogs
        }
    ]
})
