// import { hostName } from "../config/envConfig"

export async function phScenarioScenarioLstRouteModel() {
	// route.store.unloadAll("scenario")
	// const url = `${hostName}/hbdydatasource/query`
	// const accessToken = route.cookies.read("access_token")
	// let body = {
	// 	table: "scenario",
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
	// const pss = await fetch(url, options)
	// 	.then((response) => response.json())
	// 	.then((response) => {
	// 		route.store.pushPayload(response)
	// 		return new Promise((resolve) => {
	// 			resolve(route.store.peekAll("scenario"))
	// 		})
	// 	})

	//tags
	// let scenarios = pss.filter((it) => it)
	// let tags = new Set()
	// // scenarios.forEach((iter) => {
	// // 	if (typeof iter.label == "string") {
	// // 		iter.label = JSON.parse(iter.label)
	// // 		iter.label.map((it) => {
	// // 			tags.add(it)
	// // 		})
	// // 	}
	// // })
	// let tagsArray = Array.from(tags)
	return {
		// projectName: parseParams.query.projectName,
		// projectId: parseParams.query.projectId,
		// scenarios: scenarios,
		// tagsArray: tagsArray,
		_isVue: true
	}
}
