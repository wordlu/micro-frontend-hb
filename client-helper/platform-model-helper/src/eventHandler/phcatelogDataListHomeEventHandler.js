// eslint-disable-next-line no-unused-vars
export async function phcatelogDataListHomeEventHandler(e, route) {
    let params = e.detail[0].args.param
    let uri = "/projects"
    switch (e.detail[0].args.callback) {
        case "linkToPage":
            if (params.name == "datasets") {
                uri =
                    "dataset-lst?projectName=" +
                    params.projectName +
                    "&projectId=" +
                    params.projectId
            } else if (params.name == "project") {
                uri = "projects/" + params.projectId
            } else if (params.name === "scripts") {
                //recipe页面
                uri =
                    "recipes?projectName=" +
                    params.projectName +
                    "&projectId=" +
                    params.projectId
            } else if (params.name === "script") {
                //script list页面
                uri =
                    "recipes?projectName=" +
                    params.projectName +
                    "&projectId=" +
                    params.projectId
            } else if (params.name === "flow") {
                uri =
                    "flow?projectName=" +
                    params.projectName +
                    "&projectId=" +
                    params.projectId
            } else if (params.name == "projects") {
                uri = "projects"
            } else if (params.name == "airflow") {
                uri =
                    "airflow?projectName=" +
                    params.projectName +
                    "&projectId=" +
                    params.projectId
            }
            //执行列表 分页
            route.router.transitionTo("shell", uri)
            break
        default:
            console.log("submit event to parent")
    }
}
