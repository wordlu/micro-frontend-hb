<template>
    <div class="executions-logs">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/index.css">
        <div class="job-state-change">
            <div class="title-img">
                <img :src="job_img" alt="" class="">
            </div>
            <span class="job-name">
                {{ datasource.runnerId }}
            </span>
        </div>
        <div class="job">
            <div class="job-flow">
                <!-- <div v-if="!jsonMessage">暂无数据</div>
            <viewJson v-else :JsonData="jsonMessage"></viewJson> -->
                <iframe class="executions-iframe" :src="iframeUrl" frameborder="0"></iframe>
                <div class="execution-conf">
                    <div class="title">
                        运行参数
                    </div>
                    <div class="logs">
                        <div class="logs-container" v-show="!hasError">
                            <!-- {{ datasource.dataConf }} -->
                            <JsonViewer :value="datasource.dataConf" copyable :show-array-index="false" :expand-depth=5 :expanded="true"></JsonViewer>
                        </div>
                        <div class="logs-container" v-show="hasError">
                            运行脚本参数已被删除，请联系管理员!
                        </div>
                    </div>
                </div>
            </div>
            <div class="job-activities-logs">
                <div class="job-activities">
                    <div class="title job-activities__header">
                        Activity
                    </div>
                    <div style="height: calc(100% - 75px);overflow-y: auto;">
                        <div :class="focus === index ? 'activity-item active' : 'activity-item'" @click="openActivityLogs(iter,index)"
                            v-for="(iter,index) in executionItem" :key="index">
                            <span class="job-name">
                                <p v-if="iter.status === 'success'" class="el-icon-success status-icon" />
                                <p v-else-if="iter.status==='running'" class="el-icon-loading status-icon" />
                                <p v-else class="el-icon-error status-icon" />
                                {{ iter["job-show-name"] }}
                            </span>
                            <!-- <span>{{ getTimes(executionItem) }}</span> -->
                            <div>
                                <span>{{formatDateStandard(iter["start-at"], 0)}}</span>
                                -
                                <span>{{formatDateStandard(iter["end-at"], 3)}}</span>
                                |
                                <span>{{getTimes(iter)}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="activity-logs">
                    <div class="title">
                        Activity Log
                    </div>
                    <div class="logs" style="height: 100px">
                        <div class="logs-container">
                            {{ logsMessage }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { staticFilePath } from "../../config/envConfig"
import PhExecutionHistory from "./datasource"
// import viewJson from "./bp-view-json.vue"
import { Message } from 'element-ui'
import JsonViewer from 'vue-json-viewer'

export default {
    data() {
        return {
            job_img: `${staticFilePath}` + "/job_button.svg",
            jobIndex: "",
            logsMessage: null,
            jsonMessage: null,
            executionItem: null,
            iframeUrl: "",
            projectName: "",
            executionTemplate: "",
            focus: 0 ,//默认选中第一个activity,
            dagName: '',
            hasError: null,
            runnerId: '',
            confMessage: null
        }
    },
    components: {
        // viewJson
        JsonViewer
    },
    props: {
        allData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        datasource: {
            type: Object,
            default: function () {
                return new PhExecutionHistory('1')
            }
        }
    },
    mounted() {
        let href = window.location.href
        let paramArr = href.split("?")[1].split("&")
        this.datasource.projectId = this.getUrlParam(paramArr, "projectId")
        this.datasource.runnerId = this.getUrlParam(paramArr, "runnerId")
        this.runnerId = this.getUrlParam(paramArr, "runnerId")
        this.projectName = this.getUrlParam(paramArr, "projectName")
        this.dagName = this.projectName + "_" + this.projectName + "_developer"
        this.datasource.buildActivityQuery(this, this.datasource.runnerId, () => {
            this.executionItem = this.datasource.dataActivity
            if (this.executionItem.length >= 1) {
                this.datasource.jobName = this.executionItem[0]['job-name']
                this.executionTemplate = this.executionItem[0]['execution-template']
                this.datasource.jobIndex = this.executionItem[0]['job-index']
                this.datasource.buildLogsQuery(this)
                this.datasource.buildExecutionQuery(this)
                this.datasource.buildConfQuery(this,()=>{
                    // this.confMessage = this.datasource.dataConf
                })
            }
        })
        // this.datasource.buildExecutionQuery(this)
    },
    methods: {
        getUrlParam(arr, value) {
            let data = arr.find(item => item.indexOf(value) > -1)
            return data ? decodeURI(data).split("=")[1] : undefined
        },
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            arr = document.cookie.match(reg)
            if (arr) return (arr[2]);
            else return null;
        },
        dealBuildLogsQuery(response) {
            this.logsMessage = ''
            if (response.status === 0) {
                this.logsMessage = response.message
            } else {
                Message({
                    type: 'error',
                    showClose: true,
                    duration: 3000,
                    message: '数据暂未生成，请刷新重试！'
                })
            }
        },
        dealBuildFlowQuery(response) {
            if (response.status === 0) {
                this.jsonMessage = response.message
            }
        },
        dealBuildExecutionQuery(response) {
            if (response.data.length > 0) {
                this.iframeUrl = `https://executions.hubadata.com/#/history?projectName=${this.projectName}&projectId=${this.datasource.projectId}&jobName=${this.datasource.jobName}&runnerId=${this.datasource.runnerId}&executionTemplate=${this.executionTemplate}`
                // this.datasource.buildLogsQuery(this)
                this.datasource.buildFlowQuery(this)
            }
        },
        openActivityLogs(iter, index){
            this.focus = index
            this.datasource.jobIndex = this.executionItem[index]['job-index']
            this.datasource.buildLogsQuery(this)
            // this.dealBuildLogsQuery(this, iter['job-index'])
        },
        formatDateStandard(...params) {
            if(params.length === 2) {
                let date = new Date( Number(params[0]) ),
                    Y = date.getFullYear(),
                    M =
                        ( date.getMonth() + 1 < 10 ?
                            `0${date.getMonth() + 1}` :
                            date.getMonth() + 1 ),
                    D0 = ( date.getDate() < 10 ? `0${date.getDate()}` : date.getDate() ),
                    D1 = ( date.getDate() < 10 ? `0${date.getDate()}` : date.getDate() ),

                    h =
                        ( date.getHours() < 10 ? `0${date.getHours()}` : date.getHours() ),
                    m =
                        ( date.getMinutes() < 10 ?
                            `0${date.getMinutes()}` :
                            date.getMinutes() ) ,
                    s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

                // 输出结果：yyyy/mm/dd hh:mm
                if(params[1] === 0){
                    return Y + "/" + M + "/" + D0 + " " + h + ":" + m
                } else if(params[1] === 1) {
                    return Y + "-" + M + "-" + D0 + " " + h + ":" + m
                } else if(params[1] === 2) {
                    return Y + "-" + M + "-" + D0
                } else if(params[1] === 3) {
                    return h + ":" + m
                }
            }
        },
        getTimes(data) {
            if (data["end-at"] === "") {
                return "0" + " s"
            }
            let timeDiff = (data["end-at"] - data["start-at"]) / 1000
            if (timeDiff > 60) {
                let min = Math.floor(timeDiff / 60)
                let s = Math.floor(timeDiff % 60)
                return String(min) + " min " + s + " s "
            }
            return String(timeDiff) + " s"
        }
    }
}
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.active {
    background-color: #ccc;
}

.executions-logs {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 40px);
    flex-grow: 1;

    .job-state-change {
        height: 48px;
        border-bottom: 1px solid #ddd;
        display: flex;
        align-items: center;

        .title-img {
            width: 48px;
            height: 48px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            background: #8541aa;
            margin-right: 10px;
        }
    }

    .job {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 88px);

        .job-flow {
            overflow: hidden;
            flex-grow: 1;
            height: 50px;
            display: flex;

            .executions-iframe {
                height: 100%;
                // min-height: 350px;
                width: 70%;
                overflow-y: scroll;
            }

            .execution-conf {
                width: 30%;
                height: 100%;
                border-left: 1px solid #ddd;
                padding: 20px;
                .title {
                    padding-bottom: 20px;
                }
                .logs {
                    overflow-y: auto;
                    padding: 10px;
                    height: calc(100% - 30px);
                    .logs-container {
                        font-size: 16px;
                    }
                }
            }
        }

        .job-activities-logs {
            flex-grow: 1;
            display: flex;
            border-top: 1px solid #ddd;
            height: 50px;

            .title {
                height: 60px;
                padding: 20px;
            }

            .job-activities {
                display: flex;
                flex-direction: column;
                border-right: 1px solid #ddd;
                flex: 1;
                height: 100%;
                // min-height: 350px;

                .job-activities__header {
                    background: #f2f2f2;
                    border-bottom: 1px solid #ddd;
                }

                .activity-item {
                    height: 48px;
                    padding: 0 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #f2f2f2;

                    .status-icon {
                        margin-right: 24px;
                    }

                    .el-icon-error {
                        color: red;
                    }

                    .el-icon-success {
                        color: green;
                    }
                }
            }

            .activity-logs {
                height: 100%;
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;

                .logs {
                    flex-grow: 1;
                    overflow-x: auto;
                    overflow-y: scroll;
                    font-family: SFProText-Thin;
                    font-size: 14px;
                    color: #25232D;
                    letter-spacing: 0.25px;
                    line-height: 20px;
                    font-weight: 200;
                    white-space: pre-wrap;
                    padding: 20px 40px;
                }
            }
        }
    }

}

