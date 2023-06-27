// eslint-disable-next-line no-unused-vars
export async function pharbersArticlesListEventHandler(e, route) {
	let params = e.detail[0].args.param
	switch (e.detail[0].args.callback) {
		case "linkToPage":
			if (params.index != undefined) {
				route.router.transitionTo(
					"shell",
					`${params.name}/${params.index}`
				)
			} else {
				route.router.transitionTo(
					"shell",
					`${params.name}?uri=${params.uri}`
				)
			}
			break
		default:
			console.log("submit event to parent")
	}
}
