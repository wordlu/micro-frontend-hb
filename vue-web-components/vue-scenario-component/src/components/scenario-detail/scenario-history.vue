<template>
    <div class="scenario-history-container">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/index.css">
        <div class="scenario-history-content">
            <div class="scenario-history-search">
                <el-input v-model="searchString" class="search" placeholder="搜索"></el-input>
            </div>
            <div class="scenario-history-listAll">
                <div class="scenario-history-list">
                    <div :class="focus === index ?'scenario-history-item active' : 'scenario-history-item'"
                        v-for="(item, index) in history" :key="index" @click="historyDetail(item,index)">
                        <div class="left">
                            <p v-if="item.status==='success'" class="el-icon-success status-icon" />
                            <p v-else-if="item.status==='running'" class="el-icon-loading status-icon" />
                            <p v-else class="el-icon-error status-icon" />
                            <div class="scenario-history-item-detail">
                                <span class="name"><b>{{item.name === 'unknown' ? name : item.name}} |
                                        {{item.status}}</b></span>
                                <div class="scenario-history-time">
                                    <span>{{formatDateStandard(item["start-at"], 0)}}</span>
                                    -
                                    <span>{{formatDateStandard(item["end-at"], 3)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <p v-if="hasMore" class="scenario-history-loading" @click="loadMoreExecutionHistory">更多</p>
                <p v-if="!hasMore" class="scenario-history-loading">暂无更多</p>
            </div>
        </div>
        <div class="scenario-history-detail">
            <div class="scenario-history-detail-con">
                <div class="scenario-history-detail-top">
                    <div>
                        <span><b>{{detail.name === 'unknown' ? name : detail.name}}&nbsp;</b></span>
                        <span>{{detail.status}}</span>
                    </div>
                    <span>on&nbsp;{{formatDateStandard(detail["start-at"], 0)}}</span>
                    <span>runtime&nbsp;&nbsp;{{getTimes(detail)}}</span>
                </div>
                <div class="scenario-history-detail-bottom">
                    <span style="padding: 10px;"><b>detail</b></span>
                    <div class="detail-step">
                        <div class="detail-step-list" v-show="scenarioStepDetail.length >= 1 "
                        v-for="(item, index) in scenarioStepDetail" :key="index" >
                            <div class="detail-step-con" @click="getJobDetail(item, index)">
                                <div>
                                    <span>{{item.name}}</span>
                                </div>
                                <span>{{item.runtime}}</span>
                                <span>at&nbsp;{{formatDateStandard(item.date, 3)}}</span>
                            </div>
                            <div v-show="item.scenarioJob && item.scenarioJob.length >= 1 && item.showJob" >
                                <div class="detail-job" v-for="(iter, ind) in item.scenarioJob" :key="ind">
                                    <div>
                                        <p v-if="iter.status==='success'" class="el-icon-success status-icon" />
                                        <p v-else-if="iter.status==='running'" class="el-icon-loading status-icon" />
                                        <p v-else class="el-icon-error status-icon" />
                                        <span>{{iter['job-show-name']}}</span>
                                    </div>
                                    <div>
                                        <span>{{formatDateStandard(iter["start-at"], 3)}}</span>
                                        -
                                        <span>{{formatDateStandard(iter["end-at"], 3)}}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-show="item.scenarioJob && item.scenarioJob.length === 0  && item.showJob" class="detail-job">
                                <span>暂无job</span>
                            </div>
                        </div>
                        <div class="detail-step-con" v-show="scenarioStepDetail.length == 0">
                            step已被删除
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
//  import ElForm from "element-ui/packages/form/index"
//  import ElFormItem from "element-ui/packages/form-item/index"
 import ElInput from "element-ui/packages/input/index"
//  import ElButton from 'element-ui/packages/button/index'
//  import ElTable from 'element-ui/packages/table/index'
//  import ElTableColumn from 'element-ui/packages/table-column/index'
//  import PhDagDefinitions from "./policy/definitions/definitions"
//  import ElDialog from 'element-ui/packages/dialog/src/component'
//  // import ElTooltip from 'element-ui/packages/tooltip/index'
//  import { Message } from 'element-ui'
//  import ElInputNumber from 'element-ui/packages/input-number/index'
//  import Vue from 'vue'
//  import VTooltip from 'v-tooltip'
 
//  Vue.use(VTooltip)
 
 export default {
     components: {
         ElInput,
        //  ElButton,
        //  ElDialog,
        //  ElForm,
        //  ElFormItem,
        //  ElTable,
        //  ElInputNumber,
        //  ElTableColumn,
         // ElTooltip
     },
     data() {
         return {
            focus: 0,
            name: '未知',
            detail: {},
            scenarioExecutionDetail: [],
            // scenarioJobDetail: [],
            scenarioStepDetail: [],
            // index: 0
            // showJob: false
         }
     },
     props: {
        history: Array,
        hasMore: Boolean,
        detailList: Object,
        scenarioExecution: Array,
        scenarioStep: Array,
        // scenarioJob: Array,
        //  defs: {
        //      type: Object,
        //      default: function () {
        //          return new PhDagDefinitions("1");
        //      }
        //  },
        //  scriptParamsData: Array
     },
    watch: {
        detailList: {
            handler(newValue) {
                this.detail = newValue
            },
            deep: true
        },
        scenarioExecution: {
            handler(newValue) {
                this.scenarioExecutionDetail = newValue
            },
            deep: true
        },
        scenarioStep: {
            handler(newValue) {
                this.scenarioStepDetail = newValue
            },
            deep: true
        },
     },
     methods: {
        // 点击step显示job
        getJobDetail(item, index){
            this.$set(item, 'scenarioJob', [])
             if (item.showJob) {
                item.showJob = !item.showJob
             } else {
                 this.$set(item, 'showJob', false)
                 item.showJob = !item.showJob
             }
            if (item.showJob) {
                this.$emit("getScenarioJob",item['runner-id'],index)
            }
        },
        // 点击列表显示detail
        historyDetail(item, index){
            this.focus = index
            this.detail = {}
            this.detail = item
            this.$emit("getExecution",item['trace-id'])
        },
        loadMoreExecutionHistory() {
            this.$emit("getHistory")
        },
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
        formatDateStandard(...params) {
            if(params.length === 2) {
                let date = new Date( Number(params[0]) ),
                    Y = date.getFullYear(),
                    M = ( date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1 ),
                    D0 = ( date.getDate() < 10 ? `0${date.getDate()}` : date.getDate() ),
                    // D1 = ( date.getDate() < 10 ? `0${date.getDate()}` : date.getDate() ),

                    h = ( date.getHours() < 10 ? `0${date.getHours()}` : date.getHours() ),
                    m = ( date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes() ) ,
                    s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

                // 输出结果：yyyy/mm/dd hh:mm
                if(params[1] === 0){
                    return Y + "/" + M + "/" + D0 + " " + h + ":" + m + ":" + s
                } else if(params[1] === 1) {
                    return Y + "-" + M + "-" + D0 + " " + h + ":" + m + ":" + s
                } else if(params[1] === 2) {
                    return Y + "-" + M + "-" + D0
                } else if(params[1] === 3) {
                    return h + ":" + m + ":" + s
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
     },
     mounted() {
     },
 }
 </script>
<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }

    .active {
        background-color: #f2f2f2;
    } 

    .scenario-history-container {
        display: flex;
        flex-direction: row;
        height: calc(100vh - 90px);
        overflow: hidden;
        .status-icon {
            margin-right: 24px;
        }

        .el-icon-error {
            color: red;
        }

        .el-icon-success {
            color: green;
        }
        
        .search {
            width: 500px;
            min-width: 500px;
            padding: 10px;
        }
        
        .scenario-history-content {
            // height: calc(100vh - 90px);
            border-right: 1px solid #ddd;
        }

        .scenario-history-search {
            background-color: #f2f2f2;
            border-bottom: 1px solid #ddd;
        }

        .scenario-history-listAll {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: space-between;
            overflow: auto;
            border-bottom: 1px solid #ddd;
            height: calc(100vh - 160px);
            overflow-y: auto;

            .scenario-history-list {
                display: flex;
                flex-direction: column;
                flex-grow: 1;

                .scenario-history-item {
                    display: flex;
                    flex-direction: row;
                    height: 60px;
                    align-items: center;
                    padding: 0px 16px;
                    justify-content: space-between;
                    border-bottom: 1px solid #dddddd;
                    cursor: pointer;

                    .left {
                        display: flex;
                        align-items: center;
                    }

                    .scenario-history-item-detail {
                        display: flex;
                        flex-direction: column;

                        .scenario-history-time {
                            display: flex;
                            align-items: center;
                            flex-direction: row;
                            font-size: 14px;
                        }
                    }
                }
            }

            .scenario-history-loading {
                text-align: center;
                cursor: pointer;
            }
        }

        .scenario-history-detail {
            display: flex;
            // flex-direction: column;
            justify-content: center;
            border-left: 1px solid #f2f2f2;
            width: calc(100vw - 500px);
            height: calc(100vh - 90px);
            background-color: #f2f2f2;

            .scenario-history-detail-con {
                width: calc(100% - 100px);
                height: 100%;
                overflow-y: auto;
                padding: 20px;
                margin-top: 20px;
                background-color: #fff;
                border:1px solid #ddd;

                .scenario-history-detail-top {
                    height: 50px;
                    border-bottom: 1px solid #ddd;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                }

                .scenario-history-detail-bottom {
                    display: flex;
                    flex-direction: column;
                    padding-top: 10px;

                    .detail-step {
                        margin-left: 50px;

                        .detail-step-list{
                            margin-bottom: 10px;
                            background-color: #F2F2F2;
                        }

                        .detail-step-con {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            background-color: #f2f2f2;
                            padding: 0 10px;
                            line-height: 40px;
                            font-size: 16px;
                            cursor: pointer;

                            span {
                                line-height: 40px;
                            }
                        }

                        .detail-job{
                            background-color: #f2f2f2;
                            padding-right: 10px;
                            padding-left: 50px;
                            line-height: 40px;
                            font-size: 16px;
                            display: flex;
                            justify-content: space-between;
                        }
                    }
                }
            }
        }
    }
</style>
 
 