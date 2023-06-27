import { hostName } from "../config/envConfig"

export async function phHistogramSlidespageRouteModel(route, parseParams) {
	let debugToken =
		"5f674a1058c5c0d8ee6b049f07d7d1832dc97ddac7cfe0c9fb6a2dd5430f155f"
	route.store.unloadAll("dashboard")
	route.store.unloadAll("slide")
	const url = `${hostName}/hbdydatasource/query`
	const accessToken = route.cookies.read("access_token") || debugToken
	const projectId = parseParams.query.projectId
	const projectName = parseParams.query.projectName
	const dashboardId = parseParams.query.dashboardId
	let body = {
		table: "dashboard",
		conditions: {
			projectId: ["=", projectId],
			dashboardId: ["=", dashboardId]
		},
		limit: 100,
		start_key: ""
	}

	let options = {
		method: "POST",
		headers: {
			Authorization: accessToken,
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			accept: "application/json"
		},
		body: JSON.stringify(body)
	}
	// const ds = fetch(url, options)
	let that = route
	const dashboardQuery = await fetch(url, options)
		.then((response) => response.json())
		.then((response) => {
			that.store.pushPayload(response)
			return new Promise((resolve) => {
				resolve(that.store.peekAll("dashboard"))
			})
		})

	const dashboard = dashboardQuery.filter((it) => it)[0]

	let body_slide = {
		table: "slide",
		conditions: {
			pdId: ["=", projectId + "_" + dashboardId]
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
	const slides = slidesQuery.filter((it) => it)

	// 请求dataset
	// route.store.unloadAll("dataset")
	const dsurl = `${hostName}/hbdydatasource/query`
	const dsaccessToken = route.cookies.read("access_token") || debugToken
	let dsbody = {
		table: "dataset",
		conditions: {
			projectId: ["=", projectId]
		},
		limit: 100,
		start_key: ""
	}

	let dsoptions = {
		method: "POST",
		headers: {
			Authorization: dsaccessToken,
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			accept: "application/json"
		},
		body: JSON.stringify(dsbody)
	}
	const ds = fetch(dsurl, dsoptions)
	let dstmp = await ds
		.then((response) => response.json())
		.then((response) => {
			that.store.pushPayload(response)
			return new Promise((resolve) => {
				resolve(that.store.peekAll("dataset"))
			})
		})

	let dss = dstmp.filter(
		(it) => it.cat !== "catalog" && it.cat.indexOf("index") === -1
	)
	return {
		projectName: projectName,
		projectId: projectId,
		dashboard: dashboard,
		datasetArr: dss,
		slides: slides,
		_isVue: true
	}
}
