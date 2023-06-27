import { hostName } from "../config/envConfig"

// eslint-disable-next-line no-unused-vars
export async function phUploadBpFileUploadContainerEventHandler(e, route) {
	let params = e.detail[0].args.param
	let uri = ""
	const accessToken = route.cookies.read("access_token")
	switch (e.detail[0].args.callback) {
		case "linkToPage":
			if (params.name === "advancedMapping") {
				uri =
					"excel-clean?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (
				params.name === "linkToProject" ||
				params.name === "project"
			) {
				uri = `projects/` + params.projectId
			} else if (params.name === "datasets") {
				uri =
					"dataset-lst?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name === "scripts") {
				uri =
					"recipes?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name == "flow") {
				uri =
					"flow?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name == "airflow") {
				uri =
					"airflow?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			}
			//执行列表 分页
			route.router.transitionTo("shell", uri)
			break
		case "importCurrentDataToDS":
			route.projectId = params.projectId
			route.projectName = params.projectName
			createDataSetIndex(params)
			break
		default:
			console.log("submit event to parent")
	}

	function EHnoticeCallback(param, payload) {
		const { message, status } = JSON.parse(payload)
		const {
			cnotification: { data, error }
		} = JSON.parse(message)

		if (status == "succeed") {
			//跳转下一页面
			const params = [
				`projectName=${route.projectName}`,
				`projectId=${route.projectId}`
			]
			route.router.transitionTo(
				"shell",
				`dataset-lst?${params.join("&")}`
			)
			route.loadingService.loading.style.display = "none"
		} else if (status == "failed") {
			// const errorObj = error !== "" ? JSON.parse(error) : ""
			// let msg =
			// 	errorObj["message"]["zh"] !== ""
			// 		? errorObj["message"]["zh"]
			// : "导入失败，请重新上传！"
			console.log(error)
			alert("导入失败，请重新上传！")
			route.loadingService.loading.style.display = "none"
		} else if (status == "running") {
			console.info(data)
			console.info("running", data.progress)
		}
	}

	async function createDataSetIndex(param) {
		console.log(param)
		const eventName = "importfiles"
		route.loadingService.loading.style.display = "flex"
		route.loadingService.loading.style["z-index"] = 2
		const url = `${hostName}/hbresourcecreationtrigger`
		if (param.destinationType === "createDataset") {
			let message = {
				common: {
					traceId: param.uuid,
					tenantId: route.cookies.read("company_id"),
					projectId: param.projectId,
					projectName: param.projectName,
					flowVersion: "developer",
					dagName: param.projectName,
					owner: route.cookies.read("account_id"),
					showName: decodeURI(route.cookies.read("user_name_show"))
				},
				action: {
					cat: "createDS",
					desc: "create DS",
					comments: "something need to say",
					message: JSON.stringify({
						optionName: "project_file_to_DS",
						cat: "upload",
						actionName: param.dsName
					}),
					required: true
				},
				datasets: [
					{
						name: param.dsName,
						cat: "uploaded",
						format: "csv",
						version: param.dataID,
						schema: param.schemaArray
					}
				],
				script: {
					runtime: "dataset"
				},
				notification: {
					required: true
				},
				result: {}
			}
			let options = {
				method: "POST",
				headers: {
					Authorization: accessToken,
					"Content-Type":
						"application/x-www-form-urlencoded; charset=UTF-8",
					accept: "application/json"
				},
				body: JSON.stringify(message)
			}
			await fetch(url, options).then((res) => res.json())
			route.noticeService.defineAction({
				type: "iot",
				id: param.uuid,
				remoteResource: "notification",
				runnerId: "",
				eventName: eventName,
				projectId: param.projectId,
				ownerId: route.cookies.read("account_id"),
				callBack: EHnoticeCallback
			})
		} else {
			const url = `${hostName}/hbdydatasource/put_item`
			let body = {
				table: "version",
				item: {
					id: `${param.projectId}_${param.dsId}`,
					name: param.dataID,
					datasetId: param.dsId,
					projectId: param.projectId,
					owner: route.cookies.read("account_id"),
					date: new Date().getTime(),
					alias: param.dataID
				}
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
			const paramsUri = [
				`projectName=${param.projectName}`,
				`projectId=${param.projectId}`
			]
			route.router.transitionTo(
				"shell",
				`dataset-lst?${paramsUri.join("&")}`
			)
			route.loadingService.loading.style.display = "none"
		}
	}
}
