<template>
    <div class="graphWrap">
        <div class="show_area">
            <div class="show_header">
                <div class="show_header_left">
                    <input type="text">
                    <select name="" id=""></select>
                </div>
                <div class="show_header_right">
                    <button>构建DAG</button>
                    <button>脚本</button>
                    <button>数据集</button>
                </div>
            </div>
            <div ref="chart" class="chart"></div>
        </div>

        <div class="opt_area">
            <div class="opt_header">
                <img :src="py_icon_header" alt="">
                <div class="dataset_name">{{selectItemName}}</div>
            </div>
            <div class="opt_icon_area">
                <div class="fir_icon_row">
                    <img :src="label_icon" alt="">
                    <img :src="table_icon" alt="">
                    <img :src="star_icon" alt="">
                    <img :src="doc_icon" alt="">
                    <img :src="share_icon" alt="">
                    <img :src="hide_icon" alt="">
                    <img :src="run_icon" alt="" 
                        @click="on_click_runDag">
                    <img v-if="noticeService.retryButtonShow && selectItem"
                        :src="run_script" alt="" 
                        @click="on_click_run_script('self_only')">
                    <img v-if="noticeService.retryButtonShow && selectItem"
                        :src="run_to_script" alt="" 
                        @click="on_click_run_script('downstream')">
                    <img v-if="noticeService.retryButtonShow  && selectItem" 
                        :src="run_from_script" alt="" 
                        @click="on_click_run_script('upstream')">
                    <img v-if="!noticeService.retryButtonShow || !selectItem" 
                        :src="run_script_gray" alt="">
                    <img v-if="!noticeService.retryButtonShow || !selectItem" 
                        :src="run_from_script_gray" alt="">
                    <img v-if="!noticeService.retryButtonShow || !selectItem" 
                        :src="run_to_script_gray" alt="">
                </div>
                <div class="sec_icon_row">
                    <img :src="delete_icon" alt="">
                    <img :src="del_icon_black" alt="">
                </div>
            </div>
            <div class="scripts_area">
                <div class="script_title">脚本</div>
                <div class="scripts">
                    <img :src="py_icon" alt="">
                    <img :src="pySpark_icon" alt="">
                    <img :src="R_icon" alt="">
                    <img :src="sparkR_icon" alt="">
                </div>
            </div>
        </div>

        <run-dag-dialog 
            v-if="showRunJson"
            @confirmeRunDag="confirmeRunDag"
            @closeRunDagDialog="closeRunDagDialog"
        ></run-dag-dialog>

        <dag-logs-dialog
            v-if="showDagLogs"
            :runId="runId"
            :jobShowName="jobShowName"
            :projectName="projectName"
            :representId="representId"
            @closeLogDialog="closeLogDialog"
        ></dag-logs-dialog>

        <div class="job_status_area">
            <div class="job_status" v-for="(item, index) in failedLogs" :key="index">
                <div class="job_notice">
                    <div class="item title">Job failed</div>
                    <div class="item" :title="jobShowName">{{item.jobShowName}}</div>
                </div>
                <button @click="showLogs(item.data, item.representId)">Logs</button>
            </div>
        </div>

        <div v-if="loading">
            <div id="loadingio-spinner-double-ring-ho1zizxmctu">
                <div class="ldio-400lpppmiue">
                    <div></div><div></div>
                    <div><div></div></div>
                    <div><div></div></div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import * as echarts from 'echarts'
import PhDagDatasource from './model/datasource'
import noticeService from './model/notice-service'
import runDagDialog from './run-dag-dialog.vue'
import dagLogsDialog from './dag-log-dialog.vue'
import { staticFilePath, hostName } from "../config/envConfig"

