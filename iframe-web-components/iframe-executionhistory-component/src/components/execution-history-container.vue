<template>
    <div class="graphWrap">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="show_area">
            <el-switch
                    v-show="!datasource.isChanged"
                    v-model="isOnlyShowRunJobs"
                    @change="needRefresh++"
                    active-color="#13ce66" />
            <div class="viewport" ref="viewport" v-show="!datasource.isChanged">
                <div ref="chart" class="chart"></div>
            </div>
            <div v-if="datasource.isChanged">
                <JsonViewer :value="jsonMessage" copyable :expand-depth=5 :expanded="true"></JsonViewer>
            </div>
        </div>
        <div v-if="loading">
            <div id="loadingio-spinner-double-ring-ho1zizxmctu">
                <div class="ldio-400lpppmiue">
                    <div></div>
                    <div></div>
                    <div><div></div></div>
                    <div><div></div></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PhDagDatasource from "./model/datasourcev2"
import PhRenderPolicy from "./policy/render/dag-render-policy"
import PhDagDefinitions from "./policy/definitions/definitions"
import PhStatusPolicy from "./policy/handler/dagstatushandler"
import PhAlfredPolicy from "./policy/trigger/sm-trigger-policy"
import ElSwitch from "element-ui/packages/switch/index"
import JsonViewer from 'vue-json-viewer'


export default {
    data: () => {
        return {
            name: "dag",
            needRefresh: 0,
            dataRefresh: 0,
            projectId: "",
            projectName: "ETL_Iterator",
            flowVersion: "",
            runnerId: "",
            icon_header: null,
            loading: false,
            isFirstRendering: true,
            offsetLeft: 0,
            offsetTop: 0,
            isOnlyShowRunJobs: true,
            jsonMessage: {}
        };
    },
    components: {
        ElSwitch,
        JsonViewer
    },
    props: {
        datasource: {
            type: Object,
            default: function () {
                return new PhDagDatasource("1");
            }
        },
        renderPolicy: {
            type: Object,
            default: function () {
                return new PhRenderPolicy("1", this);
            }
        },
        defs: {
            type: Object,
            default: function () {
                return new PhDagDefinitions("1");
            }
        },
        eventPolicy: {
            type: Object,
            default: function () {
                return new PhStatusPolicy("1", this);
            }
        },
        triggerPolicy: {
            type: Object,
            default: function () {
                return new PhAlfredPolicy("1", this);
            }
        }
    },
    mounted() {
        this.dealUrlParam()
        this.initChart()
    },
    destroyed() {

    },
    methods: {
        dealBuildFlowQuery(response) {
            if (response.status === 0) {
                this.jsonMessage = response.message
            }
        },
        dealUrlParam() {
            let href = window.location.href
            console.log(href)
            let paramArr = href.split("?")[1].split("&")
            this.projectId = this.getUrlParam(paramArr, "projectId")
            this.projectName = this.getUrlParam(paramArr, "projectName")
            this.flowVersion = this.getUrlParam(paramArr, "flowVersion")
            this.runnerId = decodeURIComponent(this.getUrlParam(paramArr, "runnerId")).replace(" ", "+")
            this.executionTemplate = decodeURIComponent(this.getUrlParam(paramArr, "executionTemplate")).replace(" ", "+")
            // 判断环境
            this.datasource.projectId = this.projectId
            this.datasource.runnerId = this.runnerId
            this.datasource.name = this.projectName
        },
        getUrlParam(arr, value) {
            let data = arr.find((item) => item.indexOf(value) > -1);
            return data ? decodeURI(data).split("=")[1] : undefined;
        },
        async initChart() {
            // 初始化echarts实例
            await this.datasource.refreshData(this)
            await this.datasource.refreshRunJobsData(this)
            await this.datasource.selectOneElement(this)
            // 发布前解注
            document.domain = "hubadata.com"
        },
        // 监听屏幕大小改变
        bindChangeWindow() {
            window.onresize = () => {
                if (this.timer) return;

                this.timer = setTimeout(() => {
                    this.dag.resize();
                    this.timer = null;
                }, 100);
            };
        },
        getCookie(name) {
            let arr,
                reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if ((arr = document.cookie.match(reg))) return arr[2];
            else return null;
        },
        renderDag(data) {
            const that = this
            this.renderPolicy.renderDag(data, (width, height) => {
                if (that.isFirstRendering) {
                    that.isFirstRendering = false
                    const windowHeight = that.$refs.chart.offsetHeight
                    // const height = Math.max(that.datasource.sizeHit[0], windowHeight)
                    const step = Math.round(height / windowHeight)
                    const adjust = height / step / 2
                    that.offsetLeft = 0
                    that.offsetTop = height / 2 - adjust
                }
                that.$refs.viewport.scroll({
                    top: that.offsetTop,
                    left: that.offsetLeft,
                    behavior: "instant"
                })
            });
        },
        refreshData() {
            this.initChart()
        }
    },
    watch: {
        needRefresh(n, o) {
            if (this.datasource.originData.length > 0
                && this.datasource.runJobName.length > 0
                && this.datasource.cal.selected.length > 0) {
                this.datasource.refreshRenderData(this.isOnlyShowRunJobs)
                // this.datasource.refreshRenderData(false)
                this.renderDag();
            }
        },
        $route: {
            immediate:true,
            handler(){
                this.datasource.isChanged = false
                this.dealUrlParam()
                this.refreshData()
                this.datasource.buildFlowQuery(this)    
            }
        }
    }
};
</script>

