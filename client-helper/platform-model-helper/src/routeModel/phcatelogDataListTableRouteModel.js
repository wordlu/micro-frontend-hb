// eslint-disable-next-line no-unused-vars
export async function phcatelogDataListTableRouteModel(route, parseParams) {
    const limit = 10
    let page = parseInt(parseParams.query.page, 10)
    if (isNaN(page)) {
        page = 0
    }
    let tables = await route.store.query("table", {
        "filter[database]": parseParams.query.database,
        "page[limit]": limit,
        "page[offset]": page * limit
    })
    let name = parseParams.query.database
    return {
        tables: tables.filter((it) => it),
        name: name,
        count: tables.meta.count,
        page: page,
        _isVue: true
    }
}