export default {
    data: () => {
        return {
            name: 'dag',
            needRefresh: 0,
            projectId: "",
            flowVersion: "",
            label_icon: `${staticFilePath}` + "/tag.svg",
            table_icon: `${staticFilePath}` + "/%E8%A1%A8%E5%8D%95%E7%BB%84%E4%BB%B6-%E8%A1%A8%E6%A0%BC(1).svg",
            star_icon: `${staticFilePath}` + "/%E6%94%B6%E8%97%8F.svg",
            doc_icon: `${staticFilePath}` + "/new-document-dashboard.svg",
            share_icon: `${staticFilePath}` + "/share.svg",
            delete_icon: `${staticFilePath}` + "/delete_r.svg",
            del_icon_black: `${staticFilePath}` + "/%E5%88%A0%E9%99%A4+(1)(1).svg",
            hide_icon: `${staticFilePath}` + "/%E9%9A%90%E8%97%8F.svg",
            py_icon: `${staticFilePath}` + "/icons/python%E6%AD%A3%E5%B8%B8.svg",
            pySpark_icon: `${staticFilePath}` + "/icons/pyspark%E6%AD%A3%E5%B8%B8.svg",
            R_icon: `${staticFilePath}` + "/icons/R%E6%AD%A3%E5%B8%B8.svg",
            sparkR_icon: `${staticFilePath}` + "/icons/sparkR%E6%AD%A3%E5%B8%B8.svg",
            run_icon: `${staticFilePath}` + "/%E5%BC%80%E5%A7%8B1.svg",
            run_to_script: `${staticFilePath}` + "/icons/%E8%BF%90%E8%A1%8C%E8%87%B3%E5%BD%93%E5%89%8D%E8%84%9A%E6%9C%AC.svg",
            run_from_script: `${staticFilePath}` + "/icons/%E7%94%B1%E5%BD%93%E5%89%8D%E8%84%9A%E6%9C%AC%E5%BC%80%E5%A7%8B%E8%BF%90%E8%A1%8C.svg",
            run_script: `${staticFilePath}` + "/icons/%E9%87%8D%E6%96%B0%E8%BF%90%E8%A1%8C%E5%BD%93%E5%89%8D%E8%84%9A%E6%9C%AC.svg",
            run_script_gray: `${staticFilePath}` + "/icons/%E9%A1%BA%E6%97%B6%E9%92%88%E7%81%B0%E8%89%B2%E5%8D%95%E4%B8%AA.svg",
            run_from_script_gray: `${staticFilePath}` + "/icons/%E9%A1%BA%E6%97%B6%E9%92%88%E7%81%B0%E8%89%B2.svg",
            run_to_script_gray: `${staticFilePath}` + "/icons/%E9%80%86%E6%97%B6%E9%92%88%E7%81%B0%E8%89%B2.svg",
			py_icon_header: `${staticFilePath}` + "/icons/python%E5%8F%8D%E8%89%B2.svg",
            selectItemName: "",
            selectItem: null,
            showRunJson: false,
            jobShowName: "",
            runId: "",
            representId: "",
            // projectName: "",
            failedLogs: [],
            projectName: "ETL_Iterator",
            // failedLogs: [{
            //     jobShowName: "compute_aw",
            // 	data: {
            // 		attributes: {
            // 			message: JSON.stringify({"type": "notification", "opname": "张璐", "cnotification": {"jobName": "ETL_Iterator_ETL_Iterator_developer_compute_aw_EYPYvgIWyXw66Lg", "runId": "ETL_Iterator_ETL_Iterator_developer_2021-12-16T07:27:44+00:00", "jobShowName": "compute_aw", "error": ""}})
            // 		}
            // 	}
            // }],
            loading: false,
            showDagLogs:false,
            jobShowName: "",
            selectItemName: "", //单击的dag的名字
            responseArr: []
        }
    },
    components: {
        runDagDialog,
        dagLogsDialog
    },
    props: {
        datasource: {
            type: Object,
            default: function() {
                return new PhDagDatasource('1')
            }
        },
        noticeService: {
            type: Object,
            default: function() {
                return new noticeService('1')
            }
        }
    },
    mounted () {
        let href = window.location.href
        console.log(href)
        let paramArr = href.split("?")[1].split("&")
        this.projectId = paramArr[0].split('=')[1]
        this.projectName = paramArr[1].split("=")[1]
        this.flowVersion = paramArr[2].split("=")[1]
        this.datasource.projectId = this.projectId
        this.initChart()
        this.noticeService.observer()
    },
    methods: {
        closeLogDialog() {
            this.showDagLogs = false
        },
        showLogs(data, representId) {
            console.log(data)
            this.runId = JSON.parse(data.attributes.message).cnotification.runId
            this.jobShowName = JSON.parse(data.attributes.message).cnotification.jobShowName
            this.representId = representId
            this.showDagLogs = true
        },
        /**
         * 1. 调接口触发dag
         * 2. query notification接收正确或错误消息
         */
        async confirmeRunDag(data) {
            this.showRunJson = false
            const url = `${hostName}/hbdagtrigger`
            const accessToken = this.getCookie("access_token") || this.datasource.debugToken
            let body = {
                "project_name": this.projectName,
                "flow_version": "developer", 
                "conf": data.args.param.jsonValue
            }
            let options = {
                method: "POST",
                headers: {
                    "Authorization": accessToken,
                    "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
                    "accept": "application/json"
                },
                body: JSON.stringify(body)
            }
            let result = await fetch(url, options).then(res => res.json())
            let queryId = result.data.dag_run_id
            this.noticeService.projectName = this.projectName
            let timeout = data.args.param.timeout
            this.noticeService.register("notification", queryId, this.runDagCallback, this, this.projectId, timeout)
        },
        /**
         * 更新状态的回调函数
         */
        runDagCallback(response, ele) {
            let that = this
            that.failedLogs = []
            let represent_id = ""
            this.responseArr = response
            response.forEach(item => {
                let jobCat = item.attributes["job-cat"]
                let jobName = JSON.parse(item.attributes.message).cnotification.jobName
                let nodes = ele.datasource.nodes
                console.log("nodes", nodes)
                // 1.找到对应job节点并更新状态
                nodes.map((it,index) => {
                    if(jobName.indexOf(it.jobName) != -1) {
                        let category = ele.datasource.nodes[index].category
                        if(category.indexOf("_") != -1) {
                            category = category.split("_")[0]
                        }
                        if(jobCat === "success") {
                            ele.datasource.nodes[index].category = category + "_succeed"
                        } else if(jobCat === "failed") {
                            ele.datasource.nodes[index].category = category + "_failed"
                            represent_id = it.representId
                        }
                    }
                })
                // 2.失败时出现弹框
                if(jobCat === "failed") {
                    that.failedLogs.push({
                        data: item,
                        jobShowName: JSON.parse(item.attributes.message).cnotification.jobShowName,
                        representId: represent_id
                    })
                }
                console.log("failedLogs", that.failedLogs)
                // this.needRefresh++
            })
        },
        /**
         * 1. 有第一次运行状态才可以点retry三个按钮
         * 2. 选择job之后修改名字，点运行时候出现弹窗提示
         */
        async on_click_run_script(data) {
            console.log("responseArr", this.responseArr)
            console.log("selectItem", this.selectItem)
            this.runId = JSON.parse(this.responseArr[0].attributes.message).cnotification.runId
            const url = `${hostName}/hbdagtasktrigger`
            const accessToken = this.getCookie("access_token") || this.datasource.debugToken
            let body = {
                "project_name": this.projectName,
                "flow_version": "developer",
                "run_id": this.runId,
                "task_id": this.projectName + "_" + this.projectName + "_developer_" + this.selectItemName + "_" + this.selectItem["represent-id"],
                "clean_cat": data //向上还是向下
            }
            let options = {
                method: "POST",
                headers: {
                    "Authorization": accessToken,
                    "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
                    "accept": "application/json"
                },
                body: JSON.stringify(body)
            }
            let result = await fetch(url, options).then(res => res.json())
            this.noticeService.projectName = this.projectName
            let timeout = 60
            this.noticeService.register("notification", this.runId, this.runDagCallback, this, this.projectId, timeout)
        },
        on_click_runDag() {
            this.showRunJson = true
        },
        closeRunDagDialog() {
            this.showRunJson = false
        },
        // 初始化数据
        async initChart () {
            // 初始化echarts实例
            this.dag = echarts.init(this.$refs.chart)
            this.bindChangeWindow()

            this.dag.showLoading()
            // 获取数据
            // await this.queryData()
            await this.datasource.refreshData(this)
            this.dag.hideLoading()
            this.renderDag()
            const that = this
            // 发布前要解注
            document.domain = "hubadata.com"
            this.dag.on('click', function(params) {
                that.selectItemName = params.name
                // 获取选中job的基本信息
                let scriptArr = that.datasource.jobArr.filter(it => it.attributes.cat === "job" && it.attributes.name === that.selectItemName)
                if(scriptArr.length > 0) {
                    that.selectItem = scriptArr[0].attributes
                }
                console.log("selectItem", that.selectItem)
                that.$emit('itemClicked', params)
            })
        },


        // 监听屏幕大小改变
        bindChangeWindow () {
            window.onresize = () => {
                if (this.timer) return

                this.timer = setTimeout(() => {
                    this.dag.resize()
                    this.timer = null
                }, 100)
            }
        },
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        renderDag () {
            let that = this
            let option = {
                title: {
                    text: this.title
                },
                backgroundColor: '#f7f7f7',
                tooltip: {},
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [
                    {
                        type: 'graph',
                        layout: 'none',
                        symbolSize: 50,
                        roam: true, // 缩放
                        symbol: 'rect',
                        edgeSymbol: ['circle', 'arrow'],
                        edgeSymbolSize: [5, 10],
                        itemStyle: {
                            color: '#24a861'
                        },
                        label: {
                            show: true,
                            fontSize: 16,
                            position: 'bottom'
                        },
                        edgeLabel: {
                            fontSize: 20
                        },
                        categories: [
                            {
                                name: 'DSuploaded',
                                symbol: 'image://' + `${staticFilePath}` + '/icons/DSuploaded.svg'
                            },
                            {
                                name: 'DSIntermediate',
                                symbol: 'image://' + `${staticFilePath}` + '/icons/DSIntermediate.svg'
                            },
                            {
                                name: 'Python3',
                                symbol: 'image://' + `${staticFilePath}` + '/icons/python%E6%AD%A3%E5%B8%B8.svg'
                            },
                            {
                                name: 'Python3_failed',
                                symbol: 'image://' + `${staticFilePath}` + '/icons/Python%E5%A4%B1%E8%B4%A5.svg'
                            },
                            {
                                name: 'Python3_succeed',
                                symbol: 'image://' + `${staticFilePath}` + '/icons/Python%E6%88%90%E5%8A%9F.svg'
                            },
                            {
                                name: 'PySpark',
                                symbol: 'image://' + `${staticFilePath}` + '/icons/pyspark%E6%AD%A3%E5%B8%B8.svg'
                            },
                            {
                                name: 'PySpark_succeed',
                                symbol: 'image://' + `${staticFilePath}` + '/icons/Pyspark%E6%88%90%E5%8A%9F.svg'
                            },
                            {
                                name: 'PySpark_failed',
                                symbol: 'image://' + `${staticFilePath}` + '/icons/Pyspark%E5%A4%B1%E8%B4%A5.svg'
                            },
                            {
                                name: 'SparkR',
                                symbol: 'image://' + `${staticFilePath}` + '/icons/sparkR%E6%AD%A3%E5%B8%B8.svg'
                            },
                            {
                                name: 'SparkR_succeed',
                                symbol: 'image://' + `${staticFilePath}` + '/icons/SparkR%E6%88%90%E5%8A%9F.svg'
                            },
                            {
                                name: 'SparkR_failed',
                                symbol: 'image://' + `${staticFilePath}` + '/icons/SparkR%E5%A4%B1%E8%B4%A5.svg'
                            },
                            {
                                name: 'R',
                                symbol: 'image://' + `${staticFilePath}` + '/icons/R%E6%AD%A3%E5%B8%B8.svg'
                            },
                            {
                                name: 'R_succeed',
                                symbol: 'image://' + `${staticFilePath}` + '/icons/R%E6%88%90%E5%8A%9F.svg'
                            },
                            {
                                name: 'R_failed',
                                symbol: 'image://' + `${staticFilePath}` + '/icons/R%E5%A4%B1%E8%B4%A5.svg'
                            },
                            {
                                name: 'job',
                                symbol: 'image://' + `${staticFilePath}` + '/WX20211019-163226.png'
                            },
                            {
                                name: 'dataset',
                                symbol: 'image://' + `${staticFilePath}` + '/WX20211019-173847.png'
                            }
                        ],
                        data: this.datasource.nodes,
                        links: this.datasource.links,
                        lineStyle: {
                            opacity: 0.9,
                            width: 2,
                            curveness: 0
                        }
                    }
                ]
            };
            // 绘制图表
            this.dag.setOption(option)

        }
    },
    watch: {
        needRefresh(n, o) {
            this.renderDag()
        }
    }
}
</script>

