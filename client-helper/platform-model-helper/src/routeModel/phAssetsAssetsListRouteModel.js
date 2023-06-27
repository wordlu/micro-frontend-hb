// eslint-disable-next-line no-unused-vars
export async function phAssetsAssetsListRouteModel(route, parseParams) {
    let tab = parseParams.query.tab || "mine"

    // let database = await route.store.query("db", {})
    return {
        tab: tab,
        // database: database.filter((it) => it),
        _isVue: true
    }
}
