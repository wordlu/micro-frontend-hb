<template>
	<div class="bubbleWrap">
		<div id="chart" class="chart"></div>
	</div>
</template>

<script>
import * as echarts from 'echarts'
import { staticFilePath, hostName } from "../config/envConfig"
export default {
    name: 'bubble',
    data: () => {
        return {
            bubbleChart: null,
            timer: null,
            dataArr: [],
            yearArr: []
        }
    },
    mounted () {
        this.initChart()
    },
    methods: {
        // 初始化数据
        async initChart () {
            // 初始化echarts实例
            this.bubbleChart = echarts.init(document.getElementById('chart'))
            this.bindChangeWindow()

            this.bubbleChart.showLoading()
            // 获取数据
            await this.queryData()
            this.bubbleChart.hideLoading()
            this.renderbubbleChart()
        },

        // 监听屏幕大小改变
        bindChangeWindow () {
            window.onresize = () => {
                if (this.timer) return

                this.timer = setTimeout(() => {
                    this.bubbleChart.resize()
                    this.timer = null
                }, 100)
            }
        },
        async queryData() {
            const url = `${hostName}/hbchproxyquery`
            const accessToken = this.getCookie("access_token") || "e20cf44e818d6d07b04bb93745ae9f4b0bbb5477926ef8005008c845cbe68493"
            let body = {"query":"select sum(sales) as sales, sum(units) as units, `标准省份名称` as province, year from phmax.data_wide where province != 'null' group by province,year having year in (2020,2019) order by year","schema":["sales","units", "province", "year"]}
            let options = {
                method: "POST",
                headers: {
                    "Authorization": accessToken,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    "accept": "application/json"
                },
                body: JSON.stringify(body)
            }
            let result = await fetch(url, options).then(res => res.json())
            let yearGroupArr = []
            let dataArr = []
            result.forEach((item, index) => {
                if(index == 0) {
                    this.yearArr.push(item.year)
                    yearGroupArr.push([Number(item.sales), Number(item.units), Number(item.sales), item.province, item.year])
                } else {
                    if(item.year == yearGroupArr[yearGroupArr.length - 1][4]) {
                        yearGroupArr.push([Number(item.sales), Number(item.units), Number(item.sales), item.province, item.year])
                    } else {
                        this.yearArr.push(item.year)
                        dataArr.push(yearGroupArr)
                        yearGroupArr = []
                        yearGroupArr.push([Number(item.sales), Number(item.units), Number(item.sales), item.province, item.year])
                    }
                }

            })
            dataArr.push(yearGroupArr)
            this.dataArr = dataArr
            console.log(this.dataArr)
            console.log(this.yearArr)
        },
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        renderbubbleChart () {
            let that = this
            let seriesArr = []
            this.dataArr.forEach(item => {
                let seriesConfig = {
                    name: item[0][4],
                    data: item,
                    type: 'scatter',
                    symbolSize: function (data) {
                        return Math.sqrt(data[2]) / 50e2;
                    },
                    emphasis: {
                        focus: 'series',
                        label: {
                            show: true,
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'bottom'
                        }
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(100, 100, 100, 0.5)',
                        shadowOffsetY: 5
                    }
                }
                seriesArr.push(seriesConfig)
            })
            let option = {
                // backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
                //     offset: 0,
                //     color: '#f7f8fa'
                // }, {
                //     offset: 1,
                //     color: '#cdd0d5'
                // }]),
                title: {
                    text: '省份-销量 气泡图',
                    left: '5%',
                    top: '3%'
                },
                legend: {
                    right: '10%',
                    top: '3%',
                    data: this.yearArr
                },
                grid: {
                    left: '15%',
                    top: '10%'
                },
                xAxis: {
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
                yAxis: {
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    scale: true
                },
                series: seriesArr
            };
            // 绘制图表
            this.bubbleChart.setOption(option)
        }
    }
}
</script>

<style scoped lang="scss">
.bubbleWrap {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 800px;
	height: 90vh;
	.chart {
		width: 100%;
		height: 100%;
		padding: 10px;
	}
}
</style>
