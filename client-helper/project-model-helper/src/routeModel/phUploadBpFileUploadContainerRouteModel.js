import { hostName } from "../config/envConfig"

export async function phUploadBpFileUploadContainerRouteModel(
	route,
	parseParams
) {
	route.store.unloadAll("dataset")
	const url = `${hostName}/hbdydatasource/query`
	const accessToken = route.cookies.read("access_token")
	let body = {
		table: "dataset",
		conditions: {
			projectId: ["=", parseParams.query.projectId]
		},
		index_name: "dataset-projectId-name-index",
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
	const datasets = tmp.filter(
		(it) => it.cat != "catalog" && it.cat.indexOf("index") == -1
	)
	console.log(datasets)
	return {
		projectName: parseParams.query.projectName,
		projectId: parseParams.query.projectId,
		uploadType: parseParams.query.uploadType,
		datasetArr: datasets,
		_isVue: true
	}
}
