import { hostName } from "../config/envConfig"

// eslint-disable-next-line no-unused-vars
export async function phAnalyzeDataListHomeEventHandler(e, route) {
	let params = e.detail[0].args.param
	const accessToken = route.cookies.read("access_token")
	const tenantId = route.cookies.read("company_id")
	let uri = "/projects"
	let argsCallback = e.detail[0].args.callback
	switch (argsCallback) {
		case "linkToPage":
			if (params.name === "datasets") {
				uri =
					"dataset-lst?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name === "project") {
				uri = "projects/" + params.projectId
			} else if (params.name === "scripts") {
				//recipe页面
				uri =
					"recipes?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name === "script") {
				//script list页面
				uri =
					"recipes?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name === "flow") {
				uri =
					"flow?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name === "projects") {
				uri = "projects"
			} else if (params.name === "airflow") {
				uri =
					"airflow?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name === "dashboard") {
				uri =
					"dashboards?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name === "slide") {
				uri =
					"slide?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name === "notebooks") {
				uri =
					"notebooks?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			}
			//执行列表 分页
			route.router.transitionTo("shell", uri)
			break
		case "deleteProject":
			if (params) {
				/**
				 * 1.调删除接口，不等返回消息
				 * 3.删除project
				 */
				let deleteUrl = `${hostName}/hbprojectdeletiontrigger`
				let opt = {
					common: {
						traceId: guid(),
						tenantId: tenantId,
						projectId: params.projectId,
						projectName: params.projectName,
						owner: route.cookies.read("account_id"),
						showName: decodeURI(
							route.cookies.read("user_name_show")
						)
					},
					action: {
						cat: "tenantStop",
						desc: "terminate project",
						comments: "something need to say",
						message: "something need to say",
						required: true
					},
					notification: {
						required: true
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
					body: JSON.stringify(opt)
				}
				await fetch(deleteUrl, options)
				let uri = `${hostName}/hbplatform/projects/${params.projectId}`
				let results = await fetch(uri, {
					method: "delete",
					headers: {
						Authorization: accessToken,
						"Content-Type": "application/vnd.api+json",
						Accept: "application/vnd.api+json"
					}
				})
				if (results.status === 204) {
					alert("删除项目成功！")
					window.location.href =
						"https://general.hubadata.com/projects"
				} else {
					alert("删除失败！")
				}
			}
			break
		default:
			console.log("submit event to parent")
	}

	function guid() {
		return "xxxxx-xxxx-4xxx-yxxx-xxxxx".replace(/[xy]/g, function (c) {
			var r = (Math.random() * 16) | 0,
				v = c === "x" ? r : (r & 0x3) | 0x8

			return v.toString(16)
		})
	}
}