<style scoped lang="scss">
.graphWrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    // height: calc(100vh - 40px);
    background: #f7f7f7;
    box-sizing: border-box;
    .job_status_area {
        position: absolute;
        bottom: 60px;
        right: 15px;
        .job_status {
            box-sizing: border-box;
            width: 240px;
            height: 70px;
            background: #FFFFFF;
            border: 1px solid #979797;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px;
            font-size: 20px;
            margin-bottom: 10px;
            .item {
                width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .title {
                color: red;
            }
            button {
                width: 59px;
                height: 32px;
                border: 1px solid #EEEDF7;
                border-radius: 2px;
                font-size: 14px;
                color: #7163C5;
                letter-spacing: 0;
                text-align: center;
                line-height: 20px;
                font-weight: 500;
                cursor: pointer;
            }
        }
    }
    
    .show_area {
        width: 100%;
        height: 100%;
        padding: 10px;
        .show_header {
            display: flex;
            justify-content: space-between;
            padding: 20px 10px;
            input, button {
                margin: 0 10px;
            }
        }
    }
    .chart {
        width: calc(100vw - 320px);
        height: calc(100vh - 90px);
        // height: 100%;
        // padding: 10px;
    }
    .opt_area {
        width: 300px;
        height: calc(100vh - 40px);
        background: #f5f5f5;
        border-left: 1px solid #979797;
        display: flex;
        flex-direction: column;
        .opt_header {
            display: flex;
            height: 40px;
            align-items: center;
            background: #fff;
            border-bottom: 1px solid #ccc;
            img {
                width: 40px;
                height: 40px;
                margin-right: 10px;
            }
        }
        .opt_icon_area {
            padding: 20px;
            display: flex;
            flex-wrap: wrap;
            overflow: hidden;
            border-bottom: 1px solid #ccc;
            img {
                width: 25px;
                height: 25px;
                margin: 10px;
                cursor: pointer;
            }
        }
        .data_id_area {
            height: 190px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-bottom: 1px solid #ccc;
            padding: 20px;
            .data_id_opt {
                .data_id_sel {
                    width: 150px;
                    height: 20px;
                    margin-left: 30px;
                    margin-top: 10px;
                }
            }
            .run_btn {
                display: flex;
                justify-content: flex-end;
                button {
                    width: 80px;
                    height: 24px;
                    background: #ececed;
                    border-radius: 2px;
                    border: none;
                    color: #BCBAC4;
                }
            }
        }
        .scripts_area {
            padding: 20px;
            .scripts_title {
                font-family: PingFangSC-Medium;
                font-size: 12px;
                color: #000000;
                text-align: center;
                font-weight: bold;
            }
            .scripts {
                margin-top: 20px;
                display: flex;
                justify-content: space-between;
                img {
                    widows: 30px;
                    height: 30px;
                }
            }
        }
    }
}
//界面未加载loading
@keyframes ldio-400lpppmiue {
    0% {
        transform: rotate(0)
    }

    100% {
        transform: rotate(360deg)
    }
}

