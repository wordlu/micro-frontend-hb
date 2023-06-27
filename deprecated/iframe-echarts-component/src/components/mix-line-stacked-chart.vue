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
            data: [],
            provinceArr: [],
            salesArr: [],
            unitsArr: [],
            lineArr: []
        }
    },
    mounted () {
        this.initChart()
    },
    methods: {
        // 显示左侧名称
        initDataName(){
            var nameList = []
            for (var i = 0; i < this.data.length; i++) {
                nameList.push(this.data[i].name)
            }
            return nameList
        },
        //计算统计值和最高值
        initData(val){
            var serie = [];
            for (var i = 0; i < this.data.length; i++) {
                var num = 0
                if(val == 'tjz'){//计算统计值
                    num = this.data[i].tjz
                }else if (val == 'zgz') {//计算最高值
                    num = this.data[i].zgz
                }
                var total = (parseFloat(this.data[i].tjz) + parseFloat(this.data[i].zgz)).toFixed(2);
                var numcount = this.Percentage(num,total)
                serie.push(numcount);
            }
            return serie;
        },
        //计算两者占比
        Percentage(num, total) {
            return (Math.round(num / total * 10000) / 100.00);// 小数点后两位百分比
        },
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
            let body = {"query":"select max(sales) as maxsalex, avg(sales) as avgsales, avg(units) as avgunits, `标准省份名称` as province from phmax.data_wide where province != 'null' group by province","schema":["maxsalex","avgsales", "avgunits", "province"]}
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
            this.provinceArr = []
            this.salesArr = []
            this.unitsArr = []
            this.lineArr = []
            result.forEach((item, index) => {
                this.provinceArr.push(item.province)
                this.salesArr.push(Number(item.avgsales))
                this.unitsArr.push(Number(item.avgunits))
                this.lineArr.push(Number(item.maxsalex) /100)
            })
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
            let option = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {  // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    bottom:'-5',
                    data:['sales','units', 'max-sales']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : this.provinceArr
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        splitLine: {
                            show: true
                        }
                    }
                    
                ],
                series : [
                    {
                        name:'sales',
                        barWidth: 20,
                        type:'bar',
                        stack: 'sales',
                        data: this.salesArr
                    },
                    {
                        name:'units',
                        type:'bar',
                        barWidth: 20,
                        stack: 'sales',
                        data: this.unitsArr
                    },
                    {
                        name:'max-sales',
                        type:'line',
                        stack: 'sales',
                        data: this.lineArr
                    }
                
                ]
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
    width: 100vw;
    height: 90vh;
    .chart {
        width: 100%;
        height: 100%;
        padding: 10px;
    }
}
</style>
