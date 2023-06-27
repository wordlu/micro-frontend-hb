import { hostName } from "../config/envConfig"

// eslint-disable-next-line no-unused-vars
export async function phAnalyzeUploadDatasetRouteModel(route, parseParams) {
	let debugToken =
		"5f674a1058c5c0d8ee6b049f07d7d1832dc97ddac7cfe0c9fb6a2dd5430f155f"
	route.store.unloadAll("dataset")
	const url = `${hostName}/hbdydatasource/query`
	const accessToken = route.cookies.read("access_token") || debugToken
	let body = {
		table: "dataset",
		conditions: {
			projectId: ["=", parseParams.query.projectId]
		},
		index_name: "dataset-projectId-name-index",
		limit: 1000,
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
	const ds = fetch(url, options)
	let that = route
	let tmp = await ds
		.then((response) => response.json())
		.then((response) => {
			console.log(response)
			that.store.pushPayload(response)
			return new Promise((resolve) => {
				resolve(that.store.peekAll("dataset"))
			})
		})

	let dss = tmp.filter((it) => it)
	let tags = new Set()
	dss.forEach((iter) => {
		if (typeof iter.label == "string") {
			iter.label = JSON.parse(iter.label)
			iter.label.map((it) => {
				tags.add(it)
			})
		}
	})
	let tagsArray = Array.from(tags)
	return {
		projectName: parseParams.query.projectName,
		projectId: parseParams.query.projectId,
		dss: dss,
		tagsArray: tagsArray,
		_isVue: true
	}
}
