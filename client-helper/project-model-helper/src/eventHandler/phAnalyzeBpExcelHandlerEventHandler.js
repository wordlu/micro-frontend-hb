import { hostName, actionTableName } from "../config/envConfig"

// eslint-disable-next-line no-unused-vars
export async function phAnalyzeBpExcelHandlerEventHandler(e, route) {
	let params = e.detail[0].args.param
	let uri = ""
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
				params.name == "project"
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
		case "createDataSetIndex":
			route.tranParam = params
			createDataSetIndex(params)
			break
		default:
			console.log("submit event to parent")
	}

	function postUrl(type, body) {
		const url = `${hostName}/hbdydatasource/`
		let headers = {
			Authorization: route.cookies.read("access_token"),
			"Content-Type": "application/vnd.api+json",
			Accept: "application/vnd.api+json"
		}
		let options = {
			method: "POST",
			headers: headers,
			body: JSON.stringify(body)
		}
		return fetch(url + type, options).then((res) => res.json())
	}

	function EHnoticeCallback(param, payload) {
		console.log("导入的", payload)
		console.log(param)

		const { message, status } = JSON.parse(payload)
		const {
			cnotification: { data, error }
		} = JSON.parse(message)

		if (status == "succeed") {
			//跳转下一页面
			const params = [
				`projectName=${route.tranParam.projectName}`,
				`projectId=${route.tranParam.projectId}`
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
			// 		: "导入失败，请重新上传！"
			console.log(error)
			alert("导入失败，请重新上传！")
			route.loadingService.loading.style.display = "none"
		} else if (status == "running") {
			console.info(data)
			console.info("running", data.progress)
		}
	}

	async function createDataSetIndex(param) {
		const eventName = "importfiles"
		route.loadingService.loading.style.display = "flex"
		route.loadingService.loading.style["z-index"] = 2
		param.opname = route.cookies.read("account_id")
		param.opgroup = route.cookies.read("company_id")
		param.cat = "uploaded"
		param.actionName = param.destination // actions列表展示的名称
		param.prop = JSON.stringify({
			path: "",
			partitions: 1
		})
		//直接导入数据集
		const push_type = "put_item"
		const project_files_body = {
			table: actionTableName,
			item: {
				projectId: param.projectId,
				code: 0,
				comments: "project file to Data set",
				jobCat: "project_file_to_DS",
				jobDesc: eventName,
				message: JSON.stringify(param),
				date: String(new Date().getTime()),
				owner: route.cookies.read("account_id"),
				showName: decodeURI(route.cookies.read("user_name_show"))
			}
		}
		const result = await postUrl(push_type, project_files_body)
		route.noticeService.defineAction({
			type: "iot",
			id: result.data.id,
			remoteResource: "notification",
			runnerId: "",
			eventName: eventName,
			projectId: params.projectId,
			ownerId: route.cookies.read("account_id"),
			callBack: EHnoticeCallback
		})
	}
}
