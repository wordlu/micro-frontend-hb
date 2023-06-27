<template>
    <div class="page_container">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css"/>
        <div class="header">
             <div class="title">
                <img :src="defs.iconsByName(datasource.runtime)" class="title_icon" alt="">
                <!-- <img :src="defs.iconsByName('pyspark')" class="title_icon" alt=""> -->
                <span class="name">compute_{{datasource.outputs}}</span>
            </div>
            <div class="coding-title">
                <!-- <button class="button btn-fir">操作</button> -->
                <el-button class="button" @click="saveCode">保存</el-button>
                <el-button class="button btn-fir">运行</el-button>
            </div>
        </div>
        <div class="codeditor-container">
            <div class="code-io-list">
                <div class="dataset">数据集</div>
                <div class="code-block-list">
                    <div class="ints">
                        <span class="title">Inputs</span>
                        <span class="line"></span>
                    </div>
                    <div class="ds-lst">
                        <div class="ds-item" v-for="(item, index) in datasource.inputs" :key="index">
                            <span >{{item}}</span>
                            <div>
                                <img :src="defs.iconsByName('codeditor', 'table')" alt="">
                                <img :src="defs.iconsByName('codeditor', 'setting')" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="code-block-list code-block-list-last">
                    <div class="ints">
                        <span class="title">Output</span>
                        <span class="line"></span>
                    </div>
                    <div class="ds-lst">
                        <div class="ds-item">
                            <span>{{datasource.outputs}}</span>
                            <div>
                                <img :src="defs.iconsByName('codeditor', 'table')" alt="">
                                <img :src="defs.iconsByName('codeditor', 'setting')" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="coding-pane">
                <div class="coding">
                    <iframe ref="scriptCodeEditor" id="scriptCodeEditor" class="executions-iframe" :src="iframeUrl" frameborder="0" style="width: 100%; height: 100%;"></iframe>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PhCodeditorDatasource from "./model/datasource"
import PhDagDefinitions from "./policy/definitions/definitions";
import ElButton from 'element-ui/packages/button/index'
import AWS from "aws-sdk"
import { hostName } from "../config/envConfig"
import { Message } from 'element-ui'

