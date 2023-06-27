// eslint-disable-next-line no-unused-vars
export async function phProjectsProjectsRouteModel(route, parseParams) {
    const projects = route.store.query("project", {
        "filter[owner]": route.cookies.read("company_id")
    })
    const results = await Promise.all([projects])
    const projectsArray = results[0].filter((it) => it)

    //菜单栏个人信息
    let name_show, company_name_show, tenantId
    if (route.cookies.read("account_id")) {
        name_show = decodeURI(route.cookies.read("user_name_show"))
        company_name_show = decodeURI(route.cookies.read("company_name_show"))
        tenantId = route.cookies.read("company_id")
    }
    return {
        projects: projectsArray,
        name_show: name_show,
        company_name_show: company_name_show,
        tenantId: tenantId,
        _isVue: true
    }
}
