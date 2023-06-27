// eslint-disable-next-line no-unused-vars
import { hostName } from "../config/envConfig"

export async function phResourcesContainerEventHandler(e, route) {
    const params = e.detail[0].args.param
    // const accessToken = route.cookies.read("access_token")
    // const tenantId = route.cookies.read("company_id")
    const dealResourceStartEventName = "dealJupyterStart"
    const dealResourceStopEventName = "dealJupyterStop"
    const cookiesOptions = {
        domain: ".hubadata.com",
        path: "/"
    }
    const element = e.detail[0].args.element
    switch (e.detail[0].args.callback) {
        case "linkToPage":
            break
        case "dealResourceStart":
            route.cookies.write(
                "jupyterTraceId",
                params.traceId,
                cookiesOptions
            )
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
            route.cookies.clear("jupyterTraceId", cookiesOptions)
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

        if (status === "started") {
            element.codeeditors[0]["switch"] = true
            element.codeeditors[0]["status"] = 2
            alert("启动资源成功")
        } else if (status === "startfailed") {
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

        if (status === "stopped") {
            element.codeeditors[0]["switch"] = false
            element.codeeditors[0]["status"] = 0
            alert("关闭资源成功")
        } else if (status == "stopfailed") {
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
