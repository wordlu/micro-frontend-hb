// import { hostName } from "../config/envConfig"

export async function phNotebooksContainerRouteModel() {
	// route.store.unloadAll("resource")
	// const url = `${hostName}/hbdydatasource/query`
	// const accessToken = route.cookies.read("access_token")
	// const tenantId = route.cookies.read("company_id")
	// let body = {
	// 	table: "resource",
	// 	conditions: {
	// 		tenantId: ["=", tenantId]
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
	// const ds = fetch(url, options)
	// let that = route
	// let tmp = await ds
	// 	.then((response) => response.json())
	// 	.then((response) => {
	// 		console.log(response)
	// 		that.store.pushPayload(response)
	// 		return new Promise((resolve) => {
	// 			resolve(that.store.peekAll("resource"))
	// 		})
	// 	})

	// let notebooks = tmp.filter((it) => it)
	// notebooks = notebooks.filter(
	// 	(it) => it.ctype === "jupyter" || it.ctype === "c9"
	// )
	// // let dss = ds.filter((it) => it)
	// let tags = new Set()
	// notebooks.forEach((iter) => {
	// 	if (typeof iter.label === "string") {
	// 		iter.label = JSON.parse(iter.label)
	// 		iter.label.map((it) => {
	// 			tags.add(it)
	// 		})
	// 	}
	// })
	// let tagsArray = Array.from(tags)
	// console.log(notebooks)
	// console.log(tagsArray)
	return {
		// tenantId: tenantId,
		// projectName: parseParams.query.projectName,
		// projectId: parseParams.query.projectId,
		// dns: notebooks,
		// tagsArray: tagsArray,
		_isVue: true
	}
}
