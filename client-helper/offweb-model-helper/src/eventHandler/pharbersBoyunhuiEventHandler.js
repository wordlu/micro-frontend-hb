// eslint-disable-next-line no-unused-vars
export async function pharbersBoyunhuiEventHandler(e, route) {
	switch (e.detail[0].args.callback) {
		case "linkToPage":
			if (e.detail[0].args.param.index != undefined) {
				route.router.transitionTo(
					"shell",
					`${e.detail[0].args.param.name}/${e.detail[0].args.param.index}`
				)
			} else {
				route.router.transitionTo("shell", e.detail[0].args.param.name)
			}
			break
		default:
			console.log("submit event to parent")
	}
}
