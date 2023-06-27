import { hostName } from "../config/envConfig"

// eslint-disable-next-line no-unused-vars
export async function phAnalyzeDashboardsEventHandler(e, route) {
	let params = e.detail[0].args.param
	let uri = ""
	switch (e.detail[0].args.callback) {
		case "linkToPage":
			if (params.name === "clickDashboardName") {
				uri =
					"slidespage?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId +
					"&dashboardId=" +
					params.dashboardId
			}
			route.router.transitionTo("shell", uri)
			break
		case "createDashboard":
			// eslint-disable-next-line no-case-declarations
			const body = {
				table: "dashboard",
				item: params.dashboard
			}

			// eslint-disable-next-line no-case-declarations
			const url = `${hostName}/hbdydatasource/put_item`
			// eslint-disable-next-line no-case-declarations
			let headers = {
				Authorization: route.cookies.read("access_token"),
				"Content-Type": "application/vnd.api+json",
				Accept: "application/vnd.api+json"
			}
			// eslint-disable-next-line no-case-declarations
			let options = {
				method: "POST",
				headers: headers,
				body: JSON.stringify(body)
			}
			// eslint-disable-next-line no-case-declarations
			const result = await fetch(url, options) //.then((res) => res.json())
			if (result.status === 200) {
				const next =
					"slidespage?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId +
					"&dashboardId=" +
					params.dashboard.dashboardId
				route.router.transitionTo("shell", next)
			} else {
				alert("error for create dashboard")
			}
			break
		default:
			console.log("other click event!")
	}
}
