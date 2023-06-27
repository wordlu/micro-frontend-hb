import { hostName } from "../config/envConfig"

// eslint-disable-next-line no-unused-vars
export async function phProjectsProjectsEventHandler(e, route) {
    const params = e.detail[0].args.param
    const accessToken = route.cookies.read("access_token")
    const tenantId = route.cookies.read("company_id")
    const dealResourceStartEventName = "dealResourceStart"
    const dealResourceStopEventName = "dealResourceStop"
    const cookiesOptions = {
        domain: ".hubadata.com",
        path: "/"
    }
    const element = e.detail[0].args.element
    switch (e.detail[0].args.callback) {
        case "linkToPage":
            window.open(
                `https://deploy.hubadata.com/projects/${params.pid}?projectName=${params.name}&projectId=${params.pid}`
            )
            break
        case "cerateProject":
            if (params) {
                let uri = `${hostName}/hbplatform/projects`
                let body = {
                    data: {
                        type: "projects",
                        attributes: {
                            provider: "huba",
                            name: params.name,
                            type: "paas",
                            owner: tenantId
                        }
                    }
                }
                let options = {
                    method: "POST",
                    headers: {
                        Authorization: accessToken,
                        "Content-Type": "application/vnd.api+json",
                        accept: "application/vnd.api+json"
                    },
                    body: JSON.stringify(body)
                }

                route.loadingService.loading.style.display = "flex"
                route.loadingService.loading.style["z-index"] = 2

                let results = await fetch(uri, options).then((res) =>
                    res.json()
                )
                if (results.data.id) {
                    alert("创建项目成功！")
                    window.location.reload()
                }
                route.loadingService.loading.style.display = "none"
            }
            break
        case "dealResourceStart":
            route.cookies.write("tenantTraceId", params.traceId, cookiesOptions)
            element.datasource.statusCode = 1
            route.noticeService.defineAction({
                type: "iot",
                remoteResource: "notification",
                runnerId: "",
                id: params.traceId,
                eventName: dealResourceStartEventName,
                projectId: "projectid",
                ownerId: route.cookies.read("account_id"),
                callBack: dealResourceStartCallback
            })
            break
        case "dealResourceStop":
            element.datasource.statusCode = 4
            route.noticeService.defineAction({
                type: "iot",
                remoteResource: "notification",
                runnerId: "",
                id: params.traceId,
                eventName: dealResourceStopEventName,
                projectId: "projectid",
                ownerId: route.cookies.read("account_id"),
                callBack: dealResourceStopCallback
            })
            break
        default:
            console.log("submit event to parent")
    }
    function dealResourceStartCallback(param, payload) {
        const { message, status } = JSON.parse(payload)
        const {
            cnotification: { error }
        } = JSON.parse(message)
        element.datasource.status = status
        if (status == "started") {
            element.datasource.statusCode = 2
            element.datasource.switch = true
        } else if (status == "startfailed") {
            element.datasource.statusCode = 0
            element.datasource.switch = false
            // let errorObj = error !== "" ? JSON.parse(error) : ""
            // let msg =
            //     errorObj["message"]["zh"] !== ""
            //         ? errorObj["message"]["zh"]
            //         : "启动资源失败，请重新操作！"
            console.log(error)
            alert("启动资源失败，请重新操作！")
        }
        route.loadingService.loading.style.display = "none"
    }
    function dealResourceStopCallback(param, payload) {
        const { message, status } = JSON.parse(payload)
        const {
            cnotification: { error }
        } = JSON.parse(message)
        element.datasource.status = status
        if (status == "stopped") {
            element.datasource.statusCode = 0
            element.datasource.switch = false
        } else if (status == "stopfailed") {
            element.datasource.statusCode = 2
            element.datasource.switch = true
            // let errorObj = error !== "" ? JSON.parse(error) : ""
            // let msg =
            //     errorObj["message"]["zh"] !== ""
            //         ? errorObj["message"]["zh"]
            //         : "关闭资源失败，请重新操作！"
            console.log(error)
            alert("关闭资源失败，请重新操作！")
        }
        route.loadingService.loading.style.display = "none"
    }
}
