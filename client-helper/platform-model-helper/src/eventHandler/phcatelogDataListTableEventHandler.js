// eslint-disable-next-line no-unused-vars
export async function phcatelogDataListTableEventHandler(e, route) {
    let param = e.detail[0].args.param
    let element = e.detail[0].args.element
    const limit = 100
    let storage = window.localStorage
    let requestParam = e.detail[0].args.param
    let page = requestParam.queryParams.page || 0
    let nextToken = ""
    let partTables = null
    switch (e.detail[0].args.callback) {
        case "linkToPage":
            if (param.index != undefined) {
                if (param.queryParams) {
                    route.router.transitionTo(
                        "shell",
                        `${param.name}/${param.index}?${param.queryParams}`
                    )
                } else {
                    route.router.transitionTo(
                        "shell",
                        `${param.name}/${param.index}`
                    )
                }
            } else {
                if (param.queryParams) {
                    route.router.transitionTo(
                        "shell",
                        `${param.name}?${param.queryParams}`
                    )
                } else {
                    route.router.transitionTo("shell", param.name)
                }
            }
            break
        case "requestData":
            if (page != 0) {
                nextToken = JSON.parse(storage.getItem("partitionsToken"))[page]
            }
            partTables = await route.store.query(requestParam.name, {
                "filter[database]": requestParam.queryParams.database,
                "filter[table]": requestParam.queryParams.table,
                "page[limit]": limit,
                nextToken: nextToken
            })
            if (
                partTables.meta &&
                partTables.meta.token &&
                partTables.meta.token.length > 0
            ) {
                storage.setItem(
                    "partitionsToken",
                    JSON.stringify(partTables.meta.token)
                )
            }
            element.allData.partitionsCount = partTables.meta.count
            element.allData.partTables = partTables.filter(function (item) {
                return item.schema !== null
            })
            // this.random = Math.random()
            break
        default:
            console.log("submit event to parent")
    }
}