.ldio-400lpppmiue div {
    box-sizing: border-box !important
}

.ldio-400lpppmiue>div {
    position: absolute;
    width: 68px;
    height: 68px;
    top: 16px;
    left: 16px;
    border-radius: 50%;
    border: 4px solid #000;
    border-color: #f5c924 transparent #f5c924 transparent;
    animation: ldio-400lpppmiue 1s linear infinite;
}

.ldio-400lpppmiue>div:nth-child(2),
.ldio-400lpppmiue>div:nth-child(4) {
    width: 58px;
    height: 58px;
    top: 21px;
    left: 21px;
    animation: ldio-400lpppmiue 1s linear infinite reverse;
}

.ldio-400lpppmiue>div:nth-child(2) {
    border-color: transparent #747789 transparent #747789
}

.ldio-400lpppmiue>div:nth-child(3) {
    border-color: transparent
}

.ldio-400lpppmiue>div:nth-child(3) div {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: rotate(45deg);
}

.ldio-400lpppmiue>div:nth-child(3) div:before,
.ldio-400lpppmiue>div:nth-child(3) div:after {
    content: "";
    display: block;
    position: absolute;
    width: 4px;
    height: 4px;
    top: -4px;
    left: 28px;
    background: #f5c924;
    border-radius: 0%;
    box-shadow: 0 64px 0 0 #f5c924;
}

