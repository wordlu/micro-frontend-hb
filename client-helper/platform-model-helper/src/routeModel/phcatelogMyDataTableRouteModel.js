// eslint-disable-next-line no-unused-vars
export async function phcatelogMyDataTableRouteModel(route, parseParams) {
    const limit = 10
    let tab = parseParams.query.tab || "mine"
    let page = parseInt(parseParams.query.page, 10)
    let sortType = parseParams.query.sort || "-created"
    if (isNaN(page)) {
        page = 0
    }
    let files = route.store.query("file", {
        "filter[owner]": route.cookies.read("account_id"),
        "page[limit]": limit,
        "page[offset]": page * limit,
        sort: sortType
    })

    let database = route.store.query("db", {})
    //请求employer的数据
    await Promise.all([files, database])
    return {
        files: files.filter((it) => it),
        tab: tab,
        page: page,
        sort: sortType,
        count: files.meta.count,
        database: database.filter((it) => it),
        _isVue: true
    }
}
