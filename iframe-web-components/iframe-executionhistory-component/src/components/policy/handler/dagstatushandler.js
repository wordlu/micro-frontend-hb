import { staticFilePath, hostName } from "../../../config/envConfig"
import * as d3_base from "d3"
import * as d3_dag from "d3-dag"
export default class PhDagHandler {
    constructor(id, parent) {
        this.id = id
        this.parent = parent
        this.statesArr = {
            failed: true,
            fail: true,
            succeed: true,
            success: true,
            canceled: true,
            running: true
        }
    }

    // handleForwardMessage(event) {
    //     const that = this
    //     if (event.data.message) {
    //         if (event.data.message.cmd === "render_dag") {
    //             console.log("iframe接收的", event.data.message.cmd)
    //             this.runDagCallback(event.data.message)
    //         }
    //         if(event.data.message.cmd === "finish_dag") {
    //             console.log("iframe接收的dag finish", event.data.message.cmd)
    //             this.runDagFinishCallback(event.data.message)
    //         }
    //     }
    // }

    forwardMessageToParent(message) {
        window.parent.postMessage(message, '*')
    }

    /**
     *  trigger更新实时状态
     */
    runDagCallback(response) {
        let that = this.parent
        let _this = this
        let represent_id = ""
        let payloadArr = JSON.parse(response.payload)
        this.responseArr = payloadArr
        let data = that.datasource.data
        payloadArr.forEach(payload => {
            let cnotification = JSON.parse(payload.message).cnotification
            let status = payload["status"]
            let state = this.statesArr[status] || false
            if (!state) return false
            let jobShowName = cnotification.jobShowName
            // 1.找到对应job节点并更新状态
            data.forEach((it,index) => {
                if (jobShowName === it.attributes.name) {
                    if(status === "success") {
                        it.status = "succeed"
                    } else if(status === "failed") {
                        it.status = "failed"
                        represent_id = it.representId
                    } else if(status === "running") {
                        it.status = "running"
                    }
                }
                _this.refreshNodeStatus(it)
            })
            // 2.失败时出现弹框
            if(status === "failed") {
                let jobName = cnotification.jobName
                let runnerId = cnotification.runId
                let length = that.failedLogs.filter(it => it.jobShowName === jobShowName) //去重
                if(length < 1) {
                    that.failedLogs.push({
                        data: payload,
                        jobShowName: jobShowName,
                        representId: represent_id,
                        jobName: jobName,
                        runnerId: runnerId
                    })
                }
            }
            console.log("failedLogs", that.failedLogs)
        })
    }

    // trigger更新整体状态
    runDagFinishCallback(response) {
        let that = this.parent
        let payload = JSON.parse(response.payload)
        let status = payload["status"]
        const state = this.statesArr[status] || false
        if (!state) return false
        if (status === "running") {
            //停止按钮
            let cnotification = JSON.parse(payload.message).cnotification
            that.runId = cnotification.runId
            that.isRunning = true
        } else if(status == "success" || status == "failed") {
            // 更新进度条,去掉停止按钮
            that.progressOver = true
            that.retryButtonShow = true
            that.isRunning = false
        }
    }

    //更新节点状态
    refreshNodeStatus(node) {
        const that = this
        const d3 = Object.assign({}, d3_base, d3_dag)
        if (node["attributes"]["cat"] === "job") {
            d3.select("#" + node["attributes"]["name"]).selectAll("image")
                .attr("xlink:href", ({data}) => {
                    const cat = data.category
                    let status = data.status
                    if (status === "succeed") {
                        status = "success"
                    }
                    return that.parent.defs.iconsByName(cat, status)
                })
        }
    }
}
