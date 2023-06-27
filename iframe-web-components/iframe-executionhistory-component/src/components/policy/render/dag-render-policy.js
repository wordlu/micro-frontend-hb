import * as d3_base from "d3"
import * as d3_dag from "d3-dag"

export default class PhDagRenderPolicy {
    constructor(id, parent) {
        this.id = id
        this.parent = parent

        this.hitWidthStep = 300
        this.hitHeightStep = 500
    }

    renderDag(data, postRenderHook) {
        const that = this.parent

        if (data === null || data === undefined) {
            data = that.datasource.data
        }

        if (data === null && data.length === 0) {
            return
        }

        const d3 = Object.assign({}, d3_base, d3_dag);
        d3.select('svg').remove()
        const dag = d3.dagStratify()(data);

        let [hitWidth, hitHeight] = this.computeGraphMaxLevel(dag)

        const windowWidth = that.$refs.chart.offsetWidth
        const windowHeight = that.$refs.chart.offsetHeight

        const width = Math.max(this.hitWidthStep * hitWidth, windowWidth)
        const height = Math.max(this.hitHeightStep * hitHeight, windowHeight)

        const viewportWidth = width
        const viewportHeight = height

        const layout = d3.sugiyama()
            .size([height, width])
            .layering(d3.layeringSimplex())
            .decross(d3.decrossTwoLayer())
            .coord(d3.coordCenter())

        layout(dag);
        draw(dag, data, that.$refs.chart);

        function draw(dag, data, ele) {
            // This code only handles rendering
            const nodeRadius = 25;

            const svgSelection = d3.select(ele)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", `${-nodeRadius} ${nodeRadius} ${viewportWidth + 2 * nodeRadius} ${viewportHeight + 2 * nodeRadius}`);
            const defs = svgSelection.append('defs'); // For gradients

            const steps = dag.size();
            const interp = d3.interpolateRainbow;
            const colorMap = {};
            // dag.each((node, i) => {
            data.forEach((node, i) => {
                colorMap[node.id] = interp(i / steps);
            });

            // How to draw edges
            const line = d3.line()
                .curve(d3.curveCatmullRom)
                .x(d => d.y)
                .y(d => d.x);

            // Plot edges
            svgSelection.append('g')
                .selectAll('path')
                .data(dag.links())
                .enter()
                .append('path')
                .attr('d', (data) => line(data.points))
                .attr('fill', 'none')
                .attr('stroke-width', 3)
                .attr('stroke', ({source, target}) => {
                    const gradId = `${source.data.id}-${target.data.id}`;
                    const grad = defs.append('linearGradient')
                        .attr('id', gradId)
                        .attr('gradientUnits', 'userSpaceOnUse')
                        .attr('x1', source.x)
                        .attr('x2', target.x)
                        .attr('y1', source.y)
                        .attr('y2', target.y);
                    grad.append('stop').attr('offset', '0%').attr('stop-color', colorMap[source.data.id]);
                    grad.append('stop').attr('offset', '100%').attr('stop-color', colorMap[target.data.id]);
                    return `url(#${gradId})`;
                })
                // .attr('filter', ({source, target}) => {
                //     if (that.datasource.cal.selected.includes(source.data.id) &&
                //         that.datasource.cal.selected.includes(target.data.id)) {
                //         return "none"
                //     } else return 'opacity(0.5)'
                // })
                // .attr('filter', 'opacity(0.3)')

            // Select nodes
            const nodes = svgSelection.append('g')
                .selectAll('g')
                .data(dag.descendants())
                .enter()
                .append('g')
                .attr('id', ({data}) => data.attributes.name)
                .attr('transform', ({x, y}) => `translate(${y}, ${x})`)

            // Plot node circles
            nodes.append('image')
                .attr("xlink:href", ({data}) => {
                    let cat = data.category
                    let catType = data["attributes"]["cat"]
                    let status = data.status
                    if (status === "succeed") {
                        status = "success"
                    }
                    if (catType === "dataset") {
                        status = "normal"
                    }
                    return that.defs.iconsByName(cat, status)
                })
                .attr("width", "50")
                .attr("height", "50")
                .attr('transform', 'translate(-25, -25)')
                // .attr('filter', ({data}) => {
                //     if (that.datasource.cal.selected.includes(data.id)) return "none"
                //     else return 'opacity(0.5)'
                // })


            // Add text to nodes
            nodes.append('text')
                .text(d => d.data.attributes.name)
                .attr('font-weight', 'bold')
                .attr('font-family', 'sans-serif')
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .attr('fill', 'black')
                .attr('transform', 'translate(0, 30)')
                // .attr('filter', ({data}) => {
                //     if (that.datasource.cal.selected.includes(data.id)) return "none"
                //     else return 'opacity(0.5)'
                // })

            //Our new hover effects
            // nodes.on('mouseover', function (d, i) {
            //     d3.select(this).transition()
            //         .duration('50')
            //         .attr('opacity', '.85')
            //
            //     // TODO: tooltips
            //     // d3.select(this).append("circle")
            //     //     .attr("r", 20)
            //     //     .attr("fill", "black")
            //     //     .attr('transform', `translate(30, 30)`)
            // }).on('mouseout', function (d, i) {
            //     d3.select(this).transition()
            //         .duration('50')
            //         .attr('opacity', '1');
            //
            //     // TODO: remove tooltips
            //     // d3.select(this).selectAll("circle").remove()
            // }).on('click', function (d, i) {
            //     if (!that.loading) {
            //         const select = that.datasource.data.filter(it => it.attributes.name === i.data.attributes.name)
            //         if (select.length > 0) {
            //             that.selectItem = select[0]
            //         }
            //     }
            // })

            postRenderHook(width, height)
        }
    }

    //二次trigger清空所有状态
    resetDagStatus(val) {
        let that = this
        // 1.进度条状态
        this.parent.progressOver = false
        this.parent.showProgress = true
        // 2.节点状态
        // let data = this.parent.datasource.data
        // data.map((it, index) => {
        //     it.status = it["attributes"]["runtime"]
        //     // that.parent.refreshNodeStatus(it)
        //     that.refreshNodeStatus(it)
        // })
        // 3.log弹窗
        this.failedLogs = []
    }

    //更新节点状态
    refreshNodeStatus(node) {
        const that = this
        const d3 = Object.assign({}, d3_base, d3_dag)
        if (node["attributes"]["cat"] === "job") {
            d3.select("#" + node["attributes"]["name"]).selectAll("image")
                .attr("xlink:href", ({data}) => {
                    const cat = data.category
                    let status = data.status
                    if (status === "succeed") {
                        status = "success"
                    }
                    return that.parent.defs.iconsByName(cat, status)
                })
        }
    }

    computeGraphMaxLevel(dag) {
        const tmp = dag.height().descendants()
        const arr = tmp.map(x => x.value)
        const maxLevel = Math.max(...arr)
        let result = new Array(maxLevel + 1).fill(0)

        function accResult(total, v) {
            const tmp = total[v]
            total[v] = tmp + 1
            return total
        }

        result = arr.reduce(accResult, result)
        const maxNodeInSameLevel = Math.max(...result)
        return [maxLevel, maxNodeInSameLevel]
    }
}