<style scoped lang="scss">

    .viewport {
        overflow: auto;
    }

    .graphWrap {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        // height: calc(100vh - 40px);
        // background: #f7f7f7;
        box-sizing: border-box;
        .run-dag-select-dialog {
            display: flex;
            flex-direction: column;
            .select-area {
                display: flex;
                width: 100%;
                justify-content: center;
                .run-dag-active {
                    border: 1px solid #7163C5 !important;
                }
                .select-item {
                    width: 260px;
                    height: 65px;
                    border: 1px solid #eee;
                    margin: 0 5px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    .title {
                        font-size: 16px;
                        margin-bottom: 5px;
                        color: #000;
                    }
                    .desc {
                        font-size: 12px;
                    }
                }
            }
            .img {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 20px;
            }
        }
        .job_status_area {
            position: absolute;
            bottom: 60px;
            right: 15px;
            .job_status {
                box-sizing: border-box;
                width: 240px;
                height: 70px;
                background: #ffffff;
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
                    white-space: nowrap;
                    cursor: pointer;
                }
                .title {
                    color: red;
                }
                button {
                    width: 59px;
                    height: 32px;
                    border: 1px solid #eeedf7;
                    border-radius: 2px;
                    font-size: 14px;
                    color: #7163c5;
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
                input,
                button {
                    margin: 0 10px;
                }
            }
        }
        .chart {
            width: calc(100vw - 320px);
            height: calc(100vh - 90px);
            /*background-color: black;*/
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
                .dataset_name {
                    width: 180px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
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
                        color: #bcbac4;
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
                        width: 40px;
                        height: 40px;
                    }
                }
            }
        }
    }
    //界面未加载loading
    @keyframes ldio-400lpppmiue {
        0% {
            transform: rotate(0);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    .ldio-400lpppmiue div {
        box-sizing: border-box !important;
    }

    .ldio-400lpppmiue > div {
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

    .ldio-400lpppmiue > div:nth-child(2),
    .ldio-400lpppmiue > div:nth-child(4) {
        width: 58px;
        height: 58px;
        top: 21px;
        left: 21px;
        animation: ldio-400lpppmiue 1s linear infinite reverse;
    }

    .ldio-400lpppmiue > div:nth-child(2) {
        border-color: transparent #747789 transparent #747789;
    }

    .ldio-400lpppmiue > div:nth-child(3) {
        border-color: transparent;
    }

    .ldio-400lpppmiue > div:nth-child(3) div {
        position: absolute;
        width: 100%;
        height: 100%;
        transform: rotate(45deg);
    }

    .ldio-400lpppmiue > div:nth-child(3) div:before,
    .ldio-400lpppmiue > div:nth-child(3) div:after {
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

    .ldio-400lpppmiue > div:nth-child(3) div:after {
        left: -4px;
        top: 28px;
        box-shadow: 64px 0 0 0 #f5c924;
    }

    .ldio-400lpppmiue > div:nth-child(4) {
        border-color: transparent;
    }

    .ldio-400lpppmiue > div:nth-child(4) div {
        position: absolute;
        width: 100%;
        height: 100%;
        transform: rotate(45deg);
    }

    .ldio-400lpppmiue > div:nth-child(4) div:before,
    .ldio-400lpppmiue > div:nth-child(4) div:after {
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

    .ldio-400lpppmiue > div:nth-child(4) div:after {
        left: -4px;
        top: 23px;
        box-shadow: 54px 0 0 0 #747789;
    }

    #loadingio-spinner-double-ring-ho1zizxmctu {
        backdrop-filter: blur(1px);
        background: rgba(200, 0, 0, 0.05);
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
