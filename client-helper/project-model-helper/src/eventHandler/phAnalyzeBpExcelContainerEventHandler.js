import { hostName } from "../config/envConfig"

// eslint-disable-next-line no-unused-vars
export async function phAnalyzeBpExcelContainerEventHandler(e, route) {
	let params = e.detail[0].args.param
	let uri = ""
	const element = e.detail[0].args.element
	// const editSampleEventName = "editSampleEventName"
	// const eventName = "changeSchemaType"
	switch (e.detail[0].args.callback) {
		case "linkToPage":
			if (params.name === "project") {
				//返回project
				uri = `projects/${this.projectId}?projectName=${this.projectName}&projectId=${this.projectId}`
			} else if (params.name == "datasets") {
				uri =
					"/dataset-lst?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name === "scripts") {
				uri =
					"/recipes?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name == "flow") {
				uri =
					"/flow?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name == "airflow") {
				uri =
					"/airflow?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			}
			route.router.transitionTo(uri)
			break
		case "changeSchemaType":
			if (params) {
				route.loadingService.loading.style.display = "flex"
				const url = `${hostName}/hbconvertdatatypeofcache`
				const body = JSON.stringify({
					common: {
						projectId: params.projectId,
						tenantId: route.cookies.read("company_id"),
						datasetName: params.datasetName
					},
					mappings: [
						{
							column: params.title,
							from: params.originalType,
							to: params.itemValueType
						}
					]
				})
				let options = {
					method: "POST",
					headers: {
						Authorization: route.cookies.read("access_token"),
						"Content-Type":
							"application/x-www-form-urlencoded; charset=UTF-8",
						accept: "application/json"
					},
					body
				}
				const result = await fetch(url, options).then((res) =>
					res.json()
				)

				const { status, message } = result

				if (status == "success") {
					alert("修改成功")
				} else {
					alert(message)
					element.itemValueType = params.originalType
					element.selectValue = params.originalType
				}
				route.loadingService.loading.style.display = "none"
			}
			break
		case "clickSample":
			if (params) {
				const url = `${hostName}/hbdydatasource/put_item`
				const sampleUrl = `${hostName}/hbsampletrigger`
				const accessToken = route.cookies.read("access_token")
				const runnerId = genRunnerId("sample")
				route.loadingService.loading.style.display = "flex"
				route.loadingService.loading.style["z-index"] = 2
				params.targetDataset.sample = params.sample
				params.targetDataset.projectId = params.projectId
				params.targetDataset.id = params.datasetId
				let sourceProjectIdValue = ""
				if (params.targetDataset.cat === "catalog") {
					// 与后端沟通,catalog类型的projectId都是一个，暂时写死
					sourceProjectIdValue = "zudIcG_17yj8CEUoCTHg"
				} else {
					sourceProjectIdValue = params.projectId
				}
				// 更新dataset表
				let body = {
					table: "dataset",
					item: params.targetDataset
				}
				let options = {
					method: "POST",
					headers: {
						Authorization: accessToken,
						"Content-Type":
							"application/x-www-form-urlencoded; charset=UTF-8",
						accept: "application/json"
					},
					body: JSON.stringify(body)
				}
				await fetch(url, options)
				let sampleBody = {
					common: {
						runnerId: runnerId,
						projectId: params.projectId,
						projectName: "sample",
						owner: route.cookies.read("account_id"),
						showName: decodeURI(
							route.cookies.read("user_name_show")
						),
						tenantId: route.cookies.read("company_id")
					},
					calculate: {
						type: "sample",
						sourceProjectId: sourceProjectIdValue,
						targetProjectId: params.projectId,
						datasetId: params.targetDataset.id,
						datasetName: params.targetDataset.name,
						datasetType: params.datasetType,
						sample: params.sample,
						recursive: true
					}
				}
				let editSampleOptions = {
					method: "POST",
					headers: {
						Authorization: accessToken,
						"Content-Type":
							"application/x-www-form-urlencoded; charset=UTF-8",
						accept: "application/json"
					},
					body: JSON.stringify(sampleBody)
				}
				let results = await fetch(sampleUrl, editSampleOptions).then(
					(res) => res.json()
				)
				if (results.status === "failed") {
					alert("启动出错，请重新运行！")
					route.loadingService.loading.style.display = "none"
					return false
				}
				route.noticeService.defineAction({
					type: "iot",
					remoteResource: "notification",
					runnerId: "",
					id: runnerId,
					eventName: "sampleEdit",
					projectId: params.projectId,
					ownerId: route.cookies.read("account_id"),
					callBack: editSampleCallback
				})
			}
			break
		default:
			console.log("other click event!")
	}

	function genRunnerId(projectName, flowVersion = "developer") {
		let d = new Date().toISOString()
		const i = d.indexOf(".")
		d = d.substring(0, i) + "+00:00"
		return [projectName, projectName, flowVersion, d].join("_")
	}

	function editSampleCallback(param, payload) {
		const { message, status } = JSON.parse(payload)
		const {
			cnotification: { error }
		} = JSON.parse(message)

		if (status == "succeed" || status == "success") {
			alert("数据样本配置成功")
			window.location.reload()
		} else if (status == "failed") {
			console.log(error)
			// let errorObj = error !== "" ? JSON.parse(error) : ""
			// let msg =
			// 	errorObj["message"]["zh"] !== ""
			// 		? errorObj["message"]["zh"]
			// 		: "数据样本配置失败，请重新操作！"
			alert("数据样本配置失败，请重新操作！")
			route.loadingService.loading.style.display = "none"
		}
	}
}
