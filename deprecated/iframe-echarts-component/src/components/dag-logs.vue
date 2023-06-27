<template>
    <div>
        <div class="show_logs">
            <div class="header_area">
                <div class="script_name">{{jobName}}</div>
                <button>Retry This Job</button>
            </div>
            <div class="jobs_area">
                <div class="log-area" v-if="logsValue != ''">
                    <!-- <div class="log-content">{{emrLog}}</div> -->
                    <div class="log-content">{{logsValue}}</div>
                </div>
                
                <div class="no-logs" v-if="logsValue === ''">
                    <div class="no-log-img">
                        <img :src="img1" alt="">
                        <span>暂无Log数据</span>
                    </div>
                </div>
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
import { staticFilePath, hostName } from "../config/envConfig"

export default {
    data() {
        return{
            emrLog: "",
            jobName: "",
            loading: false,
            logsValue: "",
			img1: `${staticFilePath}` + "/list.png"
        }
    },
    props: {
        jobId: {
            type: String,
            default: "ETL_Iterator_ETL_Iterator_developer"
        },
        response: {
            type: Object,
            default: function() {
                return {"data": [{"type": "notifications", "id": "ETL_Iterator_ETL_Iterator_developer_2021-12-10T06_30_01+00_00", "attributes": {"project-id": "ETL_Iterator_ETL_Iterator_developer_compute_111out_0Jj6bBGAh6vIqs5", "owner": "", "show-name": "\u5f20\u7490", "time": -1, "code": "0", "job-desc": "max", "job-cat": "failed", "comments": "<empty>", "message": "{\"type\": \"notification\", \"opname\": \"\u5f20\u7490\", \"cnotification\": {\"jobName\": \"ETL_Iterator_ETL_Iterator_developer_compute_111out_0Jj6bBGAh6vIqs5\", \"runId\": \"ETL_Iterator_ETL_Iterator_developer_2021-12-10T06_30_01+00_00\", \"error\": \"\"}}", "date": 1639117863191}}], "meta": {"start_key": "{}"}}
            }
        }
    },
    computed: {},
    async mounted() {
        /**
         * 1. 查到log路径
         * 2. 读log文件并展示,循环发送请求，直到读取到logs信息
         */
        this.loading = true
        let runId = this.$route.query.runId
        let jobId = this.$route.query.jobId
        this.jobName = this.$route.query.jobName
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = this.getCookie( "access_token" ) || "a084652f8933a0adce8f2cec3fe0cab7012be251aa5c5ff851bdcf105f09c884"
        let body = {
            "table": "logs",
            "conditions": {
                "runId": ["=", runId],
                "jobId": ["begins_with", jobId]
            },
            "limit": 1000,
            "start_key": {}
        }

        let options = {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                "accept": "application/json"
            },
            body: JSON.stringify(body)
        }

        let path = await fetch(url, options).then(res => res.json())
        this.emrLog = path.data[0].attributes["emr-log"]
        
        const logsUrl = `${hostName}/hbquerylogfile`
        let param = this.emrLog.split("//")[1]
        let bucket = param.substring(0, param.indexOf("/"))
        let key = param.substring(param.indexOf("/")+1, param.length)
        console.log(bucket, key)
        let logsBody = {
            "bucket": bucket,
            "key": key
        }
        let logsOptions = {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                "accept": "application/json"
            },
            body: JSON.stringify(logsBody)
        }
        let result = null
        let that = this
        let clearInt = setInterval(async function() {
            result = await fetch(logsUrl, logsOptions).then(res => res.json())
            if (result.status === 1) {
                clearInterval(clearInt);
                that.logsValue = result.message
                that.loading = false
                console.log(that.logsValue)
            }
        }, 5 * 1000)
    },
    watch: {
    },
    methods: {
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        save() {
            const event = new Event("event")
            event.args = {
                callback: "addTags",
                element: this,
                param: {
                    name: "addTags",
                    selectedTags: this.selectedTags
                }
            }
            this.$emit('confirmeRunDag', event)
        },
        close() {
            this.$emit('closeRunDagDialog');
        }
    }
}
</script>

<style lang="scss" scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.show_logs {
    .jobs_area {
        padding: 20px;
        .log-area {
            display: flex;
            flex-direction: column;
            height: calc(100vh - 100px);
            overflow: auto;
            .log-content {
                // height: 400px;
                overflow: auto;
                font-family: SFProText-Thin;
                font-size: 14px;
                color: #25232D;
                letter-spacing: 0.25px;
                line-height: 20px;
                font-weight: 200;
                white-space: pre-wrap;
            }
        }
        .no-logs {
            display: flex;
            justify-content: center;
            align-items: center;
            height: calc(100vh - 100px);
            .no-log-img {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
        }
    }
    .header_area {
        padding: 10px 20px;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ccc;
        button {
            width: 123px;
            height: 32px;
            background: #7163C5;
            border-radius: 2px;
            font-size: 14px;
            color: #FFFFFF;
            text-align: center;
            line-height: 20px;
            font-weight: 500;
            border: none;
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