.ldio-400lpppmiue>div:nth-child(3) div:after {
    left: -4px;
    top: 28px;
    box-shadow: 64px 0 0 0 #f5c924;
}

.ldio-400lpppmiue>div:nth-child(4) {
    border-color: transparent;
}

.ldio-400lpppmiue>div:nth-child(4) div {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: rotate(45deg);
}

.ldio-400lpppmiue>div:nth-child(4) div:before,
.ldio-400lpppmiue>div:nth-child(4) div:after {
    content: "";
    display: block;
    position: absolute;
    width: 4px;
    height: 4px;
    top: -4px;
    left: 23px;
    background: #747789;
    border-radius: 0%;
    box-shadow: 0 54px 0 0 #747789;
}

.ldio-400lpppmiue>div:nth-child(4) div:after {
    left: -4px;
    top: 23px;
    box-shadow: 54px 0 0 0 #747789;
}

#loadingio-spinner-double-ring-ho1zizxmctu {
    backdrop-filter: blur(1px);
    background: rgba(200, 0,0, 0.05);
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    display: flex;
    overflow: hidden;
    /* background: none; */
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.ldio-400lpppmiue {
    /* width: 100%;
    height: 100%; */
    position: relative;
    transform: translateZ(0) scale(0.8);
    backface-visibility: hidden;
    transform-origin: 0 0;
    /* see note above */
}

.ldio-400lpppmiue div {
    box-sizing: content-box;
}
</style>