/deep/.jv-node {
        position: relative
    }
    
    /deep/.jv-node:after {
        content: ","
    }
    
    /deep/.jv-node:last-of-type:after {
        content: ""
    }
    
    /deep/.jv-node.toggle {
        margin-left: 13px !important
    }
    
    /deep/.jv-node .jv-node {
        margin-left: 25px
    }
    
    /deep/.jv-container {
        box-sizing: border-box;
        position: relative
    }
    
    /deep/.jv-container.boxed {
        // border: 1px solid #eee;
        border-radius: 6px
    }
    
    /deep/.jv-container.boxed:hover {
        box-shadow: 0 2px 7px rgba(0, 0, 0, .15);
        border-color: transparent;
        position: relative
    }
    
    /deep/.jv-container.jv-light {
        background: #fff;
        white-space: nowrap;
        color: #525252;
        font-size: 14px;
        font-family: Consolas, Menlo, Courier, monospace
    }
    
    /deep/.jv-container.jv-light .jv-ellipsis {
        color: #999;
        background-color: #eee;
        display: inline-block;
        line-height: .9;
        font-size: .9em;
        padding: 0 4px 2px;
        margin: 0 4px;
        border-radius: 3px;
        vertical-align: 2px;
        cursor: pointer;
        -webkit-user-select: none;
        user-select: none
    }
    
    /deep/.jv-container.jv-light .jv-button {
        color: #49b3ff
    }
    
    /deep/.jv-container.jv-light .jv-key {
        color: #111;
        margin-right: 4px
    }
    
    /deep/.jv-container.jv-light .jv-item.jv-array {
        color: #111
    }
    
    /deep/.jv-container.jv-light .jv-item.jv-boolean {
        color: #fc1e70
    }
    
    /deep/.jv-container.jv-light .jv-item.jv-function {
        color: #067bca
    }
    
    /deep/.jv-container.jv-light .jv-item.jv-number {
        color: #fc1e70
    }
    
    /deep/.jv-container.jv-light .jv-item.jv-object {
        color: #111
    }
    
    /deep/.jv-container.jv-light .jv-item.jv-undefined {
        color: #e08331
    }
    
    /deep/.jv-container.jv-light .jv-item.jv-string {
        color: #42b983;
        word-break: break-word;
        white-space: normal
    }
    
    /deep/.jv-container.jv-light .jv-item.jv-string .jv-link {
        color: #0366d6
    }
    
    /deep/.jv-container.jv-light .jv-code .jv-toggle:before {
        padding: 0 2px;
        border-radius: 2px
    }
    
    /deep/.jv-container.jv-light .jv-code .jv-toggle:hover:before {
        background: #eee
    }
    
    /deep/.jv-container .jv-code {
        overflow: hidden;
        padding: 30px 20px
    }
    
    /deep/.jv-container .jv-code.boxed {
        max-height: 300px
    }
    
    /deep/.jv-container .jv-code.open {
        max-height: none !important;
        overflow: visible;
        overflow-x: auto;
        padding-bottom: 45px
    }
    
    /deep/.jv-container .jv-toggle {
        background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE2IiB3aWR0aD0iOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjNjY2IiBkPSJNMCAwbDggOC04IDh6Ii8+PC9zdmc+);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: 50%;
        cursor: pointer;
        width: 10px;
        height: 10px;
        margin-right: 2px;
        display: inline-block;
        -webkit-transition: -webkit-transform .1s;
        transition: -webkit-transform .1s;
        transition: transform .1s;
        transition: transform .1s, -webkit-transform .1s
    }
    
    /deep/.jv-container .jv-toggle.open {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg)
    }
    
    /deep/.jv-container .jv-more {
        position: absolute;
        z-index: 1;
        bottom: 0;
        left: 0;
        right: 0;
        height: 40px;
        width: 100%;
        text-align: center;
        cursor: pointer
    }
    
    /deep/.jv-container .jv-more .jv-toggle {
        position: relative;
        top: 40%;
        z-index: 2;
        color: #888;
        -webkit-transition: all .1s;
        transition: all .1s;
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg)
    }
    
    /deep/.jv-container .jv-more .jv-toggle.open {
        -webkit-transform: rotate(-90deg);
        transform: rotate(-90deg)
    }
    
    /deep/.jv-container .jv-more:after {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        background: -webkit-linear-gradient(top, transparent 20%, hsla(0, 0%, 90.2%, .3));
        background: linear-gradient(180deg, transparent 20%, hsla(0, 0%, 90.2%, .3));
        -webkit-transition: all .1s;
        transition: all .1s
    }
    
    /deep/.jv-container .jv-more:hover .jv-toggle {
        top: 50%;
        color: #111
    }
    
    /deep/.jv-container .jv-more:hover:after {
        background: -webkit-linear-gradient(top, transparent 20%, hsla(0, 0%, 90.2%, .3));
        background: linear-gradient(180deg, transparent 20%, hsla(0, 0%, 90.2%, .3))
    }
    
    /deep/.jv-container .jv-button {
        position: relative;
        cursor: pointer;
        display: inline-block;
        padding: 5px;
        z-index: 5
    }
    
    /deep/.jv-container .jv-button.copied {
        opacity: .4;
        cursor: default
    }
    
    /deep/.jv-container .jv-tooltip {
        position: absolute
    }
    
    /deep/.jv-container .jv-tooltip.right {
        right: 15px
    }
    
    /deep/.jv-container .jv-tooltip.left {
        left: 15px
    }
    
    /deep/.jv-container .j-icon {
        font-size: 12px
    }
</style>
