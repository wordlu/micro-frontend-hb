import { hostName, actionTableName } from "../config/envConfig"

// eslint-disable-next-line no-unused-vars
export async function phAnalyzeSelectFileEventHandler(e, route) {
	let param = e.detail[0].args.param
	let uri = ""
	/** localUpload */
	let uploadParam = true
	let datasetName = param.property.dataset
	let dataID = param.property.dataID
	let datasetArray = route.args.allData.data.datasetArr

	switch (e.detail[0].args.callback) {
		case "linkToPage":
			if (param.name === "linkToProject" || param.name == "project") {
				uri = `projects/` + param.projectId
			} else if (param.name === "datasets") {
				uri =
					"dataset-lst?projectName=" +
					param.projectName +
					"&projectId=" +
					param.projectId
			} else if (param.name === "scripts") {
				uri =
					"recipes?projectName=" +
					param.projectName +
					"&projectId=" +
					param.projectId
			} else if (param.name == "flow") {
				uri =
					"flow?projectName=" +
					param.projectName +
					"&projectId=" +
					param.projectId
			} else if (param.name == "airflow") {
				uri =
					"airflow?projectName=" +
					param.projectName +
					"&projectId=" +
					param.projectId
			}
			route.router.transitionTo("shell", uri)
			break
		case "s3UploadFiles":
			if (param.property.type == "selectDataset") {
				// 判断数据id是否存在
				let opt = {
					query: `select count(1) from \`${param.projectId}_${datasetName}\` where version = '${dataID}'`,
					schema: ["count"],
					projectId: param.projectId
				}
				let url = `${hostName}/hbcheckversion`
				let headers = {
					Authorization: route.cookies.read("access_token"),
					"Content-Type": "application/vnd.api+json",
					Accept: "application/vnd.api+json"
				}
				let options = {
					method: "POST",
					headers: headers,
					body: JSON.stringify(opt)
				}
				let versionResult = await fetch(url, options).then((res) =>
					res.json()
				)
				let NUMResult = Number(versionResult[0].count)
				if (NUMResult != 0) {
					uploadParam = false
					alert("数据ID重复，请重新输入！")
					throw new Error("数据集已存在")
				}
			}
			// 如果数据集是新创建，判断数据集是否存在
			else if (param.property.type == "createDataset") {
				datasetArray.forEach((item) => {
					if (item.name === datasetName) {
						uploadParam = false
						alert("数据集已存在，请在下拉框选择数据集！")
						throw new Error("数据集已存在")
					}
				})
			}
			if (param.s3UploadMessage.message) {
				let resMessage = {
					tmpname: param.s3UploadMessage.message.refer_name,
					filename: param.s3UploadMessage.message.file_name
				}
				let file = param.s3UploadMessage.message
				param.property.projectId = param.projectId
				param.property.opname = route.cookies.read("account_id")
				param.property.owner = route.cookies.read("account_id")
				param.property.opgroup = route.cookies.read("company_id")
				param.property.showName = decodeURI(
					route.cookies.read("user_name_show")
				)
				//关闭弹框
				e.detail[0].args.element.show = false
				route.random = Math.random()
				//notice回调函数参数
				route.tranParam = {
					file: file,
					property: param.property,
					projectName: param.projectName,
					message: resMessage,
					projectId: param.projectId
				}
				// route.noticeService.defineAction({
				// 	type: "iot",
				// 	id: "uploadfiles",
				// 	projectId: param.projectId,
				// 	ownerId: route.cookies.read("account_id"),
				// 	callBack: noticeCallback
				// })
				//请求接口
				updateDataset(
					file,
					param.property,
					param.projectName,
					resMessage,
					param.projectId,
					"uploaded"
				)
				route.noticeService.defineAction({
					type: "iot",
					id: param.s3UploadMessage.message.refer_name,
					remoteResource: "notification",
					runnerId: "",
					eventName: "uploadfiles",
					projectId: param.projectId,
					ownerId: route.cookies.read("account_id"),
					callBack: noticeCallback
				})
			}
			break
		case "uploadFiles":
			console.log("uploadFiles")
			//如果数据集为下拉框选择，需要判断
			if (param.property.type == "selectDataset") {
				// 判断数据id是否存在
				let opt = {
					query: `select count(1) from \`${param.projectId}_${datasetName}\` where version = '${dataID}'`,
					schema: ["count"],
					projectId: param.projectId
				}
				let url = `${hostName}/hbcheckversion`
				let headers = {
					Authorization: route.cookies.read("access_token"),
					"Content-Type": "application/vnd.api+json",
					Accept: "application/vnd.api+json"
				}
				let options = {
					method: "POST",
					headers: headers,
					body: JSON.stringify(opt)
				}
				let versionResult = await fetch(url, options).then((res) =>
					res.json()
				)
				let NUMResult = Number(versionResult[0].count)
				if (NUMResult != 0) {
					uploadParam = false
					alert("数据ID重复，请重新输入！")
					throw new Error("数据集已存在")
				}
			}
			// 如果数据集是新创建，判断数据集是否存在
			else if (param.property.type == "createDataset") {
				datasetArray.forEach((item) => {
					if (item.name === datasetName) {
						uploadParam = false
						alert("数据集已存在，请在下拉框选择数据集！")
						throw new Error("数据集已存在")
					}
				})
			}
			if (uploadParam) {
				e.detail[0].args.element.show = false
				e.detail[0].args.element.close()
				param.property.projectId = param.projectId
				param.property.opname = route.cookies.read("account_id")
				param.property.owner = route.cookies.read("account_id")
				param.property.opgroup = route.cookies.read("company_id")
				param.property.showName = decodeURI(
					route.cookies.read("user_name_show")
				)
				confirmUploadFiles(
					param.files[0],
					param.property,
					param.projectName,
					param.projectId,
					"uploaded"
				)
			}
			break
		default:
			console.log("submit event to parent")
	}

	async function confirmUploadFiles(
		file,
		property,
		projectName,
		projectId,
		cat
	) {
		let uploadMessage = {}
		uploadMessage.file = file
		// let pro_name = projectName.toLowerCase().replace(/[^a-z0-9]/gi, "")
		const API_ENDPOINT = `https://${projectId}.hubadata.com/upload`
		const request = new XMLHttpRequest()
		const formData = new FormData()
		route.loadingService.loading.style.display = "flex"
		route.loadingService.loading.style["z-index"] = 2
		request.open("POST", API_ENDPOINT, true)
		request.onreadystatechange = () => {
			if (request.readyState === 4 && request.status === 200) {
				//上传成功
				let res = JSON.parse(request.responseText)
				if (res.tmpname) {
					route.tranParam = {
						file: file,
						property: property,
						projectName: projectName,
						message: res,
						projectId: projectId
					}
					updateDataset(
						file,
						property,
						projectName,
						res,
						projectId,
						cat
					)
					route.noticeService.defineAction({
						type: "iot",
						id: res.tmpname,
						remoteResource: "notification",
						runnerId: "",
						eventName: "uploadfiles",
						projectId: projectId,
						ownerId: route.cookies.read("account_id"),
						callBack: noticeCallback
					})
				}
			}
		}
		formData.append("file", uploadMessage.file)
		request.send(formData)
	}

	async function updateDataset(
		file,
		property,
		projectName,
		message,
		projectId,
		cat
	) {
		route.loadingService.loading.style.display = "flex"
		route.loadingService.loading.style["z-index"] = 2
		//push project_files
		let push_type = "put_item"
		let project_files_body = {
			table: "project_files",
			item: {
				smID: projectName,
				name: message.filename,
				status: "creating",
				category: message.filename.split(".")[1],
				property: JSON.stringify(property),
				id: message.tmpname
			}
		}
		let project_files = postUrl(push_type, project_files_body)
		//push actions
		let messages = {
			actionName: property.dataset,
			file: file,
			message: message,
			property: property,
			projectId: projectId,
			projectName: projectName,
			cat: cat,
			prop: JSON.stringify({
				path: "",
				partitions: 1
			})
		}
		let actions_body = {
			table: actionTableName,
			item: {
				projectId: projectId,
				owner: route.cookies.read("access_token"),
				showName: decodeURI(route.cookies.read("user_name_show")),
				code: 0,
				jobDesc: "created",
				jobCat: "upload",
				comments: "",
				date: String(new Date().getTime()),
				message: JSON.stringify(messages)
			}
		}
		let actions = postUrl(push_type, actions_body)
		await Promise.all([project_files, actions])
	}

	async function postUrl(type, body) {
		let url = `${hostName}/hbdydatasource/`
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

	function noticeCallback(params, payload) {
		const { message, status } = JSON.parse(payload)
		const {
			cnotification: { error }
		} = JSON.parse(message)

		if (status != "succeed") {
			alert("上传失败，请重新上传！" + error)
		} else {
			route.noticeService.uploadStatus = true
			const parameter = [
				`projectName=${route.tranParam.projectName}`,
				`projectId=${route.tranParam.projectId}`,
				`filename=${route.tranParam.file.name}`,
				`version=${route.tranParam.property.dataID}`,
				`dataset=${route.tranParam.property.dataset}`,
				`tmpname=${route.tranParam.message.tmpname}`
			]
			route.router.transitionTo(
				"shell",
				`excel-handler?${parameter.join("&")}`
			)
		}
		route.loadingService.loading.style.display = "none"
	}
}
