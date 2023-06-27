// import { hostName } from "../config/envConfig"

export async function phScriptsLstContainerRouteModel() {
	// route.store.unloadAll("dagConf")
	// route.store.unloadAll("dataset")
	// const url = `${hostName}/hbdydatasource/query`
	// const accessToken = route.cookies.read("access_token")
	// let body = {
	// 	table: "dagconf",
	// 	conditions: {
	// 		projectId: ["=", parseParams.query.projectId]
	// 		// "sortVersion": ["begins_with", "developer_"]
	// 	},
	// 	limit: 100,
	// 	start_key: ""
	// }

	// let options = {
	// 	method: "POST",
	// 	headers: {
	// 		Authorization: accessToken,
	// 		"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
	// 		accept: "application/json"
	// 	},
	// 	body: JSON.stringify(body)
	// }
	// const dc = await fetch(url, options)
	// 	.then((response) => response.json())
	// 	.then((response) => {
	// 		route.store.pushPayload(response)
	// 		return new Promise((resolve) => {
	// 			resolve(route.store.peekAll("dagConf"))
	// 		})
	// 	})

	// let body1 = {
	// 	table: "dataset",
	// 	conditions: {
	// 		projectId: ["=", parseParams.query.projectId]
	// 		// "sortVersion": ["begins_with", "developer_"]
	// 	},
	// 	index_name: "dataset-projectId-name-index",
	// 	limit: 100,
	// 	start_key: {}
	// }

	// let options1 = {
	// 	method: "POST",
	// 	headers: {
	// 		Authorization: accessToken,
	// 		"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
	// 		accept: "application/json"
	// 	},
	// 	body: JSON.stringify(body1)
	// }
	// const ds = await fetch(url, options1)
	// 	.then((response) => response.json())
	// 	.then((response) => {
	// 		route.store.pushPayload(response)
	// 		return new Promise((resolve) => {
	// 			resolve(route.store.peekAll("dataset"))
	// 		})
	// 	})
	//tags
	// let dss = ds.filter((it) => it)
	// let tags = new Set()
	// dss.forEach((iter) => {
	// 	if (typeof iter.label == "string") {
	// 		iter.label = JSON.parse(iter.label)
	// 		iter.label.map((it) => {
	// 			tags.add(it)
	// 		})
	// 	}
	// })
	// let tagsArray = Array.from(tags)
	return {
		// projectName: parseParams.query.projectName,
		// projectId: parseParams.query.projectId,
		// dcs: dc.filter((it) => it),
		// dss: dss,
		// tagsArray: tagsArray,
		_isVue: true
	}
}
