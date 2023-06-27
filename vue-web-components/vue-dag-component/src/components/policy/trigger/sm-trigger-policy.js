import { hostName } from '../../../config/envConfig'

export default class PhDagTriggerPolicy {
    constructor(id, parent) {
        this.id = id
        this.parent = parent
        this.runnerId = ""
    }

    // 停止运行
    async stopDag() {
        let sel = confirm("确认停止当前dag？")
        const that = this.parent
        if(sel) {
            const stopUri = `${hostName}/hbstatemachinestop`
            const body = {
                common: {
                    traceId: this.runnerId,
                    runnerId: this.runnerId,
                    projectId: that.projectId,
                    projectName: that.projectName,
                    owner: that.getCookie("account_id") || "c89b8123-a120-498f-963c-5be102ee9082",
                    showName: that.getCookie("user_name_show") ? decodeURI(decodeURI(that.getCookie("user_name_show"))) : "dev环境",
                    tenantId: that.getCookie("company_id") || "zudIcG_17yj8CEUoCTHg"
                },
                action: {
                    cat: "stopDag",
                    desc: "stopDag",
                    comments: "something need to say",
                    message: JSON.stringify({
                        optionName: "stop_dag",
                        cat: "intermediate",
                        actionName: that.datasource.cal.calculate.name + ` (${this.runnerId})`
                    }),
                    required: true
                }
            }

            let options = {
                method: "POST",
                headers: {
                    "Authorization": this.parent.getCookie("access_token") || this.parent.datasource.debugToken,
                    "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
                    "accept": "application/json"
                },
                body: JSON.stringify(body)
            }
            let results = await fetch(stopUri, options).then(res => res.json())
            if(results.status === "error") {
                alert("停止dag失败，请重新操作！")
            }
        }
    }

    //选择运行当前或全部脚本
    runDagSelect() {
        let roots = []
        this.parent.datasource.data.forEach(item => {
            if(item.attributes.runtime === "output_index") {
                roots.push(item)
            } else if(item.attributes.ctype === "node" &&
                item.parentIds.length === 0 &&
                this.parent.datasource.cal.selected.includes(item.id)) {
                roots.push(item)
            }
        })
        let datasetsArr = []
        roots.forEach(item => {
            datasetsArr.push({
                "name": item.attributes.name,
                "representId": item.representId,
                "version": [],
                "cat": item["attributes"]["runtime"],
                "prop": item.attributes.prop !== "" ? this.handlerJSON(item.attributes.prop) : ""
            })
        })
        this.parent.textConf = {
            "datasets": datasetsArr,
            "scripts": [],
            "userConf": {}
        }
        if(datasetsArr.length < 1 || this.parent.datasource.cal.selected.length <=1) {
            alert( "请先选择一条dag!" )
            return false
        }
        this.parent.runDagSelectVisible = true
    }

    // 点击trigger，弹窗选择version
    dagRunPreparing() {
        this.parent.runDagSelectVisible = false
        this.parent.showRunJson = true
    }

    /**
     * 1. 触发整体dag运行
     * 2. 进度条清0
     * 3. 清除节点状态
     * 4. 关闭log弹窗
     * 5. 开始正常run dag流程
     */
    async runDag(data) {
        this.parent.loading = true
        this.parent.showProgress = false
        const recursive = this.parent.selectRecursive === "recursive"
        const url = `${hostName}/hbstatemachinetrigger`
        let confData = data.args.param.jsonValue
        confData.ownerId = this.parent.getCookie("account_id") || "c89b8123-a120-498f-963c-5be102ee9082"
        confData.showName = this.parent.getCookie("user_name_show") ? decodeURI(decodeURI(this.parent.getCookie("user_name_show"))) : "dev环境"
        confData.jobDesc = this.parent.registerJobEventName
        this.runnerId = this.genRunnerId(this.parent.projectName)
        const body = {
            common: {
                traceId: this.runnerId,
                runnerId: this.runnerId,
                projectId: this.parent.projectId,
                projectName: this.parent.projectName,
                owner: confData.ownerId,
                showName: confData.showName,
                tenantId: this.parent.getCookie("company_id") || "zudIcG_17yj8CEUoCTHg",
				versionAlias: data.args.param.versionAlias
            },
            action: {
                cat: "runDag",
                desc: "runDag",
                comments: "something need to say",
                message: JSON.stringify({
                    optionName: "run_dag",
                    cat: "intermediate",
                    actionName: this.parent.datasource.cal.calculate.name + ` (${this.runnerId})`
                }),
                required: true
            },
            calculate: {
                type: "dataset",
                name: this.parent.datasource.cal.calculate.name,
                conf: confData,
                recursive: recursive
            }
        }

        let options = {
            method: "POST",
            headers: {
                "Authorization": this.parent.getCookie("access_token") || this.parent.datasource.debugToken,
                "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
                "accept": "application/json"
            },
            body: JSON.stringify(body)
        }
        let results = await fetch(url, options).then(res => res.json())
        if(results.status === "failed") {
            alert("启动出错，请重新运行！")
            this.parent.loading = false
            return false
        }

        // 触发状态请求
        this.parent.dealRunDag({
            eventName: "runDagStatus",
            projectId: this.parent.projectId
        }, {
            notification: {
                runnerId: this.runnerId,
                eventName: this.parent.registerJobEventName,
                func: this.parent.runDagCallBack
            },
            executionStatus: {
                runnerId: this.runnerId,
                eventName: "executionStatus",
                func: this.parent.executionStatusCallback
            }
        })

        this.parent.showRunJson = false
        this.parent.loading = false
        this.parent.clearDag()
    }

    handlerJSON(str) {
        if (typeof str == 'string') {
            try {
                let jsonValue = JSON.parse(str);
                return jsonValue;
            } catch (e) {
                return str
            }
        }
    }

    genRunnerId(projectName, flowVersion='developer') {
        let d = new Date().toISOString()
        const i = d.indexOf(".")
        d = d.substring(0, i) + "+00:00"
        return [projectName, projectName, flowVersion, d].join("_")
    }

}
