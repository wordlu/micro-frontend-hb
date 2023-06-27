import { hostName } from "../config/envConfig"

export async function phHistogramInsightpageRouteModel(route, parseParams) {
	let debugToken =
		"5f674a1058c5c0d8ee6b049f07d7d1832dc97ddac7cfe0c9fb6a2dd5430f155f"
	route.store.unloadAll("dashboard")
	route.store.unloadAll("slide")
	const projectId = parseParams.query.projectId
	const projectName = parseParams.query.projectName
	const dashboardId = parseParams.query.dashboardId
	const slideId = parseParams.query.slideId
	const contentId = parseParams.query.contentId

	const url = `${hostName}/hbdydatasource/query`
	const accessToken = route.cookies.read("access_token") || debugToken

	let that = route
	let body_slide = {
		table: "slide",
		conditions: {
			pdId: ["=", projectId + "_" + dashboardId],
			slideId: ["=", slideId]
		},
		limit: 100,
		start_key: ""
	}

	let options_slide = {
		method: "POST",
		headers: {
			Authorization: accessToken,
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			accept: "application/json"
		},
		body: JSON.stringify(body_slide)
	}

	const slidesQuery = await fetch(url, options_slide)
		.then((response) => response.json())
		.then((response) => {
			that.store.pushPayload(response)
			return new Promise((resolve) => {
				resolve(that.store.peekAll("slide"))
			})
		})
	const slide = slidesQuery.filter((it) => it)[0]
	return {
		projectName: projectName,
		projectId: projectId,
		dashboardId: dashboardId,
		slide: slide,
		contentId: contentId,
		_isVue: true
	}
}
