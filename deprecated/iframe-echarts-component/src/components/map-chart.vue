<template>
    <div class="MapUpDownWrap">
        <div id="chart" class="chart"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import { PROVINCES, SPECIALPROVINCES, COUNTY } from './constant'
import { getGeoJson, getChinaData, getProvinceData, getCityData } from './map'

export default {
    name: 'MapUpDown',
    data: () => {
        return {
            mapChart: null,
            mapStack: [],
            timer: null
        }
    },
    mounted () {
        this.initChart()
    },
    methods: {
        // 初始化数据
        async initChart () {
            // 初始化echarts实例
            this.mapChart = echarts.init(document.getElementById('chart'))
            this.bindOnClickChart()
            this.bindOnContextmenuChart()
            this.bindChangeWindow()

            this.mapChart.showLoading()
            // 获取数据
            const mapName = 'china'
            const {partData, geoJson} = await this.getPartAndGeoData('country', mapName)
            this.mapChart.hideLoading()
            this.registeRenderMap(mapName, partData, geoJson, {
                澳门: {
                    left: 113,
                    top: 20.5,
                    width: 0.7
                },
                香港: {
                    left: 115,
                    top: 21.3,
                    width: 2
                }
            })
        },

        // 监听屏幕大小改变
        bindChangeWindow () {
            window.onresize = () => {
                if (this.timer) return

                this.timer = setTimeout(() => {
                    this.mapChart.resize()
                    this.timer = null
                }, 100)
            }
        },

        // 绑定自定义单击事件
        bindOnClickChart () {
            this.mapChart.on('click', async params => {
                const { seriesName, name, data: { adcode } } = params
                if (name === '南海诸岛') return

                // 点击的是否是省级
                if (PROVINCES.includes(name)) {
                    const mapName = `${adcode}-${name}`
                    const { partData, geoJson } = await this.getPartAndGeoData('provice', mapName)
                    this.registeRenderMap(mapName, partData, geoJson)
                    return
                }

                // 点击的是否是特殊区域，无法下钻三级，'北京', '天津', '上海', '重庆', '香港', '澳门', '台湾'
                if (SPECIALPROVINCES.includes(seriesName)) {
                    return
                }
                // 点击的是否是县级区域，其 seriesName 格式为 '省级-市级'，无法下钻四级地图
                if (COUNTY.some(item => seriesName.indexOf(item) > -1)) {
                    return
                }

                // 点击的是否是市级 or 区级
                const mapName = `${seriesName}-${adcode}-${name}`
                const { partData, geoJson } = this.getPartAndGeoData('city', mapName)

                this.registeRenderMap(mapName, partData, geoJson)
            })
        },

        // 绑定自定义右击事件
        bindOnContextmenuChart () {
            // 取消右击默认事件
            const body = document.getElementsByTagName('body')[0]
            body.oncontextmenu = e => e.preventDefault()

            // 绑定自定义右击事件
            this.mapChart.on('contextmenu', params => {
                this.goBack()
            })
        },

        /**
         * @description: 获取渲染地图的相关数据 partData 和 geoJson
         * @param {String} type 类型  country：国家级   province：省级   city：市级
         * @param {String} mapName 地图名称 同注册地图方法registerMap 的第一个参数一致
         */
        async getPartAndGeoData (type, mapName) {
            if (type === 'country') {
                const partData = await getChinaData()
                const geoJson = await getGeoJson('country', mapName)
                return { partData, geoJson }
            }
            if (type === 'provice') {
                const partData = await getProvinceData(mapName)
                const geoJson = await getGeoJson('provice', mapName)
                return { partData, geoJson }
            }
            if (type === 'city') {
                const res = getCityData()
                const partData = res.data
                const geoJson = await getGeoJson('city', mapName)
                return { partData, geoJson }
            }
        },

        // 返回地图上一级
        goBack () {
            // 如果栈中只剩下中国地图
            if (this.mapStack.length === 1) {
                return
            }
            this.mapStack.pop()
            const { mapName, partData, geoJson } = this.mapStack.pop()
            this.registeRenderMap(mapName, partData, geoJson)
        },

        /**
         * @description: 地图数据入栈
         * @param {String} mapName 地图名称 同注册地图方法registerMap 的第一个参数一致
         * @param {Array} partData 地图部分数据内容
         * @param {Object} geoJson 地图geoJson
         */
        pushStack (mapName, partData, geoJson) {
            this.mapStack.push({
                mapName,
                partData,
                geoJson
            })
        },

        /**
         * @description: 注册渲染地图
         * @param {String} mapName 地图名称 同 option/series/map 一致
         * @param {Array} partData 地图部分数据内容
         * @param {Object} geoJson 地图geoJson
         * @param {Object} specialAreas 特殊区域
         */
        registeRenderMap (mapName, partData, geoJson, specialAreas = {}) {
            // 注册地图
            echarts.registerMap(mapName, geoJson, specialAreas)
            // 绘制地图
            this.renderMap(mapName, partData, geoJson)
        },

        /**
         * @description: 绘制地图
         * @param {String} mapName 地图名称 同注册地图方法registerMap 的第一个参数一致
         * @param {Array} partData 地图部分数据内容
         * @param {Object} geoJson 地图geoJson
         */
        renderMap (mapName, partData, geoJson) {
            const seriesData = this.getSeriesByPart(partData, geoJson)
            const visualMapMax = this.getVisualMapMax(seriesData)
            const option = {
                title: {
                    text: mapName
                },
                //提示框组件
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}<br/>{c}',
                    backgroundColor:'rgba(28,36,39,0.8)',
                    borderColor: 'rgba(28,36,39,1)',
                    textStyle: {
                        color: '#fff',
                        fontSize: 12
                    }
                },
                // 视觉映射租组件
                visualMap: {
                    type: 'continuous',
                    min: 0,
                    max: visualMapMax,
                    text: ['高', '低'],
                    realtime: true,
                    calculable: false,
                    inverse: true,
                    bottom: '30%',
                    left: '20%',
                    inRange: {
                        // 色阶范围
                        color: [
                            '#FBF5BA',
                            '#F5C924',
                            '#B29106'
                        ] 
                    },
                    textStyle: {
                        color: '#6C6F7D'
                    }
                },
                series: [
                    {
                        name: mapName, // 系列名称
                        type: 'map',
                        map: mapName, // 使用registerMap注册的地图名称
                        zoom: 1, // 当前视角的缩放比例
                        zlevel: 1, // 不同zlevel值的图形会放置在不同的Canvas中,zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
                        scaleLimit: { //滚轮缩放的极限控制
                            min: 0.5,
                            max: 2
                        },
                        roma: 'scale', //开启缩放
                        label: { //图形上的文本标签
                            show: false,
                            // 高亮状态下文本颜色
                            emphasis: {
                                color: '#fff'
                            }
                        },
                        itemStyle: {
                            // 非高亮状态下的地图块样式
                            normal: {
                                borderColor: '#fff',
                                borderWidth: 1
                            },
                            // 高亮状态下的地图块样式
                            emphasis: {
                                areaColor: 'rgb(254,153,78)'
                            }
                        },
                        data: seriesData
                    }
                ],
                animation: true,
                animationDuration: 1000,
                animationDurationUpdate: 600,
                animationEasingUpdate: 'cubicInOut'
            }

            // 绘制图表
            this.mapChart.setOption(option)
            // 入栈
            this.pushStack(mapName, partData, geoJson)
        },

        /**
         * @description: 根据partData 和 geoJson 生成 seriesData
         * @param {Array} partData 地图部分数据内容
         * @param {Object} geoJson 地图geoJson
         */
        getSeriesByPart (partData, geoJson) {
            let originData = geoJson.features.map(({ properties }) => ({
                name: properties.name,
                adcode: properties.adcode,
                value: 0
            }))
            if (geoJson.attach) {
                const attachOriginData = geoJson.attach.map(item => ({
                    name: item,
                    value: 0
                }))
                originData.push(...attachOriginData)
            }
            originData = originData.filter(item => item.name !== '')

            originData.forEach(item => {
                const currData = partData.find(i => i.name === item.name)
                if (currData) {
                    item.value = currData.value
                }
            })
            return originData
        },

        /**
         * @description: 根据seriesData 动态计算生成 visualMapMax
         * @param {Array} seriesData 地图数据内容
         */
        getVisualMapMax (seriesData) {
            const maxValue = Math.max(...seriesData.map(item => item.value))
            return parseInt(maxValue) + 50
        }
    },

    beforeDestroy () {
        // 销毁地图实例
        this.mapChart.dispose()
    }
}
</script>

<style scoped lang="scss">
.MapUpDownWrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90vw;
    height: 90vh;
    .chart {
        width: 100%;
        height: 100%;
        padding: 10px;
    }
}
</style>
