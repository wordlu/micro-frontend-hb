<template>
    <div class="waterfullWrap">
        <div id="chart" class="chart"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import { staticFilePath, hostName } from "../config/envConfig"

export default {
    name: 'waterfull',
    data: () => {
        return {
            waterfullChart: null,
            timer: null,
            providerArr: [],
            minYear: '',
            maxYear: '',
            startArr: [],
            yearnumArr: []
        }
    },
    mounted () {
        this.initChart()
    },
    methods: {
        // 初始化数据
        async initChart () {
            // 初始化echarts实例
            this.waterfullChart = echarts.init(document.getElementById('chart'))
            this.bindChangeWindow()

            this.waterfullChart.showLoading()
            // 获取数据
            await this.queryData()
            this.waterfullChart.hideLoading()
            this.renderWaterfullChart()
        },

        // 监听屏幕大小改变
        bindChangeWindow () {
            window.onresize = () => {
                if (this.timer) return

                this.timer = setTimeout(() => {
                    this.waterfullChart.resize()
                    this.timer = null
                }, 100)
            }
        },
        async queryData() {
            const url = `${hostName}/hbchproxyquery`
            const accessToken = this.getCookie("access_token") || "e20cf44e818d6d07b04bb93745ae9f4b0bbb5477926ef8005008c845cbe68493"
            let body = {"query":"select provider,min(year) as min,max(year) as max from phmax.data_wide group by provider","schema":["provider","min", "max"]}
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
            this.providerArr = []
            this.startArr = []
            this.yearnumArr = []
            this.minYear = 3000
            this.maxYear = 0
            result.forEach((item, index) => {
                this.providerArr.push(item.provider)
                if(Number(item.min) < this.minYear) {
                    this.minYear = Number(item.min)
                }
                if(Number(item.max) > this.maxYear) {
                    this.maxYear = Number(item.max)
                }
                this.startArr.push(Number(item.min))
                this.yearnumArr.push(Number(item.max) - Number(item.min))
            })
            return result
        },
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        renderWaterfullChart () {
            let option = {
                title: {
                    text: 'Waterfall Chart'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        let tar;
                        if (params[1] && params[1].value !== '-') {
                            tar = params[1];
                        } else {
                            tar = params[0];
                        }
                        return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                    }
                },
                legend: {
                    data: ['Expenses']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : {
                    type: 'value',
                    min: this.minYear,
                    max: this.maxYear,
                    axisLine: { //关键设置，不显示X轴线条
                        show: true
                    },
                    axisLabel:{
                        formatter: function (value) {
                            var texts = [];
                            texts.push(String(value))
                            return texts;
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    data: this.providerArr,
                    splitLine: {
                        show: true
                    }
                },
                series: [
                    {
                        name: 'Placeholder',
                        type: 'bar',
                        stack: 'Total',
                        itemStyle: {
                            borderColor: 'transparent',
                            color: 'transparent'
                        },
                        emphasis: {
                            itemStyle: {
                                borderColor: 'transparent',
                                color: 'transparent'
                            }
                        },
                        data: this.startArr
                    },
                    {
                        name: 'year',
                        type: 'bar',
                        stack: 'Total',
                        barWidth: 20,
                        label: {
                            show: false,
                            position: 'bottom'
                        },
                        data: this.yearnumArr
                    }
                ]
            }
            // 绘制图表
            this.waterfullChart.setOption(option)
            // 入栈
            // this.pushStack(mapName, partData, geoJson)
        }
    }
}
</script>

<style scoped lang="scss">
.waterfullWrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1000px;
    height: 100vh;
    .chart {
        width: 100%;
        height: 100%;
        padding: 10px;
    }
}
</style>
