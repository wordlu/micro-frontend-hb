<template>
    <div class="heatmapWrap">
        <div id="chart" class="chart"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: 'heatmap',
    data: () => {
        return {
            heatmapChart: null,
            timer: null,
            atc3Arr: [],
            numberArr: [],
            dataSalesArr: [],
            maxSales: 0,
            result: []
        }
    },
    mounted () {
        this.initChart()
    },
    methods: {
        // 初始化数据
        async initChart () {
            // 初始化echarts实例
            this.heatmapChart = echarts.init(document.getElementById('chart'))
            this.bindChangeWindow()

            this.heatmapChart.showLoading()
            // 获取数据
            await this.queryData()
            this.heatmapChart.hideLoading()
            this.renderheatmapChart()
        },

        // 监听屏幕大小改变
        bindChangeWindow () {
            window.onresize = () => {
                if (this.timer) return

                this.timer = setTimeout(() => {
                    this.heatmapChart.resize()
                    this.timer = null
                }, 100)
            }
        },
        async queryData() {
            const url = `${hostName}/hbchproxyquery`
            const accessToken = this.getCookie("access_token") || "e20cf44e818d6d07b04bb93745ae9f4b0bbb5477926ef8005008c845cbe68493"
            let body = {"query":"select atc3,splitByString('_', arr)[1] as atc5, toFloat64(splitByString('_', arr)[2]) as sales, number from (select atc3,groupArray(atc_sales) AS arr_val from (select atc3, concat(atc, '_', toString(sales)) as atc_sales from (select atc, substring(atc,1,3) as atc3, sum(sales) as sales from phmax.data_wide where atc != 'null' and length(atc)=5 GROUP BY atc ORDER BY atc3 ASC,sales DESC) table1 ) table2 GROUP BY atc3 ) table3　array join arr_val as arr, arrayEnumerate(arr_val) AS number where number <=10","schema":["atc3","atc5", "sales", "number"]}
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
            this.atc3Arr = []
            this.numberArr = []
            this.dataSalesArr = []
            this.maxSales = 0
            let minNum = 100
            let maxNum = 0
            result.forEach((item, index) => {
                if(Number(item.sales) > this.maxSales) {
                    this.maxSales = Number(item.sales)
                }
                //atc3 y轴数据
                if(this.atc3Arr.indexOf(item.atc3) == -1) {
                    this.atc3Arr.push(item.atc3)
                }

                if(Number(item.number) > maxNum) {
                    maxNum = Number(item.number)
                }
                if(Number(item.number) < minNum) {
                    minNum = Number(item.number)
                }

                let atc5fitst = item.atc5.slice(0,3)
                let yNum = this.atc3Arr.indexOf(atc5fitst)
                //data数据
                let dataArr = []
                dataArr.push(item.number, yNum, item.sales)
                this.dataSalesArr.push(dataArr)
            })
            const rangeArray = (start, end) => Array(end - start + 1).fill(0).map((v, i) => i + start)
            //x轴数据
            this.numberArr = rangeArray(minNum, maxNum)
            this.result = result
        },
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        renderheatmapChart () {
            let that = this
            let option = {
                tooltip: {
                    position: 'top',
                    trigger: 'item',
                    formatter: function (params) {
                        let atc5Value = ''
                        let xcoor = params.value[0]
                        let ycoor = that.atc3Arr[params.value[1]]
                        let sales = params.value[2]
                        that.result.forEach(item => {
                            if(item.atc3 == ycoor && xcoor == Number(item.number)) {
                                atc5Value = item.atc5
                            }
                        })
                        return 'name: ' + atc5Value + '<br/>' + 'sales: ' + sales
                    },
                    backgroundColor:'rgba(28,36,39,0.8)',
                    textStyle: {
                        color: '#fff'
                    }
                },
                grid: {
                    height: '90%',
                    top: '5%'
                },
                xAxis: {
                    type: 'category',
                    data: this.numberArr,
                    splitArea: {
                        show: true
                    }
                },
                yAxis: {
                    type: 'category',
                    data: this.atc3Arr,
                    splitArea: {
                        show: true
                    }
                },
                visualMap: {
                    min: 0,
                    max: this.maxSales,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    top: 0
                },
                series: [
                    {
                        name: 'heatmap',
                        type: 'heatmap',
                        data: this.dataSalesArr,
                        label: {
                            show: false
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            // 绘制图表
            this.heatmapChart.setOption(option)
        }
    }
}
</script>

<style scoped lang="scss">
.heatmapWrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 800px;
    height: 100vh;
    .chart {
        width: 100%;
        height: 100%;
        padding: 10px;
    }
}
</style>