export default {
    name: 'codeditor-page',
    components: {
        ElButton,
    },
    props: {
        iframeUrl: {
            type: String,
            // default: "http://localhost:8081/hbcodeditor/"
            default: "https://codeditor.hubadata.com/hbcodeditor"
        },
        scriptName: {
            type: String,
            default: "脚本名称"
        },
        flowVersion: {
            type: String,
            default: "developer"
        },
        datasource: {
            type: Object,
            default: function() {
                return new PhCodeditorDatasource('1', this.projectId, this.jobId, this)
            }
        },
        s3: {
            type: Object,
            default: function() {
                return new AWS.S3({
                    accessKeyId: "AKIAWPBDTVEAMBDRQWIQ",
                    secretAccessKey: "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",
                    region: "cn-northwest-1"
                })
            }
        },
        defs: {
            type: Object,
            default: function () {
                return new PhDagDefinitions("1");
            }
        }
    },
    data() {
        return {
            downloadCode: 0,
            codeBuffer: "",
            projectId: "",
            jobId: "",
            // codeEditorContent: ""
        }
    },
    async mounted() {
        /* TODO : 如何使用 IFrame嵌入 CodeEditor
            1、初始化: 使用PostMessage 在mounted时发送消息给 CodeEditor (必须要在IFrame加载完毕后初始化)
                1.1、editorId: 当前CodeEditor的id 唯一标识
                1.2、value: 当前CodeEditor的内容
                1.3、language: 当前CodeEditor的语言
                1.4、viewHeight: 当前CodeEditor的高度
                1.5、maxLines: 当前CodeEditor的最大行数
                1.6、theme: 当前CodeEditor的主题
            2、注册消息 获取Editor的内容
            3、添加beforeDestroy钩子函数 在销毁时注销以前注册的消息，不然会重复注册
         */
        let href = window.location.href
        let paramArr = href.split("?")[1].split("&")
        this.projectId = this.getUrlParam(paramArr, "projectId")
        this.jobId = this.getUrlParam(paramArr, "jobId")
        //父组件传进来的值
        this.datasource.jobId = this.jobId //decodeURI(this.jobName)
        this.datasource.projectId = this.projectId
		// 将datasource注册到window中，iframe传递消息this指向为window
		window["datasource"] = this.datasource
        this.initEditor()

    },
    watch: {
        async downloadCode() {
            let data = await this.queryData()
            this.codeBuffer = data.message.data
            this.setEditorValue()
        }
    },
    methods: {
        registerEvent() {
			this.unRegisterEvent()
            // 注册获取Editor内容事件
            window.addEventListener("message", this.datasource.getEditorContentEvent);
            window.addEventListener("message", this.datasource.iframeComplete);
        },
        unRegisterEvent() {
            window.removeEventListener("message", this.datasource.getEditorContentEvent);
            window.removeEventListener("message", this.datasource.iframeComplete);
        },
        initEditor() {
            // const iframe = document.getElementById("scriptCodeEditor")
            const iframe = this.$refs.scriptCodeEditor
            iframe.onload = function () {
                iframe.contentWindow.postMessage({
                    codeEditorParameters: {
                        editorId: "codeEditor",
                        // value: this.codeBuffer,
                        viewHeight: "calc(100vh - 180px)",
                        language: "python",
                        maxLines: 5000,
                        theme: "github"
                    }
                }, "*")
            }
            this.registerEvent()
        },
        iframeComplete(event) {
            if(event.data.editorStaus === "complete") {
                this.datasource.refreshData(this)
            }
        },
        setEditorValue() {
            // const iframe = document.getElementById("scriptCodeEditor")
            const iframe = this.$refs.scriptCodeEditor
            iframe.contentWindow.postMessage({
                codeValue: this.codeBuffer
            }, "*")

        },
        async getEditorContentEvent(event) {
            if (event.data.editorId === "codeEditor") {
                console.info(event.data)
                const codeEditorContent = event.data.content
                console.info(codeEditorContent)
                let url = `${hostName}/hbupdatejobcode`
                const accessToken = this.getCookie("access_token") || this.datasource.debugToken
                let body = {
                    "bucket": "hb-platform",
                    "key": this.datasource.codeKey,
                    "file_name": this.datasource.file_name,
                    "data": encodeURI(codeEditorContent),
                    "timespan": new Date().getTime()
                }
                let options = {
                    method: "POST",
                    headers: {
                        "Authorization": accessToken,
                        'Content-Type': 'application/json; charset=UTF-8',
                        "accept": "application/json"
                    },
                    body: JSON.stringify(body)
                }
                let result = await fetch(url, options).then(res => res.json())
                if (result.status === 1) {
                    Message({
                        type: 'success',
                        showClose: true,
                        duration: 3000,
                        message: '脚本保存成功！'
                    })
                } else {
                    Message({
                        type: 'error',
                        showClose: true,
                        duration: 30000,
                        message: '脚本保存失败！'
                    })
                }
                this.downloadCode++
            }

        },
        getUrlParam(arr, value) {
            let data = arr.find(item => item.indexOf(value) > -1)
            return data ? decodeURI(data).split("=")[1] : undefined
        },
        async queryData() {
            let url = `${hostName}/hbqueryjobcode`
            const accessToken = this.getCookie("access_token") || this.datasource.debugToken
            let body = {
                "bucket": this.datasource.bucket,
                "key": this.datasource.codeKey,
                "file_name": this.datasource.file_name
            }
            let options = {
                method: "POST",
                headers: {
                    "Authorization": accessToken,
                    'Content-Type': 'application/json; charset=UTF-8',
                    "accept": "application/json"
                },
                body: JSON.stringify(body)
            }
            let result = await fetch(url, options).then(res => res.json())
            return result
        },
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
            arr = document.cookie.match(reg)
            if (arr) return (arr[2])
            else return null
        },
        saveCode() {
            // let target = event.target;
            // if (target.nodeName == "SPAN") {
            //     target = event.target.parentNode;
            // }
            // target.blur();
            const iframe = this.$refs.scriptCodeEditor
            iframe.contentWindow.postMessage({
                getValue: { editorId: "codeEditor" }
            }, "*")
        }
    },
    beforeDestroy() {
        this.unRegisterEvent()
    }
}
</script>

<style lang='scss' scoped>
.page_container {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        padding: 0 20px;
        border-bottom: 1px solid #ccc;
        .title_icon {
            height: 30px;
            width: 30px;
        }
        .title {
            display: flex;
            align-items: center;
            .title_icon {
                margin-right: 10px;
            }
        }
        .coding-title {
            display: flex;
            .button {
                width: 70px;
                height: 40px;
                line-height: 8px;
                border: 1px solid #DCDFE6;
                border-radius: 2px;
                background: #fff;
                cursor: pointer;
            }
            .btn-fir {
                margin-left: 10px;
            }
        }
    }
    .codeditor-container {
        display: flex;
        flex-direction: row;
        height: calc(100vh - 80px);
        .code-io-list {
            display: flex;
            flex-direction: column;
            min-width: 180px;
            border-right: 1px solid #ccc;
            text-align: left;
            .dataset {
                height: 40px;
                margin-left: 20px;
                margin-top: 10px;
            }
            .code-block-list-last {
                margin-top: 20px;
            }
            .code-block-list {
                display: flex;
                flex-direction: column;
                .ints {
                    display: flex;
                    align-items: center;
                    margin-left: 5px;
                    font-size: 14px;
                }
                .title {
                    font-size: 14px;
                    margin-right: 3px;
                }
                .line {
                    width: 140px;
                    border-bottom: 1px solid #ddd;
                    height: 0;
                    display: block;

                }
                .ds-lst {
                    display: flex;
                    flex-direction: column;

                    .ds-item {
                        font-size: 12px;
                        margin-left: 20px;
                        height: 40px;
                        line-height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        span {
                            display: block;
                            white-space: nowrap;
                            width: 100px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        img {
                            width: 10px;
                            height: 10px;
                            padding-right: 10px;
                        }
                    }
                }

            }
        }

        .coding-pane {
            width: 100%;
            display: flex;
            flex-direction: column;
            padding: 30px;
            .coding {
                height: 100%;
                padding-bottom: 7px;
            }
        }
    }
}
</style>
